const router = require('express').Router()
const userController = require('../controllers/userController')

/*router.post('/register', userController.register )
router.post('/login', userController.login )
router.get('/getAll', userController.getAllUsers)
router.get('/detail/:id', userController.getUserById)*/
//router.delete('/:id', categoryController.deleteCategory)

router.post('/register', (req, res) => {
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

router.post('/login', (req, res) => {
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

router.get('/getAll', (req, res) => {
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

router.get('/detail/:id', (req, res) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.description = 'Get a user by ID'
     * #swagger.parameters['id'] = { description: 'User ID' }
     */
    userController.getUserById(req, res);
});

module.exports = router