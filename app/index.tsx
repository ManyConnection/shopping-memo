import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ShoppingItem, Category, FrequentItem } from '../types';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import {
  getItems,
  addItem,
  toggleItem,
  deleteItem,
  getFrequentItems,
  classifyCategory,
} from '../utils/storage';
import { ShoppingItemRow } from '../components/ShoppingItemRow';
import { AddItemInput } from '../components/AddItemInput';
import { SuggestionChips } from '../components/SuggestionChips';
import { CategoryPicker } from '../components/CategoryPicker';

export default function HomeScreen() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [suggestions, setSuggestions] = useState<FrequentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('食品');
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const loadData = useCallback(async () => {
    const [loadedItems, loadedSuggestions] = await Promise.all([
      getItems(),
      getFrequentItems(),
    ]);
    setItems(loadedItems);
    setSuggestions(loadedSuggestions);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAdd = async (name: string, category: Category) => {
    const detectedCategory = classifyCategory(name);
    const finalCategory = detectedCategory !== 'その他' ? detectedCategory : category;
    await addItem(name, finalCategory);
    await loadData();
  };

  const handleToggle = async (id: string) => {
    const updated = await toggleItem(id);
    setItems(updated);
  };

  const handleDelete = async (id: string) => {
    const updated = await deleteItem(id);
    setItems(updated);
  };

  const handleSuggestionSelect = async (name: string, category: Category) => {
    await addItem(name, category);
    await loadData();
  };

  const activeItems = items.filter((item) => !item.completed);
  const completedItems = items.filter((item) => item.completed);

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <ShoppingItemRow item={item} onToggle={handleToggle} onDelete={handleDelete} />
  );

  const renderSectionHeader = (title: string, count: number) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {title} ({count})
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={[...activeItems, ...completedItems]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View>
            <AddItemInput onAdd={handleAdd} suggestedCategory={selectedCategory} />
            <CategoryPicker selected={selectedCategory} onSelect={setSelectedCategory} />
            <SuggestionChips suggestions={suggestions} onSelect={handleSuggestionSelect} />
            {activeItems.length > 0 && renderSectionHeader('買うもの', activeItems.length)}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.tabIconDefault }]}>
              買い物リストが空です
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.tabIconDefault }]}>
              上の入力欄から追加してください
            </Text>
          </View>
        }
        stickyHeaderIndices={[]}
        contentContainerStyle={styles.listContent}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
});
