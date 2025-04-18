
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: '',
        token: null,
        isLoggedIn: false,
        role: null,
    });


    const logout = () => {
        setUser({ isLoggedIn: false, role: null, token: null, id: null });
        //to-do
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);