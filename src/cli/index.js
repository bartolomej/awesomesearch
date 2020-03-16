import meow from 'meow';
import { join } from 'path';
import fs from 'fs';
import parseMarkdown from "../github/markdown";
import { fetchText, fileExists, getMarkdownTree, readFile, writeFile } from "./utils";


const cli = meow(`
    Usage
      $ node build/cli <command>
      
    Commands
      test:s2  Runs stage 2 tests.
 
    Options
      --config, -c  Read awesome-list urls from test.config.json file.
 
    Examples
      $ node build/cli test:s2 --config

`, {
  flags: {
    rainbow: {
      type: 'boolean',
      alias: 'r'
    }
  }
});

parseCliArguments();

function parseCliArguments () {
  if (cli.input.length === 0) {
    info('No command provided');
    info(`Running default stage 2 tests`);
    stageTwoTest().then(() => info('Success!'));
    return;
  }
  switch (cli.input[0]) {
    case 'test:s2': {
      stageTwoTest().then(() => info('Success!'));
      break;
    }
    default: {
      error(`Command ${cli.input} not found`);
    }
  }
}

/**
 * Runs stochastic tests on real world data:
 * - downloads README's of awesome repositories
 * - computes markdown AST tree
 * - parses AST tree to high-level document structure
 */
// TODO: implement test results
// TODO: store test results in /stats.json
async function stageTwoTest () {
  const rootDir = join(__dirname, '..', '..');
  const testDir = join(rootDir, 'out');
  const configFile = join(rootDir, 'test.config.json');
  let testUrls;
  try {
    testUrls = JSON.parse(await readFile(configFile));
  } catch (e) {
    if (/no such file or directory/.test(e.message)) {
      error('Config file /test.config.json not found');
    } else {
      error(e);
    }
  }

  for (const url of testUrls) {
    const title = getAwesomeTitle(url);
    const outputDir = join(testDir, title);
    const markdownPath = join(outputDir, 'markdown.md');
    const treePath = join(outputDir, 'tree.txt');
    const documentPath = join(outputDir, 'document.json');

    if (!await fileExists(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    if (await fileExists(markdownPath) && await fileExists(treePath)) {
      info(`${title} files already downloaded`);
      await parse(await readFile(markdownPath));
    }

    let markdown;
    try {
      info(`Fetching ${url}`);
      markdown = await fetchText(url);
    } catch (e) {
      error(`Failed to fetch url: ${url} \n${e.message}`)
    }

    info(`Writing files`);
    const tree = getMarkdownTree(markdown);
    await writeFile(markdownPath, markdown);
    await writeFile(treePath, tree);
    await parse(markdown);

    async function parse (markdown) {
      try {
        const parsed = parseMarkdown(markdown);
        await writeFile(documentPath, JSON.stringify(parsed, null, 4));
      } catch (e) {
        error(`Parsing failed on ${url} \n${e}\n${e.stack}`)
      }
    }
  }
}

function getAwesomeTitle (url) {
  const urlParts = url.split('/');
  for (let i = 0; i < urlParts.length; i++) {
    if (urlParts[i] === 'master') {
      return urlParts[i - 1];
    }
  }
}

function error (message) {
  console.error('ERROR: ' + message);
  process.exit(0);
}

function info (message) {
  console.log('INFO: ' + message);
}
