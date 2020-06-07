import React, { useState, useEffect, ChangeEvent } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';


interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  const placeholderUf = { label: 'UF' };
  const placeholderCity = { label: 'Cidade' };

  useEffect(() => {
    axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);

        setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {   
    if (selectedUf === '0') {
        return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
        const cityNames = response.data.map(city => city.nome);

        setCities(cityNames);
    });

  }, [selectedUf]);

  function handleSelectUf(selectedUF: string) {
    const uf = selectedUF;

    setSelectedUf(uf);
  }

  function handleSelectCity(selectedCity: string) {
    const city = selectedCity;

    setSelectedCity(city);
  }

  function handleNavigateToPoint() {

    const uf = selectedUf;
    const city = selectedCity;

    navigation.navigate('Points', {
      uf,
      city
    });
  }

    return (
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ImageBackground 
          source={require('../../assets/home-background.png')} 
          style={styles.container}
          imageStyle={{ width: 274, height: 368 }}
        >
          <View style={styles.main}>
            <Image source={require('../../assets/logo.png')}/>
            <View>
              <Text style={styles.title}>Seu marktplace de coleta de resíduos</Text>
              <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>
          </View>

          <View style={styles.footer}>

            <RNPickerSelect               
              style={pickerSelectStyles}
              onValueChange={(value) => handleSelectUf(value)}           
              value={selectedUf !== '0' ? selectedUf : ufs}
              placeholder={placeholderUf}
              items={ufs.map(uf => ({
                key:uf, 
                label:uf, 
                value:uf
              }))}
            />

            <RNPickerSelect               
              style={pickerSelectStyles}
              onValueChange={(value) => handleSelectCity(value)}           
              value={selectedCity !== '0' ? selectedCity : cities}
              placeholder={placeholderCity}
              items={cities.map(city => ({
                key:city, 
                label:city, 
                value:city
              }))}
            />

            <RectButton style={styles.button} onPress={handleNavigateToPoint}>
              <View style={styles.buttonIcon}>
                <Text>
                  <Icon name='arrow-right' color='#FFF' size={24}/>
                </Text>
              </View>
              <Text style={styles.buttonText}>
                Entrar
              </Text>    
            </RectButton>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  }
});

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });


export default Home;