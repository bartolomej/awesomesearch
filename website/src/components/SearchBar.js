import React from 'react';
import styled from "styled-components";
import { ReactComponent as Icon } from "../assets/search.svg";
import { PRIMARY, TEXT_LIGHT } from "../colors";


export default function SearchBar ({ results, onChange, placeholder }) {

  return (
    <Container>
      <SearchIcon/>
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
  padding: 10px;
  border: 2px solid rgba(252, 96, 168, 0.5);
`;

const Input = styled.input`
  display: flex;
  outline: none;
  border: none;
  padding: 0 10px;
  font-size: 16px;
  flex: 10;
  border-radius: 10px;
  color: ${PRIMARY};
  font-weight: bold;
  ::placeholder {
    color: ${TEXT_LIGHT};
  }
  font-family: 'Libre Franklin', sans-serif;
`;

const SearchIcon = styled(Icon)`
  flex: 2;
  height: 1.5rem;
  display: inline-block;
  margin: auto 0;
  fill: rgba(252, 96, 168, 0.5);
`;

const MetaText = styled.span`
  flex: 2;
  font-size: 12px;
  margin: auto 0;
  color: ${TEXT_LIGHT};
`;
