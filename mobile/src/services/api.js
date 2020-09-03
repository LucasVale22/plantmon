import axios from 'axios';

const api = axios.create({
    baseURL: 'http://XXX.XXX.XXX.XXX:XXXX',
});

export default api;