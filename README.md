### Docker

#### Local

- `docker build . -t test_webbylab -f ./Dockerfile`
- `docker run --name webbylab -p 3000:3000 -e APP_PORT=3000 test_webbylab`

#### DockerHub

- `docker run --name webbylab -p 3000:3000 -e APP_PORT=3000 sviatoslavkytsara/test_webbylab`

### Start local

- `npm run build`
- `npm run start`
- `npm run dev`

### Libs

- class-transformer
- class-validator
- cors
- dotenv
- express
- express-fileupload
- inversify
- jsonwebtoken
- sequelize
- sequelize-typescript
- tslog

### Import movies
`https://gist.github.com/k0stik/3028d42973544dd61c3b4ad863378cad`

! між фільмами 1 пустий рядок

### API
`https://gist.github.com/k0stik/3028d42973544dd61c3b4ad863378cad`

### Validation errors
Валідатор записує в поля об'єкти з обмеженнями, що були порушені
```json
{
    "status": 0,
    "error": {
        "code": "UNPROCESSABLE_CONTENT",
        "fields": {
            "title": {
                "isString": "title must be a string"
            },
            "year": {
                "min": "year must not be less than 1888",
                "isInt": "year must be an integer number"
            },
            "actors": {
                "isString": "each value in actors must be a string"
            }
        }
    }
}
```

