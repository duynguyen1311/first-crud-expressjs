const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'My Demo API',
        description: 'Demo API using ExpressJs'
    },
    host: 'localhost:3000'
};
const outputFile = './swagger-output.json';
const routes = ['../index.js', './routes/*.js'];

swaggerAutogen(outputFile, routes, doc);