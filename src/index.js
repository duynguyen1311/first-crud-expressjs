const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./configs/swagger/swagger-output.json');
require('dotenv').config();
const passport = require('passport');
const passportJwtStrategy = require('./configs/strategy/passport-jwt-strategy');
const apiRoutes = require('./routes/route');

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
app.use(passport.initialize());
// Configure Passport JWT strategy
passportJwtStrategy(passport);
//Use route
app.use('/api', apiRoutes);
app.listen(3000, () => console.log('Server started on port 3000'));