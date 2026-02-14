import { useState, FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendToTelegram } from '../utils/telegram'
import Header from './Header'

interface FormData {
  firstName: string
  lastName: string
  withPartner: boolean | null
  attending: boolean | null
}

function Survey() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    withPartner: null,
    attending: null
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAttendingChange = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      attending: value
    }))
  }

  const handlePartnerChange = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      withPartner: value
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError('Пожалуйста, укажите ваше имя')
      return false
    }
    if (!formData.lastName.trim()) {
      setError('Пожалуйста, укажите вашу фамилию')
      return false
    }
    if (formData.attending === null) {
      setError('Пожалуйста, укажите, сможете ли вы присутствовать')
      return false
    }
    if (formData.attending === true && formData.withPartner === null) {
      setError('Пожалуйста, укажите, придете ли вы с супругой/супругом')
      return false
    }
    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await sendToTelegram(formData)
      setIsSuccess(true)
    } catch (err) {
      setError('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.')
      console.error('Error sending to Telegram:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="survey-page">
        <Header />
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Спасибо за ваш ответ!</h2>
          <p>Мы получили вашу информацию и очень ждем вас на празднике</p>
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="survey-page">
      <Header />
      
      <div className="survey-container">
        <h1>Подтверждение присутствия</h1>
        <p className="survey-description">
          Пожалуйста, заполните форму до 15 июля 2026
        </p>

        <form className="survey-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">Имя *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Иван"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Фамилия *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Иванов"
              required
            />
          </div>

          <div className="form-group">
            <label>Сможете ли вы присутствовать? *</label>
            <div className="radio-group">
              <label className={`radio-option ${formData.attending === true ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="attending"
                  checked={formData.attending === true}
                  onChange={() => handleAttendingChange(true)}
                />
                <span>Да, с удовольствием приду</span>
              </label>
              <label className={`radio-option ${formData.attending === false ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="attending"
                  checked={formData.attending === false}
                  onChange={() => handleAttendingChange(false)}
                />
                <span>К сожалению, не смогу</span>
              </label>
            </div>
          </div>

          {formData.attending === true && (
            <div className="form-group">
              <label>Будете ли вы с супругой/супругом? *</label>
              <div className="radio-group">
                <label className={`radio-option ${formData.withPartner === true ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="withPartner"
                    checked={formData.withPartner === true}
                    onChange={() => handlePartnerChange(true)}
                  />
                  <span>Да, буду с супругой/супругом</span>
                </label>
                <label className={`radio-option ${formData.withPartner === false ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="withPartner"
                    checked={formData.withPartner === false}
                    onChange={() => handlePartnerChange(false)}
                  />
                  <span>Нет, приду один/одна</span>
                </label>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Отправка...' : 'Подтвердить присутствие'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Survey
