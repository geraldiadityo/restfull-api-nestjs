# Contact Spec Api

## Create Contact
Endpoint : POST /api/contacts

Headers :
- Authorization : token

Request Body :
```json
{
    "first_name": "geraldi",
    "last_name": "adityo",
    "email": "geraldi@example.com",
    "phone": "08999999999"
}
```

Response Body :
```json
{
    "data": {
        "id": 1,
        "first_name": "geraldi",
        "last_name": "adityo",
        "email": "geraldi@example.com",
        "phone": "08999999999"
    }
}
```

## Get Contact
Endpoint : GET /api/contacts/:contactId

Headers :
- Authorization : token


Response Body :
```json
{
    "data": {
        "id": 1,
        "first_name": "geraldi",
        "last_name": "adityo",
        "email": "geraldi@example.com",
        "phone": "08999999999"
    }
}
```

## Update Contact
Endpoint : PUT /api/contacts/:contactId

Headers :
- Authorization : token

Request Body :
```json
{
    "first_name": "geraldi",
    "last_name": "adityo",
    "email": "geraldi@example.com",
    "phone": "08999999999"
}
```

Response Body :
```json
{
    "data": {
        "id": 1,
        "first_name": "geraldi",
        "last_name": "adityo",
        "email": "geraldi@example.com",
        "phone": "08999999999"
    }
}
```

## Remove Contact
Endpoint : DELETE /api/contacts/:contactId

Headers :
- Authorization : token


Response Body :
```json
{
    "data": true
}
```

## Search Contact

Endpoint : GET /api/contacts

Headers :
- Authorization : token

Query params: 
- name : string, contact first name or contact last name (optional)
- phone: string, contact phone (optional)
- email: string, contact email (optional)
- page: number, default 1
- size: number, default 10


Response Body :
```json
{
    "data": [
        {
            "id": 1,
            "first_name": "geraldi",
            "last_name": "adityo",
            "email": "geraldi@example.com",
            "phone": "08999999999"
        }
    ],
    "pagging": {
        "current_page": 1,
        "total_page": 10,
        "size": 10
    }
}
```