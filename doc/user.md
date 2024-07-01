# User API Spec

## Register User
Endpoint: POST /api/user
Request Body :
```json
{
    "username": "geraldi",
    "password": "rahasia",
    "name": "geraldi adityo"
}
```


Response Body (Success) :
```json
{
    "data": {
        "username": "geraldi",
        "name": "geraldi adityo"
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "detail errors"
}
```

## login user
Endpoint: POST /api/user/login
Request Body :
```json
{
    "username": "geraldi",
    "password": "rahasia",
}
```


Response Body (Success) :
```json
{
    "data": {
        "username": "geraldi",
        "name": "geraldi adityo",
        "token": "session_id_generated"
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "detail errors"
}
```


## Get User
Endpoint: GET /api/user/current
Headers :
- Authorization : token


Response Body (Success) :
```json
{
    "data": {
        "username": "geraldi",
        "name": "geraldi adityo"
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "detail errors"
}
```


## Update User
Endpoint: PATCH /api/user/current
Headers : 
- Authorization : token

Request Body :
```json
{
    "password": "rahasia", // optional
    "name": "geraldi adityo" // optional
}
```


Response Body (Success) :
```json
{
    "data": {
        "username": "geraldi",
        "name": "geraldi adityo"
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "detail errors"
}
```


## Logout user
Endpoint: POST /api/user/current

Headers: 
- Authorization : token


Response Body (Success) :
```json
{
    "data": {
        "username": "geraldi",
        "name": "geraldi adityo"
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "detail errors"
}
```
