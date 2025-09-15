# Reminder App

This is a simple web-based reminder application built with Node.js, Express, and MongoDB.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Running the Application

1. **Clone the repository** (or ensure you are in the project's root directory).
2. **Build and run the application using Docker Compose:**
   Open a terminal in the project's root directory and run the following command:

   ```bash
   docker-compose -f mongo-docker-compose.yaml up --build -d
   ```

   This command will:

   - Build the Docker image for the Node.js application.
   - Start containers for the application, the MongoDB database, and Mongo Express.

## Accessing the Application

Once the containers are running, you can access the different parts of the application:

- **Reminder App**: [http://localhost:3000](http://localhost:3000)
- **Mongo Express** (database admin interface): [http://localhost:8081](http://localhost:8081 "creds-&gt; admin:pass")

## Stopping the Application

To stop and remove the containers, press `Ctrl+C` in the terminal where the application is running, and then execute the following command:

```bash
docker-compose -f mongo-docker-compose.yaml down
```
