import React from "react";
import { FiArrowLeft } from "react-icons/fi";

import { Container, Image, BackToHome } from "./styles";

import Logo from "../../assets/logo.svg";

interface HeaderProps {
  backToHome?: boolean;
}

const Header: React.FC<HeaderProps> = ({ backToHome = false }) => {
  return (
    <Container>
      <Image src={Logo} />
      {backToHome && (
        <BackToHome to="/">
          <FiArrowLeft /> Voltar para Home
        </BackToHome>
      )}
    </Container>
  );
};

export default Header;
