import { css } from '@emotion/core';


export const LinkCss = (bg0, bg1, txt0, txt1) => css`
  text-decoration: none;
  // horizontal offset | vertical offset | blur radius | spread radius | color
  box-shadow: inset 0 0 0 ${bg0};
  transition: 0.2s ease-in-out all;
  border-radius: 3px;
  background: ${bg0};
  color: ${txt0};
  &:hover {
    box-shadow: inset 0 -50px 0 ${bg1};
    color: ${txt1};
  }
`;
