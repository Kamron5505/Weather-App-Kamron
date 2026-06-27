import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';

import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import gsap from 'gsap';

import search__icon from '../assets/search.png';
import clear__icon from '../assets/clear.png';
import cloud__icon from '../assets/cloud.png';
import drizzle__icon from '../assets/drizzle.png';
import humidity__icon from '../assets/humidity.png';
import rain__icon from '../assets/rain.png';
import snow__icon from '../assets/snow.png';
import wind__icon from '../assets/wind.png';

// Register Chart.js components for Radar chart
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const Weather = () => {
    const [weatherData, setWeatherData] = useState(false);

    // Refs for GSAP animations
    const weatherRef = useRef(null);
    const searchBarRef = useRef(null);
    const weatherIconRef = useRef(null);
    const temperatureRef = useRef(null);
    const locationRef = useRef(null);
    const weatherDataRef = useRef(null);
    const chartRef = useRef(null);

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

    // GSAP entrance animation
    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
            weatherRef.current,
            { opacity: 0, scale: 0.85, y: 40 },
            { opacity: 1, scale: 1, y: 0, duration: 0.8 }
        )
            .fromTo(
                searchBarRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5 },
                '-=0.4'
            );

        // Floating animation for the weather icon (continuous)
        if (weatherIconRef.current) {
            gsap.to(weatherIconRef.current, {
                y: -8,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        }
    }, []);

    // GSAP animation when weatherData changes
    useEffect(() => {
        if (!weatherData) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo(
                weatherIconRef.current,
                { opacity: 0, scale: 0.3, rotation: -30 },
                { opacity: 1, scale: 1, rotation: 0, duration: 0.7 },
                0
            )
                .fromTo(
                    temperatureRef.current,
                    { opacity: 0, x: -30 },
                    { opacity: 1, x: 0, duration: 0.5 },
                    '-=0.3'
                )
                .fromTo(
                    locationRef.current,
                    { opacity: 0, x: 30 },
                    { opacity: 1, x: 0, duration: 0.5 },
                    '-=0.3'
                )
                .fromTo(
                    weatherDataRef.current?.children,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 },
                    '-=0.2'
                )
                .fromTo(
                    chartRef.current,
                    { opacity: 0, scale: 0.8, y: 20 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.6 },
                    '-=0.2'
                );

            // Continuous floating animation
            gsap.to(weatherIconRef.current, {
                y: -8,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        });

        return () => ctx.revert();
    }, [weatherData]);

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
        search('London');
    }, []);

    // Chart data configuration
    const chartData = weatherData
        ? {
            labels: ['Temperature', 'Humidity', 'Wind Speed'],
            datasets: [
                {
                    label: 'Weather Metrics',
                    data: [
                        weatherData.temperature,
                        weatherData.humidity,
                        Math.round(weatherData.windSpeed),
                    ],
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#500ae4',
                    pointHoverBorderColor: '#fff',
                    pointRadius: 5,
                },
            ],
        }
        : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            r: {
                angleLines: { color: 'rgba(255,255,255,0.3)', lineWidth: 1 },
                grid: { color: 'rgba(255,255,255,0.2)' }, pointLabels: {
                    color: '#fff',
                    font: { size: 12, family: 'Poppins' },
                },
                ticks: {
                    backdropColor: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    font: { size: 11 },
                },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(47, 70, 128, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                cornerRadius: 8,
                padding: 10,
            },
        },
    };

    return (
        <div className="weather" ref={weatherRef}>
            <div className="search-bar" ref={searchBarRef}>
                <input
                    type="text"
                    placeholder="Search city..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            search(e.target.value);
                        }
                    }}
                />
                <img
                    src={search__icon}
                    alt="Search"
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
                        alt="Weather icon"
                        className="weather-icon"
                        ref={weatherIconRef}
                    />

                    <p className="temperature" ref={temperatureRef}>
                        {weatherData.temperature}°C
                    </p>

                    <p className="location" ref={locationRef}>
                        {weatherData.location}
                    </p>

                    <div className="weather-data" ref={weatherDataRef}>
                        <div className="col">
                            <img src={humidity__icon} alt="Humidity" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>

                        <div className="col">
                            <img src={wind__icon} alt="Wind Speed" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>

                    <div className="chart-container" ref={chartRef}>
                        <Radar data={chartData} options={chartOptions} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Weather;
