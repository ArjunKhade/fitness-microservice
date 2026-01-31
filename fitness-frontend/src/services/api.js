import axios from "axios";
//defined base URL for API call
const API_URL = 'http://localhost:9096/api';

//create axios instance to use api call
const api = axios.create({
    baseURL: API_URL
});

// set authorization header and X-User-ID header in interceptor
api.interceptors.request.use((config)=>{
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    if(userId){
        config.headers['X-User-ID'] = userId;
    }
    return config;
})

// defined api endpoints 
export const getActivities = () => api.get('/activities');
export const addActivities = (activity) => api.post('/activities', activity);
export const getRecomendationByActivity = (id) => api.get(`/recommendations/activity/${id}`);


