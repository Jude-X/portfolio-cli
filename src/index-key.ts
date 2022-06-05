import axios from "axios";

var inquirer = require("inquirer");
var program = require("commander");
var Conf = require("conf");
var config = new Conf();

program
  .command("set")
  .description("Enter your Cryptocompare API Key")
  .action(async () => {
    const input = await inquirer.prompt({
      type: "input",
      name: "apiKey",
      message: "Enter Cryptocompare API-Key: ",
    });
    let apiKey = input.apiKey;
    if (!apiKey) {
      console.log("You didnt enter an API-Key");
      return;
    }
    try {
      let url = `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&api_key=${apiKey}`;
      let resp = await axios.get(url);
      if (resp.status < 202) {
        config.set({ apiKey });
        console.log("Key set successfully");
      } else {
        console.log("Invalid API Key");
      }
    } catch (error) {
      console.log("Invalid API Key");
    }
  });

program
  .command("show")
  .description("show API Key")
  .action(() => {
    if (config.get("apiKey")) {
      console.log("Current Cryptocompare API key:", config.get("apiKey"));
    } else {
      console.log("no API Key set");
    }
  });

program.parse(process.argv);
