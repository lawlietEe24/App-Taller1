import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Score {
  name: string;
  score: number;
}

const ScoresScreen: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try { 
        const savedScores = await AsyncStorage.getItem('scores');
        if (savedScores) {
          const parsedScores: Score[] = JSON.parse(savedScores);
          setScores(parsedScores);
        }
      } catch (error) {
        console.error('Failed to fetch scores', error);
      }
    };

    fetchScores();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Puntuaciones</Text>
      <FlatList
        data={scores}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.scoreItem}>
            <Text>{item.name}</Text>
            <Text>{item.score}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
});

export default ScoresScreen;
