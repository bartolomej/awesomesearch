import { css } from '@emotion/core';
import theme from "./theme";


export const Link1 = (bg0, bg1, txt0, txt1) => css`
  text-decoration: none;
  // horizontal offset | vertical offset | blur radius | spread radius | color
  box-shadow: inset 0 -2px 0 ${bg0};
  transition: 0.2s ease-in-out all;
  color: ${txt0};
  &:hover {
    box-shadow: inset 0 -50px 0 ${bg1};
    color: ${txt1};
    border-radius: 5px;
  }
`;

export const Button = css`
  padding: 12px 20px;
  background: ${theme.color.red};
  color: ${theme.color.white};
  border-radius: 8px !important;
  font-size: ${theme.size(0.9)};
  ${Link1(
    theme.color.red,
    theme.color.amaranth,
    theme.color.white,
    theme.color.white
  )};
  &:hover {
    transform: scale(1.05);
  }
  &:active {
    transform: scale(1.1);
  }
`;
