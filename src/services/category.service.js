const database = require('../configs/database/db.config');

class CategoryService{
    async getAllCategories(){
        const result = await database.pool.query('Select * from categories');
        return result.rows;
    }

    async createCategory(name){
        const existsResult = await database.pool.query({
            text: 'select exists (select * from categories where name = $1)',
            values: [name]
        });
        if(existsResult.rows[0].exists){
            return null;
        }
        const result = await database.pool.query({
            text: 'INSERT INTO categories (name) VALUES ($1) RETURNING *',
            values: [name]
        });
        return result.rows[0];
    }

    async updateCategory(id, name){
        const result = await database.pool.query({
            text: `
                update categories
                set name = $1
                where id = $2
                returning *
            `,
            values: [name, id]
        });
        if(result.rowCount === 0) return null;
        return result.rows[0];
    }
    async deleteCategory(id){
        const countResult = await database.pool.query({
            text: 'SELECT COUNT(*) FROM product WHERE category_id = $1',
            values: [id]
        });
        if (countResult.rows[0].count > 0) {
            return {error: `Category is being used in ${countResult.rows[0].count} product(s)`};
        }
        const result = await database.pool.query({
            text: 'DELETE FROM categories WHERE id = $1',
            values: [id]
        });
        if (result.rowCount === 0) {
            return {error: 'Category not found'};
        }
        return {
            message: 'Category deleted successfully',
            id: id
        };
    }
    async checkCategoryExists(name){
        const existsResult = await database.pool.query({
            text: 'select exists (select * from categories where name = $1)',
            values: [name]
        });
        return existsResult.rows[0].exists
    }
}
module.exports = new CategoryService();