const router = require('express').Router();
const postController = require('../controllers/postController')
const authMiddleware = require('../utils/authMiddleware');

router.post('/getAll',authMiddleware.isAuthenticated, postController.getAllPost);
router.post('/create',authMiddleware.isAuthenticated, postController.createPost);
router.get('/detail/:id',authMiddleware.isAuthenticated, postController.getPostById);
router.put('/update/:id',authMiddleware.isAuthenticated, postController.updatePost);

module.exports = router