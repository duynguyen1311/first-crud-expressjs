const categoryService = require('../services/category.service');
const cacheHelper = require('../utils/cacheHelper.utils');
const logger = require('../configs/logger/logger.config');
const helper = require('../utils/helper.util');
const fs = require('fs');
const fastcsv = require('fast-csv');
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
        const isValidId = helper.isValidId(req.params.id);
        if (!isValidId) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
        if (!req.body.name) {
            return res.status(422).json({ error: 'Name is required' });
        } else {
            if (await categoryService.checkCategoryExists(req.body.name)) {
                return res.status(409).json({ error: `Category ${req.body.name} already exists` });
            }
        }
        const result = await categoryService.updateCategory(req.params.id, req.body.name);
        if (!result) {
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
        const isValidId = helper.isValidId(req.params.id);
        if (!isValidId) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
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
exports.importCategoriesFromCSV = async (req, res) => {
    logger.info('POST request received to import categories from CSV');
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const results = [];
    const errors = [];

    fastcsv.parseFile(req.file.path, { headers: true })
        .on('data', (data) => results.push(data))
        .on('error', (error) => {
            logger.error(`Error parsing CSV: ${error.message}`);
            errors.push(`Error parsing CSV: ${error.message}`);
        })
        .on('end', async (rowCount) => {
            logger.info(`Parsed ${rowCount} rows`);
            // Check if the file is empty
            if (rowCount === 0) {
                // Delete the uploaded file
                fs.unlinkSync(req.file.path);
                errors.push('No data found in the file');
                return res.status(400).json({ error: 'No data found in the file' });
            }
            for (const row of results) {
                try {
                    if (!row.name) {
                        errors.push(`Skipped row: Name is required`);
                        continue;
                    }
                    if (await categoryService.checkCategoryExists(row.name)) {
                        errors.push(`Skipped: Category ${row.name} already exists`);
                        continue;
                    }
                    await categoryService.createCategory(row.name);
                    logger.info(`Imported category: ${row.name}`);
                } catch (error) {
                    errors.push(`Error importing ${row.name}: ${error.message}`);
                }
            }

            // Invalidate the cache after import
            await cacheHelper.del(CACHE_KEY);

            // Delete the uploaded file
            fs.unlinkSync(req.file.path);

            const message = `Import completed. ${results.length - errors.length} out of ${rowCount} categories imported successfully.`;
            logger.info(message);
            res.status(200).json({ message, errors });
        });
}