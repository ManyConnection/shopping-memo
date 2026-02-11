import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FrequentItem, Category } from '../types';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

interface Props {
  suggestions: FrequentItem[];
  onSelect: (name: string, category: Category) => void;
}

export function SuggestionChips({ suggestions, onSelect }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  if (suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>よく買うもの</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={`${item.name}-${index}`}
            style={[
              styles.chip,
              { backgroundColor: colors.category[item.category] + '20', borderColor: colors.category[item.category] },
            ]}
            onPress={() => onSelect(item.name, item.category)}
            testID={`suggestion-${item.name}`}
          >
            <Text style={[styles.chipText, { color: colors.category[item.category] }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  scrollContent: {
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
