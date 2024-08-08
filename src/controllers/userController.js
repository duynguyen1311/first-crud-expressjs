const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require("../services/database");

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if all required fields are present
        if (!username || !email || !password) {
            return res.status(422).json({
                error: "Username, email, and password are required!"
            });
        }

        // Check if user already exists
        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT 1 FROM users WHERE username = $1 OR email = $2)',
            values: [username, email]
        });

        if (existsResult.rows[0].exists) {
            return res.status(409).json({
                error: "Username or email already exists"
            });
        }

        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert the new user
        const result = await database.pool.query({
            text: 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            values: [username, email, passwordHash]
        });
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(422).json({
                error: "Email and password are required!"
            });
        }

        // Find user by email
        const userResult = await database.pool.query({
            text: 'SELECT * FROM users WHERE email = $1',
            values: [email]
        });

        const user = userResult.rows[0];

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Compare provided password with stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Store user ID in session
        req.session.userId = user.id;
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Return user info and token
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token: token
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
exports.getAllUsers = async (req, res) => {
    try {
        const result = await database.pool.query({
            text: 'SELECT id, username, email FROM users ORDER BY id ASC'
        });

        return res.status(200).json(result.rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({
                error: "User ID is required"
            });
        }

        const result = await database.pool.query({
            text: 'SELECT id, username, email FROM users WHERE id = $1',
            values: [userId]
        });

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
