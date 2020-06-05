import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { useHistory } from "react-router-dom";
import axios from "axios";
import api from "../../services/api";

import {
  Container,
  Form,
  Title,
  Fieldset,
  Legend,
  TitleForm,
  SubtitleForm,
  Field,
  Label,
  Input,
  FieldGroup,
  Select,
  ListGrid,
  Item,
  ImageItem,
  NameItem,
  Button,
} from "./styles";

import Header from "../../components/Header";
import Dropzone from "../../components/Dropzone";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await api.get("/items");
      setItems(response.data);
    };

    fetchItems();
  }, []);

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

  function hanldeSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUf(uf);
  }

  function hanldeSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  function hanldeMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();

    data.append("name", name);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("uf", uf);
    data.append("city", city);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("items", items.join(","));

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    await api.post("/points", data);

    history.push("/");
  }

  return (
    <Container>
      <Header backToHome />
      <Form onSubmit={handleSubmit}>
        <Title>Cadastro do</Title>
        <Title>ponto de coleta</Title>

        <Dropzone onFileUploaded={setSelectedFile} />

        <Fieldset>
          <Legend>
            <TitleForm>Dados</TitleForm>
          </Legend>

          <Field>
            <Label htmlFor="name">Nome da entidade</Label>
            <Input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
              value={formData.name}
            />
          </Field>

          <FieldGroup>
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Field>
            <Field>
              <Label htmlFor="whatsapp">Whatsapp</Label>
              <Input
                type="text"
                name="whatsapp"
                id="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
              />
            </Field>
          </FieldGroup>
        </Fieldset>

        <Fieldset>
          <Legend>
            <TitleForm>Endereço</TitleForm>
            <SubtitleForm>Selecione o endereço no mapa</SubtitleForm>
          </Legend>

          <Map center={initialPosition} zoom={15} onClick={hanldeMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <FieldGroup>
            <Field>
              <Label htmlFor="uf">Estado (UF)</Label>
              <Select
                name="uf"
                id="uf"
                onChange={hanldeSelectUf}
                value={selectedUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label htmlFor="city">Cidade</Label>
              <Select
                name="city"
                id="city"
                onChange={hanldeSelectCity}
                value={selectedCity}
              >
                <option value="0">Selecione uma Cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </Field>
          </FieldGroup>
        </Fieldset>

        <Fieldset>
          <Legend>
            <TitleForm>Ítens de coleta</TitleForm>
            <SubtitleForm>Selecione um ou mais ítens abaixo</SubtitleForm>
          </Legend>
          <ListGrid>
            {items.map((item) => (
              <Item
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                selected={selectedItems.includes(item.id) ? true : false}
              >
                <ImageItem src={item.image_url} />
                <NameItem>{item.title}</NameItem>
              </Item>
            ))}
          </ListGrid>
        </Fieldset>

        <Button type="submit">Cadastrar ponto de coleta</Button>
      </Form>
    </Container>
  );
};

export default CreatePoint;
