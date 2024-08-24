const postService = require('../services/post.service');
const logger = require('../configs/logger/logger.config');

exports.getAllPost = async (req, res) => {
    logger.info('GET request received for all posts');
    try {
        const { categoryId, userId, keyword, page, size } = req.body;

        if (categoryId && !Number.isInteger(categoryId)) {
            return res.status(400).json({ error: "categoryId must be an integer" });
        }

        if (userId && !Number.isInteger(userId)) {
            return res.status(400).json({ error: "userId must be an integer" });
        }

        if (keyword && typeof keyword !== 'string') {
            return res.status(400).json({ error: "keyword must be a string" });
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
        const { title, content, category_id, tag_id } = req.body;
        const user_id = req.user.userId;

        if (!title || !content || !category_id) {
            return res.status(400).json({
                error: "Title, content, and category_id are required"
            });
        }

        if(!await postService.checkTagExists(tag_id)){
            return res.status(400).json({error: 'Tag not found'});
        }

        const result = await postService.createPost(title, content, user_id, category_id, tag_id);
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