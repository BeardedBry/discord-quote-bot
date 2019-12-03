const config = require("./config.json");
const log = require("./log.json");
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
        let logEntry = {
            "author": message.author.username,
            "content": message.content.slice(),
            "createdAt": message.createdAt,
            "timestamp": message.createdTimestamp,
        }

        //let entryJSON = JSON.stringify(logEntry);
        readAndAppendLog(logEntry);

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
        let PreMessage = quotePreMessage[quotePreMessage.length];

        var promise1 = new Promise(function(resolve, reject){
            resolve(getRandomQuote(name));
        });

        promise1.then(function(quote){
            message.channel.send(quote);
            //message.channel.send(`${quote.Author} ${PreMessage} \n "${quote}"`);
        });

    }

});


function getRandomQuote(name) {
    fs.readFile('./log.json', function (err, data) {
        if (err) {
            console.error(err);
        }
        const parsedData = JSON.parse(data);
        var quotes;

        if (name) {
            const filteredByAuthor = parsedData.filter((entry) => {
                return entry.Author === name;
            });
            //console.log(filteredByAuthor);
            quotes = filteredByAuthor;
        } else {
            //console.log(parsedData);
            quotes = parsedData;
        }

        if (quotes) {
            return quotes[getRandomInt(quotes.length)];
        }else{
            console.log(parsedData[getRandomInt(parsedData.length)]);
            return parsedData[getRandomInt(parsedData.length)];            
        }

    });
}

function readAndAppendLog(entry) {
    fs.readFile('./log.json', function (err, data) {
        if (err) {
            console.error(err);
        }
        // parse log
        const parsedData = JSON.parse(data);

        // append new data on to parsed log
        parsedData.push(entry);

        // stringify appended log.
        const appendedLog = JSON.stringify(parsedData);

        // Write to log file.
        fs.writeFile("./log.json", appendedLog, (err) => console.error);
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


client.login(config.token);