<h1 align="center">Horizon API</h1>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com/HassanAmirii/horizon)
[![GitHub Issues](https://img.shields.io/github/issues/HassanAmirii/paypal.svg)](https://github.com/HassanAmirii/horizon/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/HassanAmirii/horizon.svg)](https://github.com/HassanAmirii/horizon/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center">

Horizon is a RESTful API built with Node.js and Express.js, providing a robust backend for a task management application. It utilizes Mongoose for object data modeling with a MongoDB database and implements JWT-based authentication for secure, role-based access to endpoints.
<br>

</p>

## Features

- **Express.js**: For building the RESTful API server and managing routes.
- **Mongoose / MongoDB**: Provides an Object Data Modeling (ODM) layer for interacting with the MongoDB database to store user and task data.
- **JSON Web Tokens (JWT)**: Ensures secure, stateless user authentication and authorization for protected endpoints.
- **bcrypt**: Handles secure hashing of user passwords before storage.
- **Docker**: Includes `Dockerfile` and `docker-compose.yml` for easy containerization, ensuring a consistent and isolated development/production environment.

## Getting Started

This project is containerized using Docker for a streamlined setup process.

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/HassanAmirii/horizon.git
    cd horizon
    ```

2.  **Create an environment file**
    Copy the example environment file to create your own configuration.

    ```bash
    cp .env.example .env
    ```

3.  **Configure environment variables**
    Open the `.env` file and add the required values.

4.  **Run with Docker Compose**
    This command will build the images and start the Express application and MongoDB database containers.
    ```bash
    docker-compose up --build -d
    ```
    The API will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the root directory and add the following variables.

| Variable      | Description                        | Example                             |
| :------------ | :--------------------------------- | :---------------------------------- |
| `MONGODB_URI` | The connection string for MongoDB. | `mongodb://mongo:27017/horizon`     |
| `PORT`        | The port the server will run on.   | `3000`                              |
| `JWT_SECRET`  | A secret key for signing JWTs.     | `a_very_strong_and_long_secret_key` |

## API Documentation

### Base URL

`http://localhost:3000`

### Endpoints

#### POST /register

Creates a new user account.

**Request**:

```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "strongPassword123",
  "isAdmin": false
}
```

**Response**:

```json
{
  "message": "you have been succesfully registered",
  "user": {
    "username": "newuser",
    "email": "user@example.com",
    "isAdmin": false,
    "_id": "64a4c6a6b5c2b9f3e4e9a9c9",
    "createdAt": "2023-07-05T00:00:00.000Z",
    "__v": 0
  }
}
```

**Errors**:

- `500 Internal Server Error`: Could not create the user, likely due to a duplicate `username` or `email`.

---

#### POST /login

Authenticates a user and returns a JWT.

**Request**:

```json
{
  "username": "newuser",
  "password": "strongPassword123"
}
```

**Response**:

```json
{
  "message": "User logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTRjNmE2YjVjMmI5ZjNlNGU5YTljOSIsInVzZXJuYW1lIjoibmV3dXNlciIsImFkbWluIjpmYWxzZSwiaWF0IjoxNjg4NTEzMjc1LCJleHAiOjE2ODg1MTY4NzV9.abcdefg..."
}
```

**Errors**:

- `401 Unauthorized`: Invalid credentials (username or password).
- `500 Internal Server Error`: An unexpected server error occurred.

---

#### GET /users

Retrieves a list of all users. Requires admin authentication.

**Request**:

- **Headers**: `Authorization: Bearer <admin_token>`

**Response**:

```json
{
  "message": "users succesfully retrieved ",
  "users": [
    {
      "_id": "64a4c6a6b5c2b9f3e4e9a9c9",
      "username": "newuser",
      "email": "user@example.com",
      "isAdmin": false,
      "createdAt": "2023-07-05T00:00:00.000Z"
    }
  ]
}
```

**Errors**:

- `401 Unauthorized`: Access denied. Token is missing, invalid, or does not belong to an admin user.
- `404 Not Found`: No user profiles found in the database.
- `500 Internal Server Error`: An unexpected server error occurred.

---

#### POST /create

Creates a new task for the authenticated user.

**Request**:

- **Headers**: `Authorization: Bearer <user_token>`
- **Body**:
  ```json
  {
    "title": "My First Task",
    "description": "This is the description for my first task."
  }
  ```

**Response**:

```json
{
  "message": "new task created successfully",
  "task": {
    "title": "My First Task",
    "description": "This is the description for my first task.",
    "owner": "64a4c6a6b5c2b9f3e4e9a9c9",
    "_id": "64a4c7e7b5c2b9f3e4e9a9d1",
    "date": "2023-07-05T00:00:00.000Z",
    "__v": 0
  }
}
```

**Errors**:

- `401 Unauthorized`: Access denied. Token is missing or invalid.
- `500 Internal Server Error`: An unexpected server error occurred.

---

#### GET /read

Retrieves all tasks for the authenticated user.

**Request**:

- **Headers**: `Authorization: Bearer <user_token>`

**Response**:

```json
{
  "message": "succesful",
  "tasks": [
    {
      "_id": "64a4c7e7b5c2b9f3e4e9a9d1",
      "title": "My First Task",
      "description": "This is the description for my first task.",
      "owner": "64a4c6a6b5c2b9f3e4e9a9c9",
      "date": "2023-07-05T00:00:00.000Z"
    }
  ]
}
```

**Errors**:

- `204 No Content`: The user has not created any tasks.
- `401 Unauthorized`: Access denied. Token is missing or invalid.
- `500 Internal Server Error`: An unexpected server error occurred.

---

#### PATCH /update/:id

Updates a specific task owned by the authenticated user.

**Request**:

- **Headers**: `Authorization: Bearer <user_token>`
- **URL Params**: `id=[task_id]`
- **Body**:
  ```json
  {
    "description": "An updated description for the task."
  }
  ```

**Response**:

```json
{
  "message": "successfully updated task",
  "task": {
    "_id": "64a4c7e7b5c2b9f3e4e9a9d1",
    "title": "My First Task",
    "description": "An updated description for the task.",
    "owner": "64a4c6a6b5c2b9f3e4e9a9c9",
    "date": "2023-07-05T00:00:00.000Z"
  }
}
```

**Errors**:

- `401 Unauthorized`: Access denied. Token is missing or invalid.
- `404 Not Found`: Task with the specified ID does not exist.
- `500 Internal Server Error`: An unexpected server error occurred.

---

#### DELETE /delete/:id

Deletes a specific task owned by the authenticated user.

**Request**:

- **Headers**: `Authorization: Bearer <user_token>`
- **URL Params**: `id=[task_id]`

**Response**:

```json
{
  "message": "successfully deleted task",
  "task": {
    "_id": "64a4c7e7b5c2b9f3e4e9a9d1",
    "title": "My First Task",
    "description": "An updated description for the task.",
    "owner": "64a4c6a6b5c2b9f3e4e9a9c9",
    "date": "2023-07-05T00:00:00.000Z"
  }
}
```

**Errors**:

- `401 Unauthorized`: Access denied. Token is missing or invalid.
- `404 Not Found`: Task with the specified ID does not exist.
- `500 Internal Server Error`: An unexpected server error occurred.

(projectfile)[https://roadmap.sh/projects/todo-list-api]
