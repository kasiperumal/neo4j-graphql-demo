const neo4j = require('neo4j-driver');

// Replace with your Neo4j connection details
const uri = 'bolt+s://your-neo4j-host:7687';
const user = 'your-username';
const password = 'your-password';

// Create a driver instance
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), { encrypted: 'ENCRYPTION_ON' });

// Create a session
const session = driver.session();

// Example query
const query = 'MATCH (n) RETURN n LIMIT 10';

// Run the query
session.run(query)
    .then(result => {
        result.records.forEach(record => {
            console.log(record.get('n'));
        });
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        // Close the session and driver connections
        session.close();
        driver.close();
    });
