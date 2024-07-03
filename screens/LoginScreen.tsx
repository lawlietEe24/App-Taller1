
import { StyleSheet, Text, View,TextInput, TouchableOpacity  } from 'react-native' 
import React from 'react' 


export default function LoginScreen({navigation}: any) { 
  return ( 
    <View style= {styles.contariner}> 
      <Text style={{fontSize: 50, color: 'white'}}>Login</Text> 
      <TextInput 
      placeholder='Ingresar correo' 
      style={styles.input} 
      /> 
      <TextInput 
      placeholder='Ingrese contraseña' 
      style={styles.input} 
      /> 
      <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Bottom')}> 
        <Text>Ingresar</Text> 
      </TouchableOpacity> 
    </View> 
  ) 
} 
 
const styles = StyleSheet.create({ 
contariner:{ 
backgroundColor: 'hsl(187, 97%, 29%)', 
flex: 1, 
alignItems: 'center', 
justifyContent:'center' 
}, 
input:{ 
backgroundColor: 'rgb(121,140,115)', 
height:50, 
width: "80%", 
margin: 10, 
borderRadius:50, 
marginBottom: 10, 
borderColor: 'black', 
borderBottomWidth: 2, 
}, 
btn:{ 
backgroundColor:'#EFD19F', 
width: 100, 
height: 40, 
borderRadius: 40, 
alignItems: 'center', 
justifyContent:'center' 
} 
})