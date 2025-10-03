import React from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import 'react-native-gesture-handler';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <RootNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
