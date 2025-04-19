import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Initialize user from localStorage or defaults
const getInitialUser = () => {
    const raw = localStorage.getItem('user');
    if (raw && raw !== 'null') {
        try {
            return JSON.parse(raw);
        } catch {
            localStorage.removeItem('user');
        }
    }
    return { id: null, token: null, isLoggedIn: false, role: null };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getInitialUser);

    const login = (userData) => {
        // userData should include id, token, role, isLoggedIn
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        const empty = { id: null, token: null, isLoggedIn: false, role: null };
        setUser(empty);
        localStorage.removeItem('user');
        
    };

    return (
        <AuthContext.Provider value={{ user, setUser,login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);



// import React, { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState({
//         id: '',
//         token: null,
//         isLoggedIn: false,
//         role: null,
//     });


//     const logout = () => {
//         setUser({ isLoggedIn: false, role: null, token: null, id: null });
//         //to-do
//         localStorage.removeItem("user");
//     };

//     return (
//         <AuthContext.Provider value={{ user, setUser, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);