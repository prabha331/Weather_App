import React, { useState, useRef } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";  
import cloud_icon from "../assets/cloud.png"; 
import drizzle_icon from "../assets/drizzle.png"; 
import rain_icon from "../assets/rain.png"; 
import snow_icon from "../assets/snow.png"; 
import wind_icon from "../assets/wind.png"; 
import humidity_icon from "../assets/humidity.png";

const Weather = ({ onLocalTempUpdate }) => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  // const search = async () => {
  //   const city = inputRef.current.value.trim();
  //   if (!city) {
  //     alert("Enter City Name");
  //     return;
  //   }
  //   setError(""); // Clear previous error

  //   try {
  //     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
  //     const response = await fetch(url);
  //     const data = await response.json();

  //     if (!response.ok) {
  //       console.error("API Error:", data);
  //       setError(data.message);
  //       alert("City not found. Please enter a valid city name."); // Show an alert for invalid cities
  //       return;
  //     }
  const search = async () => {
    const city = inputRef.current.value.trim();
    if (!city) {
        alert("Enter City Name");
        return;
    }
    setError(""); // Clear previous error

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error("API Error:", data);
            setError(""); // Clear error message in UI
            setWeatherData(null); // Clear previous weather data
            alert("City not found. Please enter a valid city name.");
            return;
        }

        const icon = allIcons[data.weather[0].icon] || clear_icon;
        const temp = Math.floor(data.main.temp);

        setWeatherData({
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            temperature: temp,
            location: data.name,
            icon: icon,
        });

        onLocalTempUpdate(temp);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        setError(""); // Clear error message in UI
        setWeatherData(null); // Clear previous weather data
        alert("Failed to fetch weather data. Please check your internet connection and try again.");
    }
};


  return (
    <div className="weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search" />
        <img src={search_icon} alt="" onClick={search} />
      </div>

      {error && <p className="error-message">{error}</p>}

      {weatherData && (
        <>
          <img src={weatherData.icon} className="weather_icon" alt="weather icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <div className="we_data">
            <div className="col">
              <img src={humidity_icon} alt="humidity icon" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="wind icon" />
              <div>
                <p>{weatherData.windSpeed}Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
