import {css} from "styled-components";


export const LinksContainer = css`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 20px;
  position: fixed;
  bottom: 0;
  ${props => props.custom};
  overflow-y: scroll;
  justify-content: center;
  width: 70%;
  margin: 0 auto;
  @media (max-width: 1300px) {
    width: 100%;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;
