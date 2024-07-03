// components/Ant.tsx
import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

interface AntProps {
  position: { left: number, top: number };
  onPress: () => void;
}

const Ant: React.FC<AntProps> = ({ position, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.ant, position]}>
      <Image
        source={require('../assets/ant.png')} // Asegúrate de tener una imagen de hormiga en esta ruta
        style={styles.image}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ant: {
    position: 'absolute',
  },
  image: {
    width: 80,
    height: 80,
  },
});

export default Ant;
