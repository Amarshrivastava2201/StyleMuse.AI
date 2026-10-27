import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useMobileWardrobe } from '../../context/WardrobeContext';
import { ClothingCategory, ClothingItem } from '@stylemuse/types';

const CATEGORIES: Array<{ label: string; value: 'all' | ClothingCategory }> = [
  { label: 'All', value: 'all' },
  { label: 'Tops', value: 'tops' },
  { label: 'Bottoms', value: 'bottoms' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Footwear', value: 'footwear' },
];

export default function WardrobeScreen() {
  const { wardrobe, toggleFavoriteItem, addClothingItem } = useMobileWardrobe();
  const [selectedCat, setSelectedCat] = useState<'all' | ClothingCategory>('all');

  const filteredItems = wardrobe.filter((item) =>
    selectedCat === 'all' ? true : item.category === selectedCat
  );

  const handleAddSampleGarment = () => {
    addClothingItem({
      user_id: '00000000-0000-0000-0000-000000000001',
      name: 'Black Silk Slip Dress',
      category: 'one-piece',
      subcategory: 'slip_dress',
      primary_color: 'black',
      secondary_colors: [],
      pattern: 'solid',
      material: 'silk',
      formality: 'formal',
      seasons: ['spring', 'summer'],
      fit: 'slim',
      favorite: true,
      image_url:
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      ai_metadata: { confidence_score: 0.98 },
    });
    Alert.alert('AI Vision Tagged', 'New Silk Slip Dress added to your wardrobe with 98% AI confidence!');
  };

  return (
    <View style={styles.container}>
      {/* Category Pills */}
      <View style={styles.filterRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const isActive = selectedCat === item.value;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCat(item.value)}
                style={[styles.pill, isActive && styles.pillActive]}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      {/* Wardrobe Grid */}
      <FlatList
        data={filteredItems}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image_url }} style={styles.image} />
              <TouchableOpacity
                onPress={() => toggleFavoriteItem(item.id)}
                style={styles.favoriteButton}
              >
                <Text style={{ fontSize: 13 }}>{item.favorite ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemSub} numberOfLines={1}>
                {item.subcategory} &bull; {item.primary_color}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddSampleGarment}>
        <Text style={styles.fabText}>+ Add Garment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfc',
  },
  filterRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f4',
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f5f5f4',
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: '#1c1917',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716c',
  },
  pillTextActive: {
    color: '#fdfdfc',
  },
  gridContent: {
    padding: 12,
    paddingBottom: 90,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e7e5e4',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f5f5f4',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    padding: 4,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(28,25,23,0.75)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  categoryBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardInfo: {
    padding: 10,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1c1917',
  },
  itemSub: {
    fontSize: 11,
    color: '#78716c',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#1c1917',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
