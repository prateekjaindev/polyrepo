#!/bin/bash

# Function to wait for MongoDB to be ready
wait_for_mongo() {
    echo "Waiting for MongoDB to be ready..."
    until mongosh --eval "print('MongoDB is ready')" &>/dev/null; do
        echo "MongoDB is not ready yet. Waiting..."
        sleep 1
    done
    echo "MongoDB is ready!"
}

# Wait for MongoDB to be ready
wait_for_mongo

# Create admin user
echo "Creating admin user..."
mongosh admin --eval '
db.createUser({
  user: "admin",
  pwd: "password123",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" },
    { role: "clusterAdmin", db: "admin" }
  ]
});'

# Create databases and users
for db in auth-service user-service product-service order-service inventory-service payment-service; do
    echo "Creating database and user for $db..."
    mongosh admin -u admin -p password123 --eval "
    db = db.getSiblingDB('$db');
    db.createUser({
        user: 'admin',
        pwd: 'password123',
        roles: [{ role: 'readWrite', db: '$db' }]
    });
    db.init.insertOne({ initialized: true, timestamp: new Date() });"
done

echo "MongoDB initialization complete!"
