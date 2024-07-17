import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';

export default function WelcomeScreen({ navigation }: any) {
  const [loaded, error] = useFonts({
    'Pixel': require('../assets/fonts/PixelifySans-Medium.ttf'),
    'Oswald': require('../assets/fonts/BebasNeue-Regular.ttf'),
  });

  useEffect(() => {
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ImageBackground
      source={require('../assets/background2.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenidos!!</Text>
        <Text style={styles.subtitle}>¡MATA - MATA!</Text>
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Registro')}>
            <Text style={styles.btnText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Cambio para alinear los elementos en la parte superior
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    paddingTop: 50, // Añadir paddingTop para bajar todo el contenido
  },
  title: {
    fontSize: 55,
    marginBottom: 1, // Reducir margen inferior
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -5, height: 5 },
    textShadowRadius: 10,
    fontFamily: 'Pixel',
  },
  subtitle: {
    fontSize: 45,
    marginBottom: 50, // Aumentar margen inferior para separar los botones
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -5, height: 5 },
    textShadowRadius: 10,
    fontFamily: 'Pixel'
  },
  btnContainer: {
    marginTop: 450, // Añadir margen superior para separar los botones del subtítulo
  },
  btn: {
    backgroundColor: 'rgba(255, 68, 68, 0.8)',
    width: 200,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: 'blue',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Oswald',
  }
});
