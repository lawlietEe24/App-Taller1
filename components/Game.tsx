// components/Game.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, Alert } from 'react-native';
import Ant from './Ant';

const { width, height } = Dimensions.get('window');

interface AntType {
  id: number;
  x: number;
  y: number;
}

const Game: React.FC = () => {
  const [ants, setAnts] = useState<AntType[]>([]);
  const [score, setScore] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startGame();
    return () => clearInterval(intervalRef.current!);
  }, []);

  const startGame = () => {
    intervalRef.current = setInterval(() => {
      const x = Math.floor(Math.random() * (width - 80));
      const y = Math.floor(Math.random() * (height - 80));
      setAnts((prevAnts) => {
        if (prevAnts.length >= 5) {
          endGame();
          return prevAnts;
        }
        return [...prevAnts, { x, y, id: Date.now() }];
      });
    }, 1000);
  };

  const endGame = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    Alert.alert('Game Over', `Puntuación final: ${score}`);
  };

  const handleAntPress = (id: number) => {
    setAnts((prevAnts) => prevAnts.filter((ant) => ant.id !== id));
    setScore((prevScore) => prevScore + 1);
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')} // Asegúrate de tener una imagen de fondo en esta ruta
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.score}>Puntuación: {score}</Text>
        {ants.map((ant) => (
          <Ant
            key={ant.id}
            position={{ left: ant.x, top: ant.y }}
            onPress={() => handleAntPress(ant.id)}
          />
        ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    position: 'absolute',
    top: 50,
    fontSize: 24,
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
});

export default Game;
