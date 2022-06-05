const { generalAggregation, timedAggregation } = require("./index-algorithms");
const fs = require("fs");
var inquirer = require("inquirer");
var program = require("commander");
var Conf = require("conf");
var config = new Conf();

program
  .command("set")
  .description("Specify the name of file (should be in root directory)")
  .action(async () => {
    const input = await inquirer.prompt({
      type: "input",
      name: "filename",
      message: "Enter filename: ",
    });
    if (!input.filename) {
      console.log("\n\nYou didnt enter a file name");
      return;
    }
    const path = `./${input.filename}.csv`;
    config.set({ filename: path });
    if (fs.existsSync(path)) {
      // path exists
      console.log("\n\nfile found: ", path);
    } else {
      console.log("\n\nfile not found in root directory");
      return;
    }
    let lineReader = require("readline").createInterface({
      input: fs.createReadStream(path),
    });
    const generalStorage: any = {};
    const timedStorage: any = {};
    console.log("\n\nParsing File...\n\n\nThis will only take a few seconds");
    lineReader.on("line", (row: any) => {
      var line = row.split(",");
      var timestamp = Number(line[0]);
      var action = line[1];
      var token = line[2];
      var amount = Number(line[3]);
      generalAggregation(generalStorage, action, token, amount);
      // Round down to nearest day
      // timestamp *= 1000;
      timestamp -= timestamp % (24 * 60 * 60);
      //console.log(new Date(timestamp*1000).toUTCString());
      timedAggregation(timedStorage, timestamp, action, token, amount);
    });

    lineReader.on("close", () => {
      console.log("\n\nfile successfully processed, you can analyze it now");
      delete generalStorage["token"];
      delete timedStorage[NaN];
      config.set({ general: generalStorage });
      config.set({ timed: timedStorage });
    });
  });

program
  .command("show")
  .description("show current file")
  .action(() => {
    if (config.get("filename")) {
      console.log("Current file:", config.get("filename"));
    } else {
      console.log("no file set");
    }
  });

program.parse(process.argv);
