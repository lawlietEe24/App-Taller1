import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import * as Font from 'expo-font';

export default function WelcomeScreen({ navigation }: any) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        'Oswald-Bold': require('../assets/fonts/Oswald-Bold.ttf'), // Verifica que la ruta sea correcta
      });
      setFontsLoaded(true);
      console.log("Font loaded successfully");
    } catch (error) {
      console.error("Error loading font: ", error);
    }
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    ); // Muestra un texto mientras se cargan las fuentes
  }

  return (
    <ImageBackground
      source={require('../assets/background2.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenidos al Juego!</Text>
        <Text style={styles.subtitle}>¡MATA - MATA!</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btnText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Registro')}>
          <Text style={styles.btnText}>Registrarse</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -5, height: 5 },
    textShadowRadius: 10,
    fontFamily: 'Oswald-Bold', // Usando la fuente personalizada
  },
  subtitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -5, height: 5 },
    textShadowRadius: 10,
    fontFamily: 'Oswald-Bold', // Usando la fuente personalizada
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
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Oswald-Bold', // Usando la fuente personalizada
  }
});
