import { fetchText } from "./utils";
import parseMarkdown from "../github/parser";
import unified from "unified";
import markdown from "remark-parse";
import inspect from 'unist-util-inspect';
import removePosition from 'unist-util-remove-position';


export default class TestCase {

  constructor (repoUid, readmePath) {
    this.uid = repoUid;
    this.readmePath = readmePath;
    this.readme = null;
    this.parsedReadme = null;
    this.parseError = null;
  }

  getParsed () {
    return this.parsedReadme;
  }

  getReadmeName () {
    return this.readmePath.replace('/', '');
  }

  getUrl () {
    return (
      'https://github.com/'
      + `${this.getUserName()}/`
      + `${this.getRepoName()}/`
      + `${this.getReadmeName()}`
    );
  }

  getRawUrl () {
    return (
      'https://raw.githubusercontent.com/'
      + `${this.getUserName()}/`
      + `${this.getRepoName()}/`
      + `master/${this.getReadmeName()}`
    )
  }

  getRepoName () {
    const parts = this.uid.split('/').reverse();
    for (let p of parts) {
      if (p !== '') {
        return p;
      }
    }
  }

  getUserName () {
    const parts = this.uid.split('/');
    for (let p of parts) {
      if (p !== '') {
        return p;
      }
    }
  }

  async fetchRepo () {
    try {
      this.readme = await fetchText(this.getRawUrl());
    } catch (e) {
      if (e.message === 'Resource not found') {
        throw new Error('Invalid url');
      } else {
        throw e;
      }
    }
  }

  parse () {
    if (!this.readme) {
      throw new Error('Readme not fetched');
    }
    try {
      this.parsedReadme = parseMarkdown(this.readme);
      return true;
    } catch (e) {
      this.parseError = e;
      return false;
    }
  }

  getJsonTree () {
    if (!this.readme) {
      throw new Error('Readme not fetched');
    }
    const tree = unified().use(markdown).parse(this.readme);
    removePosition(tree, true);
    return tree;
  }

  getTxtTree () {
    if (!this.readme) {
      throw new Error('Readme not fetched');
    }
    return inspect.noColor(unified().use(markdown).parse(this.readme));
  }

  getJson () {
    return {
      success: this.parseError === null,
      readmePath: this.readmePath
    }
  }

}
