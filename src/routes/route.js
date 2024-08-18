const express = require('express');
const router = express.Router();

// Import all route files
const categoryRoutes = require('../routes/category.route');
const tagRoutes = require('../routes/tag.route');
const userRoutes = require('../routes/user.route');
const postRoutes = require('../routes/post.route');

// Use the imported routes
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

module.exports = router;