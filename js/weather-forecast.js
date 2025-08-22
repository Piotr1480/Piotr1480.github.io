let chart;
let refreshInterval;

function getUnitSymbol(units) {
    return units === "imperial" ? "°F" : "°C";
}

async function getWeather(city, units) {
    try {
        const res = await fetch(
            `https://openweather-getweather-city-units.moj3ai.workers.dev?city=${city}&units=${units}`
        );
        if (!res.ok) {
            document.getElementById("weather").innerHTML = `<p style="color:red">Nie znaleziono miasta</p>`;
            return;
        }
        const data = await res.json();
        renderCurrentWeather(data, units);
    } catch (err) {
        document.getElementById("weather").innerHTML = `<p style="color:red">${err.message}</p>`;
    }
}

async function getWeatherByCoords(lat, lon, units) {
    try {
        const res = await fetch(
            `https://openweather-getweather-coordsunits.moj3ai.workers.dev?lat=${lat}&lon=${lon}&units=${units}`
        );
        if (!res.ok) {
            document.getElementById("weather").innerHTML = `<p style="color:red">Błąd lokalizacji</p>`;
            return;
        }
        const data = await res.json();
        renderCurrentWeather(data, units);
        document.getElementById("city").value = data.name;
        localStorage.setItem("lastCity", data.name);
        await getForecast(data.name, units);
        startAutoRefresh(data.name, units);
    } catch (err) {
        document.getElementById("weather").innerHTML = `<p style="color:red">${err.message}</p>`;
    }
}

/**
 * Renderuje aktualne dane pogodowe
 * @param {Object} data - Dane pogodowe z API
 * @param {Object} data.coord - Współrzędne geograficzne
 * @param {number} data.coord.lon - Długość geograficzna
 * @param {number} data.coord.lat - Szerokość geograficzna
 * @param {Array<Object>} data.weather - Tablica informacji pogodowych
 * @param {number} data.weather.0.id
 * @param {string} data.weather.0.main
 * @param {string} data.weather.0.description
 * @param {string} data.weather.0.icon
 * @param {string} data.base - Źródło danych
 * @param {Object} data.main - Główne parametry pogodowe
 * @param {number} data.main.temp - Temperatura
 * @param {number} data.main.feels_like - Temperatura odczuwalna
 * @param {number} data.main.temp_min - Minimalna temperatura
 * @param {number} data.main.temp_max - Maksymalna temperatura
 * @param {number} data.main.pressure - Ciśnienie atmosferyczne
 * @param {number} data.main.humidity - Wilgotność powietrza
 * @param {number} data.main.sea_level - Ciśnienie na poziomie morza
 * @param {number} data.main.grnd_level - Ciśnienie na poziomie gruntu
 * @param {number} data.visibility - Widoczność w metrach
 * @param {Object} data.wind - Informacje o wietrze
 * @param {number} data.wind.speed - Prędkość wiatru w m/s
 * @param {number} data.wind.deg - Kierunek wiatru w stopniach
 * @param {Object} data.clouds - Informacje o zachmurzeniu
 * @param {number} data.clouds.all - Zachmurzenie w procentach
 * @param {number} data.dt - Czas pomiaru (Unix timestamp)
 * @param {Object} data.sys - Informacje systemowe
 * @param {number} data.sys.type - Typ systemu
 * @param {number} data.sys.id - ID systemu
 * @param {string} data.sys.country - Kod kraju
 * @param {number} data.sys.sunrise - Czas wschodu słońca (Unix timestamp)
 * @param {number} data.sys.sunset - Czas zachodu słońca (Unix timestamp)
 * @param {number} data.timezone - Strefa czasowa w sekundach
 * @param {number} data.id - ID miasta
 * @param {string} data.name - Nazwa miasta
 * @param {number} data.cod - Kod odpowiedzi API
 * @param {string} units - Jednostki temperatury ('metric' lub 'imperial')
 */
function renderCurrentWeather(data, units) {
    const unitSymbol = getUnitSymbol(units);
    document.getElementById("weather").innerHTML = `
        <p>${data.name}, ${data.sys.country}</p>
        <img id="icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
        <p>${data.main.temp.toFixed(1)}${unitSymbol}</p>
        <p>${data.weather[0].description}</p>
        <p>🌡️ Min: ${data.main.temp_min}${unitSymbol} | Max: ${data.main.temp_max}${unitSymbol}</p>
        <p>
          💨 Wiatr: ${
                units === "imperial"
                    ? `${data.wind.speed} mph`
                    : `${(data.wind.speed * 3.6).toFixed(1)} km/h`
            }
        </p>
      `;
}

async function getForecast(city, units) {
    try {
        const res = await fetch(
            `https://openweather-getforecast-cityunits.moj3ai.workers.dev?city=${city}&units=${units}`
        );
        if (!res.ok) {
            document.getElementById("weather").innerHTML = `<p style="color:red">Błąd lokalizacji</p>`;
            return;
        }
        const data = await res.json();

        const days = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "short" });
            if (!days[day]) days[day] = [];
            days[day].push(item);
        });

        const forecastDiv = document.getElementById("forecast");
        forecastDiv.innerHTML = "<h2>📅 Prognoza na 5 dni</h2>";

        const unitSymbol = getUnitSymbol(units);

        Object.keys(days).slice(0, 5).forEach(day => {
            const avgTemp = (days[day].reduce((sum, d) => sum + d.main.temp, 0) / days[day].length).toFixed(1);
            const icon = days[day][0].weather[0].icon;
            forecastDiv.innerHTML += `
            <div class="day">
              <strong>${day}</strong> - ${avgTemp}${unitSymbol}
              <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">
            </div>
          `;
        });

        const labels = data.list.map(item => {
            const date = new Date(item.dt * 1000);
            return date.toLocaleString("pl-PL", { weekday: "short", hour: "2-digit" });
        });

        const temps = data.list.map(item => item.main.temp);

        if (chart) chart.destroy();
        const ctx = document.getElementById("chart").getContext("2d");
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: `Temperatura ${unitSymbol}`,
                    data: temps,
                    borderColor: "#0077ff",
                    backgroundColor: "rgba(0,119,255,0.2)",
                    tension: 0.3,
                    fill: true,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: true } },
                scales: {
                    x: { ticks: { autoSkip: true, maxTicksLimit: 10 } }
                }
            }
        });
    } catch (err) {
        document.getElementById("forecast").innerHTML = `<p style="color:red">${err.message}</p>`;
    }
}

async function loadWeather(city, units) {
    if (!city) return;
    document.getElementById("weather").innerHTML = "⏳ Ładowanie...";
    document.getElementById("forecast").innerHTML = "";
    await getWeather(city, units);
    await getForecast(city, units);
}

// Osobna funkcja do ładowania z auto-refresh
async function loadWeatherWithAutoRefresh(city, units) {
    await loadWeather(city, units);
    startAutoRefresh(city, units);
}

// Poprawiona funkcja auto-refresh
function startAutoRefresh(city, units) {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(async () => {
        try {
            await loadWeather(city, units); // Wywołuje tylko ładowanie, bez ponownego startAutoRefresh
        } catch (error) {
            console.error('Błąd podczas automatycznego odświeżania:', error);
        }
    }, 1800000); // 30 minut
}

document.getElementById("getWeather").addEventListener("click", async () => {
    const city = document.getElementById("city").value.trim();
    const units = document.getElementById("units").value;
    if (!city) return;
    localStorage.setItem("lastCity", city);
    localStorage.setItem("units", units);
    await loadWeatherWithAutoRefresh(city, units);
});

document.getElementById("units").addEventListener("change", async () => {
    const city = document.getElementById("city").value.trim() || localStorage.getItem("lastCity");
    const units = document.getElementById("units").value;
    localStorage.setItem("units", units);
    if (city) await loadWeatherWithAutoRefresh(city, units);
});

window.addEventListener("DOMContentLoaded", async () => {
    const lastCity = localStorage.getItem("lastCity");
    const savedUnits = localStorage.getItem("units") || "metric";
    document.getElementById("units").value = savedUnits;

    if (lastCity) {
        document.getElementById("city").value = lastCity;
        try {
            await loadWeatherWithAutoRefresh(lastCity, savedUnits);
        } catch (error) {
            console.error('Błąd podczas ładowania ostatniego miasta:', error);
        }
    } else if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    await getWeatherByCoords(latitude, longitude, savedUnits);
                } catch (error) {
                    console.error('Błąd podczas pobierania pogody na podstawie lokalizacji:', error);
                }
            },
            () => {
                document.getElementById("weather").innerHTML = "<p style='color:red'>Brak zgody na lokalizację. Wpisz miasto ręcznie.</p>";
            }
        );
    }
});