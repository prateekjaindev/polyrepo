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

## CI/CD with GitHub Actions

GitHub Actions is configured to build and push Docker images to Quay.io for each service. The workflows are triggered on push to the `main` branch or manually via workflow dispatch.

### Required GitHub Secrets

You need to set up the following secrets in your GitHub repository:

1. `QUAY_USERNAME` - Your Quay.io username
2. `QUAY_PASSWORD` - Your Quay.io password or authentication token

To set up the secrets:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each secret with its corresponding value

### Available Workflows

Each service has its own workflow file that builds and pushes its Docker image to Quay.io:

- `auth-service` - Builds and pushes to `quay.io/prateekjain/auth-service`
- `user-service` - Builds and pushes to `quay.io/prateekjain/user-service`
- `product-service` - Builds and pushes to `quay.io/prateekjain/product-service`
- `order-service` - Builds and pushes to `quay.io/prateekjain/order-service`
- `inventory-service` - Builds and pushes to `quay.io/prateekjain/inventory-service`
- `payment-service` - Builds and pushes to `quay.io/prateekjain/payment-service`

### Manual Trigger

You can manually trigger a build for any service by:
1. Going to the "Actions" tab in your GitHub repository
2. Selecting the workflow for the service you want to build
3. Clicking "Run workflow" and selecting the branch

### Image Tags

Images are tagged with:
- Branch name for branch builds
- Pull request number for PRs
- Semantic version tags (if using semantic versioning in your commits)

### Running the stack locally

1. Make sure Docker is installed.
2. Run `docker compose up` from the repository root.
3. Navigate to [http://localhost:8080](http://localhost:8080) to access the
   sample frontend.
