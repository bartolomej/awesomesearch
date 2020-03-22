import React, { useState } from 'react';
import styled from 'styled-components';
import SearchBar from "./components/SearchBar";
import ResultItem from "./components/ResultItem";


export default function App () {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  async function fetchResults (searchTerm) {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/search?q=${searchTerm}`);
      const results = await response.json();
      setResults([...results, ...results, ...results ]);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  return (
    <Container>
      <Header>
        <Wrapper>
          <Title>Awesome Search</Title>
          <SearchBar
            value={selectedItem && selectedItem.text}
            suggestions={[]}
            onSuggestionClick={setSelectedItem}
            placeholder={"Enter search term..."}
            onChange={fetchResults}
          />
        </Wrapper>
      </Header>
      <Body>
        {results.map((r, i) => (
          <ResultItem
            key={i}
            type={r.type}
            url={r.url}
            image={r.image}
            title={r.title}
            tags={r.tags}
            description={r.description}
          />
        ))}
      </Body>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  height: 30vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: cornflowerblue;
  position: fixed;
`;

const Body = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 70vh;
  width: 100vw;
  position: fixed;
  bottom: 0;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  width: 60%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 25px;
`;
