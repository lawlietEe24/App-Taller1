import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, Modal, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
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
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current!);
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
       require('../assets/sounds/gameover.mp3') // Asegúrate de tener un archivo de sonido aquí
    );
    setSound(sound);
    await sound.playAsync();
  };

  const startGame = (difficulty: string) => {
    setScore(0);
    setAnts([]);
    setIsGameOver(false);
    setIsGameStarted(true);
    setDifficulty(difficulty);

    let intervalTime: number;
    let maxAnts: number;

    switch (difficulty) {
      case 'fácil':
        intervalTime = 750;
        maxAnts = 3;
        break;
      case 'medio':
        intervalTime = 450;
        maxAnts = 3;
        break;
      case 'difícil':
        intervalTime = 250;
        maxAnts = 3;
        break;
      default:
        intervalTime = 1000;
        maxAnts = 5;
    }

    intervalRef.current = setInterval(() => {
      const x = Math.floor(Math.random() * (width - 80));
      const y = Math.floor(Math.random() * (height - 80));
      setAnts((prevAnts) => {
        if (prevAnts.length >= maxAnts) {
          endGame();
          return prevAnts;
        }
        return [...prevAnts, { x, y, id: Date.now() }];
      });
    }, intervalTime);
  };

  const endGame = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    playSound();
    setIsGameOver(true);
    setIsGameStarted(false);
    setDifficulty(null);
    setAnts([]);
  };

  const handleAntPress = (id: number) => {
    setAnts((prevAnts) => prevAnts.filter((ant) => ant.id !== id));
    setScore((prevScore) => prevScore + 1);
  };

  return (
    <ImageBackground
      source={require('../assets/backgroundd.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {!isGameStarted && !isGameOver && (
          <>
            <TouchableOpacity style={styles.startButton} onPress={() => startGame('fácil')}>
              <Text style={styles.startButtonText}>Fácil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.startButton} onPress={() => startGame('medio')}>
              <Text style={styles.startButtonText}>Medio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.startButton} onPress={() => startGame('difícil')}>
              <Text style={styles.startButtonText}>Difícil</Text>
            </TouchableOpacity>
          </>
        )}
        <Text style={styles.score}>Puntuación: {score}</Text>
        {ants.map((ant) => (
          <Ant
            key={ant.id}
            position={{ left: ant.x, top: ant.y }}
            onPress={() => handleAntPress(ant.id)}
          />
        ))}
        {isGameOver && (
          <Modal
            transparent={true}
            visible={isGameOver}
            animationType="slide"
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalText}>Game Over</Text>
                <Text style={styles.modalText}>Puntuación final: {score}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setIsGameOver(false)}
                >
                  <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  startButton: {
    padding: 15,
    backgroundColor: 'green',
    borderRadius: 5,
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default Game;
