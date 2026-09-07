import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];

/**
 * Публичный API слайса.
 *
 * У всех слоёв слайс виден как @/<слой>/<слайс>. Исключение —
 * features: по правилам проекта фичи сгруппированы по домену
 * (features/product/add-to-cart), поэтому их публичный API лежит
 * уровнем глубже: @/features/<домен>/<действие>.
 */
const PUBLIC_API_PATTERNS = [
  {
    group: LAYERS.filter((layer) => layer !== 'features').flatMap((layer) => [
      `@/${layer}/*/*`,
      `@/${layer}/*/*/**`,
    ]),
    message:
      'Обход публичного API. Импортируй слайс целиком: @/<слой>/<слайс>.',
  },
  {
    group: ['@/features/*/*/*', '@/features/*/*/*/**'],
    message:
      'Обход публичного API фичи. Импортируй так: @/features/<домен>/<действие>.',
  },
];

const layerBoundaries = LAYERS.map((layer, index) => {
  const forbiddenLayers = LAYERS.slice(0, index + 1).filter(
    (name) => name !== 'shared',
  );

  return {
    files: [`src/${layer}/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...PUBLIC_API_PATTERNS,
            ...forbiddenLayers.map((name) => ({
              group: [`@/${name}`, `@/${name}/**`],
              message:
                `Слой "${layer}" не может импортировать из "${name}". ` +
                `Разрешён импорт только вниз: ${LAYERS.join(' → ')}.`,
            })),
          ],
        },
      ],
    },
  };
});

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: PUBLIC_API_PATTERNS }],
    },
  },
  ...layerBoundaries,
]);
