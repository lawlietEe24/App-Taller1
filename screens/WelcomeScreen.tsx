// screens/HomeScreen.tsx 
import React from 'react'; 
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'; 
 
export default function WelcomeScreen({ navigation }:any) { 
  return ( 
    <View style={styles.container}> 
      <Text style={styles.title}>MATA - MATA</Text> 
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}> 
        <Text style={styles.btnText}>Iniciar Sesión</Text> 
      </TouchableOpacity> 
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Registro')}> 
        <Text style={styles.btnText}>Registrarse</Text> 
      </TouchableOpacity> 
    </View> 
  ); 
} 
 
const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#f0f0f0', 
    padding: 20, 
  }, 
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 40, 
    color: '#333', 
  }, 
  btn: { 
    backgroundColor: '#ff4444', 
    width: 200, 
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
