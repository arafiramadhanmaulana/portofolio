# Arafi Ramadhan Maulana Portfolio

This is the source code for my personal portfolio website, complete with a fully custom-built analytics dashboard. It serves as a centralized showcase of my professional experience, academic background, and technical projects in Data Science and Software Engineering.

Beyond being a static portfolio, this project includes a robust visitor tracking engine that securely records session metrics, device information, and geographic data, which are then visualized in a dedicated SaaS-like admin portal.

## Features

- **Personal Portfolio:** Clean, dark-mode focused landing page to showcase professional identity.
- **Experience Timeline:** Interactive and responsive timeline for work and organizational history.
- **Projects Showcase:** Grid-based presentation of data science and web development projects.
- **Skills Section:** Organized breakdown of technical stacks, tools, and methodologies.
- **Website Analytics Dashboard:** A private, authenticated admin portal (`/admin.html`) built from scratch.
- **Visitor Tracking:** Real-time data capture (IP, device, browser, OS, duration, interaction clicks) stored seamlessly in a database.
- **Responsive Design:** Optimized layout for desktop, tablet, and mobile viewing.
- **Dark Mode:** Native dark UI prioritizing accessibility and modern aesthetics.

## Tech Stack

The project is built intentionally with core, lightweight web technologies to maintain absolute control over performance and structure without heavy bundlers.

**Frontend:**
- HTML5
- CSS3 (Vanilla, custom grid/flexbox layouts)
- JavaScript (ES6+, modular processing)

**Analytics & Visualizations:**
- Chart.js (Data visualization)
- GSAP (GreenSock Animation Platform)

**Backend & Database:**
- Supabase (PostgreSQL for session logs, REST API integration)

**Deployment:**
- Vercel (CI/CD pipeline)

## Project Structure

```text
portofolio/
├── assets/
│   ├── css/
│   │   ├── admin.css       # Custom styles for the SaaS analytics dashboard
│   │   └── portfolio.css   # Main styles for the public portfolio
│   ├── images/             # All static images, certificates, and thumbnails
│   └── js/
│       ├── admin.js        # Dashboard engine (auth, metrics aggregation, charts)
│       ├── script.js       # Main portfolio logic (GSAP animations, form handling)
│       └── tracker.js      # Background script for visitor telemetry
├── admin.html              # Secure analytics dashboard
├── index.html              # Main public portfolio page
├── package.json            # Development dependencies (Vite)
├── vercel.json             # Vercel deployment configuration
└── robots.txt              # Search engine crawler instructions
```

## Installation

To run this project locally, make sure you have Node.js installed. We use Vite as a fast local development server.

1. Clone the repository:
```bash
git clone https://github.com/arafiramadhanmaulana/portofolio.git
cd portofolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will start immediately, usually accessible at `http://localhost:5173/`. 
*Note: Ensure you have an active internet connection if you want the visitor tracker and analytics API (Supabase) to function correctly during local testing.*
