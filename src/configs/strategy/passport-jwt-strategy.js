const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('../database/db.config'); // Adjust this path to your database connection file

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET, // Use environment variable in production
};

const strategy = new JwtStrategy(options, async (jwtPayload, next) => {
    try {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await db.pool.query(query, [jwtPayload.userId]);
        if (result.rows.length > 0) {
            return next(null, jwtPayload);
        }
        return next(null, false);
    } catch (error) {
        return next(error, false);
    }
});

module.exports = (passport) => {
    passport.use(strategy);
};