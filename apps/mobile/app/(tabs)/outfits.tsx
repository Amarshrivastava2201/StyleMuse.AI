import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useMobileWardrobe } from '../../context/WardrobeContext';
import { ClothingItem } from '@stylemuse/types';

const OCCASIONS = [
  'Everyday Minimal',
  'Smart Casual Dinner',
  'Weekend Gallery Walk',
  'Autumn Commute',
];

export default function OutfitsScreen() {
  const { wardrobe, saveOutfit, profile } = useMobileWardrobe();
  const [activeOccasion, setActiveOccasion] = useState(OCCASIONS[0]);

  // Current Outfit Slots
  const [top, setTop] = useState<ClothingItem | null>(
    wardrobe.find((i) => i.category === 'tops') || null
  );
  const [bottom, setBottom] = useState<ClothingItem | null>(
    wardrobe.find((i) => i.category === 'bottoms') || null
  );
  const [shoes, setShoes] = useState<ClothingItem | null>(
    wardrobe.find((i) => i.category === 'footwear') || null
  );
  const [outerwear, setOuterwear] = useState<ClothingItem | null>(
    wardrobe.find((i) => i.category === 'outerwear') || null
  );

  const handleShuffle = () => {
    const tops = wardrobe.filter((i) => i.category === 'tops');
    const bottoms = wardrobe.filter((i) => i.category === 'bottoms');
    const allShoes = wardrobe.filter((i) => i.category === 'footwear');
    const coats = wardrobe.filter((i) => i.category === 'outerwear');

    if (tops.length > 0) setTop(tops[Math.floor(Math.random() * tops.length)]);
    if (bottoms.length > 0) setBottom(bottoms[Math.floor(Math.random() * bottoms.length)]);
    if (allShoes.length > 0) setShoes(allShoes[Math.floor(Math.random() * allShoes.length)]);
    if (coats.length > 0) setOuterwear(coats[Math.floor(Math.random() * coats.length)]);
  };

  const handleSave = () => {
    const items = [];
    if (top) items.push({ clothing_item_id: top.id, slot_position: 'top' as const });
    if (bottom) items.push({ clothing_item_id: bottom.id, slot_position: 'bottom' as const });
    if (shoes) items.push({ clothing_item_id: shoes.id, slot_position: 'shoes' as const });
    if (outerwear) items.push({ clothing_item_id: outerwear.id, slot_position: 'outerwear' as const });

    saveOutfit({
      user_id: profile.id,
      name: activeOccasion,
      occasion: activeOccasion,
      stylist_notes: 'Clean neutral balance curated for mobile.',
      favorite: true,
      items: items.map((i) => ({
        id: `slot-${Date.now()}-${Math.random()}`,
        outfit_id: '',
        clothing_item_id: i.clothing_item_id,
        slot_position: i.slot_position,
        created_at: new Date().toISOString(),
      })),
    });

    Alert.alert('Outfit Saved!', `Saved "${activeOccasion}" to your lookbook.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Occasions */}
      <Text style={styles.sectionTitle}>Select Occasion</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.occasionRow}>
        {OCCASIONS.map((occ) => {
          const isActive = activeOccasion === occ;
          return (
            <TouchableOpacity
              key={occ}
              onPress={() => {
                setActiveOccasion(occ);
                handleShuffle();
              }}
              style={[styles.occPill, isActive && styles.occPillActive]}
            >
              <Text style={[styles.occText, isActive && styles.occTextActive]}>{occ}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Outfit Mannequin Grid */}
      <View style={styles.canvasCard}>
        <View style={styles.canvasHeader}>
          <Text style={styles.canvasOccasion}>{activeOccasion}</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save Look</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.slotsGrid}>
          {/* Layer */}
          {outerwear && (
            <View style={styles.slot}>
              <Text style={styles.slotLabel}>Layer</Text>
              <Image source={{ uri: outerwear.image_url }} style={styles.slotImage} />
              <Text style={styles.slotName} numberOfLines={1}>
                {outerwear.name}
              </Text>
            </View>
          )}

          {/* Top */}
          {top && (
            <View style={styles.slot}>
              <Text style={styles.slotLabel}>Top</Text>
              <Image source={{ uri: top.image_url }} style={styles.slotImage} />
              <Text style={styles.slotName} numberOfLines={1}>
                {top.name}
              </Text>
            </View>
          )}

          {/* Bottom */}
          {bottom && (
            <View style={styles.slot}>
              <Text style={styles.slotLabel}>Bottom</Text>
              <Image source={{ uri: bottom.image_url }} style={styles.slotImage} />
              <Text style={styles.slotName} numberOfLines={1}>
                {bottom.name}
              </Text>
            </View>
          )}

          {/* Footwear */}
          {shoes && (
            <View style={styles.slot}>
              <Text style={styles.slotLabel}>Shoes</Text>
              <Image source={{ uri: shoes.image_url }} style={styles.slotImage} />
              <Text style={styles.slotName} numberOfLines={1}>
                {shoes.name}
              </Text>
            </View>
          )}
        </View>

        {/* Stylist Insight */}
        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>✨ Stylist Rationale</Text>
          <Text style={styles.noteText}>
            Harmonious silhouette with neutral accents. Pairing tailored structure with relaxed
            chinos keeps the look elevated yet comfortable.
          </Text>
        </View>
      </View>

      {/* Actions */}
      <TouchableOpacity style={styles.generateButton} onPress={handleShuffle}>
        <Text style={styles.generateText}>✨ Shuffle & Re-Generate Look</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfc' },
  content: { padding: 16, paddingBottom: 60 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#78716c', textTransform: 'uppercase', marginBottom: 8 },
  occasionRow: { marginBottom: 16 },
  occPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f5f5f4', marginRight: 8 },
  occPillActive: { backgroundColor: '#1c1917' },
  occText: { fontSize: 12, fontWeight: '600', color: '#78716c' },
  occTextActive: { color: '#ffffff' },
  canvasCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#e7e5e4', marginBottom: 16 },
  canvasHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  canvasOccasion: { fontSize: 16, fontWeight: '700', color: '#1c1917' },
  saveBtn: { backgroundColor: '#1c1917', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  saveBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '600' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  slot: { width: '48%', marginBottom: 12, alignItems: 'center', backgroundColor: '#fafaf9', padding: 8, borderRadius: 16 },
  slotLabel: { fontSize: 11, fontWeight: '600', color: '#a8a29e', marginBottom: 4 },
  slotImage: { width: 110, height: 130, borderRadius: 12, resizeMode: 'cover' },
  slotName: { fontSize: 11, fontWeight: '600', color: '#1c1917', marginTop: 6, textAlign: 'center' },
  noteBox: { backgroundColor: '#fef3c7', borderRadius: 16, padding: 12, marginTop: 8 },
  noteTitle: { fontSize: 12, fontWeight: '700', color: '#92400e', marginBottom: 2 },
  noteText: { fontSize: 11, color: '#78350f', lineHeight: 16 },
  generateButton: { backgroundColor: '#1c1917', borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  generateText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
});
