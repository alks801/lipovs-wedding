import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function MainInvitation() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const guestName = searchParams.get('name')
  
  // Обратный отсчет до свадьбы
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  
  // Дата свадьбы - 31 июля 2026
  const weddingDate = new Date('2026-07-31T16:00:00')
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = weddingDate.getTime() - now.getTime()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }
    
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const getGreeting = (): string => {
    if (guestName) {
      return `Дорогой ${guestName}!`
    }
    return 'Дорогие друзья!'
  }

  return (
    <div className="main-invitation">
      <Header />
      
      <div className="hero-section">
        <div className="floral-decoration top"></div>
        
        <div className="invitation-content">
          <p className="greeting">{getGreeting()}</p>
          
          <h1 className="couple-names">
            Максим & Полина
          </h1>
          
          <p className="invitation-text">
            С радостью приглашаем вас разделить с нами<br />
            один из самых важных дней в нашей жизни
          </p>
          
          <div className="wedding-date">
            <div className="date-number">31</div>
            <div className="date-details">
              <span className="month">июля</span>
              <span className="year">2026</span>
            </div>
          </div>
          
          {/* Обратный отсчет */}
          <div className="countdown">
            <h3>До торжества осталось:</h3>
            <div className="countdown-timer">
              <div className="countdown-item">
                <span className="countdown-value">{timeLeft.days}</span>
                <span className="countdown-label">дней</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-value">{timeLeft.hours}</span>
                <span className="countdown-label">часов</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-value">{timeLeft.minutes}</span>
                <span className="countdown-label">минут</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-value">{timeLeft.seconds}</span>
                <span className="countdown-label">секунд</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="floral-decoration bottom"></div>
      </div>

      {/* Важная информация */}
      <section className="important-info">
        <div className="info-card important">
          <div className="info-icon">⏰</div>
          <h3>Дедлайн подтверждения</h3>
          <p className="deadline-date">до 15 июля 2026</p>
          <p className="info-description">
            Пожалуйста, подтвердите свое присутствие<br />
            до указанной даты
          </p>
        </div>
      </section>

      <section className="event-details">
        <div className="detail-card">
          <div className="icon">🕐</div>
          <h3>Тайминг</h3>
          <p>
            16:00 - Сбор гостей<br />
            16:30 - Церемония<br />
            17:00 - Фуршет<br />
            18:00 - Банкет
          </p>
        </div>
        
        <div className="detail-card">
          <div className="icon">📍</div>
          <h3>Место проведения</h3>
          <p>Ресторан "Название"<br />ул. Адрес, 123<br />Москва</p>
        </div>
        
        <div className="detail-card">
          <div className="icon">👔</div>
          <h3>Дресс-код</h3>
          <p>Коктейльный стиль<br /><br />Для мужчин: костюм<br />Для женщин: коктейльное платье</p>
        </div>
      </section>

      {/* Важные просьбы */}
      <section className="special-requests">
        <h2>Важная информация</h2>
        
        <div className="request-cards">
          <div className="request-card">
            <div className="request-icon">🍾</div>
            <h3>Вместо цветов</h3>
            <p>
              Мы будем рады бутылке хорошего вина<br />
              или шампанского вместо букета цветов
            </p>
          </div>
          
          <div className="request-card">
            <div className="request-icon">👨‍👩‍👧</div>
            <h3>Только для взрослых</h3>
            <p>
              Просим оставить детей дома<br />
              Это будет вечер только для взрослых гостей
            </p>
          </div>
        </div>
      </section>

      {/* <section className="photo-gallery">
        <div className="photo-container">
          <img src="/images/couple-1.jpg" alt="Couple" className="couple-photo" />
        </div>
      </section> */}

      <section className="rsvp-section">
        <h2>Подтвердите свое присутствие</h2>
        <p className="rsvp-subtitle">
          Пожалуйста, заполните форму до 15 июля 2026,<br />
          чтобы мы могли подготовить все необходимое
        </p>
        <button 
          className="rsvp-button"
          onClick={() => navigate('/survey')}
        >
          Заполнить форму
        </button>
      </section>

      <Footer />
    </div>
  )
}

export default MainInvitation
