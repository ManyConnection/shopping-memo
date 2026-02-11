import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingItem, FrequentItem, Category } from '../types';

const ITEMS_KEY = 'shopping_items';
const FREQUENT_KEY = 'frequent_items';

export async function getItems(): Promise<ShoppingItem[]> {
  try {
    const json = await AsyncStorage.getItem(ITEMS_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveItems(items: ShoppingItem[]): Promise<void> {
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export async function addItem(name: string, category: Category): Promise<ShoppingItem> {
  const items = await getItems();
  const newItem: ShoppingItem = {
    id: Date.now().toString(),
    name,
    category,
    completed: false,
    createdAt: Date.now(),
  };
  items.unshift(newItem);
  await saveItems(items);
  await updateFrequentItem(name, category);
  return newItem;
}

export async function toggleItem(id: string): Promise<ShoppingItem[]> {
  const items = await getItems();
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index].completed = !items[index].completed;
    items[index].completedAt = items[index].completed ? Date.now() : undefined;
  }
  await saveItems(items);
  return items;
}

export async function deleteItem(id: string): Promise<ShoppingItem[]> {
  const items = await getItems();
  const filtered = items.filter(item => item.id !== id);
  await saveItems(filtered);
  return filtered;
}

export async function getFrequentItems(): Promise<FrequentItem[]> {
  try {
    const json = await AsyncStorage.getItem(FREQUENT_KEY);
    const items: FrequentItem[] = json ? JSON.parse(json) : [];
    return items.sort((a, b) => b.count - a.count).slice(0, 10);
  } catch {
    return [];
  }
}

async function updateFrequentItem(name: string, category: Category): Promise<void> {
  try {
    const json = await AsyncStorage.getItem(FREQUENT_KEY);
    const items: FrequentItem[] = json ? JSON.parse(json) : [];
    const existing = items.find(item => item.name === name);
    if (existing) {
      existing.count++;
    } else {
      items.push({ name, category, count: 1 });
    }
    await AsyncStorage.setItem(FREQUENT_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function classifyCategory(name: string): Category {
  const foodKeywords = [
    '野菜', '肉', '魚', 'パン', '牛乳', '卵', '米', 'ご飯', '果物',
    'りんご', 'バナナ', 'みかん', 'トマト', 'キャベツ', 'レタス',
    '豚', '鶏', '牛', 'ハム', 'ソーセージ', 'ベーコン',
    '豆腐', '納豆', 'ヨーグルト', 'チーズ', 'バター',
    '醤油', '味噌', '塩', '砂糖', '油', '酢', 'マヨネーズ', 'ケチャップ',
    'ラーメン', 'うどん', 'そば', 'パスタ', 'カレー',
    'お菓子', 'チョコ', 'クッキー', 'アイス', 'ジュース', 'お茶', 'コーヒー',
    'ビール', '酒', 'ワイン', '水',
  ];
  
  const dailyKeywords = [
    'シャンプー', 'リンス', '石鹸', 'ボディソープ', '歯磨き', '歯ブラシ',
    'トイレットペーパー', 'ティッシュ', 'キッチンペーパー', 'ゴミ袋',
    '洗剤', '柔軟剤', 'スポンジ', 'ラップ', 'アルミホイル', 'ジップロック',
    '電池', '電球', '薬', '絆創膏', 'マスク', '消毒',
    'ハンドソープ', 'ボディクリーム', '化粧水', '日焼け止め',
  ];

  const lowerName = name.toLowerCase();
  
  if (foodKeywords.some(kw => lowerName.includes(kw))) {
    return '食品';
  }
  if (dailyKeywords.some(kw => lowerName.includes(kw))) {
    return '日用品';
  }
  return 'その他';
}
