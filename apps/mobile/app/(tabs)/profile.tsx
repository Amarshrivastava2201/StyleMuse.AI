import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useMobileWardrobe } from '../../context/WardrobeContext';
import { StyleArchetype } from '@stylemuse/types';

const ARCHETYPES: Array<{ id: StyleArchetype; label: string; desc: string }> = [
  { id: 'minimalist', label: 'Minimalist', desc: 'Clean cuts & muted palette' },
  { id: 'smart_casual', label: 'Smart Casual', desc: 'Blazers, chinos & elevated knits' },
  { id: 'old_money', label: 'Quiet Luxury', desc: 'Linen, cashmere & tailored heritage' },
  { id: 'streetwear', label: 'Streetwear', desc: 'Relaxed proportions & statement sneakers' },
  { id: 'classic', label: 'Classic', desc: 'Timeless outerwear & Oxford shirts' },
];

const COLORS = ['navy', 'cream', 'charcoal', 'olive', 'black', 'white', 'camel'];

export default function ProfileScreen() {
  const { profile, updateProfile, wardrobe, outfits } = useMobileWardrobe();

  const [selectedArchs, setSelectedArchs] = useState<StyleArchetype[]>(
    profile.style_archetypes || ['minimalist']
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    profile.color_preferences || ['navy', 'cream']
  );

  const toggleArch = (id: StyleArchetype) => {
    setSelectedArchs((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleColor = (c: string) => {
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((col) => col !== c) : [...prev, c]
    );
  };

  const handleSave = () => {
    updateProfile({
      style_archetypes: selectedArchs,
      color_preferences: selectedColors,
    });
    Alert.alert('Preferences Saved', 'Stylist Muse updated to prioritize your selected style archetypes.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AM</Text>
        </View>
        <Text style={styles.userName}>{profile.full_name || 'Alex Morgan'}</Text>
        <Text style={styles.userEmail}>{profile.email}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{wardrobe.length}</Text>
            <Text style={styles.statLabel}>Wardrobe Items</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{outfits.length}</Text>
            <Text style={styles.statLabel}>Saved Looks</Text>
          </View>
        </View>
      </View>

      {/* Style Archetypes */}
      <Text style={styles.sectionTitle}>Style Archetypes</Text>
      <View style={styles.archetypeContainer}>
        {ARCHETYPES.map((arch) => {
          const active = selectedArchs.includes(arch.id);
          return (
            <TouchableOpacity
              key={arch.id}
              onPress={() => toggleArch(arch.id)}
              style={[styles.archCard, active && styles.archCardActive]}
            >
              <Text style={[styles.archLabel, active && styles.archLabelActive]}>
                {arch.label}
              </Text>
              <Text style={[styles.archDesc, active && styles.archDescActive]}>
                {arch.desc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Preferred Colors */}
      <Text style={styles.sectionTitle}>Preferred Colors</Text>
      <View style={styles.colorRow}>
        {COLORS.map((col) => {
          const active = selectedColors.includes(col);
          return (
            <TouchableOpacity
              key={col}
              onPress={() => toggleColor(col)}
              style={[styles.colorChip, active && styles.colorChipActive]}
            >
              <Text style={[styles.colorText, active && styles.colorTextActive]}>
                {col}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Preferences</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfc' },
  content: { padding: 16, paddingBottom: 40 },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1c1917',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  userName: { fontSize: 17, fontWeight: '700', color: '#1c1917' },
  userEmail: { fontSize: 12, color: '#78716c', marginTop: 2 },
  statsRow: { flexDirection: 'row', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#f5f5f4', width: '100%', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statNum: { fontSize: 16, fontWeight: '700', color: '#1c1917' },
  statLabel: { fontSize: 11, color: '#a8a29e', marginTop: 2 },
  statDivider: { width: 1, height: '100%', backgroundColor: '#f5f5f4' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#78716c', textTransform: 'uppercase', marginBottom: 10, marginTop: 8 },
  archetypeContainer: { gap: 8, marginBottom: 16 },
  archCard: { padding: 12, borderRadius: 16, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e7e5e4' },
  archCardActive: { backgroundColor: '#1c1917', borderColor: '#1c1917' },
  archLabel: { fontSize: 13, fontWeight: '700', color: '#1c1917' },
  archLabelActive: { color: '#ffffff' },
  archDesc: { fontSize: 11, color: '#78716c', marginTop: 2 },
  archDescActive: { color: '#d6d3d1' },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 24 },
  colorChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f5f5f4', borderWidth: 1, borderColor: '#e7e5e4' },
  colorChipActive: { backgroundColor: '#fef3c7', borderColor: '#d97706' },
  colorText: { fontSize: 11, fontWeight: '600', color: '#57534e', textTransform: 'capitalize' },
  colorTextActive: { color: '#92400e' },
  saveButton: { backgroundColor: '#1c1917', paddingVertical: 14, borderRadius: 24, alignItems: 'center' },
  saveButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
});
