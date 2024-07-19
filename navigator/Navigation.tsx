import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'; 
import { NavigationContainer } from '@react-navigation/native'
//screens
import HomeScreen from '../screens/HomeScreen'
import RegistroScreen from '../screens/RegistroScreen'
import Game from '../components/Game'
import WelcomeScreen from '../screens/WelcomeScreen'
import PerfilScreen from '../screens/SettingsScreen';
//import PuntuacionesScreen from '../screens/ScoreScreen';

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator(); 

 
function MyDrawer() { 
  return ( 
    <Drawer.Navigator screenOptions={{ headerShown:true}} initialRouteName="MATA- MATA" > 
        <Drawer.Screen name='MATA- MATA' component={Game}/> 
        <Drawer.Screen name='PERFIL' component={PerfilScreen}/> 
        {/* //<Drawer.Screen name='Puntuaciones' component={PuntuacionesScreen}/>  */}
    </Drawer.Navigator> 
  ); 
} 

const HomeStack = () => {
    return (
      <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown:false}} initialRouteName="Home">
        <Stack.Screen name="Inicio" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={HomeScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Drawer" component={MyDrawer} /> 
      </Stack.Navigator>
      </NavigationContainer>
    );
}

export default HomeStack;