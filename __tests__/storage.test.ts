import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  classifyCategory,
  getItems,
  saveItems,
  addItem,
  toggleItem,
  deleteItem,
  getFrequentItems,
} from '../utils/storage';
import { ShoppingItem, FrequentItem } from '../types';

// Clear storage before each test
beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('classifyCategory', () => {
  test('classifies food items correctly', () => {
    expect(classifyCategory('牛乳')).toBe('食品');
    expect(classifyCategory('卵')).toBe('食品');
    expect(classifyCategory('パン')).toBe('食品');
    expect(classifyCategory('りんご')).toBe('食品');
    expect(classifyCategory('豚肉')).toBe('食品');
    expect(classifyCategory('醤油')).toBe('食品');
    expect(classifyCategory('ビール')).toBe('食品');
  });

  test('classifies daily items correctly', () => {
    expect(classifyCategory('シャンプー')).toBe('日用品');
    expect(classifyCategory('トイレットペーパー')).toBe('日用品');
    expect(classifyCategory('ティッシュ')).toBe('日用品');
    expect(classifyCategory('洗剤')).toBe('日用品');
    expect(classifyCategory('電池')).toBe('日用品');
    expect(classifyCategory('マスク')).toBe('日用品');
  });

  test('classifies unknown items as その他', () => {
    expect(classifyCategory('本')).toBe('その他');
    expect(classifyCategory('プレゼント')).toBe('その他');
    expect(classifyCategory('ペン')).toBe('その他');
  });
});

describe('getItems / saveItems', () => {
  test('returns empty array when no items stored', async () => {
    const items = await getItems();
    expect(items).toEqual([]);
  });

  test('saves and retrieves items correctly', async () => {
    const testItems: ShoppingItem[] = [
      { id: '1', name: '牛乳', category: '食品', completed: false, createdAt: 1000 },
      { id: '2', name: '洗剤', category: '日用品', completed: true, createdAt: 2000 },
    ];
    
    await saveItems(testItems);
    const retrieved = await getItems();
    
    expect(retrieved).toEqual(testItems);
  });

  test('handles corrupted storage gracefully', async () => {
    await AsyncStorage.setItem('shopping_items', 'invalid json{');
    const items = await getItems();
    expect(items).toEqual([]);
  });
});

describe('addItem', () => {
  test('adds new item to storage', async () => {
    const item = await addItem('牛乳', '食品');
    
    expect(item.name).toBe('牛乳');
    expect(item.category).toBe('食品');
    expect(item.completed).toBe(false);
    expect(item.id).toBeTruthy();
    
    const items = await getItems();
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('牛乳');
  });

  test('adds item to beginning of list (most recent first)', async () => {
    await addItem('牛乳', '食品');
    await new Promise(resolve => setTimeout(resolve, 10));
    await addItem('卵', '食品');
    
    const items = await getItems();
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe('卵');
    expect(items[1].name).toBe('牛乳');
  });

  test('updates frequent items when adding', async () => {
    await addItem('牛乳', '食品');
    await new Promise(resolve => setTimeout(resolve, 10));
    await addItem('牛乳', '食品');
    
    const frequent = await getFrequentItems();
    const milk = frequent.find(f => f.name === '牛乳');
    expect(milk).toBeTruthy();
    expect(milk?.count).toBe(2);
  });
});

describe('toggleItem', () => {
  test('toggles item completion status', async () => {
    const item = await addItem('牛乳', '食品');
    expect(item.completed).toBe(false);
    
    let items = await toggleItem(item.id);
    expect(items[0].completed).toBe(true);
    expect(items[0].completedAt).toBeTruthy();
    
    items = await toggleItem(item.id);
    expect(items[0].completed).toBe(false);
    expect(items[0].completedAt).toBeUndefined();
  });

  test('does nothing for non-existent item', async () => {
    await addItem('牛乳', '食品');
    const items = await toggleItem('non-existent-id');
    expect(items).toHaveLength(1);
    expect(items[0].completed).toBe(false);
  });
});

describe('deleteItem', () => {
  test('removes item from storage', async () => {
    const item1 = await addItem('牛乳', '食品');
    // Small delay to ensure different timestamp IDs
    await new Promise(resolve => setTimeout(resolve, 10));
    const item2 = await addItem('卵', '食品');
    
    // Verify both added
    const beforeDelete = await getItems();
    expect(beforeDelete).toHaveLength(2);
    
    const items = await deleteItem(item1.id);
    
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('卵');
    expect(items[0].id).toBe(item2.id);
  });

  test('returns all items when deleting non-existent item', async () => {
    await addItem('牛乳', '食品');
    const items = await deleteItem('non-existent-id');
    expect(items).toHaveLength(1);
  });
});

describe('getFrequentItems', () => {
  test('returns empty array when no frequent items', async () => {
    const frequent = await getFrequentItems();
    expect(frequent).toEqual([]);
  });

  test('returns items sorted by count (most frequent first)', async () => {
    await addItem('牛乳', '食品');
    await new Promise(resolve => setTimeout(resolve, 5));
    await addItem('牛乳', '食品');
    await new Promise(resolve => setTimeout(resolve, 5));
    await addItem('牛乳', '食品');
    await new Promise(resolve => setTimeout(resolve, 5));
    await addItem('卵', '食品');
    
    const frequent = await getFrequentItems();
    expect(frequent[0].name).toBe('牛乳');
    expect(frequent[0].count).toBe(3);
    expect(frequent[1].name).toBe('卵');
    expect(frequent[1].count).toBe(1);
  });

  test('limits to 10 items', async () => {
    // Add 15 unique items with delays to avoid ID collision
    for (let i = 0; i < 15; i++) {
      await addItem(`item${i}`, '食品');
      await new Promise(resolve => setTimeout(resolve, 5));
    }
    
    const frequent = await getFrequentItems();
    expect(frequent.length).toBeLessThanOrEqual(10);
  });

  test('handles corrupted storage gracefully', async () => {
    await AsyncStorage.setItem('frequent_items', 'invalid json{');
    const frequent = await getFrequentItems();
    expect(frequent).toEqual([]);
  });
});
