import React from 'react';
import styled from "styled-components";
import UseAnimations from "react-useanimations";


export default function SearchBar ({ results, onChange, placeholder }) {

  return (
    <Container>
      <SearchIcon animationKey="searchToX" size={50}/>
      <Input
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        type="text"
      />
      <MetaText>{results && results > 0 ? `${results} results` : ''}</MetaText>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  width: 100%;
  border-radius: 20px;
  background: white;
  padding: 13px;
  @media (max-width: 700px) {
    width: 80%;
  }
`;

const Input = styled.input`
  display: flex;
  outline: none;
  border: none;
  padding: 0 10px;
  font-size: 16px;
  flex: 10;
  border-radius: 10px;
  color: ${props => props.theme.primary};
  ::placeholder {
    color: ${props => props.theme.lightText};
  }
  font-family: 'Libre Franklin', sans-serif;
`;

const SearchIcon = styled(UseAnimations)`
  height: 1.5rem;
  display: inline-block;
  margin: auto 0;
  color: ${props => props.theme.primary};
  pointer-events: none;
`;

const MetaText = styled.span`
  flex: 2;
  font-size: 12px;
  margin: auto 0;
  color: ${props => props.theme.lightText};
`;
