# 🔧 Исправление ошибки GitHub Actions

## Ошибка
```
Error: Get Pages site failed. Please verify that the repository has Pages enabled
```

## ✅ Решение

### Шаг 1: Включите GitHub Pages

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** (шестерёнка вверху)
3. В левом меню найдите **Pages**
4. В разделе **Source** выберите:
   - **Source**: `GitHub Actions`
5. Нажмите **Save**

### Шаг 2: Обновите workflow (опционально)

Если проблема сохраняется, используйте упрощённый workflow. Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

### Шаг 3: Повторите push

```bash
git add .
git commit -m "Fix GitHub Pages deployment"
git push
```

---

## 🔄 Альтернативный способ (без GitHub Actions)

Если не хотите использовать GitHub Actions, используйте `gh-pages`:

### 1. Убедитесь что homepage настроен

В `package.json`:

```json
"homepage": "https://ваш-username.github.io/название-репо",
```

### 2. Деплой командой

```bash
npm run deploy
```

Эта команда:
- Соберёт проект
- Создаст ветку `gh-pages`
- Загрузит файлы на GitHub

### 3. Настройте Pages на GitHub

1. Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `gh-pages` / `/ (root)`
4. Save

---

## ✅ Проверка

После настройки:
1. Перейдите в **Actions** в вашем репозитории
2. Посмотрите статус workflow
3. Через 1-2 минуты сайт будет доступен по адресу: `https://username.github.io/repo-name/`

---

## 🎯 Рекомендуемый подход

**Используйте простой `npm run deploy`** - это проще и надёжнее:

```bash
# 1. Обновите homepage в package.json
# 2. Выполните:
npm run deploy

# 3. На GitHub: Settings → Pages → Source: "Deploy from a branch" → Branch: "gh-pages"
```

Готово! 🎉
