import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { Category } from '../types';

interface Props {
  onAdd: (name: string, category: Category) => void;
  suggestedCategory?: Category;
}

export function AddItemInput({ onAdd, suggestedCategory = 'その他' }: Props) {
  const [text, setText] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onAdd(trimmed, suggestedCategory);
      setText('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder="買うものを入力..."
        placeholderTextColor={colors.tabIconDefault}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        testID="add-item-input"
      />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.tint }]}
        onPress={handleSubmit}
        disabled={!text.trim()}
        testID="add-item-button"
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    paddingLeft: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
});
