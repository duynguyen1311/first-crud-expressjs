const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../configs/database/db.config');

const secretKey = process.env.JWT_SECRET

// Middleware to authenticate requests
const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.session.user = user; // This sets the user information in the request
        next();
    })(req, res, next);
};

// Middleware for role-based authorization
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        console.log(allowedRoles)
        console.log("Author:",req.user)
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    };
};

module.exports = {
    authenticateJWT,
    authorizeRole,
};