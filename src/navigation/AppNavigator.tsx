import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MemoryMagicScreen from '../screens/MemoryMagicScreen';
import PatternGameScreen from '../screens/PatternGameScreen';
import LetterLandScreen from '../screens/LetterLandScreen';
import NumberJungleScreen from '../screens/NumberJungleScreen';
import ShapeSafariScreen from '../screens/ShapeSafariScreen';
import ColorWorldScreen from '../screens/ColorWorldScreen';
import TracingHomeScreen from '../screens/TracingHomeScreen';
import LetterTracingScreen from '../screens/LetterTracingScreen';
import ShapeTracingScreen from '../screens/ShapeTracingScreen';
import AnimalTracingScreen from '../screens/AnimalTracingScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { COLORS } from '../constants/theme';

export type RootStackParamList = {
  Home: undefined;
  MemoryMagic: undefined;
  PatternGame: undefined;
  LetterLand: undefined;
  NumberJungle: undefined;
  ShapeSafari: undefined;
  ColorWorld: undefined;
  TracingHome: undefined;
  LetterTracing: { letter?: string } | undefined;
  ShapeTracing: { shape?: string } | undefined;
  AnimalTracing: { animal?: string } | undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MemoryMagic" component={MemoryMagicScreen} />
      <Stack.Screen name="PatternGame" component={PatternGameScreen} />
      <Stack.Screen name="LetterLand" component={LetterLandScreen} />
      <Stack.Screen name="NumberJungle" component={NumberJungleScreen} />
      <Stack.Screen name="ShapeSafari" component={ShapeSafariScreen} />
      <Stack.Screen name="ColorWorld" component={ColorWorldScreen} />
      <Stack.Screen name="TracingHome" component={TracingHomeScreen} />
      <Stack.Screen name="LetterTracing" component={LetterTracingScreen} />
      <Stack.Screen name="ShapeTracing" component={ShapeTracingScreen} />
      <Stack.Screen name="AnimalTracing" component={AnimalTracingScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
