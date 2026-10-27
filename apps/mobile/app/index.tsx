import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>AI Personal Wardrobe Stylist</Text>
      </View>

      <Text style={styles.title}>StyleMuse AI</Text>
      <Text style={styles.subtitle}>
        Digitize your clothes, get tailored styling recommendations, and construct outfits from your real wardrobe.
      </Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Digital Wardrobe</Text>
          <Text style={styles.cardDesc}>Upload clothing photos with instant AI vision classification.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Outfit Synthesis</Text>
          <Text style={styles.cardDesc}>Outfits generated exclusively from pieces you actually own.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Stylist</Text>
          <Text style={styles.cardDesc}>Chat with Muse for occasion & weather-tailored looks.</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/(tabs)/wardrobe')}
      >
        <Text style={styles.buttonText}>Launch Mobile Studio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fdfdfc',
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  badgeText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1c1917',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#78716c',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  cardContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 28,
  },
  card: {
    backgroundColor: '#f5f5f4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e7e5e4',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1917',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#57534e',
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#1c1917',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fdfdfc',
    fontSize: 16,
    fontWeight: '600',
  },
});
