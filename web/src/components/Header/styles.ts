import styled from "styled-components";

import { Link } from "react-router-dom";

export const Container = styled.header`
  margin-top: 48px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 900px) {
    margin: 48px auto 0;
  }
`;

export const Image = styled.img``;

export const BackToHome = styled(Link)`
  color: var(--title-color);
  font-weight: bold;
  text-decoration: none;

  display: flex;
  align-items: center;

  svg {
    margin-right: 16px;
    color: var(--primary-color);
  }
`;
