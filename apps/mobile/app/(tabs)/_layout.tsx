import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#fdfdfc' },
        headerTintColor: '#1c1917',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        tabBarStyle: {
          backgroundColor: '#fdfdfc',
          borderTopColor: '#e7e5e4',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#1c1917',
        tabBarInactiveTintColor: '#a8a29e',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: 'Wardrobe',
          headerTitle: 'Digital Wardrobe',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>👔</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="outfits"
        options={{
          title: 'Outfits',
          headerTitle: 'AI Outfit Generator',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>✨</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="stylist"
        options={{
          title: 'Muse',
          headerTitle: 'Muse AI Stylist',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>💬</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Style',
          headerTitle: 'Style Preferences',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
