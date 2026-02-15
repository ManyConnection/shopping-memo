import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AddItemInput } from '../components/AddItemInput';
import { CategoryPicker } from '../components/CategoryPicker';
import { SuggestionChips } from '../components/SuggestionChips';
import { ShoppingItemRow } from '../components/ShoppingItemRow';
import { ShoppingItem } from '../types';

describe('AddItemInput', () => {
  test('renders input and add button', () => {
    const onAdd = jest.fn();
    const { getByTestId, getByPlaceholderText } = render(
      <AddItemInput onAdd={onAdd} />
    );
    
    expect(getByPlaceholderText('買うものを入力...')).toBeTruthy();
    expect(getByTestId('add-item-button')).toBeTruthy();
  });

  test('calls onAdd when submitted', () => {
    const onAdd = jest.fn();
    const { getByTestId, getByPlaceholderText } = render(
      <AddItemInput onAdd={onAdd} suggestedCategory="食品" />
    );
    
    const input = getByPlaceholderText('買うものを入力...');
    fireEvent.changeText(input, '牛乳');
    fireEvent(input, 'submitEditing');
    
    expect(onAdd).toHaveBeenCalledWith('牛乳', '食品');
  });

  test('clears input after submission', () => {
    const onAdd = jest.fn();
    const { getByPlaceholderText } = render(
      <AddItemInput onAdd={onAdd} suggestedCategory="食品" />
    );
    
    const input = getByPlaceholderText('買うものを入力...');
    fireEvent.changeText(input, '牛乳');
    fireEvent(input, 'submitEditing');
    
    expect(input.props.value).toBe('');
  });

  test('calls onAdd when add button pressed', () => {
    const onAdd = jest.fn();
    const { getByTestId, getByPlaceholderText } = render(
      <AddItemInput onAdd={onAdd} suggestedCategory="日用品" />
    );
    
    const input = getByPlaceholderText('買うものを入力...');
    fireEvent.changeText(input, 'シャンプー');
    fireEvent.press(getByTestId('add-item-button'));
    
    expect(onAdd).toHaveBeenCalledWith('シャンプー', '日用品');
  });

  test('does not call onAdd when input is empty', () => {
    const onAdd = jest.fn();
    const { getByTestId } = render(
      <AddItemInput onAdd={onAdd} suggestedCategory="食品" />
    );
    
    fireEvent.press(getByTestId('add-item-button'));
    
    expect(onAdd).not.toHaveBeenCalled();
  });

  test('does not call onAdd when input is whitespace only', () => {
    const onAdd = jest.fn();
    const { getByTestId, getByPlaceholderText } = render(
      <AddItemInput onAdd={onAdd} suggestedCategory="食品" />
    );
    
    const input = getByPlaceholderText('買うものを入力...');
    fireEvent.changeText(input, '   ');
    fireEvent.press(getByTestId('add-item-button'));
    
    expect(onAdd).not.toHaveBeenCalled();
  });

  test('trims whitespace from input', () => {
    const onAdd = jest.fn();
    const { getByPlaceholderText } = render(
      <AddItemInput onAdd={onAdd} suggestedCategory="食品" />
    );
    
    const input = getByPlaceholderText('買うものを入力...');
    fireEvent.changeText(input, '  牛乳  ');
    fireEvent(input, 'submitEditing');
    
    expect(onAdd).toHaveBeenCalledWith('牛乳', '食品');
  });
});

describe('CategoryPicker', () => {
  test('renders all categories', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(
      <CategoryPicker selected="食品" onSelect={onSelect} />
    );
    
    expect(getByTestId('category-食品')).toBeTruthy();
    expect(getByTestId('category-日用品')).toBeTruthy();
    expect(getByTestId('category-その他')).toBeTruthy();
  });

  test('calls onSelect when category pressed', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(
      <CategoryPicker selected="食品" onSelect={onSelect} />
    );
    
    fireEvent.press(getByTestId('category-日用品'));
    expect(onSelect).toHaveBeenCalledWith('日用品');
  });
});

describe('SuggestionChips', () => {
  test('renders suggestions', () => {
    const suggestions = [
      { name: '牛乳', category: '食品' as const, count: 5 },
      { name: 'パン', category: '食品' as const, count: 3 },
    ];
    const onSelect = jest.fn();
    
    const { getByTestId, getByText } = render(
      <SuggestionChips suggestions={suggestions} onSelect={onSelect} />
    );
    
    expect(getByText('よく買うもの')).toBeTruthy();
    expect(getByTestId('suggestion-牛乳')).toBeTruthy();
    expect(getByTestId('suggestion-パン')).toBeTruthy();
  });

  test('calls onSelect when chip pressed', () => {
    const suggestions = [
      { name: '牛乳', category: '食品' as const, count: 5 },
    ];
    const onSelect = jest.fn();
    
    const { getByTestId } = render(
      <SuggestionChips suggestions={suggestions} onSelect={onSelect} />
    );
    
    fireEvent.press(getByTestId('suggestion-牛乳'));
    expect(onSelect).toHaveBeenCalledWith('牛乳', '食品');
  });

  test('returns null when no suggestions', () => {
    const onSelect = jest.fn();
    const { queryByText } = render(
      <SuggestionChips suggestions={[]} onSelect={onSelect} />
    );
    
    expect(queryByText('よく買うもの')).toBeNull();
  });
});

describe('ShoppingItemRow', () => {
  const mockItem: ShoppingItem = {
    id: 'test-1',
    name: '牛乳',
    category: '食品',
    completed: false,
    createdAt: Date.now(),
  };

  const completedItem: ShoppingItem = {
    ...mockItem,
    id: 'test-2',
    completed: true,
    completedAt: Date.now(),
  };

  test('renders item name and category', () => {
    const onToggle = jest.fn();
    const onDelete = jest.fn();
    const { getByText } = render(
      <ShoppingItemRow item={mockItem} onToggle={onToggle} onDelete={onDelete} />
    );
    
    expect(getByText('牛乳')).toBeTruthy();
    expect(getByText('食品')).toBeTruthy();
  });

  test('calls onToggle when checkbox pressed', () => {
    const onToggle = jest.fn();
    const onDelete = jest.fn();
    const { getByLabelText } = render(
      <ShoppingItemRow item={mockItem} onToggle={onToggle} onDelete={onDelete} />
    );
    
    fireEvent.press(getByLabelText('完了にする'));
    
    expect(onToggle).toHaveBeenCalledWith('test-1');
  });

  test('shows different accessibility label for completed item', () => {
    const onToggle = jest.fn();
    const onDelete = jest.fn();
    const { getByLabelText } = render(
      <ShoppingItemRow item={completedItem} onToggle={onToggle} onDelete={onDelete} />
    );
    
    fireEvent.press(getByLabelText('完了を取り消す'));
    
    expect(onToggle).toHaveBeenCalledWith('test-2');
  });

  test('renders uncompleted item without strikethrough style', () => {
    const onToggle = jest.fn();
    const onDelete = jest.fn();
    const { getByText } = render(
      <ShoppingItemRow item={mockItem} onToggle={onToggle} onDelete={onDelete} />
    );
    
    const nameText = getByText('牛乳');
    // Uncompleted items should not have line-through style
    const flatStyle = Array.isArray(nameText.props.style)
      ? Object.assign({}, ...nameText.props.style)
      : nameText.props.style;
    expect(flatStyle.textDecorationLine).not.toBe('line-through');
  });

  test('renders completed item with visual indication', () => {
    const onToggle = jest.fn();
    const onDelete = jest.fn();
    const { getByText, getByTestId } = render(
      <ShoppingItemRow item={completedItem} onToggle={onToggle} onDelete={onDelete} />
    );
    
    // Completed items show checkmark icon
    expect(getByTestId('icon-checkmark-circle')).toBeTruthy();
  });

  test('renders different categories with correct badge', () => {
    const dailyItem: ShoppingItem = {
      ...mockItem,
      category: '日用品',
    };
    const onToggle = jest.fn();
    const onDelete = jest.fn();
    
    const { getByText } = render(
      <ShoppingItemRow item={dailyItem} onToggle={onToggle} onDelete={onDelete} />
    );
    
    expect(getByText('日用品')).toBeTruthy();
  });
});
