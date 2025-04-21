import axios from "axios";

// export const base = "http://localhost:5083";
export const base = "https://localhost:7057";
// export const base = "http://happ.helwan.edu.eg";
// export const base = "https://happ.helwan.edu.eg:5083";

export const api = axios.create({
    baseURL: base,
});

api.interceptors.request.use((config) => {
    
    const token = JSON.parse(sessionStorage.getItem("user"))?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    
    return config;
});

