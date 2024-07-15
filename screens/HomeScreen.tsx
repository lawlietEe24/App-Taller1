import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import React, { useState } from 'react';
import { auth } from '../config/Config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function HomeScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  function login() {
    signInWithEmailAndPassword(auth, correo, contrasenia)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigation.navigate('BottomTabs');
      })
      .catch((error:any) => {
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
          style={styles.input}
        />
        <TextInput
          placeholder='Ingresa contraseña'
          onChangeText={(texto) => setContrasenia(texto)}
          style={styles.input}
          secureTextEntry={true}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Agrega un fondo semi-transparente para mejorar la legibilidad del texto
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: 'yellow',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  input: {
    backgroundColor: '#444',
    height: 50,
    width: "100%",
    margin: 10,
    borderRadius: 10,
    borderColor: 'yellow',
    borderWidth: 2,
    paddingHorizontal: 20,
    color: '#fff',
  },
  btn: {
    backgroundColor: '#ff4444',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: 'yellow',
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});
