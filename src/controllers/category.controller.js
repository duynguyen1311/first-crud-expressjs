const categoryService = require('../services/category.service');
const cacheHelper = require('../utils/cacheHelper.utils');
const logger = require('../configs/logger/logger.config');

const CACHE_KEY = 'all_categories';
const CACHE_TTL = 3600; // Cache for 1 hour

exports.getAllCategories = async (req, res) => {
    logger.info(`GET request received for all categories`);
    try {
        // Try to get categories from cache
        const cachedCategories = await cacheHelper.get(CACHE_KEY);
        if (cachedCategories) {
            logger.info('Categories retrieved from cache');
            return res.status(200).json(cachedCategories);
        }
        // If not found in Redis, fetch from database
        const result = await categoryService.getAllCategories();
        // Store the categories in Redis for future requests
        await cacheHelper.set(CACHE_KEY, result, CACHE_TTL);

        logger.info('Categories retrieved from database and cached');
        return res.status(200).json(result);

    } catch (error) {
        logger.error(`Error in getAllCategories: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}

exports.createCategory = async (req, res) => {
    logger.info(`POST request received to create category: ${req.body.name}`);
    try {
        if (!req.body.name) {
            logger.warn('Attempt to create category without name');
            return res.status(422).json({
                error: "Name is required !"
            });
        }
        if (await categoryService.checkCategoryExists(req.body.name)) {
            logger.warn(`Attempt to create duplicate category: ${req.body.name}`);
            return res.status(409).json({
                error: `Category ${req.body.name} already exists`
            });
        }
        const result = await categoryService.createCategory(req.body.name);

        // Invalidate the cache when a new category is created
        await cacheHelper.del(CACHE_KEY);

        logger.info(`New category created: ${req.body.name}`);
        return res.status(201).json(result);
    } catch (error) {
        logger.error(`Error in createCategory: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}

exports.updateCategory = async (req, res) => {
    logger.info(`PUT request received to update category ID: ${req.params.id}`);
    try {
        if (!req.body.name) {
            logger.warn('Attempt to update category without name');
            return res.status(422).json({ error: 'Name is required' });
        } else {
            if (await categoryService.checkCategoryExists(req.body.name)) {
                logger.warn(`Attempt to update to existing category name: ${req.body.name}`);
                return res.status(409).json({ error: `Category ${req.body.name} already exists` });
            }
        }
        const result = await categoryService.updateCategory(req.params.id, req.body.name);
        if (!result) {
            logger.warn(`Attempt to update non-existent category ID: ${req.params.id}`);
            return res.status(404).json({ error: 'Category not found' });
        }

        // Invalidate the cache when a category is updated
        await cacheHelper.del(CACHE_KEY);

        logger.info(`Category updated - ID: ${req.params.id}, New Name: ${req.body.name}`);
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Error in updateCategory: ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.deleteCategory = async (req, res) => {
    logger.info(`DELETE request received for category ID: ${req.params.id}`);
    try {
        const result = await categoryService.deleteCategory(req.params.id);

        // Invalidate the cache when a category is deleted
        await cacheHelper.del(CACHE_KEY);

        logger.info(`Category deleted - ID: ${req.params.id}`);
        return res.status(204).json(result);
    } catch (error) {
        logger.error(`Error in deleteCategory: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}