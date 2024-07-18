import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native';
import { getAuth, updatePassword, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons'; // Importa Ionicons
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, uploadBytesResumable, ref as storageRef } from 'firebase/storage';
import { storage } from '../config/Config'; // Importa tu configuración de Firebase

export default function PerfilScreen({ navigation }: any) {
  const [usuario, setUsuario] = useState('');
  const [edad, setEdad] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para visibilidad de contraseña
  const [imageUri, setImageUri] = useState('');
  const [uploading, setUploading] = useState(false);

  const [loaded, error] = useFonts({
    'Pixel': require('../assets/fonts/PixelifySans-Medium.ttf'),
    'Oswald': require('../assets/fonts/BebasNeue-Regular.ttf'),
  });

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const db = getDatabase();
        const userRef = ref(db, 'users/' + user.uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUsuario(userData.usuario);
          setEdad(userData.edad);
          setImageUri(userData.imageUrl || '');
        } else {
          console.log('No data available');
        }
      } else {
        navigation.navigate('Login');
      }
    });
  }, [navigation]);

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
      const storageReference = storageRef(storage, `images/${userId}/${filename}`);
      const uploadTask = uploadBytesResumable(storageReference, blob);

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

  async function actualizarPerfil() {
    setLoading(true);

    if (!usuario || !edad) {
      Alert.alert('Datos faltantes', 'Por favor, ingrese su nombre de usuario y edad');
      setLoading(false);
      return;
    }

    if (parseInt(edad) < 18) {
      Alert.alert('Edad insuficiente', 'Debe tener al menos 18 años');
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        if (contrasenia) {
          await updatePassword(user, contrasenia);
        }

        const imageUrl = await uploadImage(user.uid);
        const db = getDatabase();
        await update(ref(db, 'users/' + user.uid), {
          usuario,
          edad,
          imageUrl,
        });

        Alert.alert('Actualización exitosa', 'El perfil ha sido actualizado correctamente');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el perfil');
    } finally {
      setLoading(false);
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
        <Text style={styles.title}>Perfil</Text>

        <TextInput
          placeholder='Nombre de usuario'
          onChangeText={setUsuario}
          value={usuario}
          placeholderTextColor="black" // Color del placeholder
          style={styles.input}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder='Contraseña'
            onChangeText={setContrasenia}
            secureTextEntry={!showPassword} // Controla la visibilidad de la contraseña
            value={contrasenia}
            placeholderTextColor="black" // Color del placeholder
            style={[styles.input, styles.passwordInput]} // Añade styles.passwordInput
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordButton}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder='Edad'
          placeholderTextColor="black" // Color del placeholder
          style={styles.input}
          value={edad}
          onChangeText={setEdad}
          keyboardType='numeric'
        />

        <View style={styles.imagePreviewContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : null}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btn} onPress={pickImage}>
            <Text style={styles.btnText}>Cambiar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={takePhoto}>
            <Text style={styles.btnText}>Tomar Foto</Text>
          </TouchableOpacity>
          {imageUri ? (
            <TouchableOpacity style={styles.deleteButton} onPress={eliminarImagen}>
              <Text style={styles.deleteButtonText}>Eliminar imagen</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={actualizarPerfil} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Actualizando...' : 'Actualizar'}</Text>
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
  deleteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Oswald'
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
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    width: '105%', // Ajusta el contenedor para que tenga el mismo ancho que los otros inputs
  },
  passwordInput: {
    flex: 1, // Permite que el TextInput ocupe el espacio restante
  },
  showPasswordButton: {
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: 'rgba(255, 68, 68, 0.8)',
    width: '30%',
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
  deleteButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.8)',
    width: '30%',
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
    fontSize: 15,
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
  updateButton: {
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