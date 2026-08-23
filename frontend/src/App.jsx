import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { PortfolioProvider } from './context/PortfolioContext.jsx'
import Navbar        from './components/Navbar'
import Hero          from './components/sections/Hero'
import About         from './components/sections/About'
import Skills        from './components/sections/Skills'
import Projects      from './components/sections/Projects'
import Achievements  from './components/sections/Achievements'
import CodingProfiles from './components/sections/CodingProfiles'
import Certifications from './components/sections/Certifications'
import Contact       from './components/sections/Contact'
import Footer        from './components/Footer'
import ScrollToTop   from './components/ScrollToTop'
import CursorSpotlight from './components/CursorSpotlight'
import NotFound      from './pages/NotFound'

function Portfolio({ isDark, toggle }) {
  return (
    <>
      <CursorSpotlight />
      <Navbar isDark={isDark} toggleTheme={toggle} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <CodingProfiles />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default function App() {
  const { isDark, toggle } = useTheme()

  return (
    <PortfolioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio isDark={isDark} toggle={toggle} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
  )
}
