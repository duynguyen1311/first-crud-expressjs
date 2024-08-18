const categoryService = require('../services/category.service');
const cacheHelper = require('../utils/cacheHelper.utils');

const CACHE_KEY = 'all_categories';
const CACHE_TTL = 3600; // Cache for 1 hour

exports.getAllCategories = async (req, res) => {
    try {
        // Try to get categories from cache
        const cachedCategories = await cacheHelper.get(CACHE_KEY);
        if (cachedCategories) {
            return res.status(200).json(cachedCategories);
        }
        // If not found in Redis, fetch from database
        const result = await categoryService.getAllCategories();
        // Store the categories in Redis for future requests
        await cacheHelper.set(CACHE_KEY, result, CACHE_TTL);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.createCategory = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(422).json({
                error: "Name is required !"
            });
        }
        if (await categoryService.checkCategoryExists(req.body.name)) {
            return res.status(409).json({
                error: `Category ${req.body.name} already exists`
            });
        }
        const result = await categoryService.createCategory(req.body.name);

        // Invalidate the cache when a new category is created
        await cacheHelper.del(CACHE_KEY);

        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(422).json({ error: 'Name is required' });
        } else {
            if (await categoryService.checkCategoryExists(req.body.name)) {
                return res.status(409).json({ error: `Category ${req.body.name} already exists` });
            }
        }
        const result = await categoryService.updateCategory(req.params.id, req.body.name);
        if (!result) return res.status(404).json({ error: 'Category not found' });

        // Invalidate the cache when a category is updated
        await cacheHelper.del(CACHE_KEY);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const result = await categoryService.deleteCategory(req.params.id);

        // Invalidate the cache when a category is updated
        await cacheHelper.del(CACHE_KEY);

        return res.status(204).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}