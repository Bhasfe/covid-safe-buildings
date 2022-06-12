import axios from 'axios';
import sessionService from './session.service';

class AuthService {
    login(username, password) {
        return axios
            .post(process.env.API_BASE_URL + 'signin', {
                username,
                password,
            })
            .then((response) => {
                if (response.data.accessToken) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
    }
    logout() {
        localStorage.removeItem('user');
        sessionService.notifyFlutter('logout', {});
    }
    register(username, email, password) {
        return axios.post(process.env.API_BASE_URL + 'signup', {
            username,
            email,
            password,
        });
    }
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}
export default new AuthService();
