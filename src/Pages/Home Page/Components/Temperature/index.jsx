import { useState, useEffect } from "react";
import { FaTemperatureHigh } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { TbLoader } from "react-icons/tb";
import styles from "./index.module.css";

export default function Temperature() {
  const API_KEY = "0141e491cfeb548922862afd4e935261";
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("Cairo"); // Default city

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          // If geolocation fails, fall back to the default city
          fetchWeatherByCity(city);
        }
      );
    } else {
      // Geolocation not supported by browser
      setError("Geolocation is not supported by your browser");
      fetchWeatherByCity(city);
    }
  }, []);

  console.log(weatherData);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Weather data not available");
      }

      const data = await response.json();
      setWeatherData(data);
      setCity(data.name);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch weather data");
      setLoading(false);
      console.error(err);
    }
  };

  const fetchWeatherByCity = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Weather data not available for this city");
      }

      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch weather data");
      setLoading(false);
      console.error(err);
    }
  };

  // Format the current date
  const formatDate = () => {
    const date = new Date();
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Display loading state
  if (loading) {
    return (
      <div className="p-3" id={styles.temp}>
        <div className="d-flex justify-content-between gap-3">
          <h6>Temperature</h6>
          <FaTemperatureHigh className={styles.icon} />
        </div>
        <div className="d-flex flex-column align-items-center justify-content-center py-4">
          <TbLoader className="animate-spin text-2xl mb-2" />
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="p-3" id={styles.temp}>
        <div className="d-flex justify-content-between gap-3">
          <h6>Temperature</h6>
          <FaTemperatureHigh className={styles.icon} />
        </div>
        <div className="d-flex flex-column align-items-center justify-content-center py-4">
          <p className="text-danger">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3" id={styles.temp}>
      <div className="d-flex justify-content-between gap-3">
        <h6>Temperature</h6>
        <FaTemperatureHigh className={styles.icon} />
      </div>

      {weatherData && (
        <>
          <div className="d-flex flex-row align-items-center justify-content-center gap-3">
            <p id={styles.uniq}>
              {Math.round(weatherData.main.temp)} <span></span>
            </p>
          </div>

          <div>
            <p>{weatherData.weather[0].main}</p>
            <p className="text-sm">{weatherData.weather[0].description}</p>
          </div>

          <p>{formatDate()}</p>

          <div className="d-flex align-items-center justify-content-center">
            <CiLocationOn className={styles.icon} />
            <p>
              {weatherData.name}, {weatherData.sys.country}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
