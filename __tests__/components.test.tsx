import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AddItemInput } from '../components/AddItemInput';
import { CategoryPicker } from '../components/CategoryPicker';
import { SuggestionChips } from '../components/SuggestionChips';

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
