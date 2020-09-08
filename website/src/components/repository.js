import styled from "@emotion/styled/macro";
import { ReactComponent as glasses } from "../assets/glasses.svg";
import { ButtonCss, SubtitleCss } from "../style/ui";
import Description from "./description";
import theme from "../style/theme";
import React from "react";


export default function RepoView ({ title, description, stars, forks, links = 120, url, tags, image, emojis }) {

  function formatTitle (text) {
    return text
      .replace('-', ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  const Logo = styled(glasses)`

  `;

  const DescWrapper = styled.div`
    max-width: 500px;
    padding: 10px 0;
  `;

  const Link = styled.a`
    display: block;
    width: 120px;
    margin: 15px;
    ${ButtonCss};
  `;

  const StatsWrapper = styled.div`
    display: flex;
    text-align: center;
  `;

  const Subtitle = styled.h3`
    ${SubtitleCss};
    margin-top: 10px;
    margin-bottom: 20px;
  `;

  const StatsElement = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 20px;
    padding: 20px;
    background: white;
    border-radius: 5px;
  `;

  return (
    <Container>
      <Logo/>
      <Subtitle>{formatTitle(title)}</Subtitle>
      <StatsWrapper>
        <StatsElement>
          <strong>{links}</strong>
          <span>links</span>
        </StatsElement>
        <StatsElement>
          <strong>{stars}</strong>
          <span>stars</span>
        </StatsElement>
        <StatsElement>
          <strong>{forks}</strong>
          <span>forks</span>
        </StatsElement>
      </StatsWrapper>
      <DescWrapper>
        <Description
          color={theme.color.dark}
          text={description}
          emojis={emojis}
          maxLength={null}
        />
      </DescWrapper>
      <Link target="_blank" href={url}>
        View on Github
      </Link>
    </Container>
  )
}
