import { Button, Image, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../config/Config'; // Assuming 'storage' is initialized with Firebase Storage

export default function SettingsScreen() {

  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false); // Track upload state

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    setUploading(true); // Set uploading state for UI feedback

    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();

      // Generate a unique filename based on timestamp
      const timestamp = Date.now();
      const filename = `${timestamp}.jpg`; // Adjust extension based on image type

      const storageRef = ref(storage, `images/${filename}`); // Create reference with unique name within 'images' folder

      await uploadBytes(storageRef, blob);

      // Get the download URL after successful upload (optional)
      const downloadURL = await getDownloadURL(storageRef);

      setImage(''); // Clear the image after successful upload
      setUploading(false); // Reset uploading state

      alert('Image uploaded successfully!'); // Informative feedback

      // Optionally display the uploaded image URL
      console.log('Download URL:', downloadURL);
    } else {
      alert('Please select an image to upload.');
    }
  };

  return (
    <View style={styles.container}>
       <Button title="ABRE LA CAMARA" onPress={pickImage} />
      <Image source={{ uri: image }} style={styles.image} />
      <Button title={uploading ? 'Subiendo...' : 'Subir Imagen'} disabled={uploading} onPress={uploadImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
