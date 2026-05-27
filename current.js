// Check security session onboarding
const sessionUser = localStorage.getItem("weather_user");
if (!sessionUser) {
  window.location.href = "login1.html";
}

// API_KEY is now resolved globally from config.js


// DOM Element references
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const welcomeMessage = document.getElementById("welcome-message");
const loadingSpinner = document.getElementById("loading-spinner");
const weatherContent = document.getElementById("weather-data-content");

// Weather Card Elements
const weatherCityName = document.getElementById("weather-city-name");
const btnPinCity = document.getElementById("btn-pin-city");
const weatherCondition = document.getElementById("weather-condition");
const weatherIcon = document.getElementById("weather-icon");
const weatherTemp = document.getElementById("weather-temp");

// Detail Metric Elements
const statFeelsLike = document.getElementById("stat-feels-like");
const statHumidity = document.getElementById("stat-humidity");
const statWind = document.getElementById("stat-wind");
const statAqi = document.getElementById("stat-aqi");
const statPressure = document.getElementById("stat-pressure");
const statVisibility = document.getElementById("stat-visibility");
const statSunrise = document.getElementById("stat-sunrise");
const statSunset = document.getElementById("stat-sunset");

// Favorites Elements
const pinnedLocationsContainer = document.getElementById("pinned-locations");

// State Variable to track active city coordinates
let currentCityDetails = null;

// Inline Custom Toast Messages
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

// State Display Controller
const setDisplayState = (state) => {
  if (state === "welcome") {
    welcomeMessage.style.display = "flex";
    loadingSpinner.style.display = "none";
    weatherContent.style.display = "none";
  } else if (state === "loading") {
    welcomeMessage.style.display = "none";
    loadingSpinner.style.display = "block";
    weatherContent.style.display = "none";
  } else if (state === "content") {
    welcomeMessage.style.display = "none";
    loadingSpinner.style.display = "none";
    weatherContent.style.display = "block";
  }
};

// Dynamic Particle & Theme Engine
const updateDynamicAtmosphere = (weatherConditionGroup) => {
  // Reset previous background classes & particles
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
    
    // Inject Parallax Drifting Clouds
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
      
      // Depth of field blur for large flakes
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
  
  // Set body class
  document.body.classList.add(bodyClass);
};


// Local Time Offset Calculator
const formatLocalTime = (unixTime, timezoneOffsetSeconds) => {
  // Convert OWM UTC unix timestamp into the target city's actual time
  const localDate = new Date((unixTime + timezoneOffsetSeconds) * 1000);
  const hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? '0' + displayMinutes : minutes;
  
  // Returns string format: HH:MM AM/PM
  return `${displayHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
};

// Render weather metrics to UI
const renderWeatherData = (cityName, weatherData, pollutionData) => {
  currentCityDetails = {
    name: cityName,
    lat: weatherData.coord.lat,
    lon: weatherData.coord.lon,
    temp: (weatherData.main.temp - 273.15).toFixed(1)
  };
  
  // Parse weather details
  weatherCityName.innerText = `${weatherData.name}, ${weatherData.sys.country}`;
  weatherCondition.innerText = weatherData.weather[0].description;
  weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
  weatherTemp.innerText = `${(weatherData.main.temp - 273.15).toFixed(1)}°C`;
  
  // High detail statistics mapping
  statFeelsLike.innerText = `${(weatherData.main.feels_like - 273.15).toFixed(1)}°C`;
  statHumidity.innerText = `${weatherData.main.humidity}%`;
  
  // Wind Direction Degrees -> Named compass coordinates
  const deg = weatherData.wind.deg;
  let direction = "N";
  if (deg > 22.5 && deg <= 67.5) direction = "NE";
  else if (deg > 67.5 && deg <= 112.5) direction = "E";
  else if (deg > 112.5 && deg <= 157.5) direction = "SE";
  else if (deg > 157.5 && deg <= 202.5) direction = "S";
  else if (deg > 202.5 && deg <= 247.5) direction = "SW";
  else if (deg > 247.5 && deg <= 292.5) direction = "W";
  else if (deg > 292.5 && deg <= 337.5) direction = "NW";
  
  statWind.innerText = `${weatherData.wind.speed} m/s ${direction}`;
  statPressure.innerText = `${weatherData.main.pressure} hPa`;
  statVisibility.innerText = `${(weatherData.visibility / 1000).toFixed(1)} km`;
  
  // Sunrise/Sunset calculations with timezone
  const offset = weatherData.timezone;
  statSunrise.innerText = formatLocalTime(weatherData.sys.sunrise, offset);
  statSunset.innerText = formatLocalTime(weatherData.sys.sunset, offset);
  
  // Air Quality AQI mapping
  const aqiIndex = pollutionData?.list?.[0]?.main?.aqi || 3;
  const aqiMap = {
    1: { label: "Good", color: "#4ade80" },
    2: { label: "Fair", color: "#a3e635" },
    3: { label: "Moderate", color: "#fbbf24" },
    4: { label: "Poor", color: "#fb923c" },
    5: { label: "Very Poor", color: "#f87171" }
  };
  
  statAqi.innerText = `${aqiMap[aqiIndex].label} (${aqiIndex}/5)`;
  statAqi.style.color = aqiMap[aqiIndex].color;
  
  // Update ambient background elements
  updateDynamicAtmosphere(weatherData.weather[0].main);
  
  // Sync pinned star fill status
  updatePinButtonState();
  
  // Swap display block
  setDisplayState("content");
};

// Multi-Feed Async Fetch
const fetchDetailedWeather = (lat, lon, cityName) => {
  setDisplayState("loading");
  
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  
  Promise.all([
    fetch(weatherUrl).then(res => {
      if(!res.ok) throw new Error("Weather request failed");
      return res.json();
    }),
    fetch(pollutionUrl).then(res => {
      if(!res.ok) throw new Error("Air pollution request failed");
      return res.json();
    }).catch(() => null) // Fallback gracefully if AQI is blocked/unavailable
  ])
  .then(([weatherData, pollutionData]) => {
    renderWeatherData(cityName, weatherData, pollutionData);
  })
  .catch((err) => {
    setDisplayState("welcome");
    showToast("Failed to compile meteorological feed. Check connectivity.", true);
    console.error(err);
  });
};

// Geolocate by City Input Name
const fetchCoordinatesByName = () => {
  const city = cityInput.value.trim();
  if (!city) {
    showToast("Enter a location name first.", true);
    return;
  }
  
  setDisplayState("loading");
  
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        setDisplayState("welcome");
        showToast(`City not found: "${city}"`, true);
        return;
      }
      const { lat, lon, name } = data[0];
      fetchDetailedWeather(lat, lon, name);
    })
    .catch(() => {
      setDisplayState("welcome");
      showToast("Geocoding connection timed out.", true);
    });
};

// Geolocate by Browser Coordinates
const fetchCoordinatesByBrowser = () => {
  if (!navigator.geolocation) {
    showToast("Geolocation is not supported by your browser.", true);
    return;
  }
  
  setDisplayState("loading");
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      
      fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          const cityName = data[0]?.name || "Local Base";
          fetchDetailedWeather(latitude, longitude, cityName);
          showToast(`Located: ${cityName}`);
        })
        .catch(() => {
          // If reverse geo fails, load coordinates directly
          fetchDetailedWeather(latitude, longitude, "My Location");
        });
    },
    (error) => {
      setDisplayState("welcome");
      showToast("Access to device location coordinates denied.", true);
    }
  );
};

// Favorites Location Controller
const getPinnedLocations = () => {
  const data = localStorage.getItem("pinned_weather_locations");
  return data ? JSON.parse(data) : [];
};

const updatePinButtonState = () => {
  if (!currentCityDetails) return;
  const pinned = getPinnedLocations();
  const isPinned = pinned.some(loc => loc.name.toLowerCase() === currentCityDetails.name.toLowerCase());
  
  if (isPinned) {
    btnPinCity.style.color = "var(--accent-primary)";
    btnPinCity.querySelector("svg").setAttribute("fill", "var(--accent-primary)");
  } else {
    btnPinCity.style.color = "var(--text-secondary)";
    btnPinCity.querySelector("svg").setAttribute("fill", "none");
  }
};

const renderPinnedLocations = () => {
  const pinned = getPinnedLocations();
  pinnedLocationsContainer.innerHTML = "";
  
  if (pinned.length === 0) {
    pinnedLocationsContainer.innerHTML = `
      <p style="font-size: 0.9rem; color: var(--text-secondary); text-align: center; padding: 20px 0;">
        No pinned locations yet. Search a city and click the pin icon to save it!
      </p>
    `;
    return;
  }
  
  pinned.forEach(loc => {
    const card = document.createElement("div");
    card.className = "pinned-city-card";
    card.innerHTML = `
      <div class="city-details" style="flex: 1;">
        <h4>${loc.name}</h4>
        <p style="font-size:0.75rem; color: var(--text-secondary);">Lat: ${loc.lat.toFixed(2)} | Lon: ${loc.lon.toFixed(2)}</p>
      </div>
      <div style="display:flex; align-items:center; gap: 8px;">
        <span class="city-temp">${loc.temp}°C</span>
        <button class="btn-remove-pin" style="background:none; border:none; padding:4px; width:auto; margin-bottom:0; color:#ef4444; cursor:pointer;" title="Remove pin">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `;
    
    // Clicking card pulls up full dashboard
    card.addEventListener("click", (e) => {
      // Prevent clicking the delete button from opening details
      if (e.target.closest(".btn-remove-pin")) return;
      fetchDetailedWeather(loc.lat, loc.lon, loc.name);
      cityInput.value = loc.name;
    });
    
    // Bind pin deletion
    card.querySelector(".btn-remove-pin").addEventListener("click", () => {
      removePinnedLocation(loc.name);
    });
    
    pinnedLocationsContainer.appendChild(card);
  });
};

const togglePinStatus = () => {
  if (!currentCityDetails) return;
  const pinned = getPinnedLocations();
  const isPinned = pinned.some(loc => loc.name.toLowerCase() === currentCityDetails.name.toLowerCase());
  
  if (isPinned) {
    removePinnedLocation(currentCityDetails.name);
    showToast(`Removed ${currentCityDetails.name} from pinned locations.`);
  } else {
    pinned.push(currentCityDetails);
    localStorage.setItem("pinned_weather_locations", JSON.stringify(pinned));
    showToast(`Pinned ${currentCityDetails.name} to sidebar.`);
  }
  
  updatePinButtonState();
  renderPinnedLocations();
};

const removePinnedLocation = (name) => {
  const pinned = getPinnedLocations();
  const filtered = pinned.filter(loc => loc.name.toLowerCase() !== name.toLowerCase());
  localStorage.setItem("pinned_weather_locations", JSON.stringify(filtered));
  
  updatePinButtonState();
  renderPinnedLocations();
};

// Event Listeners initialization
searchButton.addEventListener("click", fetchCoordinatesByName);
locationButton.addEventListener("click", fetchCoordinatesByBrowser);
btnPinCity.addEventListener("click", togglePinStatus);

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchCoordinatesByName();
});

// Load pinned locations side panel immediately on boot
renderPinnedLocations();

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
  });

  document.body.appendChild(toggleBtn);
})();

