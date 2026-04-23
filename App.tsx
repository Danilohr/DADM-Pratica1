import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CatImage from './components/cat-image';

export default function App() {
  return (
    <View style={styles.container}>
      <CatImage containerStyle={styles.catImage} />
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catImage: {
    width: 600,
    height: 600
  }
});