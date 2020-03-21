import React, {useState} from 'react';
import styled from 'styled-components';
import SearchBar from "./components/SearchBar";
import ResultItem from "./components/ResultItem";


const suggestions = [
  { text: 'Linked list...' },
  { text: 'Awesome list...' },
  { text: 'Some list...' },
];

const results = [
  { title: 'Awesome Node.js', description: 'All about node js development...' },
  { title: 'Awesome Android', description: 'All about Android....' },
  { title: 'Awesome IOS', description: 'All about IOS...' },
  { title: 'Awesome React', description: 'All about React.js' },
];

export default function App () {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <Container>
      <Header>
        <Wrapper>
          <Title>Awesome Search</Title>
          <SearchBar
            value={selectedItem && selectedItem.text}
            suggestions={suggestions}
            onSuggestionClick={setSelectedItem}
            placeholder={"Enter search term..."}
            onChange={console.log}
          />
        </Wrapper>
      </Header>
      <Body>
        {results.map((r, i) => (
          <ResultItem
            key={i}
            title={r.title}
            description={r.description}
          />
        ))}
      </Body>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  flex: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  flex: 1;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: cornflowerblue;
`;

const Body = styled.div`
  flex: 3;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px 0;
  width: 60vw;
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
