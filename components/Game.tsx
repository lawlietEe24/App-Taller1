import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, Modal, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');
const topBoundary = height * 0.5;

interface AntType {
  id: number;
  x: number;
  y: number;
}

interface AntProps {
  position: { left: number; top: number };
  onPress: () => void;
  image: any; // Cambié a any para facilitar la asignación dinámica de imagen
}

const Ant: React.FC<AntProps> = ({ position, onPress, image }) => {
  return (
    <TouchableOpacity
      style={[styles.antContainer, position]}
      onPress={onPress}
    >
      <Image source={image} style={styles.ant} />
    </TouchableOpacity>
  );
};

const Game: React.FC = () => {
  const [ants, setAnts] = useState<AntType[]>([]);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isModeSelection, setIsModeSelection] = useState<boolean>(true);
  const [mode, setMode] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [gameOverSound, setGameOverSound] = useState<Audio.Sound | null>(null);
  const [scoreSound, setScoreSound] = useState<Audio.Sound | null>(null);
  const [startGameSound, setStartGameSound] = useState<Audio.Sound | null>(null);
  const [antImage, setAntImage] = useState<any>(require('../assets/mosca3.png')); // Cambié a any para facilitar la asignación dinámica de imagen

  const [loaded, error] = useFonts({
    'Pixel': require('../assets/fonts/PixelifySans-Medium.ttf'),
    'Oswald': require('../assets/fonts/BebasNeue-Regular.ttf'),
  });

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!loaded && !error) {
      return;
    }

    const loadSounds = async () => {
      const gameOver = await Audio.Sound.createAsync(
        require('../assets/sounds/gameover.mp3')
      );
      setGameOverSound(gameOver.sound);

      const scoreWin = await Audio.Sound.createAsync(
        require('../assets/sounds/winnn.mp3')
      );
      setScoreSound(scoreWin.sound);

      const gameStart = await Audio.Sound.createAsync(
        require('../assets/sounds/inicio.mp3')
      );
      setStartGameSound(gameStart.sound);
    };

    loadSounds();

    return () => {
      if (gameOverSound) {
        gameOverSound.unloadAsync();
      }
      if (scoreSound) {
        scoreSound.unloadAsync();
      }
      if (startGameSound) {
        startGameSound.unloadAsync();
      }
    };
  }, [loaded, error]);

  const playSound = async (soundObject: Audio.Sound | null, soundFile: any) => {
    if (soundObject) {
      await soundObject.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
    return sound;
  };

  const playGameOverSound = async () => {
    await playSound(gameOverSound, require('../assets/sounds/gameover.mp3'));
  };

  const playScoreSound = async () => {
    await playSound(scoreSound, require('../assets/sounds/winnn.mp3'));
  };

  const playStartGameSound = async () => {
    await playSound(startGameSound, require('../assets/sounds/inicio.mp3'));
  };

  const startGame = (selectedMode: string) => {
    playStartGameSound();
    setMode(selectedMode);
    setScore(0);
    setLevel(1);
    setAnts([]);
    setIsGameOver(false);
    setIsGameStarted(true);
    setIsModeSelection(false);

    let intervalTime: number;
    let antImage: any;

    switch (selectedMode) {
      case 'Noob':
        intervalTime = 750;
        antImage = require('../assets/mosca3.png');
        break;
      case 'Pro':
        intervalTime = 500;
        antImage = require('../assets/mosca2.png');
        break;
      case 'Master':
        intervalTime = 250;
        antImage = require('../assets/mosca1.png');
        break;
      default:
        intervalTime = 750;
        antImage = require('../assets/mosca3.png');
    }

    setAntImage(antImage);

    intervalRef.current = setInterval(() => {
      const x = Math.floor(Math.random() * (width - 80));
      const y = Math.floor(Math.random() * (height - topBoundary) + topBoundary);
      setAnts((prevAnts) => {
        if (prevAnts.length >= 3) {
          endGame();
          return prevAnts;
        }
        return [...prevAnts, { x, y, id: Date.now() }];
      });
    }, intervalTime);
  };

  const adjustLevel = (newScore: number) => {
    if (newScore >= 100) {
      setLevel(3);
      setIsGameStarted(false);
      setIsGameOver(true);
      playScoreSound(); // Reproducir sonido de victoria
    } else if (newScore >= 50) {
      setLevel(2);
    } else if (newScore >= 25) {
      setLevel(1);
    }
  };

  const endGame = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    playGameOverSound();
    setIsGameOver(true);
    setIsGameStarted(false);
    setAnts([]);
  };

  const handleAntPress = (id: number) => {
    setAnts((prevAnts) => prevAnts.filter((ant) => ant.id !== id));
    setScore((prevScore) => {
      const newScore = prevScore + 10;
      adjustLevel(newScore);

      if (newScore % 100 === 0) {
        playScoreSound();
      }

      return newScore;
    });
  };

  const resetGame = () => {
    setIsGameOver(false);
    setIsModeSelection(true);
    setMode(null);
    setScore(0);
    setLevel(1);
  };

  return (
    <ImageBackground
      source={require('../assets/basura.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        {isModeSelection && (
          <TouchableOpacity style={styles.startButton} onPress={() => setIsModeSelection(false)}>
            <Text style={styles.startButtonText}>Modo de Juego</Text>
          </TouchableOpacity>
        )}
        {!isModeSelection && !isGameStarted && !isGameOver && (
          <>
            <TouchableOpacity style={styles.startButton} onPress={() => startGame('Noob')}>
              <Text style={styles.startButtonText}>Noob</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.startButton} onPress={() => startGame('Pro')}>
              <Text style={styles.startButtonText}>Pro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.startButton} onPress={() => startGame('Master')}>
              <Text style={styles.startButtonText}>Master</Text>
            </TouchableOpacity>
          </>
        )}
        <Text style={styles.score}>Puntuación: {score}</Text>
        {isGameStarted && <Text style={styles.level}>LVL: {level}</Text>}
        {ants.map((ant) => (
          <Ant
            key={ant.id}
            position={{ left: ant.x, top: ant.y }}
            onPress={() => handleAntPress(ant.id)}
            image={antImage}
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
                <Text style={styles.modalText}>{score >= 100 ? '¡Felicidades, ganaste el juego!' : 'Game Over'}</Text>
                <Text style={styles.modalText}>Puntuación final: {score}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={resetGame}
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    top: 70,
    left: 10,
    fontSize: 24,
    fontFamily: 'Pixel',
    color: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  level: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    top: 130,
    left: 10,
    fontSize: 24,
    fontFamily: 'Pixel',
    color: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  startButton: {
    backgroundColor: 'rgba(50, 200, 50, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    fontFamily: 'Pixel',
  },
  startButtonText: {
    color: 'white',
    fontFamily: 'Pixel',
    fontSize: 20,
  },
  antContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  ant: {
    width: '100%',
    height: '100%',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontFamily: 'Oswald',
    fontSize: 24,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Oswald',
    fontSize: 20,
  },
});

export default Game;