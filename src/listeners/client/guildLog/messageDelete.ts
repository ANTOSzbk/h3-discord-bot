import { Listener } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { SETTINGS } from '../../../utils/constants';

export default class MessageDeleteGuildLogListener extends Listener {
  public constructor() {
    super('messageDeleteGuildLog', {
      emitter: 'client',
      event: 'messageDelete',
      category: 'client',
    });
  }

  public async exec(message: Message) {
    console.log(`Deleted ${message.id}.`)
    // if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content) return;
    const guildLogs = this.client.settings.get(message.guild, SETTINGS.GUILD_LOG);
    console.log(guildLogs)
    if (guildLogs) {
      const webhook = this.client.webhooks.get(guildLogs);
      console.log(webhook)
      if (!webhook) return;
      const attachment = message.attachments.first();
      const embed = new MessageEmbed()
        .setColor(0x824aee)
        .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
        .addField('❯ Channel', message.channel)
        .addField('❯ Message', `${message.content.substring(0, 1020)}`)
        .addField('❯ Message', `[Go to message](${message.url})`, true);
      if (attachment) embed.addField('❯ Attachment(s)', attachment.url);
      embed.setTimestamp(new Date());
      embed.setFooter('Deleted');

      return webhook.send({
        embeds: [embed],
        username: 'Logs: MESSAGE DELETED',
        avatarURL: 'https://i.imgur.com/EUGvQJJ.png',
      });
    }
  }
}