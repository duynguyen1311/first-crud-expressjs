const database = require("../services/database");
exports.getAllCategories = async (req,res) => {
    try{
        const result = await database.pool.query('Select * from categories');
        console.log(req.session.userId)
        return res.status(200).json(result.rows);
    }catch (error){
        return res.status(500).json({error: error.message});
    }
}
exports.createCategory = async (req,res) => {
    try{
        if(!req.body.name){
            return res.status(422).json({
                error: "Name is required !"
            });
        }
        const existsResult = await database.pool.query({
            text: 'select exists (select * from categories where name = $1)',
            values: [req.body.name]
        });
        if(existsResult.rows[0].exists){
            return res.status(409).json({
                error: `Category ${req.body.name} already exists`
            });
        }
        const result = await database.pool.query({
            text: 'INSERT INTO categories (name) VALUES ($1) RETURNING *',
            values: [req.body.name]
        });
        return res.status(201).json(result.rows[0]);
    }catch (error){
        return res.status(500).json({error: error.message});
    }
}
exports.updateCategory = async (req,res) => {
    try{
        if (!req.body.name) {
            return res.status(422).json({ error: 'Name is required' });
        } else {
            const existsResult = await database.pool.query({
                text: 'SELECT EXISTS (SELECT * FROM categories WHERE name = $1)',
                values: [req.body.name]
            });

            if (existsResult.rows[0].exists) {
                return res.status(409).json({ error: `Category ${req.body.name} already exists` });
            }
        }
        const result = await database.pool.query({
            text: `
                update categories
                set name = $1
                where id = $2
                returning *
            `,
            values: [req.body.name, req.params.id]
        });
        if(result.rowCount === 0) return res.status(404).json({error: 'Category not found'});
        return res.status(200).json(result.rows[0]);
    }catch (error){
        return res.status(500).json({
            error: error.message
        });
    }
}
/*
exports.deleteCategory = async (req, res) => {
    try {
        const countResult = await database.pool.query({
            text: 'SELECT COUNT(*) FROM product WHERE category_id = $1',
            values: [req.params.id]
        });

        if (countResult.rows[0].count > 0) {
            return res.status(409).json({ error: `Category is being used in ${countResult.rows[0].count} product(s)` });
        }

        const result = await database.pool.query({
            text: 'DELETE FROM category WHERE id = $1',
            values: [req.params.id]
        });

        if (result.rowCount == 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}*/
