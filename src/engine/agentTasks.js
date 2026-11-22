// ============================================================================
// 12 Functional Cursor Agents & Structured Task Catalog
// Repairing the Multi-Agent Website Construction System
// ============================================================================

export const AGENT_ROSTER = [
    {
        id: 'agent-layout',
        name: 'Layout',
        color: '#F59E0B',
        textColor: '#000000',
        role: 'layout',
        zone: { minXRel: 0.05, maxXRel: 0.95, minY: 20, maxY: 110 },
        vocab: ['align: 16px', 'grid: 12-col', 'snap container', 'flex: row', 'structure: ok']
    },
    {
        id: 'agent-typography',
        name: 'Typography',
        color: '#22C55E',
        textColor: '#FFFFFF',
        role: 'typography',
        zone: { minXRel: 0.08, maxXRel: 0.45, minY: 150, maxY: 380 },
        vocab: ['typeset: 700', 'kerning: -1px', 'line-height: 1.1', 'font: Outfit', 'typeset ✓']
    },
    {
        id: 'agent-copy',
        name: 'Copy',
        color: '#06B6D4',
        textColor: '#FFFFFF',
        role: 'copy',
        zone: { minXRel: 0.08, maxXRel: 0.48, minY: 250, maxY: 440 },
        vocab: ['typing bio', 'editorial pass', 'copy text', 'pitch ready', 'tone: active']
    },
    {
        id: 'agent-media',
        name: 'Media',
        color: '#F97316',
        textColor: '#FFFFFF',
        role: 'media',
        zone: { minXRel: 0.38, maxXRel: 0.62, minY: 160, maxY: 520 },
        vocab: ['mount portrait', 'aspect: 4:5', 'laser border', 'asset: webp', 'media live']
    },
    {
        id: 'agent-style',
        name: 'Style',
        color: '#EAB308',
        textColor: '#000000',
        role: 'style',
        zone: { minXRel: 0.35, maxXRel: 0.65, minY: 180, maxY: 520 },
        vocab: ['theme: dark', 'glow: cyan', 'glassmorphism', 'backdrop-blur', 'palette ok']
    },
    {
        id: 'agent-spacing',
        name: 'Spacing',
        color: '#10B981',
        textColor: '#FFFFFF',
        role: 'spacing',
        zone: { minXRel: 0.58, maxXRel: 0.92, minY: 25, maxY: 180 },
        vocab: ['measure: 24px', 'gap: 32px', 'padding check', 'align baseline', 'spacing ok']
    },
    {
        id: 'agent-resize',
        name: 'Resize',
        color: '#84CC16',
        textColor: '#000000',
        role: 'resize',
        zone: { minXRel: 0.08, maxXRel: 0.36, minY: 400, maxY: 540 },
        vocab: ['drag handle', '340 × 430', 'resize box', 'dimensions: ok', 'snap bounds']
    },
    {
        id: 'agent-component',
        name: 'Component',
        color: '#3B82F6',
        textColor: '#FFFFFF',
        role: 'component',
        zone: { minXRel: 0.68, maxXRel: 0.94, minY: 200, maxY: 480 },
        vocab: ['mount card', 'stats: 40.', 'badge: Working', 'unit tests', 'component ready']
    },
    {
        id: 'agent-navigation',
        name: 'Navigation',
        color: '#8B5CF6',
        textColor: '#FFFFFF',
        role: 'navigation',
        zone: { minXRel: 0.15, maxXRel: 0.85, minY: 15, maxY: 85 },
        vocab: ['nav pill', 'route: #track', 'link check', 'anchor: #work', 'nav valid']
    },
    {
        id: 'agent-motion',
        name: 'Motion',
        color: '#EC4899',
        textColor: '#FFFFFF',
        role: 'motion',
        zone: { minXRel: 0.08, maxXRel: 0.38, minY: 360, maxY: 560 },
        vocab: ['spring test', 'stiffness: 130', 'easeOut', 'motion ready', 'damping: 18']
    },
    {
        id: 'agent-interaction',
        name: 'Interaction',
        color: '#2563EB',
        textColor: '#FFFFFF',
        role: 'interaction',
        zone: { minXRel: 0.08, maxXRel: 0.55, minY: 460, maxY: 600 },
        vocab: ['hover test', 'focus ring', 'click ripple', 'cta feedback', 'interaction ok']
    },
    {
        id: 'agent-review',
        name: 'Review',
        color: '#EF4444',
        textColor: '#FFFFFF',
        role: 'review',
        zone: { minXRel: 0.65, maxXRel: 0.95, minY: 100, maxY: 400 },
        vocab: ['audit pass ✓', 'verify layout', 'dom inspect', 'sign-off ✓', 'ready to ship']
    }
];

// ============================================================================
// Concrete Construction Tasks across All Portfolio Sections
// ============================================================================

export const INITIAL_TASKS = [
    // ------------------------------------------------------------------------
    // PHASE A: HERO SECTION (Runs on Initial Boot)
    // ------------------------------------------------------------------------
    {
        id: 'task-hero-nav',
        agentId: 'agent-navigation',
        targetId: 'builder-hero-nav',
        section: 'hero',
        action: 'navigation',
        label: 'snapping navbar',
        corner: 'tc',
        duration: 1.1,
        dependencies: []
    },
    {
        id: 'task-hero-bg',
        agentId: 'agent-style',
        targetId: 'builder-hero-bg',
        section: 'hero',
        action: 'style',
        label: 'stamping PORTFOLIO',
        corner: 'center',
        duration: 1.2,
        dependencies: []
    },
    {
        id: 'task-hero-name',
        agentId: 'agent-typography',
        targetId: 'builder-hero-name',
        section: 'hero',
        action: 'type',
        text: 'AMIT KUMAR SINGH.',
        label: 'typesetting headline',
        corner: 'br',
        duration: 1.4,
        dependencies: []
    },
    {
        id: 'task-hero-role',
        agentId: 'agent-copy',
        targetId: 'builder-hero-role',
        section: 'hero',
        action: 'copy',
        text: 'SOFTWARE ENGINEER & AI BUILDER',
        label: 'typing role headline',
        corner: 'br',
        duration: 1.2,
        dependencies: ['task-hero-name']
    },
    {
        id: 'task-hero-pitch',
        agentId: 'agent-copy',
        targetId: 'builder-hero-pitch',
        section: 'hero',
        action: 'copy',
        text: 'I build intelligent systems, mobile applications, and AI-assisted workflows that actually ship. Engineering student at LPU with proven experience building production-ready architectures from brief to live deployment.',
        label: 'authoring pitch bio',
        corner: 'br',
        duration: 1.3,
        dependencies: ['task-hero-role']
    },
    {
        id: 'task-hero-photo-resize',
        agentId: 'agent-resize',
        targetId: 'builder-hero-photo',
        section: 'hero',
        action: 'resize',
        startDims: { w: 260, h: 330 },
        targetDims: { w: 340, h: 430 },
        label: 'dragging handle (340×430)',
        corner: 'br',
        duration: 1.3,
        dependencies: []
    },
    {
        id: 'task-hero-photo-media',
        agentId: 'agent-media',
        targetId: 'builder-hero-photo',
        section: 'hero',
        action: 'media',
        label: 'mounting portrait & lasers',
        corner: 'tr',
        duration: 1.2,
        dependencies: ['task-hero-photo-resize']
    },
    {
        id: 'task-hero-stats',
        agentId: 'agent-component',
        targetId: 'builder-hero-stats',
        section: 'hero',
        action: 'component',
        label: 'assembling metrics (40.)',
        corner: 'tr',
        duration: 1.2,
        dependencies: []
    },
    {
        id: 'task-hero-spacing',
        agentId: 'agent-spacing',
        targetId: 'builder-hero-pitch',
        section: 'hero',
        action: 'spacing',
        spacingLabel: 'gap: 24px',
        label: 'inspecting padding (24px)',
        corner: 'bl',
        duration: 0.9,
        dependencies: ['task-hero-pitch']
    },
    {
        id: 'task-hero-cta',
        agentId: 'agent-layout',
        targetId: 'builder-hero-cta',
        section: 'hero',
        action: 'component',
        label: 'placing CTA buttons',
        corner: 'br',
        duration: 1.0,
        dependencies: ['task-hero-pitch']
    },
    {
        id: 'task-hero-interact',
        agentId: 'agent-interaction',
        targetId: 'builder-hero-cta',
        section: 'hero',
        action: 'interact',
        label: 'hover test [VIEW WORK]',
        corner: 'tl',
        duration: 0.9,
        dependencies: ['task-hero-cta']
    },
    {
        id: 'task-hero-review',
        agentId: 'agent-review',
        targetId: 'builder-hero-name',
        section: 'hero',
        action: 'review',
        label: 'QA audit (Hero PASS ✓)',
        corner: 'tr',
        duration: 1.1,
        dependencies: ['task-hero-name', 'task-hero-photo-media', 'task-hero-stats']
    },

    // ------------------------------------------------------------------------
    // PHASE B: TRACK RECORD SECTION (Triggered on Scroll into Track Record)
    // ------------------------------------------------------------------------
    {
        id: 'task-track-title',
        agentId: 'agent-typography',
        targetId: 'builder-track-title',
        section: 'track',
        action: 'type',
        text: 'BUILT FAST. SHIPPED REAL.',
        label: 'typesetting track record',
        corner: 'br',
        duration: 1.2,
        dependencies: []
    },
    {
        id: 'task-track-stat',
        agentId: 'agent-component',
        targetId: 'builder-track-stat',
        section: 'track',
        action: 'component',
        label: 'mounting stat (40. tests)',
        corner: 'tr',
        duration: 1.1,
        dependencies: ['task-track-title']
    },
    {
        id: 'task-track-timeline',
        agentId: 'agent-copy',
        targetId: 'builder-track-timeline',
        section: 'track',
        action: 'copy',
        label: 'assembling 5 experiences',
        corner: 'tr',
        duration: 1.2,
        dependencies: ['task-track-title']
    },
    {
        id: 'task-track-motion',
        agentId: 'agent-motion',
        targetId: 'builder-track-timeline',
        section: 'track',
        action: 'motion',
        label: 'motion test (spring: 130)',
        corner: 'tl',
        duration: 0.9,
        dependencies: ['task-track-timeline']
    },
    {
        id: 'task-track-spacing',
        agentId: 'agent-spacing',
        targetId: 'builder-track-stat',
        section: 'track',
        action: 'spacing',
        spacingLabel: 'grid gap: 4.5rem',
        label: 'measuring column gap',
        corner: 'bl',
        duration: 0.8,
        dependencies: ['task-track-stat']
    },
    {
        id: 'task-track-review',
        agentId: 'agent-review',
        targetId: 'builder-track-stat',
        section: 'track',
        action: 'review',
        label: 'QA audit (Track PASS ✓)',
        corner: 'tr',
        duration: 1.0,
        dependencies: ['task-track-title', 'task-track-stat', 'task-track-timeline']
    },

    // ------------------------------------------------------------------------
    // PHASE C: SELECTED WORK / PROJECTS (Triggered on Scroll into Projects)
    // ------------------------------------------------------------------------
    {
        id: 'task-projects-header',
        agentId: 'agent-typography',
        targetId: 'builder-projects-header',
        section: 'projects',
        action: 'type',
        text: 'WORK THAT SHIPS.',
        label: 'typesetting WORK THAT SHIPS',
        corner: 'br',
        duration: 1.2,
        dependencies: []
    },
    {
        id: 'task-project-card-0-resize',
        agentId: 'agent-resize',
        targetId: 'builder-project-card-0',
        section: 'projects',
        action: 'resize',
        startDims: { w: 310, h: 380 },
        targetDims: { w: 360, h: 440 },
        label: 'resizing Expensy card',
        corner: 'br',
        duration: 1.2,
        dependencies: ['task-projects-header']
    },
    {
        id: 'task-project-card-0-comp',
        agentId: 'agent-component',
        targetId: 'builder-project-card-0',
        section: 'projects',
        action: 'component',
        label: 'snapping Expensy tags',
        corner: 'tr',
        duration: 1.1,
        dependencies: ['task-project-card-0-resize']
    },
    {
        id: 'task-project-card-1-comp',
        agentId: 'agent-component',
        targetId: 'builder-project-card-1',
        section: 'projects',
        action: 'component',
        label: 'mounting Aesthetic Clock',
        corner: 'tr',
        duration: 1.1,
        dependencies: ['task-projects-header']
    },
    {
        id: 'task-project-card-2-comp',
        agentId: 'agent-component',
        targetId: 'builder-project-card-2',
        section: 'projects',
        action: 'component',
        label: 'mounting MediCore System',
        corner: 'tr',
        duration: 1.1,
        dependencies: ['task-projects-header']
    },
    {
        id: 'task-project-card-3-style',
        agentId: 'agent-style',
        targetId: 'builder-project-card-3',
        section: 'projects',
        action: 'style',
        label: 'styling More Projects card',
        corner: 'center',
        duration: 1.0,
        dependencies: ['task-projects-header']
    },
    {
        id: 'task-projects-interact',
        agentId: 'agent-interaction',
        targetId: 'builder-project-card-0',
        section: 'projects',
        action: 'interact',
        label: 'card hover test',
        corner: 'tl',
        duration: 0.9,
        dependencies: ['task-project-card-0-comp']
    },
    {
        id: 'task-projects-review',
        agentId: 'agent-review',
        targetId: 'builder-project-card-0',
        section: 'projects',
        action: 'review',
        label: 'QA audit (Projects PASS ✓)',
        corner: 'tr',
        duration: 1.1,
        dependencies: ['task-project-card-0-comp', 'task-project-card-1-comp', 'task-project-card-2-comp']
    },

    // ------------------------------------------------------------------------
    // PHASE D: SKILLS & MANIFESTO (Triggered on Scroll into Skills)
    // ------------------------------------------------------------------------
    {
        id: 'task-skills-edu',
        agentId: 'agent-layout',
        targetId: 'builder-skills-edu',
        section: 'skills',
        action: 'component',
        label: 'placing education & skills',
        corner: 'br',
        duration: 1.1,
        dependencies: []
    },
    {
        id: 'task-skills-principles',
        agentId: 'agent-copy',
        targetId: 'builder-skills-principles',
        section: 'skills',
        action: 'copy',
        label: 'authoring 4 principles',
        corner: 'br',
        duration: 1.2,
        dependencies: []
    },
    {
        id: 'task-skills-manifesto',
        agentId: 'agent-style',
        targetId: 'builder-skills-manifesto',
        section: 'skills',
        action: 'style',
        label: 'coloring manifesto card',
        corner: 'tr',
        duration: 1.1,
        dependencies: []
    },
    {
        id: 'task-skills-review',
        agentId: 'agent-review',
        targetId: 'builder-skills-manifesto',
        section: 'skills',
        action: 'review',
        label: 'QA audit (Skills PASS ✓)',
        corner: 'tr',
        duration: 1.0,
        dependencies: ['task-skills-edu', 'task-skills-principles', 'task-skills-manifesto']
    },

    // ------------------------------------------------------------------------
    // PHASE E: ABOUT SECTION (Triggered on Scroll into About)
    // ------------------------------------------------------------------------
    {
        id: 'task-about-title',
        agentId: 'agent-typography',
        targetId: 'builder-about-title',
        section: 'about',
        action: 'type',
        text: 'NOT JUST CODE. CODE THAT SHIPS.',
        label: 'typesetting about headline',
        corner: 'br',
        duration: 1.2,
        dependencies: []
    },
    {
        id: 'task-about-photo',
        agentId: 'agent-media',
        targetId: 'builder-about-photo',
        section: 'about',
        action: 'media',
        label: 'mounting LPU portrait',
        corner: 'br',
        duration: 1.2,
        dependencies: ['task-about-title']
    },
    {
        id: 'task-about-bio',
        agentId: 'agent-copy',
        targetId: 'builder-about-bio',
        section: 'about',
        action: 'copy',
        label: 'editorializing bio narrative',
        corner: 'tr',
        duration: 1.3,
        dependencies: ['task-about-title']
    },
    {
        id: 'task-about-review',
        agentId: 'agent-review',
        targetId: 'builder-about-bio',
        section: 'about',
        action: 'review',
        label: 'QA audit (About PASS ✓)',
        corner: 'tr',
        duration: 1.0,
        dependencies: ['task-about-title', 'task-about-photo', 'task-about-bio']
    },

    // ------------------------------------------------------------------------
    // PHASE F: NAVIGATION & FOOTER (Triggered on Scroll to Contact / Footer)
    // ------------------------------------------------------------------------
    {
        id: 'task-footer-nav',
        agentId: 'agent-navigation',
        targetId: 'contact',
        section: 'footer',
        action: 'navigation',
        label: 'validating social endpoints',
        corner: 'center',
        duration: 1.1,
        dependencies: []
    },
    {
        id: 'task-final-review',
        agentId: 'agent-review',
        targetId: 'builder-hero-nav',
        section: 'footer',
        action: 'review',
        label: 'FINAL AUDIT (100% PASS ✓)',
        corner: 'tr',
        duration: 1.2,
        dependencies: ['task-about-review', 'task-footer-nav']
    }
];
