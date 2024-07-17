import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { getDownloadURL, uploadBytesResumable, ref as refe } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { auth, storage } from '../config/Config';
import { useFonts } from 'expo-font';

export default function RegistroScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [edad, setEdad] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [uploading, setUploading] = useState(false);

  const [loaded, error] = useFonts({
    'Pixel': require('../assets/fonts/PixelifySans-Medium.ttf'),
    'Oswald': require('../assets/fonts/BebasNeue-Regular.ttf'),
    //'Ola': require('../assets/fonts/RubikPixels-Regular.ttf'),
  });

  useEffect(() => {
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  async function pickImage() { 
    let result = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.All, 
      allowsEditing: true, 
      aspect: [4, 3], 
      quality: 1, 
    }); 
 
    if (!result.canceled) { 
      setImageUri(result.assets[0].uri); 
    } 
  } 
 
  async function takePhoto() { 
    let result = await ImagePicker.launchCameraAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.All, 
      allowsEditing: true, 
      aspect: [4, 3], 
      quality: 1, 
    }); 
 
    if (!result.canceled) { 
      setImageUri(result.assets[0].uri); 
    } 
  }

  async function uploadImage(userId: string) {
    if (imageUri) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const timestamp = Date.now();
      const filename = `${timestamp}.jpg`;
      const storageRef = refe(storage, `images/${userId}/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error('Error uploading image:', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    }
    return null;
  }

  async function registro() {
    setUploading(true);

    // Validar si los campos de correo, contraseña y edad están vacíos
    if (!correo || !contrasenia || !edad) {
      Alert.alert('Credenciales faltantes', 'Por favor, ingrese su correo, contraseña y edad');
      setUploading(false);
      return;
    }

    // Validar edad
    if (parseInt(edad) < 18) {
      Alert.alert('Edad insuficiente', 'Debe tener al menos 18 años para registrarse');
      setUploading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasenia);
      const user = userCredential.user;
      console.log(user);

      const imageUrl = await uploadImage(user.uid);

      const db = getDatabase();
      await set(ref(db, 'users/' + user.uid), {
        correo,
        edad,
        imageUrl,
      });

      console.log('Datos guardados en la base de datos');
      Alert.alert('Registro exitoso', 'El usuario ha sido registrado correctamente');

      // Limpiar campos después de registro exitoso
      setCorreo('');
      setContrasenia('');
      setEdad('');
      setImageUri('');

      // Redirigir a la pantalla de inicio de sesión
      navigation.navigate('Login');

    } catch (error) {
      console.error('Error en el registro:', error);
      Alert.alert('Error en el registro', 'Hubo un problema al registrar el usuario');
    } finally {
      setUploading(false);
    }
  }

  function eliminarImagen() {
    setImageUri('');
  }

  return (
    <ImageBackground
      source={require('../assets/background2.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>

        <TextInput
          placeholder='Ingresa tu correo electrónico'
          onChangeText={setCorreo}
          keyboardType='email-address'
          value={correo}
          placeholderTextColor="black" // Color del placeholder
          style={styles.input}
        />
        <TextInput
          placeholder='Ingresa contraseña'
          onChangeText={setContrasenia}
          secureTextEntry
          value={contrasenia}
          placeholderTextColor="black" // Color del placeholder
          style={styles.input}
        />
        <TextInput
          placeholder='Ingrese edad'
          placeholderTextColor="black" // Color del placeholder
          style={styles.input}
          value={edad}
          onChangeText={setEdad}
          keyboardType='numeric'
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.btn} onPress={pickImage}>
            <Text style={styles.btnText}>Galería</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={takePhoto}>
            <Text style={styles.btnText}>Foto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imagePreviewContainer}>
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.deleteButton} onPress={eliminarImagen}>
                <Text style={styles.deleteButtonText}>Eliminar imagen</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={registro} disabled={uploading}>
          <Text style={styles.btnText}>{uploading ? 'Registrando...' : 'Registro'}</Text>
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
    width: "100%",
    margin: 10,
    fontFamily: 'Oswald',
    borderRadius: 10,
    borderColor: 'lightblue',
    borderWidth: 2,
    paddingHorizontal: 20,
    //color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
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
  imagePreviewContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButton: {
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
  deleteButtonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Oswald'
  },
  registerButton: {
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
});
