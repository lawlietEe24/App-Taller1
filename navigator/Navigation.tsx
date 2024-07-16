import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
//screens
import HomeScreen from '../screens/HomeScreen'
import SettingsScreen from '../screens/SettingsScreen'
import RegistroScreen from '../screens/RegistroScreen'
import Game from '../components/Game'
import StackScreen from '../screens/StackScreen'
import WelcomeScreen from '../screens/WelcomeScreen'

const Stack = createNativeStackNavigator()
const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <BottomTab.Navigator>
    <BottomTab.Screen name="Juego" component={Game} />
    <BottomTab.Screen name="Camara" component={SettingsScreen} />
    <BottomTab.Screen name="Galeria" component={StackScreen} />
  </BottomTab.Navigator>
);

const HomeStack = () => {
    return (
      <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown:false}} initialRouteName="Home">
        <Stack.Screen name="Inicio" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={HomeScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="MATA- MATA" component={Game} />
      </Stack.Navigator>
      </NavigationContainer>
    );
}

export default HomeStack;