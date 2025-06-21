// Initialize MongoDB with databases and users
const databases = [
  'auth-service',
  'user-service',
  'product-service',
  'order-service',
  'inventory-service',
  'payment-service'
];

// First create the admin user in the admin database
db = db.getSiblingDB('admin');
db.createUser({
  user: 'admin',
  pwd: 'password123',
  roles: [
    { role: 'userAdminAnyDatabase', db: 'admin' },
    { role: 'readWriteAnyDatabase', db: 'admin' },
    { role: 'dbAdminAnyDatabase', db: 'admin' },
    { role: 'clusterAdmin', db: 'admin' }
  ]
});

// Authenticate as the admin user
db.auth('admin', 'password123');

// Create databases and users
for (const dbName of databases) {
  // Switch to the database (creates it if it doesn't exist)
  db = db.getSiblingDB(dbName);
  
  // Create a user for the database
  db.createUser({
    user: 'admin',
    pwd: 'password123',
    roles: [
      {
        role: 'readWrite',
        db: dbName
      }
    ]
  });
  
  // Insert a document to ensure the database is created
  db.init.insertOne({ initialized: true, timestamp: new Date() });
}
