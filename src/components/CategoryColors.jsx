import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { COLOR_PALETTE } from '../slices/meta.js';

const rootRules = `:root { ${Object.entries(COLOR_PALETTE)
  .map(([name, hex]) => `--color-${name}: ${hex};`)
  .join(' ')} }`;

function CategoryColors() {
  const categories = useSelector((state) => state.meta.expenseCategories);
  const categoryColorDefinitions = useMemo(
    () =>
      categories
        .map(
          ({ slug, color }) =>
            `[data-cat='${slug}'] { --cat-color: var(--color-${color}); }`
        )
        .join('\n'),
    [categories]
  );
  return (
    <style>
      {rootRules}
      {categoryColorDefinitions}
    </style>
  );
}

export default CategoryColors;
