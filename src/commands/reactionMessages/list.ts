import { Command } from 'discord-akairo';
import { Message, MessageEmbed, Permissions } from 'discord.js';
import { MESSAGES } from '../../utils/messages';
import { TextChannel } from 'discord.js';

export default class ListReactionRoleMessagesCommand extends Command {
  public constructor() {
    super('reaction-role-list', {
      description: {
        content: MESSAGES.COMMANDS.UTIL.REACTION_MESSAGES.CHECK.DESCRIPTION,
      },
      category: 'reactionRoleMessages',
      channel: 'guild',
      userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
      ratelimit: 2,
    });
  }
  public async exec(message: Message) {
    const guild = message.guild!;
    const rrMessages = await this.client.reactionMessages.getReactionMessagesInGuild(guild);
    const statusEmbed = new MessageEmbed()
      .setThumbnail(guild.iconURL() ?? '')
      .setColor('DARK_GOLD')
      .setTitle(`Reaction-Role Messages`);
    rrMessages.length === 0 ? statusEmbed.setDescription('No Reaction-Role messages have been found in this guild.')
      : statusEmbed.setDescription(`All Reaction-Role messages in ${guild.name} displayed below.`);
    for (const rrMessage of rrMessages) {
      const channel: string = this.client.reactionMessages.get(rrMessage, 'channel');
      const messageChannel = (await this.client.channels.fetch(channel)) as TextChannel;
      const message = messageChannel.messages.cache.get(rrMessage);
      const title = message?.embeds[0].title;
      const disabled: boolean = this.client.reactionMessages.get(rrMessage, 'disabled');
      statusEmbed.addField(
        `${title !== '\u200b' ? title : ' Reaction-Role Message'}`,
        `[Go to Message](https://discordapp.com/channels/${guild.id}/${channel}/${rrMessage})`,
        true
      );
      statusEmbed.addField('Status', `${disabled ? '**Disabled `❌`**' : '**Enabled `✔️`**'}`, true);
      statusEmbed.addField('\u200b', '\u200b', true);
      statusEmbed.setFooter(`${message?.guild?.name} reaction role messages list`, this.client.user?.displayAvatarURL())
      statusEmbed.setTimestamp(new Date())
    }
    return message.util?.send(statusEmbed);
  }
}
