import axios from 'axios'

interface FormData {
  firstName: string
  lastName: string
  withPartner: boolean | null
  attending: boolean | null
}

interface TelegramResponse {
  ok: boolean
  result: any
}

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID as string

export async function sendToTelegram(formData: FormData): Promise<TelegramResponse> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram credentials not configured')
    throw new Error('Telegram configuration missing')
  }

  const fullName = `${formData.firstName} ${formData.lastName}`
  const attendingText = formData.attending ? 'Да, будет' : 'Нет, не будет'
  const partnerText = formData.attending 
    ? (formData.withPartner ? 'С супругой/супругом' : 'Один/одна')
    : 'Не применимо'

  const message = `
🎊 Новый ответ на приглашение

👤 ФИО: ${fullName}
✅ Присутствие: ${attendingText}
👫 Сопровождение: ${partnerText}
  `.trim()

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  try {
    const response = await axios.post<TelegramResponse>(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
    
    return response.data
  } catch (error) {
    console.error('Error sending message to Telegram:', error)
    throw error
  }
}
