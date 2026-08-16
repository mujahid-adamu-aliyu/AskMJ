AskMJ — Conversational AI Portfolio

A single-file, self-contained web app that reimagines the personal portfolio as a chat experience. Built for Mujahid Adamu Aliyu, AskMJ lets visitors ask an AI assistant about his background, skills, and projects instead of scrolling a static page.

Features
- Conversational chat interface powered by the Groq API, with three tonal modes — Casual, Professional, and Technical — each shaping how the AI responds
- Dedicated Projects and Skills tabs with expandable detail cards, proficiency bars, and tiered self-assessment notes
- Tag-based UI rendering system that lets AI replies trigger native components (contact buttons, suggestion chips) inline in the conversation
- Responsive dual-layout design: floating glass islands with a slide-in nav drawer on mobile, persistent glass sidebar on desktop
- Light/dark theming via CSS custom properties, with a full "glass" frosted-blur aesthetic throughout
- Chat persistence via localStorage, with a confirm-before-delete Clear Chat flow
- Animated welcome screen with staggered entrance and icon-based suggestion chips to guide first-time visitors

Stack
HTML, CSS, and vanilla JavaScript in a single file — no build step, no framework. Uses Phosphor Icons and Google Fonts (Poppins) via CDN, and the Groq API for chat completions.
