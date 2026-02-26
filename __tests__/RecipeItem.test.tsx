import { render } from '@testing-library/react';
import React from 'react';
import RecipeItem from '@/components/myrecipe/RecipeItem';

describe('RecipeItem 성능 최적화 테스트', () => {
  const mockRecipe = {
    id: 1,
    foodName: '테스트 레시피',
    createdAt: '2026-02-26T00:00:00Z'
  } as any;

  const mockOnClick = jest.fn();
  const mockFormatDate = jest.fn((date) => '2026-02-26');

  test('React.memo 적용 시, 동일한 Props로는 리렌더링이 발생하지 않아야 한다', () => {
    const { rerender } = render(
      <RecipeItem 
        recipe={mockRecipe} 
        displayId={1} 
        onClick={mockOnClick} 
        formatDate={mockFormatDate} 
      />
    );

    expect(mockFormatDate).toHaveBeenCalledTimes(1);

    rerender(
      <RecipeItem 
        recipe={mockRecipe} 
        displayId={1} 
        onClick={mockOnClick} 
        formatDate={mockFormatDate} 
      />
    );

    expect(mockFormatDate).toHaveBeenCalledTimes(1);
    
    console.log('성능 검증 완료: 불필요한 리렌더링이 차단되었습니다.');
  });
});