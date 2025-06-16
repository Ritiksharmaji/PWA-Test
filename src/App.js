import React, { useEffect, useState } from 'react';
import { fetchWeather } from './api/fetchWeather';
import { APP_VERSION } from './version';
import './App.css';

export default function App() {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});


    useEffect(() => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration && registration.waiting) {
                showUpdateNotification(); // Already waiting
            }

            registration && registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker && newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateNotification(); // New update ready
                    }
                });
            });
        });
    }
}, []);

    const search = async (e) => {
        if (e.key === 'Enter') {
            const data = await fetchWeather(query);
            setWeather(data);
            setQuery('');
        }
    };

    
const showUpdateNotification = () => {
    const confirmUpdate = window.confirm("🚀 A new version is available. Do you want to update?");
    if (confirmUpdate) {
        window.location.reload(true); // Reload and activate new service worker
    }
};

    return (
        <div className="main-container">
            <input
                type="text"
                className="search"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={search}
            />

            {weather.main && (
                <div className="city">
                    <h2 className="city-name">
                        <span>{weather.name}</span>
                        <sup>{weather.sys.country}</sup>
                    </h2>
                    <div className="city-temp">
                        {Math.round(weather.main.temp)}
                        <sup>&deg;C</sup>
                    </div>
                    <div className="info">
                        <img
                            className="city-icon"
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                            alt={weather.weather[0].description}
                        />
                        <p>{weather.weather[0].description}</p>
                        
                    </div>
                    
                </div>
            )}
            <p>this is for version check with notification</p>

            <footer className="app-version">Version: {APP_VERSION}</footer>
        </div>
    );
}
