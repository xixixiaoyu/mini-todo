import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default [
  // 忽略文件
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      'eslint.config.mjs'
    ]
  },
  
  // 基础配置
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  
  // TypeScript 配置（后端）
  ...tseslint.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: ['apps/backend/**/*.ts']
  })),
  {
    files: ['apps/backend/**/*.ts'],
    languageOptions: {
      globals: { 
        ...globals.node, 
        ...globals.jest 
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: './apps/backend'
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn'
    }
  },
  
  // Vue 配置（前端）
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['apps/frontend/**/*.{js,vue}'],
    languageOptions: {
      globals: { 
        ...globals.browser 
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'error',
      'vue/no-multiple-template-root': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/attributes-order': 'warn',
      'vue/order-in-components': 'warn',
      'vue/no-v-html': 'warn'
    }
  },
  
  // JavaScript 通用配置
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  }
];