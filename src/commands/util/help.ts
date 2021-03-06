import { Command, PrefixSupplier } from 'discord-akairo';
import { Message, MessageEmbed, Permissions } from 'discord.js';
import { MESSAGES } from '../../utils/messages';

export default class HelpCommand extends Command {
  public constructor() {
    super('help', {
      aliases: ['help'],
      description: {
        content: MESSAGES.COMMANDS.HELP.DESCRIPTION,
        usage: '[command]',
      },
      category: 'util',
      clientPermissions: [Permissions.FLAGS.EMBED_LINKS],
      ratelimit: 2,
      args: [
        {
          id: 'command',
          type: 'commandAlias',
        },
      ],
    });
  }

  public async exec(message: Message, { command }: { command: Command }) {
    const prefix = (this.handler.prefix as PrefixSupplier)(message);
    if (!command) {
      const embed = new MessageEmbed()
        .setColor('DARK_GOLD')
        .addField('> Commands', MESSAGES.COMMANDS.HELP.REPLY(prefix));

      for (const category of this.handler.categories.values()) {
        const regExp = /([^A-Z])([A-Z])/g;
        embed.addField(
          // `> ${category.id.replace(/(\b\w)/gi, (lc) => lc.toUpperCase())}`,
          `> ${category.id.charAt(0).toUpperCase() + category.id.replace(regExp, '$1 $2').slice(1)}`,
          `${category
            .filter((cmd) => cmd.aliases.length > 0)
            .map((cmd) => `\`${cmd.aliases[0]}\``)
            .join(' ')}`
        );
      }

      return message.util?.send(embed);
    }

    const embed = new MessageEmbed()
      .setColor('DARK_GOLD')
      .setTitle(`\`${command.aliases[0]} ${command.description.usage || ''}\``)
      .addField('📋 Description', command.description.content || '\u200b');

    if (command.aliases.length > 1)
      embed.addField('☝️ Aliases', `\`${command.aliases.join('` `')}\``, true);
    if (command.description.examples?.length)
      embed.addField(
        '📌 Examples',
        `\`${command.aliases[0]} ${command.description.examples.join(
          `\`\n\`${command.aliases[0]} `
        )}\``,
        true
      );

    return message.util?.send(embed);
  }
}
