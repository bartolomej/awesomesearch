import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import searchIcon from '../assets/search.svg';


const SearchField = ({ placeholder, onChange, onSubmit, suggestions }) => {
  const [text, setText] = useState('');
  const [suggestionList, setSuggestionList] = useState([]);
  const containerRef = React.useRef();

  useEffect(() => {
    window.addEventListener('click', e => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setSuggestionList([]);
      } else {
        setSuggestionList(suggestions);
      }
    });
    window.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        onSubmit(text);
      }
    });
  }, []);

  useEffect(() => {
    setSuggestionList(suggestions);
  }, [suggestions]);

  function onSuggestionClick (s) {
    setText(s);
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
        <Submit onClick={() => onSubmit(text)}>
          Search
        </Submit>
      </InnerContainer>
      {suggestionList.length > 0 && (
        <SuggestionContainer>
          {suggestionList.map(s => (
            <SuggestionItem key={s} onClick={() => onSuggestionClick(s)}>{s}</SuggestionItem>
          ))}
        </SuggestionContainer>
      )}
    </Container>
  )
}

const BORDER_RADIUS = 10;

const Container = styled.div`
  border-radius: ${BORDER_RADIUS * 1.7}px;
  border: 3px solid transparent;
  &:focus-within {
    border: 3px solid ${p => p.theme.color.orange};
  }
  width: 50%;
  position: relative;
`;

const InnerContainer = styled.div`
  padding: 8px ;
  margin: 3px;
  border-radius: ${BORDER_RADIUS}px;
  display: flex;
  background: white;
  justify-content: space-between;
  align-items: center;
`;

const Icon = styled(searchIcon)`
  width: 25px;
  margin-left: 10px;
`;

const Field = styled.input`
  flex: 1;
  margin: 0 20px;
  color: ${p => p.theme.color.dark};
  font-size: ${p => p.theme.size(1.1)};
`;

const Submit = styled.button`
  padding: 15px 20px;
  background: ${p => p.theme.color.red};
  color: ${p => p.theme.color.white};
  border-radius: 8px;
`

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
  padding: 8px 4px;
  width: 100%;
  text-align: start;
  &:hover {
    background: ${p => p.theme.color.light};
  }
`;

export default SearchField;
