import React, { useState } from 'react'
import RecipeItem from './myrecipe/RecipeItem';

export default function TestPage() {
  const [count, setCount] = useState(0);
    const dummyRecipes = Array.from({ length: 2000 }, (_, i) => ({
    id: i,
    foodName: `성능 테스트 레시피 ${i + 1}호`,
    createdAt: new Date().toISOString(),
  }));
  return (
    <div>
      <h1>레시피 목록 (총 {dummyRecipes.length}개)</h1>
        
        <button 
          onClick={() => setCount(count + 1)}
          style={{ height: '100px', padding: '20px', fontSize: '20px', backgroundColor: 'yellow' }}
        >
          부모 리렌더링 시키기: {count}
        </button>
        <div>
      {dummyRecipes.map((recipe) => (
        <RecipeItem
          key={recipe.id}
          recipe={recipe as any}
          displayId={recipe.id + 1}
          onClick={(id) => console.log(id)}
          formatDate={(date) => (date ? date.split('T')[0] : "")}
        />
      ))}
      </div>
    </div>
  )
}
