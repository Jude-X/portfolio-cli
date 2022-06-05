#!/usr/bin/env node
import chalk = require("chalk");
import figlet = require("figlet");
const program = require("commander");
const pkg = require("../package.json");

console.log(
  chalk.red(figlet.textSync("portfolio-cli", { horizontalLayout: "full" }))
);

program
  .version(pkg.version)
  .description("A portfolio analyzer")
  .command(
    "file",
    "set and retrieve name of file (should be in root directory)"
  )
  .command("analyze", "analyze a portfolio in csv file")
  .command("key", "set and retrieve a Cryptocompare API key")
  .parse(process.argv);
