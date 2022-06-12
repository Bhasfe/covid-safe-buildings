import axios from 'axios';
import authHeader from './auth_header';

class BuildingService {
    getAllBuildings() {
        return axios.get(process.env.API_BASE_URL + 'buildings', {
            headers: authHeader(),
        });
    }
    get(id) {
        return axios.get(process.env.API_BASE_URL + 'building/' + id, {
            headers: authHeader(),
        });
    }
    create(building) {
        return axios.post(process.env.API_BASE_URL + 'building', building, {
            headers: authHeader(),
        });
    }
}
export default new BuildingService();
