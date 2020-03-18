import fs from 'fs';
import fetch from "node-fetch";


export async function fetchText (url) {
  const response = await fetch(url);
  return await response.text();
}

/**
 * @returns {Promise<string>}
 */
export async function readFile (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  })
}

/**
 * @returns {Promise<>}
 */
export async function writeFile (path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, err => {
      if (err) return reject(err);
      else return resolve();
    });
  })
}

export async function fileExists (path) {
  return new Promise(((resolve, reject) => {
    fs.access(path, fs.F_OK, (err) => {
      if (err) resolve(false);
      else resolve(true)
    })
  }))
}
