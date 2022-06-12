from typing import Optional, NoReturn
from dotenv import load_dotenv
import requests
import os

load_dotenv()


class ApiUtils:
    """Contains api utility functions for common use"""

    @classmethod
    def get_access_token(cls) -> Optional[str]:
        """Authenticate with application user and return access token"""

        # Headers for form data
        headers = {
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'Accept': '*/*'
        }

        # Login credentials
        data = {
            "email": (os.getenv("ADMIN_EMAIL")),
            "password": (os.getenv("ADMIN_PASSWORD"))
        }

        # Request for getting access token
        url = f'http://{os.getenv("APP_BACKEND_HOST")}:{os.getenv("APP_BACKEND_PORT")}/login'
        response = requests.post(url, json=data, headers=headers)

        return response.json().get("access_token")

    @classmethod
    def get_camera_ip(cls, camera_id: int, building_id: int, room_id: int, token: str) -> Optional[str]:
        """Returns the ip address of the given camera"""

        headers = {
            "Authorization": f"Bearer {token}"
        }
        url = f'http://{os.getenv("APP_BACKEND_HOST")}:{os.getenv("APP_BACKEND_PORT")}/building/{building_id}/room/{room_id}/camera/{camera_id}'
        response = requests.get(url, headers=headers)

        return response.json().get("ip_address")

    @classmethod
    def update_room_statistics(cls,
                               building_id: int,
                               room_id: int,
                               occupancy: int,
                               num_of_people_masked_with_pcr_positive: int,
                               num_of_people_non_masked_with_pcr_positive: int,
                               num_of_people_masked_with_pcr_negative: int,
                               num_of_people_non_masked_with_pcr_negative: int,
                               num_of_people_vaccinated: int,
                               num_of_people_non_vaccinated: int
                               ):
        """Send put request to update a room with the body given"""

        token = cls.get_access_token()

        headers = {
            "Authorization": f"Bearer {token}"
        }

        data = {
            "occupancy": occupancy,
            "num_of_people_masked_with_pcr_positive": num_of_people_masked_with_pcr_positive,
            "num_of_people_non_masked_with_pcr_positive": num_of_people_non_masked_with_pcr_positive,
            "num_of_people_masked_with_pcr_negative": num_of_people_masked_with_pcr_negative,
            "num_of_people_non_masked_with_pcr_negative": num_of_people_non_masked_with_pcr_negative,
            "num_of_people_vaccinated": num_of_people_vaccinated,
            "num_of_people_non_vaccinated": num_of_people_non_vaccinated
        }

        # Request for getting access token
        url = f'http://{os.getenv("APP_BACKEND_HOST")}:{os.getenv("APP_BACKEND_PORT")}/building/{building_id}/room/{room_id}'
        response = requests.put(url, headers=headers, json=data)

        return response.json()

    @classmethod
    def get_user_information(cls, user_id: int) -> Optional[dict]:
        """Returns the user information of the given user id"""

        token = cls.get_access_token()
        headers = {
            "Authorization": f"Bearer {token}"
        }
        url = f'http://{os.getenv("APP_BACKEND_HOST")}:{os.getenv("APP_BACKEND_PORT")}/user/{user_id}'
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            return response.json()
        return None

    @classmethod
    def update_statistics(cls, building_id: int, room_id: int, occupancy: int, guests: dict) -> NoReturn:
        """Update the safety related statistics of the room"""

        num_of_people_masked_with_pcr_positive = 0
        num_of_people_non_masked_with_pcr_positive = 0
        num_of_people_masked_with_pcr_negative = 0
        num_of_people_non_masked_with_pcr_negative = 0
        num_of_people_vaccinated = 0
        num_of_people_non_vaccinated = 0

        for name, guest in guests.items():
            if name != "unknown" and guest:
                if guest.get("pcr_result") and guest.get("has_mask"):
                    num_of_people_masked_with_pcr_positive += 1
                elif guest.get("pcr_result") and not guest.get("has_mask"):
                    num_of_people_non_masked_with_pcr_positive += 1
                elif not guest.get("pcr_result") and guest.get("has_mask"):
                    num_of_people_masked_with_pcr_negative += 1
                elif not guest.get("pcr_result") and not guest.get("has_mask"):
                    num_of_people_non_masked_with_pcr_negative += 1

                if guest.get("vac_dose") > 1:
                    num_of_people_vaccinated += 1
                else:
                    num_of_people_non_vaccinated += 1

            cls.update_room_statistics(
                building_id=building_id,
                room_id=room_id,
                num_of_people_masked_with_pcr_positive=num_of_people_masked_with_pcr_positive,
                num_of_people_non_masked_with_pcr_positive=num_of_people_non_masked_with_pcr_positive,
                num_of_people_masked_with_pcr_negative=num_of_people_masked_with_pcr_negative,
                num_of_people_non_masked_with_pcr_negative=num_of_people_non_masked_with_pcr_negative,
                num_of_people_vaccinated=num_of_people_vaccinated,
                num_of_people_non_vaccinated=num_of_people_non_vaccinated,
                occupancy=occupancy
            )