const config = require("./config.json");
const log = require("./log.json");
const logger = require("./logger.js");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

client.on("ready", () => {
    console.log("I am ready!");
});

const quotePreMessage = [
    'has been known to say:',
    'has once sad:',
    'believes:',
    'has the unpopular opinion that:'
];


client.on("message", (message) => {

    //Logs messages in chat.
    if (!message.content.startsWith(config.prefix) && !message.author.bot) {
        
        const logEntry = logger.createEntry(message);
        const log = logger.readLog();
        log.push(logEntry);
        logger.saveLog(log);


    } else if (message.content.startsWith(config.prefix + "prefix")) {

        //changes the prefix.
        let newPrefix = message.content.split(" ").slice(1, 2)[0];
        config.prefix = newPrefix;
        fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);

    } else if (message.content.startsWith(config.prefix + "who")) {

        message.channel.send("ID: " + message.author.id);

    } else if (message.content.startsWith(config.prefix + "sup")) {

        //Greeting
        if (message.author.id == config.owner) {
            message.channel.send("Hey " + message.author.username + "! You are amazing!");
        } else {
            message.channel.send("Hey there " + message.author.username + "!");
        }

    } else if (message.content.startsWith(config.prefix + "stop") && message.author.id == config.owner) {

        //Disconnects the Bot.
        client.destroy();

    } else if (message.content.startsWith(config.prefix + "quote")) {

        let name = message.content.split(" ").slice(1, 2)[0] || null;
        let preMessage = quotePreMessage[getRandomInt(quotePreMessage.length)];

        try {
            getRandomQuoteAndSend(preMessage, name, sendMessage);
        } catch (error) {
            console.log('error: maybe no quotes available?')
        }
   
    }

    function sendMessage(msg){
        message.channel.send(msg);
    }

});


function getRandomQuoteAndSend(pre, name, cb) {
    fs.readFile('./log.json', function (err, data) {
        if (err) {
            console.error(err);
        }
        const parsedData = JSON.parse(data);
        var filteredByAuthor = [];
        var quotes;

        if (name) {
            filteredByAuthor = parsedData.filter((entry) => {
                return entry.author === name;
            });
        }

        quotes = filteredByAuthor.length > 0 ? filteredByAuthor : parsedData;

        let quote = quotes[getRandomInt(quotes.length)];
        cb(`${quote.author} ${pre} \n "${quote.content}"`);        

    });
}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


client.login(config.token);