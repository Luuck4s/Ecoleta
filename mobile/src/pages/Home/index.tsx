import React, { useEffect, useState } from "react";

import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  Container,
  Image,
  Main,
  Title,
  Description,
  Button,
  ButtonText,
  ButtonIcon,
  Footer,
} from "./styles";

import RNPickerSelect from "react-native-picker-select";

import axios from "axios";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const navigation = useNavigation();

  function handleNavigationToPoints() {
    if (selectedCity === "0") {
      return;
    }
    navigation.navigate("Points", { uf: selectedUf, city: selectedCity });
  }

  useEffect(() => {
    const fetchUfs = async () => {
      const response = await axios.get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados/"
      );
      const ufsInitials = response.data.map((uf) => uf.sigla);

      setUfs(ufsInitials);
    };

    fetchUfs();
  }, []);

  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }

    const fetchCities = async () => {
      const response = await axios.get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      );

      const citiesNames = response.data.map((city) => city.nome);

      setCities(citiesNames);
    };

    fetchCities();
  }, [selectedUf]);

  return (
    <Container
      source={require("../../assets/home-background.png")}
      imageStyle={{ width: 274, height: 368 }}
    >
      <Main>
        <Image source={require("../../assets/logo.png")} />
        <Title>Seu marketplace de coleta de resíduos</Title>
        <Description>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Description>
      </Main>

      <Footer>
        <RNPickerSelect
          placeholder={{ label: "Selecione um Estado" }}
          onValueChange={(uf) => setSelectedUf(uf)}
          value={selectedUf}
          doneText={"Selecionar"}
          style={{
            placeholder: {
              fontSize: 20,
              backgroundColor: "#FFF",
              borderRadius: 8,
              padding: 10,
              height: 50,
            },
            inputAndroid: {
              fontSize: 20,
              backgroundColor: "#FFF",
              borderRadius: 8,
              padding: 10,
              height: 50,
            },
            inputIOS: {
              fontSize: 20,
              backgroundColor: "#FFF",
              borderRadius: 8,
              padding: 10,
              height: 50,
            },
            viewContainer: {
              marginBottom: 20,
            },
            done: {
              fontSize: 15,
              color: "#34cb79",
            },
          }}
          items={ufs.map((uf) => {
            return { label: uf, value: uf };
          })}
        />

        <RNPickerSelect
          placeholder={{ label: "Selecione uma Cidade" }}
          onValueChange={(city) => setSelectedCity(city)}
          value={selectedCity}
          doneText={"Selecionar"}
          style={{
            placeholder: {
              fontSize: 20,
              backgroundColor: "#FFF",
              borderRadius: 8,
              padding: 10,
              height: 50,
            },
            inputAndroid: {
              fontSize: 20,
              backgroundColor: "#FFF",
              borderRadius: 8,
              padding: 10,
              height: 50,
            },
            inputIOS: {
              fontSize: 20,
              backgroundColor: "#FFF",
              borderRadius: 8,
              padding: 10,
              height: 50,
            },
            viewContainer: {
              marginBottom: 20,
            },
            done: {
              fontSize: 15,
              color: "#34cb79",
            },
          }}
          items={cities.map((city) => {
            return { label: city, value: city };
          })}
        />

        <Button onPress={handleNavigationToPoints}>
          <ButtonIcon>
            <Feather name="arrow-right" color="#FFF" size={24} />
          </ButtonIcon>
          <ButtonText>Entrar</ButtonText>
        </Button>
      </Footer>
    </Container>
  );
};

export default Home;
