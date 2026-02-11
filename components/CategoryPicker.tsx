import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Category } from '../types';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

const CATEGORIES: Category[] = ['食品', '日用品', 'その他'];

interface Props {
  selected: Category;
  onSelect: (category: Category) => void;
}

export function CategoryPicker({ selected, onSelect }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.button,
            {
              backgroundColor:
                selected === category
                  ? colors.category[category]
                  : colors.category[category] + '20',
              borderColor: colors.category[category],
            },
          ]}
          onPress={() => onSelect(category)}
          testID={`category-${category}`}
        >
          <Text
            style={[
              styles.buttonText,
              { color: selected === category ? '#fff' : colors.category[category] },
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
