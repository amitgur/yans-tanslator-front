const DotEnv = require("dotenv");
const parsedEnv = DotEnv.config().parsed;
module.exports = function () {
  // Let's stringify our variables
  console.log("loading .env definitions");
  console.log(parsedEnv);
  return parsedEnv;
};
