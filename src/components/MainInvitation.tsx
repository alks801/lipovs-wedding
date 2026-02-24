import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
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
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  
  const weddingDate = new Date('2026-07-31T15:00:00')
  
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
    return 'Дорогие родные и близкие!'
  }

  const photosRef = useRef(null)
  const photosInView = useInView(photosRef, { once: true, amount: 0.2 })

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, ease: 'easeOut' as const },
  }

  const fadeIn = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 1, ease: 'easeOut' as const },
  }

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: 'easeOut' as const },
  }

  return (
    <div className="main-invitation">
      <Header />
      
      {/* Детские фото — polaroid стиль, влетают с боков */}
      <section className="childhood-photos" ref={photosRef}>
        <div className="polaroid-scene">
          <motion.div 
            className="polaroid left"
            initial={{ x: '-100vw', rotate: -25 }}
            animate={photosInView ? { x: 0, rotate: -6 } : {}}
            transition={{ type: 'spring', stiffness: 60, damping: 15, duration: 2 }}
          >
            <div className="polaroid-frame">
              <img src="/images/photo_2026-02-24_21.57.00.jpg" alt="Полина" />
            </div>
            <p className="polaroid-caption">
              Интересно, кто будет<br />моим мужем,<br />когда я вырасту?
            </p>
          </motion.div>

          <motion.div 
            className="polaroid right"
            initial={{ x: '100vw', rotate: 25 }}
            animate={photosInView ? { x: 0, rotate: 5 } : {}}
            transition={{ type: 'spring', stiffness: 60, damping: 15, duration: 2, delay: 1.3 }}
          >
            <div className="polaroid-frame">
              <img src="/images/photo_2026-02-24_21.57.02.jpg" alt="Максим" />
            </div>
            <p className="polaroid-caption">Им буду я!</p>
          </motion.div>
        </div>
      </section>

      {/* Фото-разделитель */}
      <section className="photo-divider" style={{backgroundImage: 'url(/images/photo_2026-02-24_21.58.50.jpeg)'}}></section>
      
      {/* Приглашение */}
      <div className="hero-section">
        <motion.div className="invitation-content" {...fadeUp}>
          <motion.p className="greeting" {...fadeUp}>{getGreeting()}</motion.p>
          
          <div className="divider-line"></div>
          
          <motion.h1 
            className="couple-names"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: 'easeOut' as const, delay: 0.2 }}
          >
            Максим<span className="amp">&</span>Полина
          </motion.h1>
          
          <div className="divider-line"></div>
          
          <motion.p className="invitation-text" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }}>
            С радостью приглашаем вас<br />
            на наш <strong>День свадьбы</strong>
          </motion.p>
          
          <motion.div className="wedding-date" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.4 }}>
            <div className="date-number">31</div>
            <div className="date-details">
              <span className="month">июля</span>
              <span className="year">2026</span>
            </div>
          </motion.div>
          
          <motion.div className="countdown" {...fadeIn} transition={{ duration: 1.2, delay: 0.6 }}>
            <p className="countdown-title">До торжества осталось</p>
            <div className="countdown-timer">
              <div className="countdown-item">
                <span className="countdown-value">{timeLeft.days}</span>
                <span className="countdown-label">дней</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-value">{timeLeft.hours}</span>
                <span className="countdown-label">часов</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-value">{timeLeft.minutes}</span>
                <span className="countdown-label">минут</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-value">{timeLeft.seconds}</span>
                <span className="countdown-label">секунд</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Место проведения */}
      <motion.section 
        className="venue-section" 
        style={{backgroundImage: 'url(/images/photo_2026-02-24_21.58.46.jpeg)'}}
        {...fadeIn}
      >
        <div className="venue-overlay">
          <motion.div className="venue-content" {...fadeUp}>
            <p className="section-label">Место проведения</p>
            <h2>Ресторан "Карс"</h2>
            <div className="divider-line dark"></div>
            <p className="venue-address">
              Колхозная ул., 19А<br />
              Козельск
            </p>
            <motion.a 
              href="https://yandex.ru/navi/org/kars/14431688074?si=6g4hbz55aq7mc0zf7wpbzj1xwr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="venue-link"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Построить маршрут
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Тайминг */}
      <section className="timeline-section">
        <motion.p className="section-label" {...fadeUp}>Программа дня</motion.p>
        <div className="divider-line"></div>
        <div className="timeline">
          {[
            { time: '14:45', text: 'Сбор гостей' },
            { time: '15:00', text: 'Свадебная церемония' },
            { time: '16:30', text: 'Банкет' },
            { time: '22:30', text: 'Финал' },
          ].map((item, i) => (
            <motion.div 
              key={item.time} 
              className="timeline-item"
              {...staggerItem}
              transition={{ duration: 0.5, ease: 'easeOut' as const, delay: i * 0.15 }}
            >
              <span className="timeline-time">{item.time}</span>
              <span className="timeline-dot"></span>
              <span className="timeline-text">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Дресс-код */}
      <motion.section 
        className="dresscode-section" 
        style={{backgroundImage: 'url(/images/photo_2026-02-24_21.58.48.jpeg)'}}
        {...fadeIn}
      >
        <div className="dresscode-overlay">
          <motion.div {...fadeUp}>
            <p className="section-label light">Дресс-код</p>
            <h2>Коктейльный стиль</h2>
            <div className="divider-line light"></div>
          </motion.div>
          <motion.div className="dresscode-details" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
            <div className="dresscode-item">
              <p className="dresscode-who">Для него</p>
              <p className="dresscode-what">Костюм</p>
            </div>
            <div className="dresscode-item">
              <p className="dresscode-who">Для неё</p>
              <p className="dresscode-what">Коктейльное платье</p>
            </div>
          </motion.div>
          <motion.p className="color-palette-label" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }}>Палитра</motion.p>
          <motion.div 
            className="color-palette"
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
          >
            {['#EDC9CA','#B5B5A1','#C6D4CE','#B3BFE6','#DECCCA','#E4A6B8','#C5C89F','#D1CDC5','#D3CCE3','#D4A5E5'].map((color, i) => (
              <motion.span
                key={color}
                className="color-dot"
                style={{background: color}}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.07, ease: 'backOut' as const }}
              />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Важная информация */}
      <section className="special-requests">
        <div className="request-cards">
          <motion.div 
            className="request-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' as const }}
          >
            <p className="section-label">Вместо цветов</p>
            <div className="divider-line short"></div>
            <p>
              Мы будем рады бутылке хорошего вина<br />
              или шампанского вместо букета цветов
            </p>
          </motion.div>
          
          <motion.div 
            className="request-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' as const, delay: 0.15 }}
          >
            <p className="section-label">Только для взрослых</p>
            <div className="divider-line short"></div>
            <p>
              Просим с пониманием отнестись к тому,<br />
              что это будет вечер только для взрослых
            </p>
          </motion.div>
        </div>
      </section>

      {/* Дедлайн и RSVP */}
      <motion.section 
        className="rsvp-section" 
        style={{backgroundImage: 'url(/images/photo_2026-02-24_21.58.50.jpeg)'}}
        {...fadeIn}
      >
        <div className="rsvp-overlay">
          <motion.div {...fadeUp}>
            <p className="section-label light">Подтвердите присутствие</p>
            <h2>до 15 июля 2026</h2>
            <div className="divider-line light"></div>
            <p className="rsvp-subtitle">
              Пожалуйста, заполните короткую форму,<br />
              чтобы мы могли подготовить всё для вас
            </p>
            <motion.button 
              className="rsvp-button"
              onClick={() => navigate('/survey')}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              Заполнить форму
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  )
}

export default MainInvitation
