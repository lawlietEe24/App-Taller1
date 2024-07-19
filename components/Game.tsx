import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, Modal, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');
const topBoundary = height * 0.4; // Ajustar el límite superior

interface AntType {
  id: number;
  x: number;
  y: number;
}

interface AntProps {
  position: { left: number; top: number };
  onPress: () => void;
  image: any;
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
  const [antImage, setAntImage] = useState<any>(require('../assets/mosca3.png'));

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
    if (newScore >= 400) {
      setLevel(3);
      setIsGameStarted(false);
      setIsGameOver(true);
      playScoreSound();
    } else if (newScore >= 250) {
      setLevel(2);
    } else if (newScore >= 100) {
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
        <Text style={[styles.score, { top: height * 0.1 }]}>Puntuación: {score}</Text>
        {isGameStarted && <Text style={[styles.level, { top: height * 0.15 }]}>LVL: {level}</Text>}
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
                <Text style={styles.modalText}>{score >= 200 ? '¡Felicidades, ganaste el juego!' : 'Game Over'}</Text>
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
  startButton: {
    margin: 10,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Oswald',
  },
  score: {
    position: 'absolute',
    color: 'white',
    fontSize: 24,
    fontFamily: 'Pixel',
  },
  level: {
    position: 'absolute',
    color: 'white',
    fontSize: 24,
    fontFamily: 'Pixel',
  },
  antContainer: {
    position: 'absolute',
  },
  ant: {
    width: 50,
    height: 50,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: 'Oswald',
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Oswald',
  },
});

export default Game;
