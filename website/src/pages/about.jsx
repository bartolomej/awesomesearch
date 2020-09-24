import React from 'react';
import Layout from "../components/layout";
import { Body, Header, Logo, Title } from "../style/ui";
import styled from "@emotion/styled";
import { ReactComponent as fetchIllustration } from '../assets/fetch-lists.svg'
import awesomeScreenshot from '../assets/awesome-screenshot.png'


/**
 * ATTRIBUTIONS:
 * <div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
 */

function AboutPage () {

  return (
    <Layout>
      <Header>
        <Logo/>
        <Title>About <a
          href="https://awesomesearch.in">awesomesearch.in</a></Title>
      </Header>
      <Body withoutPadding>
        <Container>
          <h2>What is Awesome list ?</h2>
          <p>
            Ever found a super cool website that you wanted to save for later ?
            Well <BlankLink>Awesome list</BlankLink> is the biggest open source
            collection of awesome links / resources that other people
            (mostly developers) found on the internet. It is released
            under <BlankLink
            href="https://github.com/sindresorhus/awesome/blob/main/license">Creative
            Commons Zero v1.0 Universal</BlankLink> license, which means anyone
            can use, modify and distribute it for free.
          </p>
          <p>
            The project now known under the name 'awesome' was originally
            started by Github user <BlankLink
            href="https://github.com/sindresorhus">sindresorhus</BlankLink> back
            in 2014 and now has over 141000 Github stars.
            Main project acts as a index or collection of other curated lists
            that were started by other Github users. Today there are over 600
            lists listed on <BlankLink
            href="https://awesome.re">awesome.re</BlankLink> and each of those
            lists contains anywhere between a few ten to a few hundred links 🤯.
          </p>
          <BlankLink href="https://awesome.re">
            <AwesomeScreenshot src={awesomeScreenshot}/>
          </BlankLink>
          <h2>So what is awesomesearch.in then ?</h2>
          <p>
            AwesomeSearch is a web crawler and a search engine for <BlankLink
            href="https://awesome.re">Awesome list</BlankLink>.
            This service parses and indexes the contents of all those hundreds
            of lists that are listed on <BlankLink
            href="https://awesome.re">awesome.re</BlankLink>, so that users
            don't spend a lot of time manually searching through the collection.
            Project was build to make awesome list easily searchable and
            discoverable with good UX in mind.
          </p>
          <span>There are also a few other alternatives:</span>
          <ul>
            <li><BlankLink href="https://awesome-indexed.mathew-davies.co.uk/">Awesome
              Indexed</BlankLink></li>
            <li><BlankLink
              href="https://awesomelists.top/">awesomelists.top</BlankLink></li>
          </ul>
          <h2>How does it work ?</h2>
          <p>
            AwesomeSearch fetches some information (aka. "<BlankLink
            href="https://en.wikipedia.org/wiki/Metadata">metadata</BlankLink>")
            from the <BlankLink href="https://docs.github.com/en/rest">Github
            API</BlankLink>. It then parses the main README.md file - this is
            where all the links are found.
            Our servers then retrieve and store some metadata about those links
            (website title, description,...) and perform a screenshot of the
            site for better previewing experience.
          </p>
          <FetchIllustration/>
        </Container>
      </Body>
    </Layout>
  )
}

const BlankLink = ({ href, children }) => (
  <a href={href} rel="noopener noreferrer" target="_blank">{children}</a>
);

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  p {
    margin: 10px 0 20px 0;
  }
  span {
    margin: 5px 0;
    display: inline-block;
  }
  span, p {
    font-size: ${p => p.theme.size(1.2)};
    color: ${p => p.theme.color.dark};
    line-height: 1.5;
  }
  a {
    color: ${p => p.theme.color.red};
  }
  h2 {
    padding: 80px 0 30px 0;
  }
  ul {
    margin-left: 40px;
  }
  li {
    line-height: 1.6;
  }
  @media (max-width: 700px) {
    width: 90vw;
    margin: auto;
  }
`;

const FetchIllustration = styled(fetchIllustration)`
  width: 100%;
`;

const AwesomeScreenshot = styled.img`
  width: 100%;
  border-radius: 8px;
  border: 2px solid ${p => p.theme.color.dark};
`;

export default AboutPage;
