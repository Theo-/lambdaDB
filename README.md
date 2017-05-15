# LambdaDB

LambdaDB is a standalone Express Server that sits on top of your database. It makes your database Lambda ready by managing the connection pool and
exposing a secure API.

Supported databases:
- MySQL

## Getting started

- 1. Clone repository

```
git clone https://github.com/Theo-/lambdaDB.git
```

- 2. Install dependencies

```
npm install
```

- 3. Configure database connection

Fill the `config.json` file:
```
{
    host: "database_host",
    password: "database_password",
    username: "database_username",
    database: "database_name"
}
```

## API

