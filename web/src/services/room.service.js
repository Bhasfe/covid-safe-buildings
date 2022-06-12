import axios from 'axios';
import authHeader from './auth_header';

class RoomService {
    getRoomsOfBuilding(id) {
        return axios.get(
            process.env.API_BASE_URL + 'building/' + id + 'rooms/'
        );
    }
    get(building_id, id) {
        return axios.get(
            process.env.API_BASE_URL +
                'building/' +
                building_id +
                '/room/' +
                id,
            {
                headers: authHeader(),
            }
        );
    }
    create(building_id, data) {
        return axios.post(
            process.env.API_BASE_URL + 'building/' + building_id + '/room',
            data,
            {
                headers: authHeader(),
            }
        );
    }
}
export default new RoomService();
