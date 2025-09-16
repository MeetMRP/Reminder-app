# Reminder App

This is a simple, full-stack web application for creating and managing reminders. It is built with Node.js, Express, and MongoDB, and is fully containerized using Docker.

## 1. Application Quickstart

This section covers the essential commands to get the application running and to shut it down.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Jenkins](https://www.jenkins.io/)

### Running the Application

There are 2 ways to run the application

#### Direct run the application using the docker compose file

To build and start all the services in the background, run the following command from the project root:

```bash
docker-compose -f docker-compose.app.yaml up --build -d
```

After running this, the following services will be accessible:

- **Reminder App**: `http://localhost:3000`
- **Mongo Express** (Database Admin UI): `http://localhost:8081`
  - *Credentials*: `admin` / `pass`

#### Build the jenkins pipeline and then use the pipeline to test and deploy the application

To get jenkins up run this

```bash
docker-compose -f docker-compose.jenkins.yaml up --build -d
```

After running this, jenkins will be visible here

- **Jenkins Pipeline**: `http://localhost:8080`

### Stopping the Application

To stop and remove all the running containers, execute:

```bash
docker-compose down
```

---

## 2. Docker Configuration

This project uses Docker to containerize the application and its database.

### Dockerfile

The `docker/Dockerfile` is responsible for creating the image for the Node.js application. It follows a multi-stage approach to optimize for build caching:

1. Starts from a `node:18-alpine` base image.
2. Copies `package.json` and installs dependencies. This step is cached and only re-runs if dependencies change.
3. Copies the rest of the application source code.
4. Exposes port `3000` and sets the startup command to `node app.js`.

### Docker Compose

The `docker-compose.yml` file orchestrates the multi-container setup. It defines three services:

- **`mongo`**: The MongoDB database instance. It uses the official `mongo:latest` image and persists data to a Docker volume named `mongo-data`.
- **`mongo-express`**: A web-based administration interface for MongoDB, which is useful for viewing and managing data directly.
- **`reminder-app`**: The main application service. It is built using the `Dockerfile` and is configured to connect to the `mongo` service.

---

## 3. Testing

The application includes a basic integration test to ensure the server is running and responsive.

### Test Case

The test file is located at `app/tests/app.test.js`. It contains one primary test:

- **`Check if server is up and running`**: This test sends a `GET` request to the root URL (`/`) of the application and expects a `200 OK` status code in response.

### How to Run the Test

1. **Start the application** using `docker-compose up`.
2. **Execute the test script**: Open a new terminal and run the following command from the project root:
   ```bash
   npm test --prefix ./app
   ```

   This command runs Jest, which will automatically find and execute the test files.

### Testing in Different Environments

The test is configured to use the `APP_URL` environment variable to determine the target server address. If this variable is not set, it defaults to `http://localhost:3000`.

This is significant because it allows you to run the same test against different environments (e.g., local, staging, production) without changing the code. For example, in a CI/CD pipeline, you could run the test against a deployed staging environment like this:

```bash
APP_URL=http://your-deployed-app.com npm test --prefix ./app
```

This command sets the `APP_URL` for the duration of the test run, pointing the test to your deployed application.

---

## 4. Application Details

### Features

- **Create, Read, Update, Delete (CRUD)** operations for reminders.
- Mark reminders as **complete** or undo completion.
- Simple and clean user interface.
- Default date and time are pre-filled to the current time for convenience.

### API Endpoints

The backend server in `app/app.js` provides the following RESTful endpoints:

- `GET /api/reminders`: Fetches all reminders.
- `POST /api/reminders`: Creates a new reminder.
- `PUT /api/reminders/:id`: Updates an existing reminder (used for editing and toggling completion).
- `DELETE /api/reminders/:id`: Deletes a reminder.

### Project Structure

The project is organized into the following directories:

- **`/app`**: Contains all the Node.js application source code, including `app.js`, `package.json`, the `public` frontend assets, and `tests`.
- **`/docker`**: Holds the `Dockerfile` for building the application image.
- **`/jenkins`**: Intended for Jenkins CI/CD pipeline configuration (`Jenkinsfile`).
- **`/`**: The root directory contains the main `docker-compose.yml` and this `README.md`.
