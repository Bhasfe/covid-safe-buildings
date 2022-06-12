# Covid Safe Buildings Backend

### Quickstart
```
conda env create -f=environment.yml
conda activate covid_safe_buildings_backend

python app.py
```

OR

```
docker-compose build
docker-compose up
```

## Endpoints

<details>
<summary>POST /register</summary>

Request: 
```json
{
    "first_name": "Barış",
    "last_name": "Hasdemir",
    "password": "dummy",
    "email": "test@gmail.com",
    "phone": "05346883643",
    "role": 2,
    "age": 25,
    "pcr_result": true,
    "had_covid": true,
    "vac_dose": 0
}
```

Response:
```json
{
    "message": "User created successfully!"
}
```
</details>

<details>
<summary>POST /login</summary>

Request: 
```json
{
    "email": "admin@admin.com",
    "password": "admin"
}
```

Response:
```json
{
    "access_token": "<access_token>",
    "refresh_token": "<refresh_token",
    "user": {
        "id": 1,
        "email": "admin@admin.com",
        "first_name": "admin",
        "last_name": "admin",
        "phone": 53053030,
        "role": 1,
        "age": null,
        "pcr_result": "0",
        "had_covid": false,
        "vac_dose": 0
    }
}
```

</details>

<details>
<summary>POST /logout</summary>

Response:
```json
{
    "message": "User 1 has been logged out."
}
```

</details>

<details>
<summary>POST /refresh</summary>

Response:
```json
{
    "access_token": "<access_token>
```

</details>

<details>
<summary>GET /user/&lt;user_id&gt;</summary>

Response:
```json
{
    "id": 2,
    "email": "test@gmail.com",
    "first_name": "Barış",
    "last_name": "Hasdemir",
    "phone": 5346883643,
    "role": 2,
    "age": 25,
    "pcr_result": true,
    "had_covid": true,
    "vac_dose": 0
}
```

</details>

<details>
<summary>GET /users</summary>

Response:
```json
{
    "users": [
        {
            "id": 1,
            "email": "admin@admin.com",
            "first_name": "admin",
            "last_name": "admin",
            "phone": 53053030,
            "role": 1,
            "age": null,
            "pcr_result": false,
            "had_covid": false,
            "vac_dose": 0
        },
        {
            "id": 2,
            "email": "test@gmail.com",
            "first_name": "Barış",
            "last_name": "Hasdemir",
            "phone": 5346883643,
            "role": 2,
            "age": 25,
            "pcr_result": true,
            "had_covid": true,
            "vac_dose": 0
        }
    ]
}
```

</details>

<details>
<summary>DEL /user/<int:user_id></summary>

Response:
```json
{
    "message": "User deleted!"
}
```

</details>


<details>
<summary>GET /buildings</summary>

Response:
```json
{
    "buildings": [
        {
            "id": 1,
            "name": "Suay 3 Apt",
            "address": "Gazimağusa",
            "building_type": "apartment",
            "safety_level": 100.0,
            "rooms": [
                {
                    "id": 1,
                    "name": "mutfak",
                    "description": "televizyon izlenir",
                    "area": 20.0,
                    "capacity": 5,
                    "occupancy": 0,
                    "safety_level": 100.0,
                    "num_of_people_masked_with_pcr_positive": 0,
                    "num_of_people_non_masked_with_pcr_positive": 0,
                    "num_of_people_masked_with_pcr_negative": 0,
                    "num_of_people_non_masked_with_pcr_negative": 0,
                    "num_of_people_vaccinated": 0,
                    "num_of_people_non_vaccinated": 0,
                    "building_id": 1,
                    "cameras": [
                        {
                            "id": 1,
                            "ip_address": "0",
                            "building_id": 1,
                            "room_id": 1
                        }
                    ]
                }
            ]
        },
        {
            "id": 2,
            "name": "Simpaş",
            "address": "Ankara",
            "building_type": "apartment",
            "safety_level": 0,
            "rooms": []
        }
    ]
}
```

</details>


<details>

<summary>POST /building</summary>

Request: 
```json
{
    "name": "Simpaş",
    "address": "Ankara",
    "building_type": "apartment"
}
```

Response:
```json
{
    "id": 2,
    "name": "Simpaş",
    "address": "Ankara",
    "building_type": "apartment",
    "safety_level": 0,
    "rooms": []
}
```


</details>

<details>

<summary>GET /building/&lt;building_id&gt;</summary>

Response:
```json
{
    "id": 1,
    "name": "Suay 3 Apt",
    "address": "Gazimağusa",
    "building_type": "apartment",
    "safety_level": 100.0,
    "rooms": [
        {
            "id": 1,
            "name": "mutfak",
            "description": "televizyon izlenir",
            "area": 20.0,
            "capacity": 5,
            "occupancy": 0,
            "safety_level": 100.0,
            "num_of_people_masked_with_pcr_positive": 0,
            "num_of_people_non_masked_with_pcr_positive": 0,
            "num_of_people_masked_with_pcr_negative": 0,
            "num_of_people_non_masked_with_pcr_negative": 0,
            "num_of_people_vaccinated": 0,
            "num_of_people_non_vaccinated": 0,
            "building_id": 1,
            "cameras": [
                {
                    "id": 1,
                    "ip_address": "0",
                    "building_id": 1,
                    "room_id": 1
                }
            ]
        }
    ]
}
```

</details>

<details>

<summary>DEL /building/&lt;building_id&gt;</summary>

Response:
```json
{
    "message": "Building deleted"
}
```

</details>

<details>

<summary>GET /building/&lt;building_id&gt;/rooms</summary>

Response:
```json
{
    "rooms": [
        {
            "id": 1,
            "name": "mutfak",
            "description": "televizyon izlenir",
            "area": 20.0,
            "capacity": 5,
            "occupancy": 0,
            "safety_level": 100.0,
            "num_of_people_masked_with_pcr_positive": 0,
            "num_of_people_non_masked_with_pcr_positive": 0,
            "num_of_people_masked_with_pcr_negative": 0,
            "num_of_people_non_masked_with_pcr_negative": 0,
            "num_of_people_vaccinated": 0,
            "num_of_people_non_vaccinated": 0,
            "building_id": 1,
            "cameras": [
                {
                    "id": 1,
                    "ip_address": "0",
                    "building_id": 1,
                    "room_id": 1
                }
            ]
        },
        {
            "id": 2,
            "name": "salon",
            "description": "yemek yenir",
            "area": 20.0,
            "capacity": 5,
            "occupancy": 0,
            "safety_level": 100.0,
            "num_of_people_masked_with_pcr_positive": 0,
            "num_of_people_non_masked_with_pcr_positive": 0,
            "num_of_people_masked_with_pcr_negative": 0,
            "num_of_people_non_masked_with_pcr_negative": 0,
            "num_of_people_vaccinated": 0,
            "num_of_people_non_vaccinated": 0,
            "building_id": 1,
            "cameras": []
        }
    ]
}
```

</details>

<details>


<summary>POST /building/&lt;building_id&gt;/room</summary>

Request: 
```json
{
            "name": "salon",
            "description": "yemek yenir",
            "area": 20
}
```

Response:
```json
{
    "id": 2,
    "name": "salon",
    "description": "yemek yenir",
    "area": 20.0,
    "capacity": 5,
    "occupancy": 0,
    "safety_level": 100.0,
    "num_of_people_masked_with_pcr_positive": 0,
    "num_of_people_non_masked_with_pcr_positive": 0,
    "num_of_people_masked_with_pcr_negative": 0,
    "num_of_people_non_masked_with_pcr_negative": 0,
    "num_of_people_vaccinated": 0,
    "num_of_people_non_vaccinated": 0,
    "building_id": 1,
    "cameras": []
}
```

</details>

<details>

<summary>PUT /building/&lt;building_id&gt;/room/&lt;room_id&gt;</summary>

Request: 
```json
{
    "description": "updated",
    "safety_level": 15.6
}
```

Response:
```json
{
    "id": 1,
    "name": "mutfak",
    "description": "updated",
    "area": 20.0,
    "capacity": 5,
    "occupancy": 0,
    "safety_level": 15.6,
    "num_of_people_masked_with_pcr_positive": 0,
    "num_of_people_non_masked_with_pcr_positive": 0,
    "num_of_people_masked_with_pcr_negative": 0,
    "num_of_people_non_masked_with_pcr_negative": 0,
    "num_of_people_vaccinated": 0,
    "num_of_people_non_vaccinated": 0,
    "building_id": 1,
    "cameras": [
        {
            "id": 1,
            "ip_address": "0",
            "building_id": 1,
            "room_id": 1
        }
    ]
}
```

</details>

<details>

<summary>DEL /building/&lt;building_id&gt;/room/&lt;room_id&gt;</summary>

Response: 
```json
{
    "message": "Room deleted"
}
```

</details>

<details>

<summary>GET /building/&lt;building_id&gt;/cameras</summary>

Response: 
```json
{
    "cameras": [
        {
            "id": 1,
            "ip_address": "0",
            "building_id": 1,
            "room_id": 1
        },
        {
            "id": 2,
            "ip_address": "192.168.1.1:5000",
            "building_id": 1,
            "room_id": 1
        }
    ]
}
```

</details>

<details>

<summary>POST /building/&lt;building_id&gt;/room/&lt;room_id&gt;/camera</summary>

Request: 
```json
{
    "ip_address": "192.168.1.1:5000"
}
```

Response:
```json
{
    "id": 2,
    "ip_address": "192.168.1.1:5000",
    "building_id": 1,
    "room_id": 1
}
```

</details>

<details>


<summary>PUT /building/&lt;building_id&gt;/room/&lt;room_id&gt;/camera/&lt;camera_id&gt;</summary>

Request: 
```json
{
    "ip_address": "1"
}
```

Response:
```json
{
    "id": 2,
    "ip_address": "1",
    "building_id": 1,
    "room_id": 1
}
```

</details>

<details>

<summary>DEL /building/&lt;building_id&gt;/room/&lt;room_id&gt;/camera/&lt;camera_id&gt;</summary>

Response:
```json
{
    "message": "Camera deleted"
}
```

</details>

<details>

<summary>GET /building/&lt;building_id&gt;/room/&lt;room_id&gt;/camera/&lt;camera_id&gt;</summary>

Response:
```json
{
    "id": 1,
    "ip_address": "0",
    "building_id": 1,
    "room_id": 1
}
```

</details>
