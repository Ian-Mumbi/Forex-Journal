const path = require("path");
const fs = require("fs");
const Trade = require('./models/trades')

const dataPath = path.resolve(__dirname, "./public/data/tidy.json");
// console.log('dataPath', dataPath)


module.exports = ( ) => {
    fs.readFile(dataPath, async (err, fileData) => {
      if (!err) {
        const data = JSON.parse(fileData.toString());
        const keys = Object.keys(data);
        const trader = {
          id: req.user._id,
          username: req.user.username,
        };

        keys.forEach(async (key) => {
          req.body = data[key];
          const trade = new Trade({ ...req.body, trader });

          await trade.save();
        });
      }
    });
}