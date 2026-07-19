// home.js — logique de la page d'accueil (Chamber of Commerce)

// ⚠️ Ta clé API OpenWeatherMap (peut prendre jusqu'à 2h avant activation)
const WEATHER_API_KEY = "b70cdbe07f947776a3208a0577864ffc";

// Coordonnées de Port-au-Prince, Haïti
const LATITUDE = 18.5944;
const LONGITUDE = -72.3074;

// ---------- Menu hamburger ----------

const hamburgerBtn = document.querySelector("#hamburger");
const primaryNav = document.querySelector("#primaryNav");

hamburgerBtn.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  hamburgerBtn.classList.toggle("open", isOpen);
  hamburgerBtn.setAttribute("aria-expanded", isOpen);
});

// ---------- Footer : date de dernière modification + année ----------

document.querySelector("#copyrightYear").textContent = new Date().getFullYear();

document.querySelector("#lastModified").textContent =
  `Dernière modification : ${document.lastModified}`;

// ---------- Météo (OpenWeatherMap) ----------

const weatherContainer = document.querySelector("#weatherContainer");

const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌫️",
};

function getWeatherIcon(condition) {
  return weatherIcons[condition] || "🌤️";
}

async function getCurrentWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&lang=fr&appid=${WEATHER_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erreur météo actuelle : ${response.status}`);
  }

  return response.json();
}

async function getForecast() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&lang=fr&appid=${WEATHER_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erreur prévisions : ${response.status}`);
  }

  return response.json();
}

// L'API "forecast" renvoie des données toutes les 3h sur 5 jours.
// On extrait une entrée par jour (autour de midi) pour obtenir 3 jours distincts.
function extractThreeDayForecast(forecastData) {
  const dailyEntries = forecastData.list.filter((entry) =>
    entry.dt_txt.includes("12:00:00")
  );
  return dailyEntries.slice(0, 3);
}

function formatDayLabel(dateTimeText) {
  const date = new Date(dateTimeText);
  return date.toLocaleDateString("fr-FR", { weekday: "long" });
}

async function displayWeather() {
  try {
    const [current, forecast] = await Promise.all([
      getCurrentWeather(),
      getForecast(),
    ]);

    const threeDayForecast = extractThreeDayForecast(forecast);

    const forecastHTML = threeDayForecast
      .map((day) => {
        const label = formatDayLabel(day.dt_txt);
        const icon = getWeatherIcon(day.weather[0].main);
        const temp = Math.round(day.main.temp);
        return `
          <div class="forecast-day">
            <p class="forecast-label">${label}</p>
            <p class="forecast-icon">${icon}</p>
            <p class="forecast-temp">${temp}°C</p>
          </div>
        `;
      })
      .join("");

    weatherContainer.innerHTML = `
      <div class="weather-current">
        <p class="weather-icon">${getWeatherIcon(current.weather[0].main)}</p>
        <p class="weather-temp">${Math.round(current.main.temp)}°C</p>
        <p class="weather-desc">${current.weather[0].description}</p>
      </div>
      <div class="weather-forecast">
        ${forecastHTML}
      </div>
    `;
  } catch (error) {
    weatherContainer.innerHTML = `<p class="loading-message">Météo indisponible pour le moment.</p>`;
    console.error("Erreur lors du chargement de la météo :", error);
  }
}

// ---------- Spotlights (membres or/argent, aléatoires) ----------

const spotlightContainer = document.querySelector("#spotlightContainer");

const levelLabels = {
  1: "Membre",
  2: "Argent",
  3: "Or",
};

function pickRandomSpotlights(members, count) {
  const eligible = members.filter((member) => member.membershipLevel >= 2);
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function createSpotlightCard(member) {
  const card = document.createElement("article");
  card.classList.add("spotlight-card", `level-${member.membershipLevel}`);

  card.innerHTML = `
    <img src="images/${member.image}" alt="Logo de ${member.name}" class="spotlight-logo" loading="lazy" />
    <h3>${member.name}</h3>
    <span class="member-badge level-${member.membershipLevel}">${levelLabels[member.membershipLevel]}</span>
    <p>${member.sector}</p>
    <p>${member.phone}</p>
    <p>${member.address}</p>
    <a href="${member.website}" target="_blank" rel="noopener">${member.website}</a>
  `;

  return card;
}

async function displaySpotlights() {
  try {
    const response = await fetch("data/members.json");

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    const spotlightCount = Math.random() < 0.5 ? 2 : 3;
    const spotlights = pickRandomSpotlights(data.members, spotlightCount);

    spotlightContainer.innerHTML = "";
    spotlights.forEach((member) => {
      spotlightContainer.appendChild(createSpotlightCard(member));
    });
  } catch (error) {
    spotlightContainer.innerHTML = `<p class="loading-message">Impossible de charger les membres pour le moment.</p>`;
    console.error("Erreur lors du chargement de members.json :", error);
  }
}

// ---------- Lancement ----------

displayWeather();
displaySpotlights();