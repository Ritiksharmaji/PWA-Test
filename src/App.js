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
                    notifyUserOfUpdate(); // Already waiting
                }

                registration?.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker?.addEventListener('statechange', () => {
                        if (
                            newWorker.state === 'installed' &&
                            navigator.serviceWorker.controller
                        ) {
                            notifyUserOfUpdate(); // New update installed and ready
                        }
                    });
                });
            });
        }

        // Ask for notification permission
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    const search = async (e) => {
        if (e.key === 'Enter') {
            const data = await fetchWeather(query);
            setWeather(data);
            setQuery('');
        }
    };

    const notifyUserOfUpdate = () => {
        // Native browser notification (optional)
        if (Notification.permission === "granted") {
            navigator.serviceWorker.getRegistration().then((reg) => {
                reg?.showNotification("🔄 Update Available", {
                    body: "A new version of the Weather App is ready. Click OK to update.",
                    icon: "./images/logo.png",
                    badge: "./images/logo.png"
                });
            });
        }

        // In-app confirmation
        const confirmUpdate = window.confirm("🚀 A new version is available. Do you want to update?");
        if (confirmUpdate) {
            window.location.reload(true); // Force reload to activate new service worker
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

            <p>This is for version check with notification</p>
            <p>This is for second time version check with notification</p>
            <p>This is for third time version check with notification</p>

            <footer className="app-version">Version: {APP_VERSION}</footer>
        </div>
    );
}
