const database = require('../services/database')
const {query} = require("express");

exports.getAllPost = async (req, res) => {
    try {
        const { categoryId, userId, keyword } = req.body;

        if (categoryId && !Number.isInteger(categoryId)) {
            return res.status(400).json({ error: "categoryId must be an integer" });
        }

        if (userId && !Number.isInteger(userId)) {
            return res.status(400).json({ error: "userId must be an integer" });
        }

        if (keyword && typeof keyword !== 'string') {
            return res.status(400).json({ error: "keyword must be a string" });
        }

        let queryText = `
            SELECT p.id, p.title, p.content, p.created_at, p.updated_at,
            (SELECT row_to_json(category_obj)
             FROM (SELECT id, name FROM categories WHERE id = p.category_id) category_obj) AS "category",
            (SELECT row_to_json(user_obj)
             FROM (SELECT id, username, email FROM users WHERE id = p.user_id) user_obj) AS "user"
            FROM posts p
            WHERE 1=1
        `;

        const values = [];
        let valueIndex = 1;

        if (categoryId) {
            queryText += ` AND p.category_id = $${valueIndex}`;
            values.push(categoryId);
            valueIndex++;
        }

        if (userId) {
            queryText += ` AND p.user_id = $${valueIndex}`;
            values.push(userId);
            valueIndex++;
        }

        if (keyword) {
            queryText += ` AND (p.title ILIKE $${valueIndex} OR p.content ILIKE $${valueIndex})`;
            values.push(`%${keyword}%`);
            valueIndex++;
        }

        queryText += ` ORDER BY p.created_at DESC`;

        const result = await database.pool.query(queryText, values);
        return res.status(200).json(result.rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content, category_id } = req.body;
        const user_id = req.session.userId;
        if (!title || !content || !user_id || !category_id) {
            return res.status(400).json({
                error: "Title, content, user_id, and category_id are required"
            });
        }

        const result = await database.pool.query({
            text: 'INSERT INTO posts (title, content, user_id, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
            values: [title, content, user_id, category_id]
        });

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        const result = await database.pool.query({
            text: `SELECT p.id, p.title, p.content, p.created_at, p.updated_at,
                (SELECT row_to_json(category_obj)
                 FROM (SELECT id, name FROM categories WHERE id = p.category_id) category_obj) AS "category",
                (SELECT row_to_json(user_obj)
                 FROM (SELECT id, username, email FROM users WHERE id = p.user_id) user_obj) AS "user"
                FROM posts p
                WHERE id = $1`,
            values: [postId]
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json(result.rows[0]);
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

        let updateQuery = 'UPDATE posts SET ';
        const updateValues = [];
        let valueIndex = 1;

        if (title) {
            updateQuery += `title = $${valueIndex}, `;
            updateValues.push(title);
            valueIndex++;
        }
        if (content) {
            updateQuery += `content = $${valueIndex}, `;
            updateValues.push(content);
            valueIndex++;
        }
        if (category_id) {
            updateQuery += `category_id = $${valueIndex}, `;
            updateValues.push(category_id);
            valueIndex++;
        }

        updateQuery += `updated_at = CURRENT_TIMESTAMP WHERE id = $${valueIndex} RETURNING *`;
        updateValues.push(postId);

        const result = await database.pool.query({
            text: updateQuery,
            values: updateValues
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};