# Address API Spec

## create address
Endpoint : POST /api/contacts/:contactId/address

Headers: 
- Authorization : token

Request Body :
```json
{
    "street": "jalan contoh (optional)",
    "city": "kota (optional)",
    "province": "provinsi (optional)",
    "country": "negara",
    "postal_code": "123123"
}
```

```json
{
    "data": {
        "id": 1,
        "street": "jalan contoh (optional)",
        "city": "kota (optional)",
        "province": "provinsi (optional)",
        "country": "negara",
        "postal_code": "123123"
    }
}
```

## get address
Endpoint : POST /api/contacts/:contactId/address/:addressId

Headers: 
- Authorization : token


```json
{
    "data": {
        "id": 1,
        "street": "jalan contoh (optional)",
        "city": "kota (optional)",
        "province": "provinsi (optional)",
        "country": "negara",
        "postal_code": "123123"
    }
}
```

## update address
Endpoint : PUT /api/contacts/:contactId/address/:addressId

Headers: 
- Authorization : token

Request Body :
```json
{
    "street": "jalan contoh (optional)",
    "city": "kota (optional)",
    "province": "provinsi (optional)",
    "country": "negara",
    "postal_code": "123123"
}
```

```json
{
    "data": {
        "id": 1,
        "street": "jalan contoh (optional)",
        "city": "kota (optional)",
        "province": "provinsi (optional)",
        "country": "negara",
        "postal_code": "123123"
    }
}
```
## remove address
Endpoint : DELETE /api/contacts/:contactId/address/:addressId

Headers: 
- Authorization : token


```json
{
    "data": true
}
```

## list Address

Endpoint : GET /api/contacts/:contactId/address

Headers: 
- Authorization : token

```json
{
    "data": [
        {
            "id": 1,
            "street": "jalan contoh (optional)",
            "city": "kota (optional)",
            "province": "provinsi (optional)",
            "country": "negara",
            "postal_code": "123123"
        }
    ]
}
```