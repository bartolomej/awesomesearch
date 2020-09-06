import MetaService from "../services/metadata";
import path from 'path';
import fs from 'fs';
import { ImageServiceInt } from "../services/image";


async function execute () {
  const outDir = path.join(__dirname, '..', '..', 'out');
  const args = process.argv;
  if (args.length === 2) {
    console.error(`ERROR: Provide url as first argument !`);
    process.exit(1);
  }
  const url = args[2];

  info(`Received url: ${url}`);

  // mock image service API
  // copy file from /cache to /out folder
  function ImageServiceMock (): ImageServiceInt {
    return {
      remove (uid: string): Promise<any> {
        throw new Error('Function not implemented');
      },
      upload (fsPath: string, uid: string): Promise<any> {
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir);
          info(`Creating /out folder.`)
        }
        const filePath = path.join(outDir, `${uid}.png`);
        fs.copyFileSync(fsPath, filePath);
        info(`Copying screenshot ${uid}.png to /out folder.`);

        return Promise.resolve({ secure_url: filePath, })
      }
    }
  }

  info(`Starting processing !`);
  const metaService = MetaService({
    imageService: ImageServiceMock()
  });

  let data;
  try {
    data = await metaService.getLinkWithMetadata(url);
  } catch (e) {
    error(e.message)
  }

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
