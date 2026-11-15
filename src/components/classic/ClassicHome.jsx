import React from 'react';
import ClassicNavigation from './ClassicNavigation';
import ClassicHero from './ClassicHero';
import ClassicAbout from './ClassicAbout';
import ClassicProjects from './ClassicProjects';
import ClassicFooter from './ClassicFooter';

const ClassicHome = () => {
    return (
        <div className="app-container classic-portfolio-root">
            <ClassicNavigation />
            <main>
                <ClassicHero />
                <ClassicAbout />
                <ClassicProjects />
            </main>
            <ClassicFooter />
        </div>
    );
};

export default ClassicHome;
