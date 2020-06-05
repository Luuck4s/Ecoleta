import React, { useEffect, useState } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Linking } from "react-native";

import {
  SafeView,
  Container,
  BackButton,
  PointImage,
  PointItems,
  PointName,
  Address,
  AddressTitle,
  AddressContent,
  Footer,
  Button,
  ButtonText,
} from "./styles";
import { useNavigation, useRoute } from "@react-navigation/native";

import api from "../../services/api";
import * as MailComposer from "expo-mail-composer";

interface Params {
  point_id: number;
}

interface Data {
  point: {
    image: string;
    image_url: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

const Detail = () => {
  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    const fetchDataPoint = async () => {
      const response = await api.get(`/points/${routeParams.point_id}`);
      setData(response.data);
    };

    fetchDataPoint();
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function hanldeComposeMail() {
    MailComposer.composeAsync({
      subject: "Interesse na coleta de resíduos",
      recipients: [data.point.email],
    });
  }

  function handleWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`
    );
  }

  if (!data.point) {
    return null;
  }

  return (
    <SafeView>
      <Container>
        <BackButton onPress={handleNavigateBack}>
          <Feather name="arrow-left" size={20} color="#34cb78" />
        </BackButton>
        <PointImage
          source={{
            uri: data.point.image_url,
          }}
        />
        <PointName>{data.point.name}</PointName>
        <PointItems>
          {data.items.map((item) => item.title).join(", ")}
        </PointItems>
        <Address>
          <AddressTitle>Endereço</AddressTitle>
          <AddressContent>
            {data.point.city}, {data.point.uf}
          </AddressContent>
        </Address>
      </Container>
      <Footer>
        <Button onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <ButtonText>whatsapp</ButtonText>
        </Button>
        <Button onPress={hanldeComposeMail}>
          <Feather name="mail" size={20} color="#FFF" />
          <ButtonText>E-mail</ButtonText>
        </Button>
      </Footer>
    </SafeView>
  );
};

export default Detail;
