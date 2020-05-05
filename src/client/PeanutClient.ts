import {
  AkairoClient,
  CommandHandler,
  InhibitorHandler,
  ListenerHandler,
} from 'discord-akairo';
import { Message, Collection, Webhook } from 'discord.js';
import HasuraProvider from '../helpers/SettingsProvider';
import { EVENTS, TOPICS, LoggerProvider } from '../helpers/LoggerProvider';
import { SETTINGS } from '../utils/constants';
import { Logger } from 'winston';
import { join } from 'path';
import { MESSAGES } from '../utils/messages';

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler;
    config: PeanutOptions;
    settings: HasuraProvider;
    webhooks: Collection<string, Webhook>;
    logger: Logger;
  }
}

interface PeanutOptions {
  owner?: string;
  token?: string;
}

export default class PeanutClient extends AkairoClient {
  public settings = new HasuraProvider();
  public logger = LoggerProvider;

  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: join(__dirname, '..', 'commands'),
    prefix: (message: Message): string =>
      this.settings.get(
        message.guild!,
        SETTINGS.PREFIX,
        process.env.COMMAND_PREFIX
      ),
    aliasReplacement: /-/g,
    allowMention: true,
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 3e5,
    defaultCooldown: 3000,
    argumentDefaults: {
      prompt: {
        modifyStart: (_, str) =>
          MESSAGES.COMMAND_HANDLER.PROMPT.MODIFY_START(str),
        modifyRetry: (_, str) =>
          MESSAGES.COMMAND_HANDLER.PROMPT.MODIFY_RETRY(str),
        timeout: MESSAGES.COMMAND_HANDLER.PROMPT.TIMEOUT,
        ended: MESSAGES.COMMAND_HANDLER.PROMPT.ENDED,
        cancel: MESSAGES.COMMAND_HANDLER.PROMPT.CANCEL,
        retries: 3,
        time: 30000,
      },
      otherwise: '',
    },
  });

  public inhibitorHandler = new InhibitorHandler(this, {
    directory: join(__dirname, '..', 'inhibitors'),
  });

  public listenerHandler = new ListenerHandler(this, {
    directory: join(__dirname, '..', 'listeners'),
  });

  public config: PeanutOptions;

  public constructor(config: PeanutOptions) {
    super(
      { ownerID: config.owner },
      {
        messageCacheMaxSize: 1000,
        disableMentions: 'everyone',
      }
    );

    this.config = config;

    process.on('unhandledRejection', (err: any) =>
      this.logger.error(err, { topic: TOPICS.UNHANDLED_REJECTION })
    );

    if (process.env.LOGS) {
      this.webhooks = new Collection();
    }
  }

  private async _init() {
    this.commandHandler.loadAll();
    this.logger.info(MESSAGES.COMMAND_HANDLER.LOADED, {
      topic: TOPICS.DISCORD_AKAIRO,
      event: EVENTS.INIT,
    });
    this.inhibitorHandler.loadAll();
    this.logger.info(MESSAGES.INHIBITOR_HANDLER.LOADED, {
      topic: TOPICS.DISCORD_AKAIRO,
      event: EVENTS.INIT,
    });
    this.listenerHandler.loadAll();
    this.logger.info(MESSAGES.LISTENER_HANDLER.LOADED, {
      topic: TOPICS.DISCORD_AKAIRO,
      event: EVENTS.INIT,
    });
    await this.settings.init();
    this.logger.info(MESSAGES.SETTINGS.INIT, {
      topic: TOPICS.DISCORD_AKAIRO,
      event: EVENTS.INIT,
    });
  }

  public async start() {
    await this._init();
    return this.login(this.config.token);
  }
}