const MetaService = require('../services/metadata');
const path = require('path');
const fs = require('fs');


async function execute () {
  const outDir = path.join(__dirname, '..', '..', 'out');
  const args = process.argv;
  if (args.length === 2) {
    console.error(`ERROR: Provide url as first argument !`);
    process.exit(1);
  }
  const url = args[2];

  info(`Received url: ${url}`);

  const imageService = {
    // mock image service API
    // copy file from /cache to /out folder
    upload: async function (cachePath, uid) {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
        info(`Creating /out folder.`)
      }
      const filePath = path.join(outDir, `${uid}.png`);
      fs.copyFileSync(cachePath, filePath);
      info(`Copying screenshot ${uid}.png to /out folder.`);

      return { secure_url: filePath, }
    }
  }

  info(`Starting processing !`);
  const metaService = MetaService({ imageService });
  const data = await metaService.getMetadata(url)
    .catch(e => error(e.message));

  info(`Writing json output !`);
  const outFilePath = path.join(outDir, `${data.uid}.json`)
  fs.writeFileSync(outFilePath, JSON.stringify(data, null, 2));

  info(`All done !`);
}

function error (message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function info (message) {
  console.info(`INFO: ${message}`);
}

execute();
