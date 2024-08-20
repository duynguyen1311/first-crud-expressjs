const database = require('../configs/database/db.config')
const postService = require('../services/post.service')
exports.getAllPost = async (req, res) => {
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
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content, category_id, tag_id } = req.body;
        const user_id = req.user.userId
        if (!title || !content || !category_id) {
            return res.status(400).json({
                error: "Title, content, and category_id are required"
            });
        }
        if(!await postService.checkTagExists(tag_id)){
            return res.status(400).json({error: 'Tag not found'});
        }

        const result = await postService.createPost(title,content,user_id,category_id,tag_id);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        const result = await postService.getPostById(postId);
        if (result.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
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
        }
        const result = await postService.updatePost(postId,updatedData)

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};