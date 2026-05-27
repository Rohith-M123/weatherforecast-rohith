// Check security session onboarding
const sessionUser = localStorage.getItem("weather_user");
if (!sessionUser) {
  window.location.href = "login1.html";
}

// Resolve the API Key safely with a local try/catch block
let localApiKey = "";
try {
  localApiKey = API_KEY;
} catch (e) {
  localApiKey = "";
}

// Global API URL Builder (supports Local file fallback vs Vercel Serverless proxy)
const getApiUrl = (params) => {
  const isLocal = window.location.hostname === "localhost" || 
                  window.location.hostname === "127.0.0.1" || 
                  window.location.protocol === "file:";
  
  if (isLocal) {
    const key = localApiKey || "e301e76642e5894f2182a3398948469c"; // Fallback to default key if config fails to resolve
    
    if (params.endpoint === "direct") {
      return `https://api.openweathermap.org/geo/1.0/direct?q=${params.q}&limit=${params.limit || 1}&appid=${key}`;
    } else if (params.endpoint === "reverse") {
      return `https://api.openweathermap.org/geo/1.0/reverse?lat=${params.lat}&lon=${params.lon}&limit=${params.limit || 1}&appid=${key}`;
    } else if (params.endpoint === "weather") {
      return `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&appid=${key}`;
    } else if (params.endpoint === "aqi") {
      return `https://api.openweathermap.org/data/2.5/air_pollution?lat=${params.lat}&lon=${params.lon}&appid=${key}`;
    } else if (params.endpoint === "forecast") {
      return `https://api.openweathermap.org/data/2.5/forecast?lat=${params.lat}&lon=${params.lon}&appid=${key}`;
    }
  } else {
    // Production (Vercel): Proxy all requests securely via Vercel Serverless Functions
    const query = new URLSearchParams(params).toString();
    return `/api/weather?${query}`;
  }
};

// DOM references
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const welcomeMessage = document.getElementById("welcome-message");
const loadingSpinner = document.getElementById("loading-spinner");
const forecastContent = document.getElementById("forecast-content");
const weatherCardsContainer = document.querySelector(".weather-cards");
const forecastHeader = document.getElementById("forecast-header");

// Chart.js instance tracking
let analyticsChartInstance = null;

// Custom sliding toast system
const showToast = (message, isError = false) => {
  const toast = document.getElementById("toast");
  const text = document.getElementById("toast-message");
  text.innerText = message;
  
  if (isError) {
    toast.classList.add("error");
    toast.querySelector("svg").innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>';
  } else {
    toast.classList.remove("error");
    toast.querySelector("svg").innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
  }
  
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
};

// Layout Display state manager
const setDisplayState = (state) => {
  if (state === "welcome") {
    welcomeMessage.style.display = "flex";
    loadingSpinner.style.display = "none";
    forecastContent.style.display = "none";
  } else if (state === "loading") {
    welcomeMessage.style.display = "none";
    loadingSpinner.style.display = "block";
    forecastContent.style.display = "none";
  } else if (state === "content") {
    welcomeMessage.style.display = "none";
    loadingSpinner.style.display = "none";
    forecastContent.style.display = "block";
  }
};

// Date day name parser
const getDayOfWeekName = (dateString) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const date = new Date(dateString);
  return days[date.getDay()];
};

const getShortDayOfWeekName = (dateString) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(dateString);
  return days[date.getDay()];
};

// Dynamic Particle & Theme Engine
const updateDynamicAtmosphere = (weatherConditionGroup) => {
  document.body.className = "";
  const container = document.getElementById("particles");
  container.innerHTML = "";
  
  let bodyClass = "clear-sky";
  const group = weatherConditionGroup.toLowerCase();
  
  if (group.includes("clear")) {
    bodyClass = "clear-sky";
    
    // Inject Pulsing Sun Overlay
    const sun = document.createElement("div");
    sun.className = "sunny-glow";
    container.appendChild(sun);
    
  } else if (group.includes("cloud")) {
    bodyClass = "clouds";
    
    // Inject Parallax Clouds
    for (let i = 0; i < 4; i++) {
      const cloud = document.createElement("div");
      cloud.className = "parallax-cloud";
      cloud.style.top = `${Math.random() * 45 + 5}%`;
      cloud.style.width = `${Math.random() * 240 + 160}px`;
      cloud.style.height = `${Math.random() * 90 + 50}px`;
      cloud.style.animationDuration = `${Math.random() * 60 + 80}s`;
      cloud.style.animationDelay = `-${Math.random() * 60}s`;
      cloud.style.opacity = `${Math.random() * 0.4 + 0.3}`;
      container.appendChild(cloud);
    }
    
  } else if (group.includes("rain") || group.includes("drizzle")) {
    bodyClass = "rain";
    
    // Inject Diagonal Raindrops
    const rainCount = 75;
    for (let i = 0; i < rainCount; i++) {
      const p = document.createElement("div");
      p.className = "raindrop";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `-${Math.random() * 100}px`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      p.style.animationDuration = `${Math.random() * 1.2 + 0.6}s`;
      p.style.opacity = `${Math.random() * 0.35 + 0.15}`;
      p.style.height = `${Math.random() * 20 + 35}px`;
      container.appendChild(p);
    }
    
  } else if (group.includes("snow")) {
    bodyClass = "snow";
    
    // Inject Swaying 3D Parallax Snowflakes
    const snowCount = 40;
    for (let i = 0; i < snowCount; i++) {
      const p = document.createElement("div");
      p.className = "snowflake";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `-${Math.random() * 50}px`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      p.style.animationDuration = `${Math.random() * 6 + 5}s`;
      
      const size = Math.random() * 6 + 2;
      p.style.width = p.style.height = `${size}px`;
      p.style.opacity = `${Math.random() * 0.7 + 0.3}`;
      
      if (size > 4.5) {
        p.style.filter = "blur(0.8px)";
      }
      
      container.appendChild(p);
    }
    
  } else if (group.includes("thunderstorm")) {
    bodyClass = "thunderstorm";
    
    // Inject lightning flash card
    const flash = document.createElement("div");
    flash.className = "lightning-flash";
    container.appendChild(flash);
    
    // Also inject heavy diagonal storm rain
    const rainCount = 90;
    for (let i = 0; i < rainCount; i++) {
      const p = document.createElement("div");
      p.className = "raindrop";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `-${Math.random() * 100}px`;
      p.style.animationDelay = `${Math.random() * 4}s`;
      p.style.animationDuration = `${Math.random() * 0.9 + 0.5}s`;
      p.style.opacity = `${Math.random() * 0.45 + 0.2}`;
      p.style.height = `${Math.random() * 25 + 45}px`;
      container.appendChild(p);
    }
    
  } else if (group.includes("mist") || group.includes("fog") || group.includes("haze")) {
    bodyClass = "mist";
    
    // Inject Dual Rolling Fog Systems
    const fog1 = document.createElement("div");
    fog1.className = "fog-layer";
    fog1.style.animationDuration = "35s";
    fog1.style.opacity = "0.75";
    container.appendChild(fog1);
    
    const fog2 = document.createElement("div");
    fog2.className = "fog-layer";
    fog2.style.animationDuration = "55s";
    fog2.style.height = "25%";
    fog2.style.opacity = "0.45";
    container.appendChild(fog2);
  }
  
  document.body.classList.add(bodyClass);
};


// Active chart data state tracker for live theme-toggle redraws
let activeChartData = null;

// Render forecasting curves to Canvas
const generateAnalyticsChart = (chartLabels, tempValues, humidityValues) => {
  const ctx = document.getElementById("analyticsChart").getContext("2d");
  
  // Clean overlap instances
  if (analyticsChartInstance) {
    analyticsChartInstance.destroy();
  }
  
  // Dynamic theme matching colors
  const isLight = document.body.classList.contains("light-theme");
  const labelColor = isLight ? "#475569" : "#cbd5e1";
  const gridColor = isLight ? "rgba(15, 23, 42, 0.06)" : "rgba(255, 255, 255, 0.06)";
  
  // Track chart data for dynamic redraws on theme toggle
  activeChartData = {
    labels: chartLabels,
    temps: tempValues,
    humidities: humidityValues
  };
  
  // Create beautiful background gradients
  const tempGradient = ctx.createLinearGradient(0, 0, 0, 250);
  tempGradient.addColorStop(0, "rgba(251, 191, 36, 0.35)");
  tempGradient.addColorStop(1, "rgba(251, 191, 36, 0.0)");
  
  const humGradient = ctx.createLinearGradient(0, 0, 0, 250);
  humGradient.addColorStop(0, "rgba(56, 189, 248, 0.25)");
  humGradient.addColorStop(1, "rgba(56, 189, 248, 0.0)");
  
  analyticsChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: tempValues,
          borderColor: "#fbbf24",
          backgroundColor: tempGradient,
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: "#fbbf24",
          pointBorderColor: isLight ? "#ffffff" : "rgba(255,255,255,0.8)",
          pointBorderWidth: 1.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: "y-temp"
        },
        {
          label: "Humidity (%)",
          data: humidityValues,
          borderColor: "#38bdf8",
          backgroundColor: humGradient,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: "#38bdf8",
          pointBorderColor: isLight ? "#ffffff" : "rgba(255,255,255,0.8)",
          pointBorderWidth: 1.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: "y-hum"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: labelColor,
            font: {
              family: "'Outfit', sans-serif",
              size: 11
            }
          }
        },
        tooltip: {
          backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(15, 23, 42, 0.9)",
          borderColor: isLight ? "rgba(15, 23, 42, 0.1)" : "rgba(255, 255, 255, 0.12)",
          borderWidth: 1,
          titleColor: isLight ? "#0f172a" : "#f8fafc",
          bodyColor: isLight ? "#475569" : "#cbd5e1",
          titleFont: { family: "'Outfit', sans-serif", size: 12 },
          bodyFont: { family: "'Outfit', sans-serif", size: 12 },
          padding: 10
        }
      },
      scales: {
        x: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: labelColor,
            font: { family: "'Outfit', sans-serif" }
          }
        },
        "y-temp": {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: "Temp (°C)",
            color: "#fbbf24",
            font: { family: "'Outfit', sans-serif", weight: "500" }
          },
          grid: {
            color: gridColor
          },
          ticks: {
            color: "#fbbf24",
            font: { family: "'Outfit', sans-serif" }
          }
        },
        "y-hum": {
          type: "linear",
          position: "right",
          title: {
            display: true,
            text: "Humidity (%)",
            color: "#38bdf8",
            font: { family: "'Outfit', sans-serif", weight: "500" }
          },
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            color: "#38bdf8",
            font: { family: "'Outfit', sans-serif" }
          }
        }
      }
    }
  });
};


// Render Forecast cards to list elements
const renderForecastData = (cityName, rawForecastList) => {
  // Sync page title banner
  forecastHeader.innerText = `5-Day Predictive Outlook for ${cityName}`;
  
  // Filter forecast lists (OWM outputs readings every 3 hours. We want one reading per day, ideally mid-day at 12:00 PM)
  const uniqueDays = [];
  const filteredDays = rawForecastList.filter(item => {
    const dateTime = item.dt_txt.split(" ");
    const date = dateTime[0];
    const hour = dateTime[1];
    
    // Pick the reading nearest to mid-day (12:00:00) or first reading of the day
    if (!uniqueDays.includes(date) && (hour === "12:00:00" || hour === "09:00:00" || hour === "15:00:00" || uniqueDays.length === 0)) {
      // Avoid adding consecutive duplicates from midnight check shifts
      if (!uniqueDays.includes(date)) {
        uniqueDays.push(date);
        return true;
      }
    }
    return false;
  });
  
  // Fallback: If filtered list is too small, grab direct index intervals
  let finalDays = filteredDays;
  if (finalDays.length < 5) {
    const backupDays = [];
    finalDays = rawForecastList.filter((item, idx) => {
      const date = item.dt_txt.split(" ")[0];
      if (idx % 8 === 0 && !backupDays.includes(date)) {
        backupDays.push(date);
        return true;
      }
      return false;
    });
  }
  
  // Take exactly 5 elements
  finalDays = finalDays.slice(0, 5);
  
  // Build forecasting cards DOM
  weatherCardsContainer.innerHTML = "";
  
  const chartLabels = [];
  const tempValues = [];
  const humidityValues = [];
  
  finalDays.forEach(day => {
    const dateStr = day.dt_txt.split(" ")[0];
    const dayName = getDayOfWeekName(dateStr);
    const shortDay = getShortDayOfWeekName(dateStr);
    const tempC = (day.main.temp - 273.15).toFixed(1);
    
    // Add arrays for chart mapping
    chartLabels.push(shortDay);
    tempValues.push(parseFloat(tempC));
    humidityValues.push(day.main.humidity);
    
    const card = document.createElement("li");
    card.className = "card";
    card.innerHTML = `
      <h3>${dayName}</h3>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon">
      <span class="temp">${tempC}°C</span>
      <p class="detail" style="text-transform: capitalize; font-weight: 500; color: var(--accent-primary); margin-top:2px;">${day.weather[0].description}</p>
      <div style="width: 100%; border-top: 1px solid var(--card-border); margin-top: 8px; padding-top: 8px; font-size: 0.75rem; color: var(--text-secondary); text-align: left; display: flex; flex-direction: column; gap: 4px;">
        <span style="display:flex; justify-content:space-between;"><span>Wind:</span><strong>${day.wind.speed} m/s</strong></span>
        <span style="display:flex; justify-content:space-between;"><span>Humid:</span><strong>${day.main.humidity}%</strong></span>
      </div>
    `;
    weatherCardsContainer.appendChild(card);
  });
  
  // Update ambient background based on the first forecast element (current/tomorrow outlook)
  updateDynamicAtmosphere(finalDays[0].weather[0].main);
  
  // Render Chart.js
  generateAnalyticsChart(chartLabels, tempValues, humidityValues);
  
  // Toggle UI block visible
  setDisplayState("content");
};

// Fetch 5-Day Forecast
const fetchForecastData = (lat, lon, cityName) => {
  setDisplayState("loading");
  
  const url = getApiUrl({ endpoint: "forecast", lat, lon });
  
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Forecast API request failed");
      return res.json();
    })
    .then(data => {
      renderForecastData(cityName, data.list);
    })
    .catch((err) => {
      setDisplayState("welcome");
      showToast("Failed to fetch 5-day predictive curves. Check OWM service status.", true);
      console.error(err);
    });
};

// City Input Search Resolution
const resolveCityCoordinates = () => {
  const city = cityInput.value.trim();
  if (!city) {
    showToast("Enter a location name first.", true);
    return;
  }
  
  setDisplayState("loading");
  
  fetch(getApiUrl({ endpoint: "direct", q: city, limit: 1 }))
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        setDisplayState("welcome");
        showToast(`City not found: "${city}"`, true);
        return;
      }
      const { lat, lon, name } = data[0];
      fetchForecastData(lat, lon, name);
    })
    .catch(() => {
      setDisplayState("welcome");
      showToast("Geocoding connection timed out.", true);
    });
};

// Browser Geolocation Search Resolution
const resolveBrowserCoordinates = () => {
  if (!navigator.geolocation) {
    showToast("Geolocation is not supported by your browser.", true);
    return;
  }
  
  setDisplayState("loading");
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      
      fetch(getApiUrl({ endpoint: "reverse", lat: latitude, lon: longitude, limit: 1 }))
        .then(res => res.json())
        .then(data => {
          const cityName = data[0]?.name || "Local Base";
          fetchForecastData(latitude, longitude, cityName);
          cityInput.value = cityName;
          showToast(`Located: ${cityName}`);
        })
        .catch(() => {
          fetchForecastData(latitude, longitude, "My Location");
        });
    },
    () => {
      setDisplayState("welcome");
      showToast("Access to device location coordinates denied.", true);
    }
  );
};

// Event Bindings
searchButton.addEventListener("click", resolveCityCoordinates);
locationButton.addEventListener("click", resolveBrowserCoordinates);

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") resolveCityCoordinates();
});

// Listen to theme changes to redraw the Chart.js with correct label colors instantly
window.addEventListener("themeChanged", () => {
  if (analyticsChartInstance && activeChartData) {
    generateAnalyticsChart(activeChartData.labels, activeChartData.temps, activeChartData.humidities);
  }
});

// Self-contained Theme & Toggle Injector
(() => {
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "theme-toggle-btn";
  toggleBtn.title = "Toggle Light/Dark Mode";
  toggleBtn.style.position = "fixed";
  toggleBtn.style.top = "20px";
  toggleBtn.style.right = "20px";
  toggleBtn.style.width = "44px";
  toggleBtn.style.height = "44px";
  toggleBtn.style.borderRadius = "50%";
  toggleBtn.style.background = "var(--card-bg)";
  toggleBtn.style.border = "1px solid var(--card-border)";
  toggleBtn.style.color = "var(--text-primary)";
  toggleBtn.style.display = "flex";
  toggleBtn.style.alignItems = "center";
  toggleBtn.style.justifyContent = "center";
  toggleBtn.style.cursor = "pointer";
  toggleBtn.style.zIndex = "1001";
  toggleBtn.style.boxShadow = "var(--shadow-sm)";
  toggleBtn.style.backdropFilter = "blur(10px)";
  toggleBtn.style.transition = "var(--transition)";

  const moonSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-primary);"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  const sunSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #fbbf24;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  const currentTheme = localStorage.getItem("weather_theme") || "dark";
  if (currentTheme === "light") {
    document.body.classList.add("light-theme");
    toggleBtn.innerHTML = moonSvg;
  } else {
    toggleBtn.innerHTML = sunSvg;
  }

  toggleBtn.addEventListener("mouseover", () => {
    toggleBtn.style.transform = "scale(1.1) rotate(15deg)";
    toggleBtn.style.borderColor = "var(--accent-primary)";
  });
  toggleBtn.addEventListener("mouseout", () => {
    toggleBtn.style.transform = "scale(1) rotate(0deg)";
    toggleBtn.style.borderColor = "var(--card-border)";
  });

  toggleBtn.addEventListener("click", () => {
    if (document.body.classList.contains("light-theme")) {
      document.body.classList.remove("light-theme");
      localStorage.setItem("weather_theme", "dark");
      toggleBtn.innerHTML = sunSvg;
    } else {
      document.body.classList.add("light-theme");
      localStorage.setItem("weather_theme", "light");
      toggleBtn.innerHTML = moonSvg;
    }
    // Dispatch event to redraw forecast chart with light/dark colors
    window.dispatchEvent(new CustomEvent("themeChanged"));
  });

  document.body.appendChild(toggleBtn);
})();

