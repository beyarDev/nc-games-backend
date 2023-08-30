const fs = require('fs/promises');

function regVisitors(req,res,next){
    const data = `Time: ${Date()} ip address: ${req.ip} , requested url: ${req.url}\n`
    fs.appendFile(`${__dirname}/../logs/viewers.txt`,data)
    next()
}

module.exports = regVisitors;