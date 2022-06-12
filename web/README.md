# Safe Building - REST API [Draft]
---
## Object Data Types
#### ==SafetyLevel== <Enum string>
| Value         |
|---------------|
| low_risk      |
| low_moderate  |
| moderate_risk |
| moderate_high |
| high_risk     |
#### Example
```json
{
...
"safety_level": "low_moderate"
...
}
```

---

==Occupant==
| Key        | Value                 | Description                                                  |
|------------|-----------------------|--------------------------------------------------------------|
| id         | `string` or `integer` | Unique identifier of the occupant                            |
| name       | `string`              | Full name of the occupant                                    |
| age        | `integer`             | Current age of the occupant                                  |
| has_mask   | `boolean`             | Does the occupant currently wear mask?                       |
| vac_dose   | `integer`             | Number of vaccination doses of the occupant                  |
| pcr_result | `string`              | Latest PCR result of the occupant.<br>Can take "positive" or "negative".<br>*(may use booelan instead)* |
| had_covid  | `boolean`             | Has the occupant ever had covid?                             |
#### Example
```json
{
  "id": 1,
  "name": "Berat Aşıcı",
  "age": 25,
  "has_mask": true,
  "vac_dose": 2,
  "pcr_result": "negative",
  "had_covid": false
}
```

---

#### ==Room==
| Key          | Value                        | Descritption                      |
|--------------|------------------------------|-----------------------------------|
| id           | `string` or `integer`        | Unique identifier of the room     |
| name         | `string`                     | Name of the room (e.g. "Kitchen") |
| capacity     | `integer`                    | Allowed max. capacity of the room |
| safety_level | ==SafetyLevel== `enum`       | Safety level of the room          |
| occupants    | Array of ==Occupant== object | List of people in the room        |
| labels       | Array of `string`            | Time labels of live data          |
| data         | Array of `integer`           | Occupancy count of live data      |

#### Example
```json
{
  "id": 1,
  "name": "Living Room",
  "capacity": 6,
  "safety_level": "low_risk",
  "occupants": [ ... ],
  "labels": [
      "13:00:00", "13:00:05", "13:00:10",
      "13:00:15", "13:00:20", "13:00:25"
  ],
  "data": [
      1, 0, 0,
      2, 3, 2
  ]
}
```

---

==Building==

| Key          | Type                     | Description                                                  |
|--------------|--------------------------|--------------------------------------------------------------|
| id           | `string` or `integer`    | Unique identifier of the building                            |
| name         | `string`                 | Name of the building                                         |
| capacity     | `integer`                | Allowed total capacity of the building<br>(sum of all the rooms' capacities) |
| occupancy    | `integer`                | Current occupant count in the building<br>(sum of all the rooms' occupants) |
| safety_level | ==SafetyLevel== `enum`   | Overall safety level of the building                         |
| rooms        | Array of ==Room== object | Rooms belonging to the building                              |
| labels       | Array of `string`        | Time labels of live data<br>(e.g.: `["10:00:00", "10:00:05", "10:00:10"]`) |
| data         | Array of `integer`       | Occupancy count of live data<br>(e.g.: `[0, 2, 2]`)          |
#### Example
```json
[{
    "id": 1,
    "name": "Flat No: 11",
    "capacity": 10,
    "occupancy": 4,
    "safety_level": "moderate_high",
    "rooms": [{
        "id": 1,
        "name": "Living Room",
        "capacity": 6,
        "safety_level": "low_risk",
        "occupants": [{
                "id": 1,
                "name": "Berat Aşıcı",
                "age": 25,
                "has_mask": true,
                "vac_dose": 2,
                "pcr_result": "negative",
                "had_covid": false
            },
            {
                "id": 2,
                "name": "Barış Dede",
                "age": 25,
                "has_mask": false,
                "vac_dose": 1,
                "pcr_result": "negative",
                "had_covid": true
            }
        ],
        "labels": [
            "13:00:00", "13:00:05", "13:00:10", 
			 "13:00:15", "13:00:20", "13:00:25"
        ],
        "data": [
            1, 0, 0, 2, 3, 2
        ]
    }],
    "labels": [
        "13:00:00", "13:00:05", "13:00:10",
        "13:00:15", "13:00:20", "13:00:25"
    ],
    "data": [
        1, 0, 2,
        3, 4, 4
    ]
}]
```

---
# Endpoints 
#### Request
==GET== `/buildings`
List the existing buildings with their live data 
#### Response
Returns an array of ==Building== objects
#### Example response
```json
[{
    "id": 1,
    "name": "Flat No: 11",
    "capacity": 10,
    "occupancy": 4,
    "safety_level": "moderate_high",
    "rooms": [
    {
        "id": 1,
        "name": "Living Room",
        "capacity": 6,
        "safety_level": "low_risk",
        "occupants": [
        {
            "id": 1,
            "name": "Berat Aşıcı",
            "age": 25,
            "has_mask": true,
            "vac_dose": 2,
            "pcr_result": "negative",
            "had_covid": false
        },
        {
            "id": 2,
            "name": "Barış Dede",
            "age": 25,
            "has_mask": false,
            "vac_dose": 1,
            "pcr_result": "negative",
            "had_covid": true
        }
        ],
        "labels": [
            "13:00:00", "13:00:05", "13:00:10",
            "13:00:15", "13:00:20", "13:00:25"
        ],
        "data": [
            1, 0, 0,
            2, 3, 2
        ]
    },
    {
        "id": 2,
        "name": "Kitchen",
        "capacity": 4,
        "safety_level": "high_risk",
        "occupants": [
        {
            "id": 3,
            "name": "Barış Hasdemir",
            "age": 27,
            "has_mask": true,
            "vac_dose": 3,
            "pcr_result": "negative",
            "had_covid": false
        },
        {
            "id": 4,
            "name": "Infectus Patronus",
            "age": 40,
            "has_mask": false,
            "vac_dose": 0,
            "pcr_result": "positive",
            "had_covid": true
        }
        ],
        "labels": [
            "13:00:00", "13:00:05", "13:00:10",
            "13:00:15", "13:00:20", "13:00:25"
        ],
        "data": [
            0, 0, 2,
            1, 1, 2
        ]
    }
    ],
    "labels": [
        "13:00:00", "13:00:05", "13:00:10",
        "13:00:15", "13:00:20", "13:00:25"
    ],
    "data": [
        1, 0, 2,
        3, 4, 4
    ]
},
{
    "id": 2,
    "name": "Flat No: 9",
    "capacity": 8,
    "occupancy": 5,
    "safety_level": "moderate_risk",
    "rooms": [
    {
        "id": 3,
        "name": "Living Room",
        "capacity": 6,
        "safety_level": "low_risk",
        "occupants": [
        {
            "id": 5,
            "name": "Sıdıka Taşralı",
            "age": 23,
            "has_mask": false,
            "vac_dose": 3,
            "pcr_result": "negative",
            "had_covid": false
        },
        {
            "id": 6,
            "name": "Serdar Oyar",
            "age": 28,
            "has_mask": false,
            "vac_dose": 1,
            "pcr_result": "negative",
            "had_covid": false
        }
        ],
        "labels": [
            "13:00:00", "13:00:05", "13:00:10",
            "13:00:15", "13:00:20", "13:00:25"
        ],
        "data": [
            0, 0, 0,
            1, 1, 2
        ]
    },
    {
        "id": 4,
        "name": "Guest Room",
        "capacity": 2,
        "safety_level": "moderate_risk",
        "occupants": [
        {
            "id": 7,
            "name": "Andro",
            "age": 2,
            "has_mask": false,
            "vac_dose": 0,
            "pcr_result": "negative",
            "had_covid": false
        },
        {
            "id": 8,
            "name": "Meda",
            "age": 2,
            "has_mask": true,
            "vac_dose": 0,
            "pcr_result": "positive",
            "had_covid": true
        },
        {
            "id": 9,
            "name": "Dali",
            "age": 2,
            "has_mask": false,
            "vac_dose": 3,
            "pcr_result": "negative",
            "had_covid": false
        }
        ],
        "labels": [
            "13:00:00", "13:00:05", "13:00:10",
            "13:00:15", "13:00:20", "13:00:25"
        ],
        "data": [
            1, 0, 0,
            2, 3, 3
        ]
    }
    ],
    "labels": [
        "13:00:00", "13:00:05", "13:00:10",
        "13:00:15", "13:00:20", "13:00:25"
    ],
    "data": [
        1, 0, 0,
        3, 4, 7
    ]
}]
```

---
#### Request
==GET== `/buildings/{id}`
Fetches a building with given id
| Key | Type                  | Description         |
|-----|-----------------------|---------------------|
| id  | `string` or `integer` | Building Identifier |
#### Response
Returns a single ==Building== object

---
#### Request
==GET== `/buildings/{id}/rooms`
List all the rooms of given building
| Key | Type                  | Description         |
|-----|-----------------------|---------------------|
| id  | `string` or `integer` | Building Identifier |
#### Response
Returns an array of ==Room== objects

---
#### Request
==GET== `/buildings/{id}/rooms/{room_id}`
List all the rooms of given building
| Key     | Type                  | Description                           |
|---------|-----------------------|---------------------------------------|
| id      | `string` or `integer` | Building Identifier                   |
| room_id | `string` or `integer` | Child Room Identifier of the building |
#### Response
Returns an array of ==Room== objects

---
#### Request
==GET== `/rooms`
List all the rooms registered
#### Response
Returns an array of ==Room== objects

---
#### Request
==GET== `/rooms/{id}`
Fetches a room with given id
| Key | Type                  | Description     |
|-----|-----------------------|-----------------|
| id  | `string` or `integer` | Room Identifier |
#### Response
Returns a ==Room== object

---
#### Request
==POST== `/login`
Attempts to login
#### JSON Request Body
| Key      | Type     | Description                    |
|----------|----------|--------------------------------|
| username | `string` | Username or e-mail of the user |
| password | `string` | Password of the user           |
#### ==200== Response
If succesfull it returns a JSON object with a JWT token
| Key   | Type     | Description                                                  |
|-------|----------|--------------------------------------------------------------|
| token | `string` | JWT token with `role` key included (e.g.: { "role": "admin" } ) |
#### Example
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU0MzY5NDM4LCJleHAiOjE2NTQzNzMwMzh9.u8Ob-0lTp6VrHUKYBCXKHXEWXw04GOrjBCmjWk1XqBc"
}
```
Which decodes to;
**Encoded:** 
(Header)
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
**Decoded:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Encoded:** 
(Payload)
`J1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU0MzY5NDM4LCJleHAiOjE2NTQzNzMwMzh9`
**Decoded:**
```json
{
  "username": "demouser",
  "role": "admin",
  "iat": 1654369438,
  "exp": 1654373038
}
```
