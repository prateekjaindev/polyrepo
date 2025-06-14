# Polyrepo Example

This is a sample polyrepo structure with multiple Node.js microservices and GitHub Actions CI/CD.

## Services

1. **auth-service**: Authentication and authorization service
2. **user-service**: User management service
3. **product-service**: Product catalog service
4. **order-service**: Order processing service

## Getting Started

1. Clone the repository
2. Navigate to any service directory
3. Run `npm install`
4. Start the service with `npm start`

## CI/CD

GitHub Actions is configured to run tests and build Docker images on push to the
`main` branch. Images are published to the Quay registry and can be started
together with MongoDB using the provided `docker-compose.yml`.
The workflow expects Quay credentials to be stored in the `DOCKERHUB_USERNAME`
and `DOCKERHUB_TOKEN` secrets.

### Running the stack locally

1. Make sure Docker is installed.
2. Run `docker compose up` from the repository root.
3. Navigate to [http://localhost:8080](http://localhost:8080) to access the
   sample frontend.
