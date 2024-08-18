const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'My Demo API',
        description: 'Demo API using ExpressJs'
    },
    host: 'localhost:3000',
    schemes: ['http', 'https'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Enter your bearer token in the format **Bearer &lt;token>**'
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ],
};
const outputFile = './swagger-output.json';
const routes = ['../../index.js', './routes/*.js'];

swaggerAutogen(outputFile, routes, doc);