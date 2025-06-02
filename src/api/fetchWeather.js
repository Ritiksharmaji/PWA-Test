import axios from 'axios';

const URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'f33a484cf794d08d0148764789aaba32';

export const fetchWeather = async (query) => {
    const { data } = await axios.get(URL, {
        params: {
            q: query,
            units: 'metric',
            APPID: API_KEY,
        }
    });

    return data;
}

// in the axios second parameter, we can pass an object with the params property, 
// which is an object that contains the query parameters to be sent in the request. The params object will be serialized into a query string and appended to the URL. This way, we can easily add or modify query parameters without having to manually construct the URL. The axios library takes care of encoding the parameters for us, ensuring that they are properly formatted for the request.
