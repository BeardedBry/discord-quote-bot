const fs = require('fs');

// Create and return log entry object
const createEntry = function(msg) {
   const logEntry = {
        "Author": msg.author.username,
        "content": msg.content.slice(),
        "createdAt": msg.createdAt,
        "timestamp": msg.createdTimestamp,
    }
    return logEntry;
};


// read and return log, or empty array
const readLog = function() {
    
    fs.readFile('./log.json', function (err, data) {
        if (err) {
           return [];
       } else {
           return JSON.parse(data);
       }
    });
};

const saveLog = function (log) {
    
    const jsonFile = JSON.stringify(log);
    fs.writeFile("./log.json", jsonFile, (err) => console.error);

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


module.exports = {
    createEntry: createEntry,
    readLog: readLog,
    saveLog: saveLog
}