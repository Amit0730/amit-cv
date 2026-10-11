export const projectsData = [
    {
        id: 'expensy',
        title: 'Expensy',
        description: 'A privacy-first, offline-first personal financial management suite engineered for instant transaction tracking, deterministic mathematical budgeting, and AI-powered intelligence. Features a realistic 3D shallow-water physics engine responding to real-world phone tilt and touch ripples, global custom gallery photo wallpapers behind frosted glassmorphic cards, on-device Google ML Kit OCR receipt scanning with Gemini Vision fallback, certified CFP-grade AI Advisor chat, voice expense logging, Safe-to-Spend™ daily spend pacing, live multi-asset Total Net Worth tracking, split bills & dodge groups with UPI settlement, 8 radical UI design languages (Neomorphism, Glassmorphism, Claymorphism, etc.), and encrypted multi-device Google Firebase synchronization.',
        tags: ['Next.js 14', 'Capacitor', 'Android Native', '3D Physics', 'Firebase', 'Google ML Kit', 'Gemini AI', 'Razorpay UPI'],
        link: '#',
        apkLink: `${import.meta.env.BASE_URL}apks/Expensy_v1.2.5.apk`,
        version: '1.2.5',
        gallery: []
    },
    {
        id: 'aesthetic-clock',
        title: 'Aesthetic Clock',
        description: 'A premium, full-screen aesthetic clock experience. It features glassmorphism UI, hidden productivity tools (Timer & Alarm), and a "Study Focus" mode that uses completely local, offline AI (MediaPipe Face Landmarker) to track eye movement and wake the user up via alarm if they fall asleep.',
        tags: ['React', 'Vite', 'MediaPipe AI', 'Glassmorphism'],
        link: `${import.meta.env.BASE_URL}aesthetic-time/index.html`,
        apkLink: `${import.meta.env.BASE_URL}apks/clock-app-debug.apk`,
        gallery: []
    },
    {
        id: 'smart-management-system',
        title: 'Smart Management System',
        description: 'A modern, dark-themed hospital and healthcare management system (MediCore). Features interactive patient records, doctor scheduling, department tracking, pharmacy management, and real-time medical dashboard metrics.',
        tags: ['Tailwind CSS', 'JavaScript', 'Live Demo', 'Hospital System'],
        link: 'https://amit0730.github.io/Smart-Management-System/',
        gallery: []
    }
];

export const allWorkspaceProjects = [
    {
        id: 'expensy',
        title: 'Expensy',
        folder: 'ISA / expensy',
        category: 'Mobile & FinTech',
        condition: 'Working',
        description: 'Privacy-first offline personal financial suite with 3D water physics, receipt OCR scanning, certified CFP-grade AI Advisor, and encrypted Firebase sync.',
        tags: ['Next.js 14', 'Capacitor', 'Android Native', '3D Physics', 'Firebase', 'Gemini AI'],
        link: '/project/expensy',
        isInternalRoute: true,
        featured: true
    },
    {
        id: 'aesthetic-clock',
        title: 'Aesthetic Clock',
        folder: 'ISA / clock-app',
        category: 'Productivity & AI',
        condition: 'Working',
        description: 'Full-screen aesthetic clock with offline MediaPipe Face Landmarker AI to monitor study drowsiness and trigger alarms.',
        tags: ['React', 'Vite', 'MediaPipe AI', 'Glassmorphism'],
        link: '/project/aesthetic-clock',
        isInternalRoute: true,
        featured: true
    },
    {
        id: 'smart-management-system',
        title: 'Smart Management System',
        folder: 'Smart-Management-System',
        category: 'Web Systems',
        condition: 'Working',
        description: 'Modern hospital and clinic management dashboard (MediCore) with patient records, doctor scheduling, and real-time metrics.',
        tags: ['Tailwind CSS', 'JavaScript', 'Live Demo', 'Hospital System'],
        link: 'https://amit0730.github.io/Smart-Management-System/',
        featured: true
    },
    {
        id: 'campus-energy-intelligence',
        title: 'Campus Energy Intelligence & Anomaly Detection',
        folder: 'supervised learning / GitHub_WebApp',
        category: 'AI & Machine Learning',
        condition: 'Working',
        description: 'Campus energy consumption forecasting & anomaly detection system achieving XGBoost R² = 0.8855, 95.1% directional accuracy, and 99.64% precision.',
        tags: ['Python', 'Streamlit', 'XGBoost', 'Scikit-Learn', 'Pandas'],
        link: 'https://campus-energy-intelligence.streamlit.app',
        github: 'https://github.com/Amit0730/campus-energy-intelligence-and-anomaly-detection',
        featured: false
    },
    {
        id: 'dbscan-disaster-hotspots',
        title: 'Disaster Response Hotspot Clustering (SIH26030)',
        folder: 'unsupervised learning',
        category: 'AI & Machine Learning',
        condition: 'Working',
        description: 'Geodesic Haversine DBSCAN spatial clustering platform analyzing drone thermal anomalies and visual probabilities for tactical search & rescue.',
        tags: ['React 19', 'FastAPI', 'DBSCAN', 'Leaflet GIS', 'Scikit-Learn'],
        link: '#',
        featured: false
    },
    {
        id: 'ai-trio-synthesizer',
        title: 'AI Trio Synthesizer (ulti-trio)',
        folder: 'ulti-trio',
        category: 'Tools & Extensions',
        condition: 'Working',
        description: 'Multi-LLM Chrome Extension side panel enabling simultaneous prompting and real-time answer synthesis across Gemini, Claude, and ChatGPT.',
        tags: ['Chrome Extension (MV3)', 'Gemini AI', 'Claude', 'ChatGPT', 'JavaScript'],
        link: '#',
        featured: false
    },
    {
        id: 'cam-recognizer',
        title: 'Cam Recognizer Desktop',
        folder: 'cam-recognizer',
        category: 'AI & Computer Vision',
        condition: 'Working',
        description: 'AI-powered desktop vision application running local TensorFlow.js COCO-SSD object recognition models inside an Electron wrapper.',
        tags: ['TensorFlow.js', 'COCO-SSD', 'Electron', 'Vite'],
        link: '#',
        featured: false
    },
    {
        id: 'heat-cam',
        title: 'Heat Cam',
        folder: 'heat-cam',
        category: 'Mobile Apps',
        condition: 'Working',
        description: 'Mobile thermal imaging simulation and visual camera filter application engineered with Capacitor and native Android support.',
        tags: ['Capacitor', 'Android Native', 'Vite', 'Lucide'],
        link: '#',
        featured: false
    },
    {
        id: 'romantic-secret-proposal',
        title: 'Romantic Secret Proposal Experience (luv)',
        folder: 'luv',
        category: 'Web Experiences',
        condition: 'Working',
        description: 'Interactive single-page web experience with floating canvas particles, physics-based dodging button, passcode unlock, and confetti celebration.',
        tags: ['HTML5 Canvas', 'Vanilla JS', 'CSS3 Physics', 'GitHub Pages'],
        link: '#',
        featured: false
    },
    {
        id: 'habytix',
        title: 'Habytix',
        folder: 'ISA / Habytix',
        category: 'Mobile & Productivity',
        condition: 'Working',
        description: 'Modern cross-platform habit tracker and goal progress manager engineered with Next.js 15, React 19, and Capacitor.',
        tags: ['Next.js 15', 'React 19', 'Capacitor', 'Tailwind CSS v4', 'TypeScript'],
        link: '#',
        featured: false
    },
    {
        id: 'audixa',
        title: 'Audixa - AI Music Experience',
        folder: 'ISA / Audixa',
        category: 'Media & Web',
        condition: 'Working',
        description: 'Immersive AI audio experience and music streaming player platform built with Node.js, Express, and interactive audio controls.',
        tags: ['Node.js', 'Express', 'AI Audio', 'JavaScript'],
        link: '#',
        featured: false
    },
    {
        id: 'boredo',
        title: 'Boredo Gaming Hub',
        folder: 'ISA / boredo',
        category: 'Games & Web',
        condition: 'Working',
        description: 'Premium offline arcade gaming collection featuring Dino Run, Fruit Slicer, Neon Snake, and Candy Match in glassmorphic UI.',
        tags: ['Next.js', 'React', 'Capacitor', 'Canvas Games'],
        link: '#',
        featured: false
    },
    {
        id: 'fun-o',
        title: 'Fun-o Gaming Hub',
        folder: 'ISA / Fun-o',
        category: 'Games & Mobile',
        condition: 'Working',
        description: 'Universal gaming and entertainment portal built for mobile & web with instant interactive arcade mini-games.',
        tags: ['Next.js', 'Android Native', 'Interactive Web Games'],
        link: '#',
        featured: false
    },
    {
        id: 'isa-ai',
        title: 'ISA-AI Neural Assistant',
        folder: 'ISA / ISA-AI',
        category: 'AI & Automation',
        condition: 'Working',
        description: 'Neural voice assistant and automated smart command agent designed for intelligent speech processing and device workflows.',
        tags: ['Python', 'Android Native', 'Neural Voice', 'NLP'],
        link: '#',
        featured: false
    },
    {
        id: 'linko',
        title: 'Linko Cross-Device Sync',
        folder: 'ISA / linko',
        category: 'Networking & Tools',
        condition: 'Working',
        description: 'High-speed local peer-to-peer cross-device file sharing and clipboard synchronization suite.',
        tags: ['Next.js', 'Android', 'WebRTC', 'Local P2P'],
        link: '#',
        featured: false
    },
    {
        id: 'touch-app',
        title: 'Touch App',
        folder: 'ISA / touch',
        category: 'Tools & UI',
        condition: 'Working',
        description: 'Minimalist multi-touch gesture analyzer and display responsiveness verification web tool.',
        tags: ['React 18', 'Vite', 'Lucide React'],
        link: '#',
        featured: false
    },
    {
        id: 'isa-vpn',
        title: 'ISA-VPN',
        folder: 'ISA / ISA-VPN',
        category: 'Networking & Security',
        condition: 'Working',
        description: 'Secure encrypted proxy and networking tunnel prototype designed for private traffic routing.',
        tags: ['Python', 'Encrypted Proxy', 'Tunneling'],
        link: '#',
        featured: false
    },
    {
        id: 'books-ppt',
        title: "Book's PPT Suite",
        folder: "ISA / Book's Ppt",
        category: 'Tools & Web',
        condition: 'Working',
        description: 'Interactive slide presentation and educational material viewer optimized for mobile and desktop screens.',
        tags: ['HTML5', 'Android Native', 'Presentation Engine'],
        link: '#',
        featured: false
    },
    {
        id: 'amit0730-profile',
        title: 'Amit0730 Developer Profile',
        folder: 'ISA / Amit0730-profile',
        category: 'Profile & Portfolio',
        condition: 'Working',
        description: 'Comprehensive developer showcase featuring dynamic GitHub analytics, technology matrix, and repository badges.',
        tags: ['Markdown', 'GitHub Actions', 'SVG Badges'],
        link: 'https://github.com/Amit0730',
        featured: false
    },
    {
        id: 'amit-cv',
        title: 'Amit-CV Portfolio & CV',
        folder: 'ISA / amit-cv',
        category: 'Web Systems',
        condition: 'Working',
        description: 'Production developer portfolio featuring interactive laser borders, cursor spotlight shaders, and integrated CV document viewer.',
        tags: ['React', 'Vite', 'Framer Motion', 'Lucide React'],
        link: 'https://amit0730.github.io/amit-cv/',
        featured: false
    }
];
