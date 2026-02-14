# 🔐 Безопасная настройка Telegram для GitHub Pages

## Проблема

GitHub Pages это статический хостинг, и все переменные окружения станут видны в коде. Telegram токены нельзя выставлять публично!

## ✅ Решение: Backend API (Рекомендуется)

### Вариант 1: Netlify Functions (БЕСПЛАТНО)

1. **Создайте аккаунт на [Netlify](https://www.netlify.com/)**

2. **Создайте файл `netlify/functions/send-telegram.ts`:**

```typescript
import axios from 'axios'

export const handler = async (event: any) => {
  // Разрешаем CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' }
  }

  try {
    const data = JSON.parse(event.body)
    
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

    const fullName = `${data.firstName} ${data.lastName}`
    const attendingText = data.attending ? 'Да, будет' : 'Нет, не будет'
    const partnerText = data.attending 
      ? (data.withPartner ? 'С супругой/супругом' : 'Один/одна')
      : 'Не применимо'

    const message = `
🎊 Новый ответ на приглашение

👤 ФИО: ${fullName}
✅ Присутствие: ${attendingText}
👫 Сопровождение: ${partnerText}
    `.trim()

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to send message' })
    }
  }
}
```

3. **Создайте `netlify.toml` в корне проекта:**

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

4. **Обновите `src/utils/telegram.ts`:**

```typescript
import axios from 'axios'

interface FormData {
  firstName: string
  lastName: string
  withPartner: boolean | null
  attending: boolean | null
}

export async function sendToTelegram(formData: FormData): Promise<any> {
  const url = '/.netlify/functions/send-telegram' // Для Netlify
  
  try {
    const response = await axios.post(url, formData)
    return response.data
  } catch (error) {
    console.error('Error sending to backend:', error)
    throw error
  }
}
```

5. **Деплой на Netlify:**

```bash
# Установите Netlify CLI
npm install -g netlify-cli

# Залогиньтесь
netlify login

# Инициализируйте проект
netlify init

# Добавьте переменные окружения через Netlify UI:
# Site settings -> Environment variables
# TELEGRAM_BOT_TOKEN=ваш_токен
# TELEGRAM_CHAT_ID=ваш_chat_id

# Деплой
netlify deploy --prod
```

---

### Вариант 2: Vercel Functions (БЕСПЛАТНО)

1. **Создайте `api/send-telegram.ts`:**

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { firstName, lastName, attending, withPartner } = req.body

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

    const fullName = `${firstName} ${lastName}`
    const attendingText = attending ? 'Да, будет' : 'Нет, не будет'
    const partnerText = attending 
      ? (withPartner ? 'С супругой/супругом' : 'Один/одна')
      : 'Не применимо'

    const message = `
🎊 Новый ответ на приглашение

👤 ФИО: ${fullName}
✅ Присутствие: ${attendingText}
👫 Сопровождение: ${partnerText}
    `.trim()

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}
```

2. **Обновите `src/utils/telegram.ts`:**

```typescript
import axios from 'axios'

interface FormData {
  firstName: string
  lastName: string
  withPartner: boolean | null
  attending: boolean | null
}

export async function sendToTelegram(formData: FormData): Promise<any> {
  // Замените на ваш Vercel URL после деплоя
  const url = 'https://your-project.vercel.app/api/send-telegram'
  
  try {
    const response = await axios.post(url, formData)
    return response.data
  } catch (error) {
    console.error('Error sending to backend:', error)
    throw error
  }
}
```

3. **Деплой:**

```bash
# Установите Vercel CLI
npm i -g vercel

# Деплой
vercel

# Добавьте переменные через Vercel Dashboard:
# Settings -> Environment Variables
# TELEGRAM_BOT_TOKEN
# TELEGRAM_CHAT_ID
```

---

## 🎯 Итоговая схема работы

```
[GitHub Pages]         [Netlify/Vercel Functions]      [Telegram]
   Frontend     --->    Backend API (токены)    --->    Bot API
 (публичный)            (приватный)                    
```

### Преимущества:
- ✅ Токены остаются в секрете
- ✅ Frontend на GitHub Pages (бесплатно)
- ✅ Backend на Netlify/Vercel (бесплатно)
- ✅ Безопасно для публичного репозитория

---

## 📝 Что делать дальше

1. Выберите платформу (Netlify или Vercel)
2. Создайте функцию согласно инструкции выше
3. Обновите `src/utils/telegram.ts`
4. Задеплойте функцию
5. Обновите URL в коде на реальный
6. Задеплойте frontend на GitHub Pages

Готово! Теперь у вас безопасная архитектура 🎉
