import { performance } from 'perf_hooks';

const fs = require('fs');
const rimraf = require('rimraf');

export async function execute<T> (
  name: string, promises: Array<Promise<T>> | Promise<T>
): Promise<T | Array<T>> {
  const start = performance.now();
  const result = promises instanceof Array
    ? await Promise.all(promises)
    : await promises;
  const duration = performance.now() - start;
  // log if execution took more than 2000ms
  if (duration > 2000) {
    console.debug(`${name} took ${duration} ms`)
  }
  return result;
}

export async function makeDir (
  path: string
): Promise<NodeJS.ErrnoException | any> {
  return new Promise(async (resolve, reject) => {
    if (await fileExists(path)) {
      return resolve();
    }
    fs.mkdir(path, err => (
      err ? reject(err) : resolve()
    ))
  })
}

export async function removeDir (
  path: string
): Promise<NodeJS.ErrnoException | any> {
  return new Promise((resolve, reject) => {
    rimraf(path, err => (
      err ? reject(err) : resolve()
    ))
  })
}

export async function fileExists (
  path: string)
  : Promise<boolean> {
  return new Promise(resolve => {
    fs.access(path, error => resolve(!error));
  });
}
