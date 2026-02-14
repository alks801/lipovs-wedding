function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p className="footer-text">С любовью, Максим и Полина</p>
        <p className="footer-year">{currentYear}</p>
      </div>
    </footer>
  )
}

export default Footer
