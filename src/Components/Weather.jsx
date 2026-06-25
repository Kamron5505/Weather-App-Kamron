import React, { useEffect, useState } from 'react';
import './Weather.css';

import search__icon from '../assets/search.png';
import clear__icon from '../assets/clear.png';
import cloud__icon from '../assets/cloud.png';
import drizzle__icon from '../assets/drizzle.png';
import humidity__icon from '../assets/humidity.png';
import rain__icon from '../assets/rain.png';
import snow__icon from '../assets/snow.png';
import wind__icon from '../assets/wind.png';

const Weather = () => {
    const [weatherData, setWeatherData] = useState(false);

    const allIcons = {
        "01d": clear__icon,
        "01n": clear__icon,
        "02d": cloud__icon,
        "02n": cloud__icon,
        "03d": cloud__icon,
        "03n": cloud__icon,
        "04d": drizzle__icon,
        "04n": drizzle__icon,
        "09d": rain__icon,
        "09n": rain__icon,
        "10d": rain__icon,
        "10n": rain__icon,
        "13d": snow__icon,
        "13n": snow__icon,
    };

    const search = async (city) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            const icon = allIcons[data.weather[0].icon] || clear__icon;

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
            });

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        search("London");
    }, []);

    return (
        <div className="weather">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search city..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            search(e.target.value);
                        }
                    }}
                />
                <img
                    src={search__icon}
                    alt=""
                    onClick={() => {
                        const input = document.querySelector('.search-bar input');
                        search(input.value);
                    }}
                />
            </div>

            {weatherData && (
                <>
                    <img
                        src={weatherData.icon}
                        alt=""
                        className="weather-icon"
                    />

                    <p className="temperature">
                        {weatherData.temperature}°C
                    </p>

                    <p className="location">
                        {weatherData.location}
                    </p>

                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity__icon} alt="" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>

                        <div className="col">
                            <img src={wind__icon} alt="" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
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
