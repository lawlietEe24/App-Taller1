import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { auth } from '../config/Config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegistroScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [edad, setEdad] = useState('');

    function registro() {
        createUserWithEmailAndPassword(auth, correo, contrasenia)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);

            // Aquí puedes almacenar el usuario adicional en tu base de datos
            // Puedes usar Firebase Firestore o Realtime Database para esto

            navigation.navigate('Home'); // Cambié a navigate en lugar de replace como originalmente tenías
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
            Alert.alert('Error', errorMessage);
        });
    }


  return (
    <ImageBackground 
      source={require('../assets/background2.png')}// Cambia esto por la URL de tu imagen o usa require para imágenes locales
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>

        <TextInput
          placeholder='Ingresa tu correo electrónico'
          onChangeText={(texto) => setCorreo(texto)}
          keyboardType='email-address'
          value={correo}
          style={styles.input}
          />
        <TextInput
          placeholder='Ingresa contraseña'
          onChangeText={(texto) => setContrasenia(texto)}
          secureTextEntry
          value={contrasenia}
          style={styles.input}
          />
        <TextInput
          placeholder='Ingrese edad'
          placeholderTextColor="#fff"
          style={styles.input}
          value={edad}
          onChangeText={setEdad}
          keyboardType='numeric'
        />
        <TouchableOpacity style={styles.btn} onPress={registro}>
          <Text style={styles.btnText}>Registro</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
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
    fontSize: 50,
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
  }
});
