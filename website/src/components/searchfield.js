import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import searchIcon from '../assets/search.svg';
import { Button, Link1 } from "../style/ui";


const SearchField = ({ placeholder, onChange, onSubmit, suggestions }) => {
  const [text, setText] = useState('');
  const [suggestionList, setSuggestionList] = useState([]);
  const containerRef = React.useRef();

  useEffect(() => {
    window.addEventListener('click', onClick);
    window.addEventListener('keypress', onKeyPress);
    return () => {
      window.removeEventListener('click', onClick)
      window.removeEventListener('keypress', onKeyPress)
    }
  }, [text]);

  useEffect(() => {
    setSuggestionList(suggestions);
  }, [suggestions]);

  function onClick (e) {
    if (!containerRef.current) return;
    if (!containerRef.current.contains(e.target)) {
      setSuggestionList([]);
    } else {
      setSuggestionList(suggestions);
    }
  }

  function onKeyPress (e) {
    if (e.key === 'Enter') {
      onSubmit(text);
      setSuggestionList([]);
    }
  }

  function onSuggestionClick (s) {
    setText(s);
    setSuggestionList([]);
    onSubmit(s);
  }

  function onSubmitClick () {
    onSubmit(text);
    setSuggestionList([]);
  }

  return (
    <Container ref={containerRef}>
      <InnerContainer>
        <Icon/>
        <Field
          type="text"
          value={text}
          placeholder={placeholder}
          onChange={e => {
            setText(e.target.value);
            onChange(e.target.value);
          }}
        />
        <Submit onClick={onSubmitClick}>Search</Submit>
      </InnerContainer>
      {suggestionList.length > 0 && (
        <SuggestionContainer>
          {suggestionList.map(s => (
            <SuggestionItem
              key={s}
              dangerouslySetInnerHTML={{
                __html: insertMarks(s, text)
              }}
              onClick={() => onSuggestionClick(s)} />
          ))}
        </SuggestionContainer>
      )}
    </Container>
  )
}

function insertMarks (s, t) {
  return s.replace(t, `<mark>${t}</mark>`);
}

const Container = styled.div`
  width: 600px;
  position: relative;
  @media (max-width: 700px) {
    width: 90%;
  }
`;

const InnerContainer = styled.div`
  padding: 8px ;
  margin: 3px;
  border-radius: 10px;
  display: flex;
  background: white;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s ease-in-out all;
  &:focus-within {
    box-shadow: 
      ${p => p.theme.opacity(p.theme.color.red, 150)} 4px 4px 16px, 
      ${p => p.theme.opacity(p.theme.color.red, 150)} -4px -4px 16px;
  }
`;

const Icon = styled(searchIcon)`
  width: 25px;
  margin-left: 10px;
`;

const Field = styled.input`
  flex: 1;
  margin: 0 20px;
  width: 70%;
  padding: 10px 0;
  color: ${p => p.theme.color.dark};
  font-size: ${p => p.theme.size(1.1)};
  @media (max-width: 700px) {
    margin: 0 5px;
    font-size: ${p => p.theme.size(1)};
  }
`;

const Submit = styled.button`
  ${Button}
`;

const SuggestionContainer = styled.div`
  position: absolute;
  z-index: 10;
  display: flex;
  width: 100%;
  background: white;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  box-sizing: border-box; 
  border-radius: 10px;
  margin-top: 10px;
`;

const SuggestionItem = styled.button`
  padding: 8px;
  color: ${p => p.theme.opacity(p.theme.color.dark, 10)};
  width: 100%;
  text-align: start;
  border-radius: 8px;
  &:hover {
    background: ${p => p.theme.color.light};
  }
  mark {
    background: ${p => p.theme.color.gold};
  }
`;

export default SearchField;
