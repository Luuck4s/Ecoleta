import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  Container,
  BackButton,
  Title,
  Description,
  MapContainer,
  Map,
  MapMarker,
  MapMarkerImage,
  ItemsContainer,
  Item,
  ItemImage,
  ItemTitle,
  ScrollContainer,
  MapMarkerContainer,
  MapMarkerTitle,
} from "./styles";

import { Feather } from "@expo/vector-icons";

import * as Location from "expo-location";
import api from "../../services/api";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  image: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;

  useEffect(() => {
    const loadPosition = async () => {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Ops", "Precisamos de sua localização");
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setInitialPosition([latitude, longitude]);
    };
    loadPosition();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await api.get("/items");
      setItems(response.data);
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const fetchPoints = async () => {
      const response = await api.get("/points", {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems,
        },
      });
      setPoints(response.data);
    };

    fetchPoints();
  }, [selectedItems]);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate("Detail", { point_id: id });
  }

  function handleSelectItem(id: number) {
    const alredySelected = selectedItems.findIndex((item) => item === id);

    if (alredySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <>
      <Container>
        <BackButton onPress={handleNavigateBack}>
          <Feather name="arrow-left" size={20} color="#34cb78" />
        </BackButton>
        <Title>Bem Vindo.</Title>
        <Description>Encontre no mapa um ponto de coleta.</Description>
        <MapContainer>
          {initialPosition[0] !== 0 && (
            <Map
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map((point) => (
                <MapMarker
                  key={`${point.id}`}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  onPress={() => handleNavigateToDetail(point.id)}
                >
                  <MapMarkerContainer>
                    <MapMarkerImage
                      source={{
                        uri: point.image,
                      }}
                    />
                    <MapMarkerTitle>{point.name}</MapMarkerTitle>
                  </MapMarkerContainer>
                </MapMarker>
              ))}
            </Map>
          )}
        </MapContainer>
      </Container>
      <ScrollContainer
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        <ItemsContainer>
          {items.map((item) => (
            <Item
              selected={selectedItems.includes(item.id) ? true : false}
              key={`${item.id}`}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.6}
            >
              <ItemImage width={42} height={42} uri={item.image_url} />
              <ItemTitle>{item.title}</ItemTitle>
            </Item>
          ))}
        </ItemsContainer>
      </ScrollContainer>
    </>
  );
};

export default Points;
