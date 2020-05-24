import styled from "styled-components";


export const LinksContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 20px;
  position: fixed;
  bottom: 0;
  top: ${props => props.top};
  overflow-y: scroll;
  justify-content: center;
  width: 70%;
  margin: 0 auto;
  @media (max-width: 1300px) {
    width: 100%;
  }
  @media (max-width: 500px) {
    top: 10vh;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;
