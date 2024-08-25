const router = require('express').Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require("../middlewares/auth.middleware");
const ROLE = require("../common/role.constant");


router.get('/users',authMiddleware.authenticateJWT,authMiddleware.authorizeRole([ROLE.ADMIN]),
    (req, res) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.description = 'Get all users'
     * #swagger.responses[200] = {
     *   description: 'Successful response',
     *   schema: {
     *     type: 'array',
     *     items: { $ref: '#/definitions/User' }
     *   }
     * }
     */
    userController.getAllUsers(req, res);
});
router.get('/users/getProfile',authMiddleware.authenticateJWT, (req, res) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.description = 'Get user profile'
     * #swagger.security = [{ "bearerAuth": [] }]
     */
    userController.getProfile(req, res);
});
router.get('/users/:id',authMiddleware.authenticateJWT,authMiddleware.authorizeRole([ROLE.ADMIN]),
    (req, res) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.description = 'Get a user by ID'
     * #swagger.parameters['id'] = { description: 'User ID' }
     */
    userController.getUserById(req, res);
});
//change user active status
router.put('/users/:id/:is_active',authMiddleware.authenticateJWT,authMiddleware.authorizeRole([ROLE.ADMIN]),
    (req, res) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.description = 'Change user active status'
     * #swagger.parameters['id'] = { description: 'User ID' }
     * #swagger.parameters['is_active'] = { description: 'Active status' }
     */
    userController.changeUserActiveStatus(req, res);
});

router.post('/users/register', (req, res) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.description = 'Register a new user'
     * #swagger.parameters['newUser'] = {
     *   in: 'body',
     *   description: 'New user information',
     *   required: true,
     *   schema: { $ref: '#/definitions/NewUser' }
     * }
     */
    userController.register(req, res);
});

router.post('/users/login', (req, res) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.description = 'User login'
     * #swagger.parameters['credentials'] = {
     *   in: 'body',
     *   description: 'User credentials',
     *   required: true,
     *   schema: { $ref: '#/definitions/UserCredentials' }
     * }
     */
    userController.login(req, res);
});
module.exports = router