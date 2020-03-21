import React, { useState, useEffect } from 'react';
import styled from "styled-components";


export default function SearchBar ({ onChange, placeholder, suggestions, onSuggestionClick }) {
  const [selected, setSelected] = useState(true);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (suggestions.length > 0) {
      setSelected(false);
    }
  }, [suggestions]);

  function onSelect (s) {
    setSelected(true);
    setValue(s.text);
    onSuggestionClick(s)
  }

  function onChangeText (e) {
    const value = e.target.value;
    setValue(value);
    onChange(value);
  }

  return (
    <Container>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={onChangeText}
        type="text"
      />
      <SuggestionContainer>
        {!selected && suggestions.map((s, i) => (
          <SuggestionItem key={i} onClick={() => onSelect(s)}>
            {s.text}
          </SuggestionItem>
        ))}
      </SuggestionContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  display: flex;
  outline: none;
  border-radius: 10px;
  padding: 15px 30px;
  font-size: 16px;
  width: 100%;
`;

const SuggestionContainer = styled.div`
  position: absolute;
  top: 100%;
  width: 100%;
`;

const SuggestionItem = styled.button`
  width: 100%;
  border: 1px solid black;
  padding: 5px;
  outline: none;
  background: white;
  cursor: pointer;
  &:hover {
    background: lightgrey;
  }
`;
