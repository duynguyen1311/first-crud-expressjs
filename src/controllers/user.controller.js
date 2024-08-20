const userService = require("../services/user.service");
const cacheHelper = require('../utils/cacheHelper.utils');
const CACHE_KEY = 'all_users';
const CACHE_TTL = 3600; // Cache for 1 hour
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if all required fields are present
        if (!username || !email || !password) {
            return res.status(422).json({
                error: "Username, email, and password are required!"
            });
        }
        if (await userService.checkUserExists(email, username)) {
            return res.status(409).json({
                error: "Username or email already exists"
            });
        }
        const result = await userService.register(username, email, password);
        return res.status(201).json(result);
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
        const result = await userService.login(email, password);
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
exports.getAllUsers = async (req, res) => {
    try {
        //If cache has users data, return it
        const users = await cacheHelper.get(CACHE_KEY);
        if (users) return res.status(200).json(users);
        //If not found in Redis, fetch from database
        const result = await userService.getAllUsers();
        //Store the users in Redis for future requests
        await cacheHelper.set(CACHE_KEY, result, CACHE_TTL);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getUserById = async (req, res) => {
    try {
        const result = await userService.getUserById(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getProfile = async (req, res) => {
    try {
        const user = req.session.user;
        console.log("User from session:", user);
        const result = await userService.getProfile(user.userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
exports.changeUserActiveStatus = async (req, res) => {
    try {
        const result = await userService.changeUserActiveStatus(req.params.id, req.params.is_active);
        await cacheHelper.del(CACHE_KEY);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
