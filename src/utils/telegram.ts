import axios from 'axios'

interface FormData {
  firstName: string
  drinks: string
  attending: boolean | null
}

interface TelegramResponse {
  ok: boolean
  result: any
}

const TELEGRAM_CHAT_ID = '-5126852416'

export async function sendToTelegram(formData: FormData): Promise<TelegramResponse> {
  const fullName = `${formData.firstName}`
  const attendingText = formData.attending ? 'Да, будет' : 'Нет, не будет'

  const message = `
🎊 Новый ответ на приглашение

👤 ФИО: ${fullName}
🥂 Предпочтения: ${formData.drinks}
✅ Присутствие: ${attendingText}
  `.trim()

  const url = `https://api.telegram.org/bot8790424719:AAGATiXMSw6L6XV7ZySkXwyGrP7tfJH3Txg/sendMessage`

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
