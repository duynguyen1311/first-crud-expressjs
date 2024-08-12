const router = require('express').Router();
const postController = require('../controllers/postController')
const authMiddleware = require('../utils/authMiddleware');

/*router.post('/getAll',authMiddleware.isAuthenticated, postController.getAllPost);
router.post('/create',authMiddleware.isAuthenticated, postController.createPost);
router.get('/detail/:id',authMiddleware.isAuthenticated, postController.getPostById);
router.put('/update/:id',authMiddleware.isAuthenticated, postController.updatePost);*/

router.post('/getAll', authMiddleware.isAuthenticated, (req, res) => {
    /**
     * #swagger.tags = ['Posts']
     * #swagger.description = 'Get all posts'
     * #swagger.security = [{ "bearerAuth": [] }]
     * #swagger.responses[200] = {
     *   description: 'Successful response',
     *   schema: {
     *     type: 'array',
     *     items: { $ref: '#/definitions/Post' }
     *   }
     * }
     */
    postController.getAllPost(req, res);
});

router.post('/create', authMiddleware.isAuthenticated, (req, res) => {
    /**
     * #swagger.tags = ['Posts']
     * #swagger.description = 'Create a new post'
     * #swagger.security = [{ "bearerAuth": [] }]
     * #swagger.parameters['newPost'] = {
     *   in: 'body',
     *   description: 'New post information',
     *   required: true,
     *   schema: { $ref: '#/definitions/NewPost' }
     * }
     */
    postController.createPost(req, res);
});

router.get('/detail/:id', authMiddleware.isAuthenticated, (req, res) => {
    /**
     * #swagger.tags = ['Posts']
     * #swagger.description = 'Get a post by ID'
     * #swagger.security = [{ "bearerAuth": [] }]
     * #swagger.parameters['id'] = { description: 'Post ID' }
     */
    postController.getPostById(req, res);
});

router.put('/update/:id', authMiddleware.isAuthenticated, (req, res) => {
    /**
     * #swagger.tags = ['Posts']
     * #swagger.description = 'Update a post'
     * #swagger.security = [{ "bearerAuth": [] }]
     * #swagger.parameters['id'] = { description: 'Post ID' }
     * #swagger.parameters['updatedPost'] = {
     *   in: 'body',
     *   description: 'Updated post information',
     *   required: true,
     *   schema: { $ref: '#/definitions/UpdatePost' }
     * }
     */
    postController.updatePost(req, res);
});


module.exports = router