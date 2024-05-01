import axios from 'axios';
import React, { useState } from 'react';
import { Button, Image, Keyboard, Text, TextInput, View } from 'react-native';

const traduzirCondicao = (descricao) => {
  const traducoes = {
    'clear sky': 'céu limpo',
    'few clouds': 'poucas nuvens',
    'scattered clouds': 'nuvens dispersas',
    'broken clouds': 'nuvens quebradas',
    'shower rain': 'chuva rápida',
    'rain': 'chuva',
    'thunderstorm': 'trovoada',
    'snow': 'neve',
    'mist': 'névoa',
  };
  return traducoes[descricao] || descricao;
};

const App = () => {
  const [cidade, setCidade] = useState('');
  const [dadosClima, setDadosClima] = useState(null);
  const [erro, setErro] = useState('');

  const buscarClima = async () => {
    try {
      const resposta = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=419467019bcbeaea93bf4dc3e27d69b1&units=metric`);
      if (resposta.data.cod && resposta.data.cod === "404") {
        setErro("Cidade não encontrada no banco de dados.");
        setDadosClima(null);
      } else {
        setDadosClima(resposta.data);
        setErro('');
      }
    } catch (erro) {
      console.error('Erro ao buscar dados do clima:', erro);
      if (erro.response) {
        setErro('Erro ao buscar dados do clima.\nVerifique se está digitado corretamente.');
      } else if (erro.request) {
        setErro('Erro ao buscar dados do clima.\nVerifique sua conexão com a internet.');
      } else {
        setErro('Erro ao buscar dados do clima.\nPor favor, tente novamente mais tarde.');
      }
      setDadosClima(null);
    }

    Keyboard.dismiss();
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black', padding: 0 }}>
      <View style={{ backgroundColor: 'white', padding: 25, marginBottom: 200}}/>
      <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', marginBottom: 10 }}>Previsão do Tempo</Text>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        <TextInput
          style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, color: 'white' }}
          placeholder="Digite o nome da cidade"
          placeholderTextColor="white"
          onChangeText={(texto) => setCidade(texto)}
          value={cidade}
        />
        <Button title="Buscar" onPress={buscarClima} color="blue" />
        {dadosClima && (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: 'white' }}>Cidade: {dadosClima.name}</Text>
            <Text style={{ color: 'white' }}>Temperatura: {dadosClima.main.temp}°C</Text>
            <Text style={{ color: 'white' }}>Condição: {traduzirCondicao(dadosClima.weather[0].description)}</Text>
            <Image
              source={{ uri: `http://openweathermap.org/img/w/${dadosClima.weather[0].icon}.png` }}
              style={{ width: 50, height: 50 }}
            />
          </View>
        )}
        {erro ? (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: 'red', textAlign: 'center' }}>{erro}</Text>
          </View>
        ) : null}
      </View>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 20}}>
        <Text style={{ color: 'black', textAlign: 'center' }}>Pedro Fanton</Text>
      </View>
    </View>
  );
};
export default App;
