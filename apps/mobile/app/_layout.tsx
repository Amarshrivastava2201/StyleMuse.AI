import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MobileWardrobeProvider } from '../context/WardrobeContext';

export default function RootLayout() {
  return (
    <MobileWardrobeProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#fdfdfc' },
          headerTintColor: '#1c1917',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#fdfdfc' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </MobileWardrobeProvider>
  );
}
