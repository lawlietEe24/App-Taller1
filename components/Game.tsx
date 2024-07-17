import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, Modal, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Ant from './Ant';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

interface AntType {
  id: number;
  x: number;
  y: number;
}

const Game: React.FC = () => {
  const [ants, setAnts] = useState<AntType[]>([]);
  const [score, setScore] = useState<number>(100);  // Puntuación inicial ajustada a 100
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [gameOverSound, setGameOverSound] = useState<Audio.Sound | null>(null);
  const [scoreSound, setScoreSound] = useState<Audio.Sound | null>(null);
  const [antSquishSound, setAntSquishSound] = useState<Audio.Sound | null>(null); // Estado para el sonido de aplastar hormiga

  const [loaded, error] = useFonts({
    'Pixel': require('../assets/fonts/PixelifySans-Medium.ttf'),
    'Oswald': require('../assets/fonts/BebasNeue-Regular.ttf'),
  });

  useEffect(() => {
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current!);
  }, []);

  useEffect(() => {
    return gameOverSound
      ? () => {
          gameOverSound.unloadAsync();
        }
      : undefined;
  }, [gameOverSound]);

  useEffect(() => {
    return scoreSound
      ? () => {
          scoreSound.unloadAsync();
        }
      : undefined;
  }, [scoreSound]);

  useEffect(() => {
    return antSquishSound
      ? () => {
          antSquishSound.unloadAsync();
        }
      : undefined;
  }, [antSquishSound]);

  const playGameOverSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
       require('../assets/sounds/gameover.mp3') // Asegúrate de tener un archivo de sonido aquí
    );
    setGameOverSound(sound);
    await sound.playAsync();
  };

  const playScoreSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
       require('../assets/sounds/win.mp3') // Asegúrate de tener un archivo de sonido aquí
    );
    setScoreSound(sound);
    await sound.playAsync();
  };

  const playAntSquishSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
       require('../assets/sounds/jaja.mp3') // Asegúrate de tener un archivo de sonido aquí
    );
    setAntSquishSound(sound);
    await sound.playAsync();
  };

  const startGame = (difficulty: string) => {
    setScore(100); // Ajusta la puntuación inicial a 100
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
    playGameOverSound();
    setIsGameOver(true);
    setIsGameStarted(false);
    setDifficulty(null);
    setAnts([]);
  };

  const handleAntPress = (id: number) => {
    setAnts((prevAnts) => prevAnts.filter((ant) => ant.id !== id));
    playAntSquishSound(); // Reproduce el sonido al aplastar una hormiga
    setScore((prevScore) => {
      const newScore = prevScore + 1;

      if ((newScore - 100) % 10 === 0) { // Reproduce el sonido de puntuación cada 10 puntos a partir de 100
        playScoreSound();
      }

      return newScore;
    });
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'Pixel'
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
    fontSize: 22,
    marginBottom: 10,
    fontFamily: 'Pixel'
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Pixel'
  },
  startButton: {
    padding: 15,
    backgroundColor: 'green',
    borderRadius: 5,
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'Pixel'
  },
});

export default Game;
