const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
require('dotenv').config();
const app = express();
const session = require('express-session');
//Config session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 24 * 60 * 60 * 1000
    }
}));
// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
//except request as json
app.use(express.json());
//Use route
app.use('/api/categories', require('./routes/categoryRoute'))
app.use('/api/tags', require('./routes/tagRoute'))
app.use('/api/users', require('./routes/userRoute'))
app.use('/api/posts', require('./routes/postRoute'))
app.listen(3000, () => console.log('Server started on port 3000'));