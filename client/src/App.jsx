import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { UserContext } from './context/user/userContext';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';

export const App = () => {
  const { userState, userDispatch } = useContext(UserContext);

  return (
    <div className="text-gray-800">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={userState.user ? <Home /> : <Navigate to="/register" />}
          >
            <Route
              path="/user/:username"
              element={userState.user ? <Home /> : <Navigate to="/register" />}
            />
            <Route
              path="/notifications"
              element={userState.user ? <Home /> : <Navigate to="/register" />}
            />
            <Route
              path="/search"
              element={userState.user ? <Home /> : <Navigate to="/register" />}
            />
            <Route
              path="/contacts"
              element={userState.user ? <Home /> : <Navigate to="/register" />}
            />
            <Route
              path="/chats"
              element={userState.user ? <Home /> : <Navigate to="/register" />}
            />
          </Route>
          <Route
            path="/login"
            element={
              userState.user ? (
                <Navigate to="/" />
              ) : (
                <Login user={{ userState, userDispatch }} />
              )
            }
          />
          <Route
            path="/register"
            element={userState.user ? <Navigate to="/" /> : <Register />}
          />
          <Route path="*" element={<Navigate to="/chats" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
