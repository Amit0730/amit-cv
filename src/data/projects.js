export const projectsData = [
    {
        id: 'expensy',
        title: 'Expensy',
        description: 'A comprehensive expense tracking application with automatic offline UPI transaction tracking, intelligent categorization, and analytics dashboards. It is built to help users seamlessly manage their finances on the go without relying on constant internet connectivity.',
        tags: ['Next.js', 'Capacitor', 'Android Native', 'Firebase'],
        link: '#',
        apkLink: `${import.meta.env.BASE_URL}apks/expensy-debug.apk`,
        version: '1.0.9',
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
    }
];
