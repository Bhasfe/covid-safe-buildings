import axios from 'axios';
import authHeader from './auth_header';

class CameraService {
    getAll(buildingId) {
        return axios.get(
            `${process.env.API_BASE_URL}/building/${buildingId}/cameras`,
            { headers: authHeader() }
        );
    }
    get(buildingId, roomId, cameraId) {
        return axios.get(
            `${process.env.API_BASE_URL}/building/${buildingId}/room/${roomId}/camera/${cameraId}`,
            { headers: authHeader() }
        );
    }
    add(buildingId, roomId, camera) {
        return axios.post(
            `${process.env.API_BASE_URL}/building/${buildingId}/room/${roomId}/camera`,
            camera,
            { headers: authHeader() }
        );
    }
    update(buildingId, roomId, cameraId, camera) {
        return axios.put(
            `${process.env.API_BASE_URL}/building/${buildingId}/room/${roomId}/camera/${cameraId}`,
            camera,
            { headers: authHeader() }
        );
    }
    delete(buildingId, roomId, cameraId) {
        return axios.delete(
            `${process.env.API_BASE_URL}/building/${buildingId}/room/${roomId}/camera/${cameraId}`,
            { headers: authHeader() }
        );
    }
}
export default new CameraService();
