import axios from 'axios';
import authHeader from './auth_header';

class UserService {
    register(first_name, last_name, email, password, role) {
        return axios.post(process.env.API_BASE_URL + 'register', {
            first_name,
            last_name,
            email,
            password,
            role,
        });
    }

    getUser(id) {
        return axios.get(process.env.API_BASE_URL + 'user/' + id, {
            headers: authHeader(),
        });
    }

    getUserInformationFromStorage() {
        return JSON.parse(localStorage.getItem('token')).user;
    }

    getList() {
        return axios.get(process.env.API_BASE_URL + 'users', {
            headers: authHeader(),
        });
    }

    login(email, password) {
        return axios.post(process.env.API_BASE_URL + 'login', {
            email: email,
            password: password,
        });
    }

    logout() {
        return axios
            .post(
                process.env.API_BASE_URL + 'logout',
                {},
                { headers: authHeader() }
            )
            .then(() => {
                localStorage.removeItem('token');
            });
    }

    update(data) {
        return axios.put(process.env.API_BASE_URL + 'user/' + data.id, data, {
            headers: authHeader(),
        });
    }
}
export default new UserService();
