const userService = require("../services/user.service");
const cacheHelper = require('../utils/cacheHelper.utils');
const logger = require('../configs/logger/logger.config');

const CACHE_KEY = 'all_users';
const CACHE_TTL = 3600; // Cache for 1 hour

exports.register = async (req, res) => {
    logger.info('POST request received for user registration');
    try {
        const { username, email, password } = req.body;

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
        logger.info(`New user registered: ${username}`);
        return res.status(201).json(result);
    } catch (error) {
        logger.error(`Error in register: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}

exports.login = async (req, res) => {
    logger.info('POST request received for user login');
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({
                error: "Email and password are required!"
            });
        }
        const result = await userService.login(email, password);
        logger.info(`User logged in: ${email}`);
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Error in login: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}

exports.getAllUsers = async (req, res) => {
    logger.info('GET request received for all users');
    try {
        const users = await cacheHelper.get(CACHE_KEY);
        if (users) {
            logger.info('Users retrieved from cache');
            return res.status(200).json(users);
        }
        const result = await userService.getAllUsers();
        await cacheHelper.set(CACHE_KEY, result, CACHE_TTL);
        logger.info(`Retrieved ${result.length} users from database and cached`);
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Error in getAllUsers: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    logger.info(`GET request received for user ID: ${userId}`);
    try {
        const result = await userService.getUserById(userId);
        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }
        logger.info(`Retrieved user ID: ${userId}`);
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Error in getUserById: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    logger.info('GET request received for user profile');
    try {
        const user = req.session.user;
        logger.info(`User from session: ${JSON.stringify(user)}`);
        const result = await userService.getProfile(user.userId);
        if (!result) {
            return res.status(404).json({ error: "Profile not found" });
        }
        logger.info(`Retrieved profile for user ID: ${user.userId}`);
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Error in getProfile: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}

exports.changeUserActiveStatus = async (req, res) => {
    const userId = req.params.id;
    const isActive = req.params.is_active;
    logger.info(`PUT request received to change active status for user ID: ${userId} to ${isActive}`);
    try {
        const result = await userService.changeUserActiveStatus(userId, isActive);
        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }
        await cacheHelper.del(CACHE_KEY);
        logger.info(`Changed active status for user ID: ${userId} to ${isActive}`);
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Error in changeUserActiveStatus: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}