const postService = require('../services/post.service');
const logger = require('../configs/logger/logger.config');
const helper = require('../utils/helper.util');
exports.getAllPost = async (req, res) => {
    logger.info('GET request received for all posts');
    try {
        const { categoryId, userId, keyword, page, size } = req.body;
        const validation = helper.validatePostQuery(categoryId, userId, keyword, page, size);
        if (!validation.isValid) {
            return res.status(400).json(validation.errors);
        }
        const posts = await postService.getAllPosts(categoryId, userId, keyword, page, size);
        logger.info(`Retrieved ${posts.length} posts`);
        return res.status(200).json(posts);
    } catch (error) {
        logger.error(`Error in getAllPost: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    logger.info('POST request received to create a new post');
    try {
        const { title, content, category_id, tagIds } = req.body;
        const user_id = req.session.user.userId;
        const validation = helper.validatePostInput({ title, content, category_id, tagIds });
        if (!validation.isValid) {
            logger.error(`Invalid request: ${validation.errors}`);
            return res.status(400).json(validation.errors);
        }

        const result = await postService.createPost(title, content, user_id, category_id, tagIds);
        logger.info(`New post created with ID: ${result.id}`);
        return res.status(201).json(result);
    } catch (error) {
        logger.error(`Error in createPost: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    const postId = req.params.id;
    logger.info(`GET request received for post ID: ${postId}`);
    try {
        const isValidId = helper.isValidId(req.params.id);
        if (!isValidId) {
            return res.status(400).json({ error: 'Invalid post ID' });
        }
        const result = await postService.getPostById(postId);
        if (result.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        logger.info(`Retrieved post ID: ${postId}`);
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Error in getPostById: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    const postId = req.params.id;
    logger.info(`PUT request received to update post ID: ${postId}`);
    try {
        const { title, content, category_id } = req.body;
        const isValidId = helper.isValidId(req.params.id);
        if (!isValidId) {
            return res.status(400).json({ error: 'Invalid post ID' });
        }
        if (!title && !content && !category_id) {
            return res.status(400).json({
                error: "At least one field (title, content, or category_id) must be provided for update"
            });
        }

        const updatedData = {
            title: title,
            content: content,
            category_id: category_id
        };

        const result = await postService.updatePost(postId, updatedData);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        logger.info(`Updated post ID: ${postId}`);
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error(`Error in updatePost: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
};