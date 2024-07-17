import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../config/Config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useFonts } from 'expo-font';

export default function HomeScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  const [loaded, error] = useFonts({
    'Pixel': require('../assets/fonts/PixelifySans-Medium.ttf'),
    'Oswald': require('../assets/fonts/BebasNeue-Regular.ttf'),
  });

  useEffect(() => {
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setCorreo('');
      setContrasenia('');
    });

    return unsubscribe;
  }, [navigation]);

  function login() {
    signInWithEmailAndPassword(auth, correo, contrasenia)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigation.navigate('Drawer');
      })
      .catch((error: any) => {
        const errorCode = error.code;
        let titulo = "";
        let mensaje = "";

        if (errorCode === "auth/wrong-password") {
          titulo = "Error de contraseña";
          mensaje = "La contraseña ingresada es incorrecta";
        } else if (errorCode === "auth/user-not-found") {
          titulo = "Error de usuario";
          mensaje = "El usuario ingresado no existe";
        } else {
          titulo = "Error de Acceso";
          mensaje = "Revisar credenciales";
        }

        Alert.alert(titulo, mensaje);
      });
  }

  return (
    <ImageBackground
      source={require('../assets/background2.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          placeholder='Ingresa tu correo electrónico'
          onChangeText={(texto) => setCorreo(texto)}
          keyboardType='email-address'
          placeholderTextColor="black" // Color del placeholder
          style={styles.input}
          value={correo}
        />
        <TextInput
          placeholder='Ingresa contraseña'
          onChangeText={(texto) => setContrasenia(texto)}
          style={styles.input}
          placeholderTextColor="black" // Color del placeholder
          secureTextEntry={true}
          value={contrasenia}
        />
        
        <TouchableOpacity style={styles.btn} onPress={login}>
          <Text style={styles.btnText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
          <Text style={styles.registerText}>Registrarse</Text>
        </TouchableOpacity>
        </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo semi-transparente para mejorar la legibilidad del texto
    padding: 20,
  },
  title: {
    fontSize: 50,
    color: 'lightblue',
    marginBottom: 20,
    fontFamily: 'Pixel',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -5, height: 5 },
    textShadowRadius: 3,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    height: 50,
    width: "100%",
    margin: 10,
    fontFamily: 'Oswald',
    borderRadius: 10,
    borderColor: 'lightblue',
    borderWidth: 2,
    paddingHorizontal: 20,
    //color: '#fff',
  },
  btn: {
    backgroundColor: 'rgba(255, 68, 68, 0.8)',
    width: 150,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Oswald',
  },
  registerText: {
    color: 'lightblue',
    fontSize: 20,
    marginTop: 10,
    fontFamily: 'Oswald',
    textDecorationLine: 'underline',
  },
});
