import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GameProgressProvider } from './src/context/GameProgressContext';
import AppNavigator from './src/navigation/AppNavigator';
import { useBackgroundMusic } from './src/hooks/useBackgroundMusic';

function AudioBootstrap() {
  useBackgroundMusic('global');
  return null;
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <GameProgressProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <AudioBootstrap />
          <AppNavigator />
        </NavigationContainer>
      </GameProgressProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
