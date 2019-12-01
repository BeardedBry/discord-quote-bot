const config = require("./config.json");
const log = require("./log.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

client.on("ready", () => {
    console.log("I am ready!");
});



client.on("message", (message) => {

    //Logs messages in chat.
    if (!message.content.startsWith(config.prefix) && !message.author.bot) {
        let logEntry = {
            "Author": message.author.username,
            "content": message.content.slice(),
            "createdAt": message.createdAt,
            "timestamp": message.createdTimestamp,
        }

        console.log(logEntry);
        let strEntry = JSON.stringify(logEntry);
        log.log.push(strEntry);

        fs.appendFile("./log.json", JSON.stringify(log), (err) => console.error);
        //JSON.stringify(log)

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
            
            let name = message.content.split(" ") || null;
            let quote = getRandomQuote(name);
        }

});


function getRandomQuote(){

}


client.login(config.token);