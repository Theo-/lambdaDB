# LambdaDB

LambdaDB is a standalone Express Server that sits on top of your database. It makes your database Lambda ready by managing the connection pool and
exposing a *secure API*.

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

Fill the `config.js` file:
```js
module.exports = function(environment) {
    return {
        host: "database_host",
        password: "database_password",
        username: "database_username",
        database: "database_name",
        port: 3306,
        secretToken: "secretToken"
    }
}
```

Remark that the `environment` is passed to the function so you can easily modify those credentials at running time. One use case would be to swap credentials when in a testing environment.

The `secretToken` is used to authenticate the request to the LambdaDB server.

- 4. Start the server

```
npm start
```

- 5. Use the LambdaDB npm package to access your database.

You can find the documentation at [the LambdaDB client repository](https://github.com/Theo-/lambdaDB-client).

## Authentication

We don't want everybody to have access to this server, that's why we use a `secretToken`. This `secretToken` should be passed through a `X-Access-Token` header for *every* request;

## API

```
POST /
```

Body:
```
{
    query: "SELECT * FROM users"
}
```

Results:
```
{
  "success": true,
  "data": [
    {
        firstName: "",
        ....
    },
    ...
  ]
}
```