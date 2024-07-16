import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native'; 
import React, { useState } from 'react'; 
import { auth, storage } from '../config/Config'; 
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import { getDatabase, ref, set } from 'firebase/database'; 
import { getDownloadURL, uploadBytesResumable,ref as refe } from 'firebase/storage'; 
import * as ImagePicker from 'expo-image-picker'; 
 
export default function RegistroScreen({ navigation }: any) { 
  const [correo, setCorreo] = useState(''); 
  const [contrasenia, setContrasenia] = useState(''); 
  const [edad, setEdad] = useState(''); 
  const [imageUri, setImageUri] = useState(''); 
  const [uploading, setUploading] = useState(false); 
 
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
 
      navigation.navigate('Login'); 
    } catch (error) { 
      console.error('Error en el registro:', error); 
      //Alert.alert('Error', error); 
    } finally { 
      setUploading(false); 
    } 
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
          style={styles.input} 
        /> 
        <TextInput 
          placeholder='Ingresa contraseña' 
          onChangeText={setContrasenia} 
          secureTextEntry 
          value={contrasenia} 
          style={styles.input} 
        /> 
        <TextInput 
          placeholder='Ingrese edad'placeholderTextColor="#fff" 
          style={styles.input} 
          value={edad} 
          onChangeText={setEdad} 
          keyboardType='numeric' 
        /> 
        <TouchableOpacity style={styles.btn} onPress={pickImage}> 
          <Text style={styles.btnText}>Galería Img</Text> 
        </TouchableOpacity> 
        <TouchableOpacity style={styles.btn} onPress={takePhoto}> 
          <Text style={styles.btnText}>Tomar Foto</Text> 
        </TouchableOpacity> 
        <TouchableOpacity style={styles.btn} onPress={registro} disabled={uploading}> 
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
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