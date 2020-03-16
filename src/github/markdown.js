import unified from 'unified';
import markdown from 'remark-parse';
import { select as selectNode, selectAll } from "unist-util-select";


/**
 * @description Parse markdown to high-level document tree.
 * @param text
 * @returns {Object}
 */
export default function (text) {
  const tree = unified().use(markdown).parse(text);
  const document = {
    title: select('heading[depth=1] > text', tree, 'value'),
    children: [],
  };

  let sectionIndex = -1;
  let subsectionIndex = -1;
  for (let i = 0; i < tree.children.length; i++) {
    const child = tree.children[i];
    if (child.type === 'heading' && child.depth === 2) {
      sectionIndex++;
      subsectionIndex = -1;
      document.children[sectionIndex] = {
        title: select('text', child, 'value'),
        children: [],
      };
    }
    if (child.type === 'heading' && child.depth === 3) {
      subsectionIndex++;
      document.children[sectionIndex].children[subsectionIndex] = {
        title: select('text', child, 'value'),
        children: []
      };
    }
    if (child.type === 'list') {
      const listItems = [];
      const listItemsNodes = selectAll('listItem', child);
      for (let l = 0; l < listItemsNodes.length; l++) {
        const items = select('listItem > paragraph', listItemsNodes[l], 'children');
        const text = selectAll('text', listItemsNodes[l])
          .map(e => e.value)
          .reduce((p, c) => p + c)
          .split('\n\t\t');
        for (let j = 0; (j < items.length && (j / 2) < text.length); j += 2) {
          const title = select('link > text', items[j], 'value') || select('link > text', items[j + 1], 'value');
          const url = select('link', items[j], 'url') || select('link', items[j + 1], 'url');
          const description = text[j / 2].replace(title, '');
          const item = { title, url, description, children: [] };
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
  }
  return document;
}

function select (selector, tree, attr) {
  const node = selectNode(selector, tree);
  return node ? node[attr] : null;
}
