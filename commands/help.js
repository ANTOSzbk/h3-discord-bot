const Discord = require('discord.js');

exports.run = (client, message, args) => {
    const helpEmbed = new Discord.RichEmbed()
        .setDescription('Dostępne komendy: \n\n\
                **!pandora** - otwórz sobie puszkę pandory! [aliasy: \`!puszka\`]\n\n\
                **!yn** - zapytaj Pomocnika Barona :) (tak lub nie) \n\n\
                **!reload** `[nazwa_komendy/all]` - przeładuj skrypt komendy (tylko administracja) \n\n\
                **!poll** `[pytanie]` - stwórz pytanie/ankietę widoczną dla wszystkich [aliasy: \`!ankieta, !sonda\`]\n\n\
                **!h3wiki** `[fraza]` - przeszukaj Wikipedię H3 [aliasy: \`!h3\`]\n\n\
                **!bswiki** `[fraza]` - przeszukaj Wikipedię Bloodstone [aliasy: \`!bs, !bloodstone\`]\n\n\
                ** ---------------- KASYNO ----------------** \n\n\
                **!slots** `[ilość kredytów/all]` - zagraj w grę slots! [aliasy: \`!slot\`]\n\n\
                **!daily** - otrzymaj codzienny bonus kredytów \n\n\
                **!balance** - sprawdź balans swojego konta [aliasy: \`!bal, !stankonta\`]\n\n\
                **!leaderboard** - sprawdź swoją pozycję oraz aktualnych liderów Slots [aliasy: \`!top, !top10, !leaders\`]\n\n\
                **!daj** `[@nazwa_użytkownika] [ilość kredytów]` - przekaż innemu użytkownikowi swoje kredyty \n\n\
                ** --------------------------------------------- ** \n\n\
                *Bot jest nadal w fazie produkcji, więcej wkrótce ;)*')
        .setColor('BLUE')
    message.channel.send(helpEmbed);
}