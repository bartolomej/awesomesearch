import React from "react";
import styled from "@emotion/styled";
import UseAnimations from "react-useanimations";


function Modal ({ children, onClose }) {

  return (
    <Container>
      <InnerContainer>
        <CloseButton onClick={onClose}>
          <UseAnimations
            animationKey="plusToX"
            size={40}
            style={{ transform: 'rotate(45deg)' }}/>
        </CloseButton>
        {children}
      </InnerContainer>
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(10px);
  background: rgba(0,0,0,0.6);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: showUp 250ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
    
  @keyframes showUp {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;


const InnerContainer = styled.div`
  position: relative;
  border-radius: 8px;
  z-index: 21;
  padding: 40px 60px;
  box-sizing: border-box;
  background: ${p => p.theme.color.light};
  color: ${p => p.theme.color.dark};
  @media (max-width: 700px) {
    max-width: 90vw;
    padding: 30px 20px;
  }
`;


const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  color: ${p => p.theme.color.dark};
  &:hover {
    color: ${p => p.theme.color.red};
    transform: scale(1.1);
  }
`;

export default Modal;
