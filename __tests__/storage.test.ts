import { classifyCategory } from '../utils/storage';

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
