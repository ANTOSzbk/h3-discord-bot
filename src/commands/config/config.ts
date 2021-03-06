import { Command, Flag, PrefixSupplier } from 'discord-akairo';
import { Message, Permissions } from 'discord.js';
import { MESSAGES } from '../../utils/messages';

export default class ConfigCommand extends Command {
  public constructor() {
    super('config', {
      aliases: ['config'],
      description: {
        content: MESSAGES.COMMANDS.CONFIG.DESCRIPTION,
        usage: '<method> <...arguments>',
      },
      category: 'config',
      channel: 'guild',
      userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
      ratelimit: 2,
    });
  }

  public *args() {
    const method = yield {
      type: [
        ['config-set', 'set'],
        ['config-clear', 'clear'],
        ['config-start', 'start'],
        ['config-check', 'check'],
        ['config-toggle', 'toggle'],
        ['config-delete', 'delete'],
      ],
      otherwise: (msg: Message) => {
        const prefix = (this.handler.prefix as PrefixSupplier)(msg);
        return MESSAGES.COMMANDS.CONFIG.REPLY(prefix);
      },
    };
    return Flag.continue(method);
  }
}
