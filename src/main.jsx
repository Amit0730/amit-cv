import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Classic / Old Website Components
import ClassicHome from './components/classic/ClassicHome';

// New AI Multi-Agent Website Components
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Footer from './components/Footer';
import MultiAgentEngine from './components/MultiAgentEngine';
import { BuildEngineProvider } from './context/BuildEngineContext';

// Shared Pages
import ProjectDetail from './pages/ProjectDetail';
import CVPage from './pages/CVPage';
import MoreProjectsPage from './pages/MoreProjectsPage';
import CursorGlow from './components/CursorGlow';
import './index.css';

// The New AI Multi-Agent Website Page
const NewAgentWebsite = () => (
    <BuildEngineProvider>
        {/* Interactive Mouse Trail & Spotlight */}
        <CursorGlow />

        {/* 12 Collaborative AI Agent Cursors & Delivery Engine */}
        <MultiAgentEngine />

        <div className="app-container agent-website-root">
            <Navigation />
            <main>
                <Hero />
                <About />
                <Projects />
            </main>
            <Footer />
        </div>
    </BuildEngineProvider>
);

// The Classic / Live Main Website Page
const OldClassicWebsite = () => (
    <>
        <CursorGlow />
        <ClassicHome />
    </>
);

const App = () => {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL || '/'}>
            <Routes>
                {/* Route /: The Original / Classic Main Website */}
                <Route path="/" element={<OldClassicWebsite />} />

                {/* Route /new: The New AI Multi-Agent Website */}
                <Route path="/new" element={<NewAgentWebsite />} />
                <Route path="/new-website" element={<NewAgentWebsite />} />

                {/* Other dedicated pages */}
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/cv" element={<CVPage />} />
                <Route path="/more" element={<MoreProjectsPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
