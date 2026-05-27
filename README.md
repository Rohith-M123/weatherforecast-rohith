# Premium Weather Dashboard & Analytics Suite 🌤️

A premium, high-fidelity, responsive web application designed to bring weather forecasting, real-time diagnostics, and predictive analytics to the next level. Featuring a modern glassmorphic interface, dynamic clock-aware particle backgrounds, persistent location favoriting, and interactive charting overlays.

---

## 🌟 Key Highlights & Features

### 1. Unified Glassmorphic UI/UX
*   **Frosted Glass Aesthetics**: Elegant semi-transparent containers built on modern HSL color palettes, thin border outlines, backdrop blurring (`backdrop-filter: blur(16px)`), and soft 3D elevations.
*   **Outfit Typography**: Fitted with **Outfit** via Google Fonts, providing high-end geometric headings and modern readability.
*   **Micro-Animations**: Magnetic scale transitions, floating glow effects, pulsating indicator dots, and smooth slide routes.

### 2. Cinematic Background Animations
Changing locations or current times dynamically morphs the primary body gradients and triggers custom ambient particles:
*   **Sunny / Clear Sky**: Spawns a glowing solar radial orb pulsating softly across the screen.
*   **Volumetric Clouds**: Spawns multiple parallax clouds floating horizontally at different heights, scales, and blur rates.
*   **Diagonal Wind Rain**: Tilts falling rain vectors diagonally (`12deg`) to simulate active wind elements.
*   **3D Parallax Snow**: Swaying snowflakes drifting in a soft sine motion, complete with camera blur-depth offsets for larger flakes.
*   **Electrical Storm**: Heavy storm rain overlayed with rapid, random lightning strikes that periodically light up the screen.
*   **Rolling Fogbanks**: Drifts two distinct bands of horizontal rolling fog shifting at offset speeds (`35s` & `55s`).

### 3. Clock-Aware Welcome Particles (Login & Launcher)
Instead of static backgrounds, the onboarding portal and dashboard hub analyze your local computer clock to adapt:
*   **Daytime (6 AM - 5 PM)**: Bright sky-blue presets with sun rays and drifting clouds.
*   **Dusk (5 PM - 7 PM)**: Warm sunset twilight overlayed with rolling ground fog layers.
*   **Nighttime (7 PM - 6 AM)**: Deep indigo starry slates with a slow, sparkling drift of 25 star points.

### 4. Floating Light & Dark Mode Toggle
*   **State Persistence**: Toggle buttons appear on all page corners, saving your selection in `localStorage` (`weather_theme`) to prevent screen-flashing on page load.
*   **Hue Preservation**: Toggling into Light Mode shifts weather backgrounds into bright, pastel versions of their meteorological colors.
*   **Instant Redraws**: Forecast charts listen to theme-change events and instantly rebuild grid lines, ticks, tooltips, and gradients to match the active theme.

### 5. Detailed Current Diagnostics (`current.html`)
*   **Parallel OWM Queries**: Resolves current weather coordinates and **Air Quality Indexes (AQI)** simultaneously using parallel promises.
*   **Rich Analytics Grid**: Thermometer card for Feels Like, compass bearings for Wind Speed (e.g. *NE*, *SW* derived from degrees), pressure gauges, visibility meters, and local sun rise/set times translated using OWM timezone offsets.
*   **Pinned Locations Sidebar**: A persistent pinning board (`pinned_weather_locations` in `localStorage`). Pinned cards show live temp previews, click to load weather instantly, and feature one-click deletion triggers.

### 6. Predictive Forecast Charting (`forecast.html`)
*   **Daily Mid-day Filter**: Standardizes forecast feeds to exactly 5 distinct predictive daily cards (taking mid-day readouts), mapping raw date indices to Day names (e.g. "Monday", "Tuesday").
*   **Chart.js Spline Curves**: Integrated **Chart.js** via CDN. Plots temperature trends (amber spline curve) and humidity variables (sky-blue spline curve) decorated with elegant transparent gradient fills.

---

## 📂 Architecture & File Tree

*   `login1.html` — Premium entry portal with guest bypass structures and inline validators.
*   `index.html` — Dynamic launcher greeting hub with time-aware greeting messages and security session guards.
*   `current.html` / `current.js` — Two-column live weather diagnostics board, favorites sidebar, and AQI parsing.
*   `forecast.html` / `forecast.js` — 5-day card layouts, Chart.js grid, and active theme-toggle listeners.
*   `style.css` — Consolidated style system containing dark/light theme properties, HSL weather classes, glassmorphism, and cinematic particle keyframes.

---

## 🚀 Quick Start Guide

1.  **Run Locally**: Open **[login1.html](login1.html)** directly in your browser.
2.  **Authenticate**: Use standard form parameters (Username: 5+ characters, Email: ending in `@gmail.com`, Password: standard safety rules) or click **"Continue as Guest"** for instant bypass.
3.  **Search**: Type a city name (e.g., "Paris", "Tokyo", "Cairo") or select **"Geolocate"** to load live conditions.
4.  **Pin Favorites**: Click the star/pin button in the weather card to save your city into the persistent sidebar list.
5.  **Analytics**: Tap "5-Day Forecasting" to view the predictive forecast cards and the interactive spline chart.
6.  **Toggle Theme**: Tap the floating circular toggle button in the top-right corner to transition between light and dark visual states.

---

## 🛠️ Technology Stack

*   **HTML5 & CSS3**: Structured elements, HSL design systems, translucent glass cards, and highly-optimized keyframe animations.
*   **Vanilla JS (ES6+)**: Custom dynamic DOM modules, asynchronous parallel promise fetches, time formats, and local storage state managers.
*   **Chart.js (via CDN)**: Fully responsive canvas renderers and interactive data overlays.
*   **Outfit Google Font**: Sharp, modern geometric typography.
