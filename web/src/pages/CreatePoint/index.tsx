import React, { useEffect, useState, ChangeEvent } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import logo from "../../assets/logo.svg";
import { Map, TileLayer, Marker } from "react-leaflet";
import api from "../../services/api";
import axios from "axios";

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

const CreatePoint = () => {
  //array ou objeto: manualmente informar o tipo de variável.
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUF, setSelectedUF] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");

  useEffect(() => {
    //nao aceita async await nao pode!!
    api.get("items").then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    //carregar as cidades sempre que a UF mudar.
    if (selectedUF === "0") {
      return;
    }
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedUF]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUF(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
          </legend>

          <Map center={[-21.7614585, -43.3330644]} zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[-21.7614585, -43.3330644]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                onChange={handleSelectUf}
                value={selectedUF}
                name="uf"
                id="uf"
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                value={selectedCity}
                onChange={handleSelectCity}
                name="city"
                id="city"
              >
                <option>Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou ais itens abaixos</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => {
              return (
                <li key={item.id}>
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;