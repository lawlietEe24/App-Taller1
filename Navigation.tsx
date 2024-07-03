import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
//screens
import HomeScreen from './screens/HomeScreen'
import SettingsScreen from './screens/SettingsScreen'
import StackScreen from './screens/StackScreen'

const HomeStackNavigator = createNativeStackNavigator()

function HomeStack() {
    return (
        <HomeStackNavigator.Navigator
            initialRouteName='HomeScreen'>
            <HomeStackNavigator.Screen 
                name="HomeScreen"
                component={HomeScreen} />
            <HomeStackNavigator.Screen 
            name="Stack" 
            component={StackScreen} />
        </HomeStackNavigator.Navigator>
    )
}

const Tab = createBottomTabNavigator()

function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                tabBarActiveTintColor: 'purple',
            }}
        >
        <Tab.Screen
            name="Home"
            component={HomeStack} 
            options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ focused, color, size }) => (
                    <MaterialCommunityIcons name="home" size={24} color="black" />
                ),
                tabBarBadge: 3
            }}
        />
        <Tab.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{
                tabBarLabel: 'Settings',
                tabBarIcon: ({ focused, color, size }) => (
                    <MaterialCommunityIcons name="cog" size={24} color="black" />
                ),
            }}
        />
        {/* <Tab.Screen name="Stack" component={StackScreen} /> */}
      </Tab.Navigator>
    )
}
export default function Navigation() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})