import React from "react";
import styled from "@emotion/styled";


/**
 * This component replaces github :<emoji-name>: syntax with emoji images.
 */
function Description ({ text, emojis, maxLength = 80, color }) {

  return (
    <Container c={color} dangerouslySetInnerHTML={{
      __html: insertEmojis(formatDesc(text, maxLength), emojis)
    }}/>
  )
}

function insertEmojis (text, emojis) {
  for (let { key, url } of emojis) {
    text = text.replace(`:${key}:`, `<img src="${url}" alt="" />`);
  }
  return text;
}

function formatDesc (text, l = null) {
  if (text) {
    return (l && text.length > l)
      ? `${text.substring(0, l)}...`
      : text
  } else {
    return '';
  }
}

const Container = styled.p`
  color: ${p => p.c || p.theme.opacity(p.theme.color.dark, 80)};
  font-weight: normal;
  margin-top: 10px;
  img {
    height: 15px;
  }
`;

export default Description;
