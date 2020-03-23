import React from 'react';
import styled from "styled-components";
import { ReactComponent as Icon } from "../assets/search.svg";
import { PRIMARY, TEXT_LIGHT, TEXT_LIGHTEST } from "../colors";


export default function SearchBar ({ onChange, placeholder }) {

  return (
    <Container>
      <SearchIcon/>
      <Input
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        type="text"
      />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
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
  width: 100%;
  border-radius: 10px;
  color: ${PRIMARY};
  font-weight: bold;
  ::placeholder {
    color: ${TEXT_LIGHT};
  }
  font-family: 'Libre Franklin', sans-serif;
`;

const SearchIcon = styled(Icon)`
  height: 1.5rem;
  display: inline-block;
  margin: auto auto;
  fill: ${TEXT_LIGHT};
`;
