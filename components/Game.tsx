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
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [gameOverSound, setGameOverSound] = useState<Audio.Sound | null>(null);
  const [scoreSound, setScoreSound] = useState<Audio.Sound | null>(null);
  const [antSquishSound, setAntSquishSound] = useState<Audio.Sound | null>(null);
  const [startGameSound, setStartGameSound] = useState<Audio.Sound | null>(null);

  const [loaded, error] = useFonts({
    'Pixel': require('../assets/fonts/PixelifySans-Medium.ttf'),
    'Oswald': require('../assets/fonts/BebasNeue-Regular.ttf'),
  });

  useEffect(() => {}, [loaded, error]);

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

  useEffect(() => {
    return startGameSound
      ? () => {
          startGameSound.unloadAsync();
        }
      : undefined;
  }, [startGameSound]);

  const playGameOverSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/gameover.mp3')
    );
    setGameOverSound(sound);
    await sound.playAsync();
  };

  const playScoreSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/win.mp3')
    );
    setScoreSound(sound);
    await sound.playAsync();
  };

  // const playAntSquishSound = async () => {
  //   const { sound } = await Audio.Sound.createAsync(
  //     require('../assets/sounds/xd.mp3')
  //   );
  //   setAntSquishSound(sound);
  //   await sound.playAsync();
  // };

  const playStartGameSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/inicio.mp3') // Asegúrate de tener un archivo de sonido aquí
    );
    setStartGameSound(sound);
    await sound.playAsync();
  };

  const startGame = () => {
    playStartGameSound(); // Reproduce el sonido al empezar el juego
    setScore(0);
    setAnts([]);
    setIsGameOver(false);
    setIsGameStarted(true);

    let intervalTime: number = 750;

    intervalRef.current = setInterval(() => {
      const x = Math.floor(Math.random() * (width - 80));
      const y = Math.floor(Math.random() * (height - 80));
      setAnts((prevAnts) => {
        if (prevAnts.length >= 3) {
          endGame();
          return prevAnts;
        }
        return [...prevAnts, { x, y, id: Date.now() }];
      });
    }, intervalTime);
  };

  const adjustDifficulty = (currentScore: number) => {
    let intervalTime: number;

    if (currentScore >= 500) {
      intervalTime = 200;
    } else if (currentScore >= 400) {
      intervalTime = 250;
    } else if (currentScore >= 300) {
      intervalTime = 350;
    } else if (currentScore >= 200) {
      intervalTime = 450;
    } else if (currentScore >= 100) {
      intervalTime = 550;
    } else {
      intervalTime = 750;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const x = Math.floor(Math.random() * (width - 80));
      const y = Math.floor(Math.random() * (height - 80));
      setAnts((prevAnts) => {
        if (prevAnts.length >= 3) {
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
    setAnts([]);
  };

  const handleAntPress = (id: number) => {
    setAnts((prevAnts) => prevAnts.filter((ant) => ant.id !== id));
    // playAntSquishSound(); // Comenta esta línea para desactivar el sonido de "xd"
    setScore((prevScore) => {
      const newScore = prevScore + 10;

      if (newScore % 100 === 0) {
        playScoreSound();
      }

      if (newScore % 100 === 0) {
        adjustDifficulty(newScore);
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
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
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
