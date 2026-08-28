import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Footer from './components/Footer';
import ProjectDetail from './pages/ProjectDetail';
import CVPage from './pages/CVPage';
import CursorGlow from './components/CursorGlow';
import './index.css';

const Home = () => (
    <div className="app-container">
        <Navigation />
        <main>
            <Hero />
            <About />
            <Projects />
        </main>
        <Footer />
    </div>
);

const App = () => {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL || '/'}>
            {/* Interactive Mouse Trail & Ambient Spotlight */}
            <CursorGlow />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/cv" element={<CVPage />} />
            </Routes>
        </BrowserRouter>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
