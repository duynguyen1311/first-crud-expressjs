const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require("../configs/database/db.config");
const ROLE = require("../common/role.constant");
class UserService {
    async login(email, password){
        let role = '';
        // Find user by email
        const user = await this.getUserByEmail(email);
        // Check if user exists
        if (!user) {
            return {error: "Invalid email or password"};
        }
        // Compare provided password with stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return {error: "Invalid email or password"};
        }
        switch (user.role_id) {
            case 1:
                role = ROLE.ADMIN;
                break;
            case 2:
                role = ROLE.EDITOR;
                break;
            default:
                role = ROLE.VIEWER;
                break;
        }
        // Generate JWT token
        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            role: role
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        return {
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token: token
        };
    }
    async register(username, email, password){
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const result = await database.pool.query({
            text: 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            values: [username, email, passwordHash]
        });
        return result.rows[0];
    }
    async getAllUsers(){
        const result = await database.pool.query({
            text: 'SELECT id, username, email FROM users ORDER BY id ASC'
        });
        return result.rows;
    }
    async getUserById(id){
        const result = await database.pool.query({
            text: 'SELECT id, username, email FROM users WHERE id = $1',
            values: [id]
        });
        if(!id) return {error: "User ID is required"};
        if(result.rows.length === 0) return {error: "User not found"};
        return result.rows[0];
    }
    async getUserByEmail(email){
        const result = await database.pool.query({
            text: 'SELECT id, username, email, password_hash FROM users WHERE email = $1',
            values: [email]
        });
        if(result.rows.length === 0) return null;
        return result.rows[0];
    }
    async checkUserExists(email, username){
        // Check if user already exists
        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT 1 FROM users WHERE username = $1 OR email = $2)',
            values: [username, email]
        });
        return existsResult.rows[0].exists;
    }
    async getProfile(userId){
        const result = await database.pool.query({
            text: 'SELECT id, username, email FROM users WHERE id = $1',
            values: [userId]
        });
        if(result.rows.length === 0) return {error: "User not found"};
        return result.rows[0];
    }
}
module.exports = new UserService();