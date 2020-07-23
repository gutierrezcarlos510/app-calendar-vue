import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/events/';

class EventService {
    save(obj) {
        return axios.post(API_URL, obj, { headers: authHeader() });
    }
    update(obj) {
        return axios.put(API_URL + obj.id, obj, { headers: authHeader() });
    }
    delete(id) {
        return axios.delete(API_URL + id, { headers: authHeader() })
    }
    list() {
        return axios.get(API_URL, { headers: authHeader() });
    }
    get(id) {
        return axios.get(API_URL + id, { headers: authHeader() });
    }
}

export default new EventService();