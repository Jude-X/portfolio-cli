import axios from "axios";
var inquirer = require("inquirer");
var program = require("commander");
var Conf = require("conf");
var config = new Conf();

program
  .command("run")
  .description(
    "Default anaylsis - will return the latest portfolio value per token in USD"
  )
  .action(async () => {
    let generalStorage = config.get("general");
    if (!generalStorage) {
      console.log(
        "\n\nNo csv file set yet, please use the 'file set' command to add a portfolio"
      );
      return;
    }
    let apiKey = config.get("apiKey");
    if (!apiKey) {
      console.log(
        "\n\nNo Cryptocompare API Key set, Please use 'key set' command to set a key"
      );
      return;
    }
    let result: any = {};
    for (let token in generalStorage) {
      let url = `https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${apiKey}`;
      let resp = await axios.post(url);
      let usdRate = Number(resp.data["USD"]);
      let portfolioBalance = 0;
      //Incase there was either deposit or withdraw and not both
      if (generalStorage[token]["DEPOSIT"]) {
        portfolioBalance += generalStorage[token]["DEPOSIT"]["amount"];
      }
      if (generalStorage[token]["WITHDRAWAL"]) {
        portfolioBalance -= generalStorage[token]["WITHDRAWAL"]["amount"];
      }
      result[token] = portfolioBalance * usdRate;
    }
    console.log("\n\nPortfolio (USD): ", result);
  });

program
  .command("token")
  .description(
    "Token Analysis - will return the latest portfolio value for the token entered in USD"
  )
  .action(async () => {
    let generalStorage = config.get("general");
    let apiKey = config.get("apiKey");
    if (!apiKey) {
      console.log(
        "\n\nNo Cryptocompare API Key set, Please use 'key set' command to set a key"
      );
      return;
    }
    const input = await inquirer.prompt({
      type: "input",
      name: "token",
      message: "Enter token symbol: ",
    });
    let token = input.token;
    if (!token) {
      console.log("\n\nYou didnt enter a token");
      return;
    }
    if (!generalStorage[token]) {
      console.log(`\n\n${token} currency is not in portfolio`);
      return;
    }
    let url = `https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${apiKey}`;
    let resp = await axios.post(url);
    let usdRate = Number(resp.data["USD"]);
    let portfolioBalance = 0;
    //Incase there was either deposit or withdraw and not both
    if (generalStorage[token]["DEPOSIT"]) {
      portfolioBalance += generalStorage[token]["DEPOSIT"]["amount"];
    }
    if (generalStorage[token]["WITHDRAWAL"]) {
      portfolioBalance -= generalStorage[token]["WITHDRAWAL"]["amount"];
    }
    console.log(`\n\n${token} Portfolio (USD): `, portfolioBalance * usdRate);
  });

program
  .command("date")
  .description(
    "Date Analysis - will return the latest portfolio value at the date entered in USD"
  )
  .action(async () => {
    let timedStorage = config.get("timed");
    let apiKey = config.get("apiKey");
    if (!apiKey) {
      console.log(
        "\n\nNo Cryptocompare API Key set, Please use 'key set' command to set a key"
      );
      return;
    }
    const input = await inquirer.prompt({
      type: "input",
      name: "date",
      message:
        "Enter date in dd/mm/yyyy or dd-mm-yyyy format eg 04/06/2022, 04-06-2022: ",
    });
    let date = input.date;
    if (!date) {
      console.log("You didnt enter a date");
      return;
    }
    let timestamp = Date.parse(date);
    let result: any = {};
    // Sort all dates to be able to tell if date entered is in the range
    let allDates = Object.keys(timedStorage).sort(
      (a: string, b: string): number => {
        return Number(a) - Number(b);
      }
    );
    //If the time entered is less than the oldest data, return an error
    if (timestamp < Number(allDates[0]) * 1000) {
      console.log(
        "\n\nNo record in portfolio for date entered. Please enter a more recent date"
      );
      return;
    }
    //If the time entered is greater than the most recent data, just return general storage instead

    if (timestamp > Number(allDates[allDates.length - 1]) * 1000) {
      let generalStorage = config.get("general");
      for (let token in generalStorage) {
        let url = `https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${apiKey}`;
        let resp = await axios.post(url);
        let usdRate = Number(resp.data["USD"]);
        let portfolioBalance = 0;
        //Incase there was either deposit or withdraw and not both
        if (generalStorage[token]["DEPOSIT"]) {
          portfolioBalance += generalStorage[token]["DEPOSIT"]["amount"];
        }
        if (generalStorage[token]["WITHDRAWAL"]) {
          portfolioBalance -= generalStorage[token]["WITHDRAWAL"]["amount"];
        }
        result[token] = portfolioBalance * usdRate;
      }
      console.log("\n\nPortfolio (USD): ", result);
      return;
    }

    //Calculate the portfolio till the date
    for (let datetime in timedStorage) {
      if (Number(datetime) * 1000 <= timestamp) {
        for (let token in timedStorage[datetime]) {
          if (!result[token]) {
            result[token] = 0;
          }
          //Incase there was either deposit or withdraw and not both
          if (timedStorage[datetime][token]["DEPOSIT"]) {
            result[token] += timedStorage[datetime][token]["DEPOSIT"]["amount"];
          }
          if (timedStorage[datetime][token]["WITHDRAWAL"]) {
            result[token] -=
              timedStorage[datetime][token]["WITHDRAWAL"]["amount"];
          }
        }
      }
    }
    for (let token in result) {
      let url = `https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${apiKey}`;
      let resp = await axios.post(url);
      let usdRate = Number(resp.data["USD"]);
      result[token] = result[token] * usdRate;
    }
    console.log("\n\nPortfolio (USD): ", result);
  });

program
  .command("date-token")
  .description(
    "Date-Token Analysis - will return the latest token value at the date entered in USD"
  )
  .action(async () => {
    let timedStorage = config.get("timed");
    let generalStorage = config.get("general");
    let apiKey = config.get("apiKey");
    if (!apiKey) {
      console.log(
        "\n\nNo Cryptocompare API Key set, Please use 'key set' command to set a key"
      );
      return;
    }
    const dateInput = await inquirer.prompt({
      type: "input",
      name: "date",
      message:
        "Enter date in dd/mm/yyyy or dd-mm-yyyy format eg 04/06/2022, 04-06-2022: ",
    });
    const tokenInput = await inquirer.prompt({
      type: "input",
      name: "token",
      message: "Enter token eg BTC, ETH: ",
    });
    let date = dateInput.date;
    let token = tokenInput.token;
    if (!date) {
      console.log("You didnt enter a date");
      return;
    }
    if (!token) {
      console.log("You didnt enter a token");
      return;
    }
    if (!generalStorage[token]) {
      console.log(`\n\n${token} currency is not in portfolio`);
      return;
    }

    let timestamp = Date.parse(date);
    let tokenAmount = 0;
    // Sort all dates to be able to tell if date entered is in the range
    let allDates = Object.keys(timedStorage).sort(
      (a: string, b: string): number => {
        return Number(a) - Number(b);
      }
    );
    //If the time entered is less than the oldest data, return an error
    if (timestamp < Number(allDates[0]) * 1000) {
      console.log(
        "\n\nNo record in portfolio for date entered. Please enter a more recent date"
      );
      return;
    }
    //If the time entered is greater than the most recent data, just return general storage instead

    if (timestamp > Number(allDates[allDates.length - 1]) * 1000) {
      let url = `https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${apiKey}`;
      let resp = await axios.post(url);
      let usdRate = Number(resp.data["USD"]);
      let portfolioBalance = 0;
      //Incase there was either deposit or withdraw and not both
      if (generalStorage[token]["DEPOSIT"]) {
        portfolioBalance += generalStorage[token]["DEPOSIT"]["amount"];
      }
      if (generalStorage[token]["WITHDRAWAL"]) {
        portfolioBalance -= generalStorage[token]["WITHDRAWAL"]["amount"];
      }
      console.log(`\n\n${token} Portfolio (USD): `, portfolioBalance * usdRate);
      return;
    }

    //Calculate the portfolio till the date
    for (let datetime in timedStorage) {
      if (Number(datetime) * 1000 <= timestamp) {
        //Incase there was either deposit or withdraw and not both
        if (timedStorage[datetime][token]["DEPOSIT"]) {
          tokenAmount += timedStorage[datetime][token]["DEPOSIT"]["amount"];
        }
        if (timedStorage[datetime][token]["WITHDRAWAL"]) {
          tokenAmount -= timedStorage[datetime][token]["WITHDRAWAL"]["amount"];
        }
      }
    }
    let url = `https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${apiKey}`;
    let resp = await axios.post(url);
    let usdRate = Number(resp.data["USD"]);
    console.log(`\n\n${token} Portfolio (USD): `, tokenAmount * usdRate);
  });

program.parse(process.argv);
