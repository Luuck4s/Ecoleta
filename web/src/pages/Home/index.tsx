import React from "react";
import { FiLogIn } from "react-icons/fi";

import {
  Container,
  Content,
  MainContent,
  Title,
  Subtitle,
  Button,
  ButtonIcon,
  ButtonText,
} from "./styles";

import Header from "../../components/Header";

const Home: React.FC = () => {
  return (
    <Container>
      <Content>
        <Header />

        <MainContent>
          <Title>Seu marketpalce de coleta de resíduos.</Title>
          <Subtitle>
            Ajudando pessoas a encontrarem pontos de coleta de forma eficiente.
          </Subtitle>

          <Button to={"/create-point"}>
            <ButtonIcon>
              <FiLogIn color={"#FFF"} size={20} />
            </ButtonIcon>
            <ButtonText>Cadastre um ponto de coleta</ButtonText>
          </Button>
        </MainContent>
      </Content>
    </Container>
  );
};

export default Home;
