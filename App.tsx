import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import RegistroScreen from './screens/RegistroScreen';
import Game from './components/Game';


const Stack = createStackNavigator();

const StackScreen = () => (
  <View style={styles.stackScreenContainer}>
    <Text>Pantalla Stack</Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Juego" component={Game} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  stackScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
