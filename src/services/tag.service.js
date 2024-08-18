const database = require('../configs/database/db.config');

class TagService {
    async getAllTags() {
        const queryText = 'SELECT * FROM tags';
        const result = await database.pool.query(queryText);
        return result.rows;
    }

    async createTag(name) {
        const queryText = 'INSERT INTO tags (name) VALUES ($1) RETURNING *';
        const result = await database.pool.query(queryText, [name]);
        return result.rows[0];
    }

    async getTagById(tagId) {
        const queryText = 'SELECT * FROM tags WHERE id = $1';
        const result = await database.pool.query(queryText, [tagId]);
        return result.rows[0];
    }

    async updateTag(tagId, name) {
        const queryText = 'UPDATE tags SET name = $1 WHERE id = $2 RETURNING *';
        const result = await database.pool.query(queryText, [name, tagId]);
        if(result.rowCount === 0) return null;
        return result.rows[0];
    }

    async deleteTag(tagId) {
        const result = await database.pool({
            text: 'DELETE FROM tags WHERE id = $1',
            values: [tagId]
        });
        if (result.rowCount === 0) {
            return {error: 'Tag not found'};
        }
        return {
            message: 'Tag deleted successfully',
            id: tagId
        };
    }
    async checkTagExists(name) {
        const queryText = 'SELECT EXISTS (SELECT * FROM tags WHERE name = $1)';
        const result = await database.pool.query(queryText, [name]);
        return result.rows[0].exists;
    }
}
module.exports = new TagService();