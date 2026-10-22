const weatherForm = document.querySelector(".weatherForm");
const card = document.querySelector(".card");
const cityInput = document.querySelector(".cityInput");
const apiKey = "";

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value;

  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      displayError(error);
    }
  } else {
    displayError("Enter a city");
  }
});

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could not fetch a data");
  }

  return await response.json();
}

function displayWeatherInfo(data) {
  const {
    name,
    main: { temp, humidity },
    weather: [{ id: weatherId, description, icon }],
    wind: { speed },
  } = data;

  card.textContent = "";
  card.style.display = "flex";
  card.dataset.theme = themeFor(weatherId);
  card.dataset.time = icon.endsWith("n") ? "night" : "day";

  const displayCity = document.createElement("h1");
  displayCity.textContent = name;
  displayCity.classList.add("cityDisplay");
  card.appendChild(displayCity);

  const displayTemp = document.createElement("p");
  displayTemp.textContent = `${(temp - 273.15).toFixed(1)}°C`;
  displayTemp.classList.add("tempDisplay");
  card.appendChild(displayTemp);

  const displayHumidity = document.createElement("p");
  displayHumidity.textContent = `${humidity}%`;
  displayHumidity.classList.add("humidityDisplay");
  card.appendChild(displayHumidity);

  const displayWind = document.createElement("p");
  displayWind.textContent = `${speed.toFixed(1)} km/h`;
  displayWind.classList.add("windDisplay");
  card.appendChild(displayWind);

  const descriptionDisplay = document.createElement("p");
  descriptionDisplay.textContent = description;
  descriptionDisplay.classList.add("descDisplay");
  card.appendChild(descriptionDisplay);

  getPokemonData(weatherId);
}

function displayError(message) {
  console.error(message);

  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  delete card.dataset.theme;
  delete card.dataset.time;
  card.appendChild(errorDisplay);
  card.style.display = "flex";
}

async function getPokemonData(weatherId) {
  const pokeName = pokemonName(weatherId);

  const pokemonApiUrl = `https://pokeapi.co/api/v2/pokemon/${pokeName}`;
  const responsePokeApi = await fetch(pokemonApiUrl);

  if (!responsePokeApi.ok) {
    throw new Error("Could not find Pokemon");
  }

  const pokeApiData = await responsePokeApi.json();
  const pokeApiSprite = await pokeApiData.sprites.front_default;

  const pokeSpriteDisplay = document.createElement("img");
  pokeSpriteDisplay.src = `${pokeApiSprite}`;
  pokeSpriteDisplay.alt = pokeName;
  pokeSpriteDisplay.classList.add("pokeSprite");
  card.appendChild(pokeSpriteDisplay);
}

function themeFor(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return "storm";
  if (weatherId >= 300 && weatherId < 600) return "rain";
  if (weatherId >= 600 && weatherId < 700) return "snow";
  if (weatherId >= 700 && weatherId < 800) return "fog";
  if (weatherId === 800) return "clear";
  if (weatherId <= 802) return "clouds";
  return "overcast";
}

function pokemonName(weatherId) {
  let pokeName;
  if (weatherId <= 200 && weatherId < 300) {
    pokeName = "pikachu";
  } else if (weatherId <= 300 && weatherId < 400) {
    pokeName = "squirtle";
  } else if (weatherId <= 500 && weatherId < 600) {
    pokeName = "magikarp";
  } else if (weatherId <= 600 && weatherId < 700) {
    pokeName = "sneasel";
  } else if (weatherId <= 700 && weatherId < 800) {
    pokeName = "gastly";
  } else if (weatherId === 800) {
    pokeName = "sunflora";
  } else if (weatherId >= 801 && weatherId < 810) {
    pokeName = "altaria";
  } else {
    pokeName = "ditto";
  }
  return pokeName;
}
