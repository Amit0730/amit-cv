import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Footer from './components/Footer'
import ProjectDetail from './pages/ProjectDetail'

function App() {
  return (
    <Router basename="/amit-cv/">
      <Routes>
        <Route path="/" element={
          <div className="app-container">
            <Navigation />
            <main>
              <Hero />
              <About />
              <Projects />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </Router>
  )
}

export default App
