import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Stack')}>
        <Text style={styles.Text}>Go to StackScreen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Text: {
    fontSize: 10,
    borderRadius: 10,
    backgroundColor: 'blue',
    padding: 10,
    color: 'white',
    marginTop: 10
  }
});
