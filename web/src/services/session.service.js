import axios from 'axios';
import jwtDecode from 'jwt-decode';

class SessionService {
    
    refreshJob;

    setRefreshJob() {
        let self = this;

        clearTimeout(this.refreshJob);

        this.refreshJob = setTimeout(() => {
            self.refreshToken();
        }, Math.max((this.getTimeToExpiration() * 1000) - 1800000, 1));
        // Set the job for 30 mins before expiration date
    }

    hasToken() {

        let rawToken = localStorage.getItem('token');


        if (!rawToken) {
            return false;
        }

        let token;

        try {
            token = JSON.parse(rawToken);

            if (token.access_token === undefined) {
                return false;
            }

        } catch(err) {
            return false;
        }

        try {
            token = jwtDecode(token.access_token);
        } catch (error) {
            return false;
        }
        


        return true;
    }

    getToken() {

        if (this.hasToken()) {
            return JSON.parse(localStorage.getItem('token')).access_token;
        }

        return false;

    }

    
    saveToken(token) {
        localStorage.setItem('token', JSON.stringify(token));
    }

    getTimeToExpiration() {
        let rawToken = JSON.parse(localStorage.getItem('token'));
        let token = jwtDecode(rawToken.access_token);

        return token.exp - Math.floor(Date.now() / 1000);
    } 

    hasExpired() {

        this.setRefreshJob();

        console.log("Checking if expired");
        let rawToken = JSON.parse(localStorage.getItem('token'));
        let token = jwtDecode(rawToken.access_token);

        if (token.exp < Math.floor(Date.now() / 1000)) {
            return true;
        }

        
        return false;
    }

    refreshToken() {

        console.log("Refreshing token");
        let token = JSON.parse(localStorage.getItem('token'));

        axios.post(process.env.API_BASE_URL + 'refresh', {}, {
            headers: {
                'Authorization': 'Bearer ' + token.refresh_token,
            },
        }).then(response => {
            token.access_token = response.data.access_token;
            this.saveToken(token);
            this.notifyFlutter('token_refreshed', {
                token: token.access_token,
            });
        }).then(() => {
            this.setRefreshJob();
        });
    }

    notifyFlutter(type, data) {

        if (typeof BRT == "undefined") {
            return;
        }

        BRT.postMessage(
            JSON.stringify({
                type: type,
                data: data,
            })
        );

    }

}
export default new SessionService();
