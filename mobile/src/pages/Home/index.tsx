import React, { useState, useEffect, ChangeEvent } from 'react';
import {Feather as Icon} from '@expo/vector-icons'
import { View,TextInput,Platform,KeyboardAvoidingView,ImageBackground ,Image, StyleSheet,Text, PickerIOSBase, Picker} from 'react-native';
import {RectButton} from 'react-native-gesture-handler'
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect, {PickerStyle} from 'react-native-picker-select';
import api from '../../services/api';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome:string;
}


const Home = () => {
  const [ufs,setUfs] = useState<string[]>([]);
  const [cities,setCities] = useState<string[]>([]);

  const [selectedUf,setSelectedUf] = useState('0');
  const [selectedCity,setSelectedCity] = useState('0');

    const navigation = useNavigation();

    function handleNavigateToPoints() {
      navigation.navigate('Point',{
        uf:selectedUf,
        city:selectedCity
      });
    }
    function handleSelectedUf(value: string) {
     
      const uf = value;

      setSelectedUf(uf);
    }
    function handleSelectedCity(value: string) {
      const city = value

      setSelectedCity(city)
    }

    useEffect( () => {
      api.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(resp => {
        const ufInitials = resp.data.map( uf => uf.sigla)
        setUfs(ufInitials)
      })
    },[])
    useEffect( () => {
      api.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then( resp => {
        const cityNames = resp.data.map( city => city.nome)
        setCities(cityNames);
      })
    },[selectedUf])


    return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground  source={require('../../assets/home-background.png')} 
      style={styles.container}
      imageStyle={{ width:274, height:368}}
      > 
          <View style={styles.main}>
              <Image source={require('../../assets/logo.png')} />
              <View>
                <Text style={styles.title}> Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}> Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
              </View>
          </View>

          <View style={styles.footer}>
             <RNPickerSelect onValueChange={(value) => {handleSelectedUf(value)}}
             value={selectedUf}      
             style={{inputIOS:styles.input}}
             placeholder={{label:'Selecione um Estado',color:'#9EA0A4'}}
             items={ufs.map(uf => ({
               label: uf,
               value: uf
             }))}
             />

               <RNPickerSelect onValueChange={(value) => {handleSelectedCity(value)}}
              value={selectedCity}
             style={{inputIOS:styles.input}}
             placeholder={{label:'Selecione uma cidade',color:'#9EA0A4'}}
             items={cities.map(city => ({
               label: city,
               value: city
             }))}
             /> 


              <RectButton style={styles.button} onPress={ handleNavigateToPoints }>
                  <View style={styles.buttonIcon}>
                      <Text>
                          <Icon 
                          name="arrow-right" 
                          color="#fff"
                          size={24}
                          ></Icon>
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

  selectIos: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

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