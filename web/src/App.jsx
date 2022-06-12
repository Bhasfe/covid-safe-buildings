import React, { useEffect, useState } from 'react';

import { Routes, Route, useLocation } from 'react-router-dom';

import './css/style.scss';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Buildings from './pages/Buildings';
import Building from './pages/Building';
import AddBuilding from './pages/AddBuilding';
import Settings from './pages/Settings';
import UserList from './pages/UserList';
import sessionService from './services/session.service';
import AddCamera from './pages/AddCamera';
import Register from './pages/Register';

function App() {
    const [token, setToken] = useState(null);

    process.env.API_BASE_URL = 'http://127.0.0.1:5000/';
    process.env.LIVE_STREAM_URL = 'http://192.168.31.122:5002/';

    const location = useLocation();

    useEffect(() => {
        if (sessionService.hasToken()) {
            setToken(sessionService.getToken());

            if (sessionService.hasExpired()) {
                sessionService.refreshToken();
            }
        }

        document.querySelector('html').style.scrollBehavior = 'auto';
        window.scroll({ top: 0 });
        document.querySelector('html').style.scrollBehavior = '';
    }, [location.pathname]); // triggered on route change

    if (!token && location.pathname !== '/register') {
        return <Login setToken={setToken} />;
    }

    return (
        <>
            <Routes>
                <Route exact path="/" element={<Dashboard />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/buildings" element={<Buildings />} />
                <Route exact path="/buildings/add" element={<AddBuilding />} />
                <Route path="/building/:id" element={<Building />} />
                <Route path="/settings/:id" element={<Settings />} />
                <Route path="/settings" element={<Settings />} />
                <Route exact path="/users" element={<UserList />} />
                <Route
                    path="/building/:building_id/room/:room_id/camera"
                    element={<AddCamera />}
                />
                <Route
                    path="/building/:building_id/room/:room_id/camera/:camera_id"
                    element={<AddCamera />}
                />
            </Routes>
        </>
    );
}

export default App;
