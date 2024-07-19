import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Alert, Dimensions } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import { auth } from '../config/Config';
import { Ionicons } from '@expo/vector-icons';

const db = getFirestore();

const HomeScreen = ({ navigation } : any) => {
  const [correoOUsuario, setCorreoOUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [loginSound, setLoginSound] = useState<Audio.Sound | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [loaded, error] = useFonts({
    'Pixel': require('../assets/fonts/PixelifySans-Medium.ttf'),
    'Oswald': require('../assets/fonts/BebasNeue-Regular.ttf'),
  });

  useEffect(() => {
    const loadSounds = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/go.mp3')
      );
      setLoginSound(sound);
    };
    loadSounds();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setCorreoOUsuario('');
      setContrasenia('');
    });

    return unsubscribe;
  }, [navigation]);

  const fetchEmailFromUsername = async (username:any) => {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data().email;
    }
    return null;
  };

  const login = async () => {
    const isEmail = correoOUsuario.includes('@');
    let email = correoOUsuario;

    if (!isEmail) {
      email = await fetchEmailFromUsername(correoOUsuario);
      if (!email) {
        Alert.alert('Error de usuario', 'El usuario ingresado no existe');
        return;
      }
    }

    signInWithEmailAndPassword(auth, email, contrasenia)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        if (loginSound) {
          loginSound.replayAsync();
        }
        navigation.navigate('Drawer');
      })
      .catch((error) => {
        const errorCode = error.code;
        let titulo = '';
        let mensaje = '';

        if (errorCode === 'auth/wrong-password') {
          titulo = 'Error de contraseña';
          mensaje = 'La contraseña ingresada es incorrecta';
        } else if (errorCode === 'auth/user-not-found') {
          titulo = 'Error de usuario';
          mensaje = 'El usuario ingresado no existe';
        } else {
          titulo = 'Error de Acceso';
          mensaje = 'Revisar credenciales';
        }

        Alert.alert(titulo, mensaje);
      });
  };

  if (!loaded && !error) {
    return null;
  }

  const { height, width } = Dimensions.get('window');

  return (
    <ImageBackground
      source={require('../assets/background2.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          placeholder='Ingresa tu correo electrónico o nombre de usuario'
          onChangeText={(texto) => setCorreoOUsuario(texto)}
          keyboardType='email-address'
          placeholderTextColor="black"
          style={[styles.input, { width: width * 0.8 }]}
          value={correoOUsuario}
        />
        <View style={[styles.passwordContainer, { width: width * 0.8 }]}>
          <TextInput
            placeholder='Ingresa contraseña'
            onChangeText={(texto) => setContrasenia(texto)}
            style={[styles.input, styles.passwordInput]}
            placeholderTextColor="black"
            secureTextEntry={!showPassword}
            value={contrasenia}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordButton}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.btn, { width: width * 0.5 }]} onPress={login}>
          <Text style={styles.btnText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
          <Text style={styles.registerText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    margin: 10,
    fontFamily: 'Oswald',
    borderRadius: 10,
    borderColor: 'lightblue',
    borderWidth: 2,
    paddingHorizontal: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  passwordInput: {
    flex: 1,
  },
  showPasswordButton: {
    padding: 10,
  },
  btn: {
    backgroundColor: 'rgba(255, 68, 68, 0.8)',
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

export default HomeScreen;
