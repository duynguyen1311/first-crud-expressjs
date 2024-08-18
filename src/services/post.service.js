const database = require('../configs/database/db.config');
const helper = require('../utils/helper.util');
class PostService {
    async getAllPosts(categoryId, userId, keyword,page, size) {
        const { limit, offset } = helper.getPagination(page, size);
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

        queryText += ` ORDER BY p.created_at DESC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
        values.push(limit, offset);

        const result = await database.pool.query(queryText, values);

        const countQuery = `SELECT COUNT(*) FROM posts p WHERE 1=1` + queryText.split('WHERE 1=1')[1].split('ORDER BY')[0];
        const countResult = await database.pool.query(countQuery, values.slice(0, -2));

        return helper.getPagingData({
            count: parseInt(countResult.rows[0].count),
            rows: result.rows
        }, page, limit);
    }

    async createPost(title, content, userId, categoryId) {
        const result = await database.pool.query({
            text: 'INSERT INTO posts (title, content, user_id, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
            values: [title, content, userId, categoryId]
        });
        return result.rows[0];
    }

    async getPostById(postId) {
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
        return result.rows[0];
    }

    async updatePost(postId, updateData) {
        let updateQuery = 'UPDATE posts SET ';
        const updateValues = [];
        let valueIndex = 1;

        for (const [key, value] of Object.entries(updateData)) {
            updateQuery += `${key} = $${valueIndex}, `;
            updateValues.push(value);
            valueIndex++;
        }

        updateQuery += `updated_at = CURRENT_TIMESTAMP WHERE id = $${valueIndex} RETURNING *`;
        updateValues.push(postId);

        const result = await database.pool.query({
            text: updateQuery,
            values: updateValues
        });

        return result.rows[0];
    }
}

module.exports = new PostService();