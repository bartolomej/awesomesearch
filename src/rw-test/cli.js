import meow from 'meow';
import { join } from 'path';
import fs from 'fs';
import { fileExists, readFile, writeFile } from "./utils";
import TestCase from "./test-case";
import chalk from 'chalk';

const rootDir = join(__dirname, '..', '..');
const resultsPath = join(rootDir, 'results.json');

const cli = meow(`
    Usage
      $ node build/cli <command>
      
    Commands
      test:s2  Runs stage 2 tests.
 
    Options
      --config, -c  Read awesome-list urls from test.config.json file.
      --failed, -f  Run only failed tests from results.json file.
 
    Examples
      $ node build/cli test:s2 --config
      $ node build/cli test:s2 --failed

`, {
  flags: {
    config: {
      type: 'boolean',
      alias: 'c'
    },
    failed: {
      type: 'boolean',
      alias: 'f'
    },
  }
});

parseCliArguments();

function parseCliArguments () {
  if (cli.input.length === 0) {
    info('No command provided');
    info(`Running default stage 2 tests`);
    runRealWorldTests();
    return;
  }
  switch (cli.input[0]) {
    case 'rw-test': {
      runRealWorldTests(cli.flags.config, cli.flags.failed);
      break;
    }
    default: {
      error(`Command ${cli.input} not found`);
    }
  }
}

async function runRealWorldTests (readConfig = false, onlyFailed = false) {
  const outDir = join(rootDir, 'out');
  let testCases;
  if (readConfig) {
    testCases = await getConfig();
    info(`Received ${testCases.length} urls from config file`);
  } else {
    testCases = await getResults(onlyFailed);
    info(`Received ${testCases.length} urls from results file`);
  }
  if (onlyFailed) {
    info(`Running only failed cases`);
  }

  if (!await fileExists(outDir)) {
    fs.mkdirSync(outDir);
  }

  for (const testCase of testCases) {
    const outputDir = join(outDir, testCase.getRepoName());
    const markdownPath = join(outputDir, 'markdown.md');
    const jsonTreePath = join(outputDir, 'tree.json');
    const txtTreePath = join(outputDir, 'tree.txt');
    const documentPath = join(outputDir, 'document.json');
    const reportPath = join(outputDir, 'report.txt');

    console.log(''); // print empty line for readability

    if (!await fileExists(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    if (
      await fileExists(markdownPath) &&
      await fileExists(jsonTreePath) &&
      await fileExists(txtTreePath)
    ) {
      info(`${testCase.getRepoName()} already downloaded`);
      await parse();
      continue;
    }

    await testCase.fetchRepo();

    info(`Writing output files to ${outputDir}`);
    await writeFile(markdownPath, testCase.readme);
    await writeFile(jsonTreePath, JSON.stringify(testCase.getJsonTree(), null, 4));
    await writeFile(txtTreePath, testCase.getTxtTree());
    await parse();

    async function parse () {
      if (!testCase.readme) {
        await testCase.fetchRepo();
      }
      if (!testCase.parse()) {
        info(`Parsing failed, generated report: ${reportPath}`);
        await writeFile(reportPath, testCase.parseError.stack);
      } else {
        info(`Parsing success!`);
        await writeFile(documentPath, JSON.stringify(testCase.getParsed(), null, 4));
      }
    }
  }
  await mergeResults(testCases);
}

/** FILE UTILITIES **/

export async function getConfig () {
  const configPath = join(rootDir, 'test.config.json');
  if (!await fileExists(configPath)) {
    error(`Config file "test.config.json" not found`);
  }
  const cases = JSON.parse(await readFile(configPath));
  return cases.map(c => new TestCase(c.uid, c.readmePath));
}

export async function getResults (onlyFailed = false) {
  if (!await fileExists(resultsPath)) {
    info(`Creating "results.json" file`);
    await writeFile(resultsPath, JSON.stringify({}));
  }
  const results = JSON.parse(await readFile(resultsPath));
  let items = [];
  for (let key of Object.keys(results)) {
    let item = results[key];
    let testCase = new TestCase(key, item.readmePath);
    if (onlyFailed && item.success === false) {
      items.push(testCase);
    } else if (!onlyFailed) {
      items.push(testCase);
    }
  }
  return items;
}

export async function mergeResults (testCases) {
  let results;
  if (await fileExists(resultsPath)) {
    results = JSON.parse(await readFile(resultsPath));
  } else {
    results = {};
  }
  for (let testCase of testCases) {
    results[testCase.uid] = testCase.getJson();
  }
  await writeFile(resultsPath, JSON.stringify(results, null, 4));
}

function error (message) {
  console.error(chalk.red('ERROR: ' + message));
  process.exit(0);
}

function info (message) {
  console.log(chalk.green('INFO: ') + message);
}
