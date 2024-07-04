import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { db } from '../config/Config';
import { ref, set } from "firebase/database";

export default function RegistroScreen({ navigation }: any) {
  const [password, setPassword] = useState('');
  const [edad, setEdad] = useState('');
  const [nickname, setNickname] = useState('');

  /*Guardar */
  function writeUserData(nickname: String, edad: String, contrasenia: String) {
    set(ref(db, 'usuarios/' + nickname), {
      age: edad,
      password: contrasenia,
    });
  }

  const handleRegister = () => {
    // Validar que todos los campos estén completos
    if (password && edad && nickname) {
      writeUserData(nickname, edad, password);
      Alert.alert('Registro exitoso');
      navigation.navigate('Stack');
    } else {
      Alert.alert('Por favor, complete todos los campos');
    }
  };

  const handleLogin = () => {
    // Aquí puedes agregar la lógica para el inicio de sesión
    navigation.navigate('HomeScreen');
  };

  return (
    <ImageBackground 
      source={require('../assets/background2.png')}// Cambia esto por la URL de tu imagen o usa require para imágenes locales
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>

        <TextInput
          placeholder='Ingrese un Nickname'
          placeholderTextColor="#fff"
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
        />
        <TextInput
          placeholder='Ingrese contraseña'
          placeholderTextColor="#fff"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <TextInput
          placeholder='Ingrese edad'
          placeholderTextColor="#fff"
          style={styles.input}
          value={edad}
          onChangeText={setEdad}
          keyboardType='numeric'
        />
        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btnText}>Registro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Inicio de Sesion</Text>
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
