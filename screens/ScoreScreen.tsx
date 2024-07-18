import React, { useEffect, useState } from 'react'; 
import { StyleSheet, Text, View, FlatList, ImageBackground } from 'react-native'; 
import { getDatabase, ref, onValue } from 'firebase/database'; 

interface Score { 
  id: string; 
  username: string; 
  score: number; 
} 

export default function PuntuacionesScreen() { 
  const [scores, setScores] = useState<Score[]>([]); 

  useEffect(() => { 
    const db = getDatabase(); 
    const scoresRef = ref(db, 'scores'); 

    const unsubscribe = onValue(scoresRef, (snapshot) => { 
      const data = snapshot.val(); 
      if (data) { 
        const scoresArray: Score[] = Object.keys(data).map((key) => ({ 
          id: key, 
          username: data[key].username, 
          score: data[key].score, 
        })); 
        // Ordena las puntuaciones de mayor a menor 
        scoresArray.sort((a, b) => b.score - a.score); 
        setScores(scoresArray); 
      } else { 
        setScores([]); // Establece scores como un array vacío si no hay datos 
      } 
    }); 

    return () => unsubscribe(); 
  }, []); 

  return ( 
    <ImageBackground 
      source={require('../assets/background2.png')} 
      style={styles.backgroundImage} 
    > 
      <View style={styles.container}> 
        <Text style={styles.title}>Top 3 Puntuaciones</Text> 
        <FlatList 
          data={scores.slice(0, 3)} // Muestra solo los primeros 3 elementos 
          keyExtractor={(item) => item.id} 
          renderItem={({ item, index }) => ( 
            <View style={styles.scoreItem}> 
              <Text style={styles.scoreText}> 
                {index + 1}. {item.username}: {item.score} 
              </Text> 
            </View> 
          )} 
        /> 
      </View> 
    </ImageBackground> 
  ); 
} 

const styles = StyleSheet.create({ 
  backgroundImage: { 
    flex: 1, 
    resizeMode: 'cover', 
  }, 
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    padding: 20, 
  }, 
  title: { 
    fontSize: 50, 
    color: 'lightblue', 
    marginBottom: 20, 
    fontFamily: 'Pixel', 
    textShadowColor: 'rgba(0, 0, 0, 0.75)', 
    textShadowOffset: { width: -5, height: 5 }, 
    textShadowRadius: 3, 
  }, 
  scoreItem: { 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: 15, 
    marginVertical: 10, 
    borderRadius: 10, 
    width: '100%', 
    alignItems: 'center', 
  }, 
  scoreText: { 
    fontSize: 20, 
    color: 'black', 
    fontFamily: 'Oswald', 
  }, 
});