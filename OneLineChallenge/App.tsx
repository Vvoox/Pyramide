/**
 * App.tsx – root component.
 *
 * Hydrates the progress store from AsyncStorage before rendering,
 * then mounts the navigator.
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { AppNavigator } from './src/navigation/AppNavigator';
import { progressStore } from './src/store/progressStore';
import { COLORS } from './src/constants/colors';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    progressStore.hydrate().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
