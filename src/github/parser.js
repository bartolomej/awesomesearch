import unified from 'unified';
import markdown from 'remark-parse';
import u from 'unist-builder';
import { select, selectAll } from "unist-util-select";
import Document from "./models/document";
import Section from "./models/section";
import ListItem from "./models/list-item";
import removePosition from 'unist-util-remove-position';


/**
 * @description Parse markdown to high-level document tree.
 * @param text
 * @returns {Document}
 */
export default function (text) {
  const tree = unified().use(markdown).parse(text);
  const document = new Document(s('heading[depth=1] > text', tree, 'value'));

  let sectionIndex = -1;
  let subsectionIndex = -1;
  for (let i = 0; i < tree.children.length; i++) {
    const child = tree.children[i];
    try {
      if (child.type === 'heading' && child.depth === 2) {
        sectionIndex++;
        subsectionIndex = -1;
        document
          .children[sectionIndex] = new Section(s('text', child, 'value'));
      }
      if (child.type === 'heading' && child.depth === 3) {
        subsectionIndex++;
        document
          .children[sectionIndex]
          .children[subsectionIndex] = new Section(s('text', child, 'value'));
      }
      if (child.type === 'list') {
        const listItems = [];
        const listNodes = selectAll('listItem', child);
        for (let l = 0; l < listNodes.length; l++) {
          const items = s('listItem > paragraph', listNodes[l], 'children');
          const text = selectAll('text', listNodes[l]).map(e => e.value).reduce((p, c) => p + c).split('\n\t\t');
          for (let j = 0; (j < items.length && (j / 2) < text.length); j += 2) {
            const title = s('link > text', u('node', [items[j], items[j + 1]]), 'value');
            const url = s('link', u('node', [items[j], items[j + 1]]), 'url');
            const item = new ListItem(title, url, text[j / 2]);
            if (listItems[l]) {
              listItems[l].children.push(item);
            } else {
              listItems[l] = item;
            }
          }
        }
        if (subsectionIndex === -1) {
          document.children[sectionIndex].children = listItems;
        } else {
          document.children[sectionIndex].children[subsectionIndex].children = listItems;
        }
      }
    } catch (e) {
      throw new ParseError(document, child, e);
    }
  }
  return document;
}

function s (selector, tree, attr) {
  const node = select(selector, tree);
  return node ? node[attr] : null;
}

function sAll (selector, tree, attrs) {
  const nodes = selectAll(selector, tree);
  return nodes.reduce((p, c) => p[attrs] + c[attrs])
}

export class ParseError extends Error {

  constructor (document, node, e) {
    super();
    this.name = 'ParseError';
    this.document = document;
    this.node = node;
    this.e = e;

  }

  toString () {
    removePosition(this.node);
    removePosition(this.document);
    return (
      this.e.stack
      + '\n\n'
      + '------------------- DOCUMENT: '
      + JSON.stringify(this.document, null, 4)
      + '\n\n'
      + '------------------- CURRENT NODE: '
      + JSON.stringify(this.node, null, 4)
    )
  }

}
