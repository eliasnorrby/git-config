#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const yargs = require("yargs");

const { log } = require("@eliasnorrby/log-util");

yargs
  .alias("v", "version")
  .usage("Usage: $0 [options]")
  .option("f", {
    describe: "Overwrite existing files",
    type: "boolean",
    alias: "force",
    default: false,
  })
  .help("h")
  .alias("h", "help")
  .strict(true);
const argv = yargs.argv;

// const packageName = "@eliasnorrby/git-config";

if (!fs.existsSync("package.json")) {
  log.fail(
    "No package.json found in the current directory. Make sure you are in the project root. If no package.json exists yet, run `npm init` first.",
  );
  process.exit(1);
}

const gitignore = fs.readFileSync(path.resolve(__dirname, "gitignore"), "utf8");
const gitattributes = fs.readFileSync(
  path.resolve(__dirname, "gitattributes"),
  "utf8",
);

// Config files to write
const CONFIG_FILES = {
  ".gitignore": gitignore,
  ".gitattributes": gitattributes,
};

const failedToWrite = {};

Object.entries(CONFIG_FILES).forEach(([fileName, contents]) => {
  if (!fs.existsSync(fileName)) {
    log.info(`Writing ${fileName}`);
    fs.writeFileSync(fileName, contents, "utf8");
  } else if (argv.force) {
    log.warn(`Overwriting ${fileName}`);
    fs.writeFileSync(fileName, contents, "utf8");
  } else {
    log.skip(`${fileName} already exists`);
    failedToWrite[fileName] = true;
  }
});

log.info("Done!");
