const tagService = require("../services/tag.service");
const cacheHelper = require('../utils/cacheHelper.utils');
const logger = require('../configs/logger/logger.config');

const CACHE_KEY = 'all_tags';
const CACHE_TTL = 3600; // Cache for 1 hour

exports.getAllTag = async (req, res) => {
    logger.info('GET request received for all tags');
    try {
        // If cache has tags data, return it
        const tags = await cacheHelper.get(CACHE_KEY);
        if (tags) {
            logger.info('Tags retrieved from cache');
            return res.status(200).json(tags);
        }
        // If not found in Redis, fetch from database
        const result = await tagService.getAllTags()
        // Store the tags in Redis for future requests
        await cacheHelper.set(CACHE_KEY, result, CACHE_TTL);
        logger.info('Tags retrieved from database and cached');
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Error in getAllTag: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}

exports.createTag = async (req, res) => {
    logger.info(`POST request received to create tag: ${req.body.name}`);
    try {
        if (!req.body.name) {
            return res.status(422).json({
                error: "Name is required !"
            });
        }
        if (await tagService.checkTagExists(req.body.name)) {
            return res.status(409).json({
                error: `Tag ${req.body.name} already exists`
            });
        }
        const result = await tagService.createTag(req.body.name);
        // Invalidate the cache when a new tag is created
        await cacheHelper.del(CACHE_KEY);
        logger.info(`New tag created: ${req.body.name}`);
        return res.status(201).json(result);
    } catch (error) {
        logger.error(`Error in createTag: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}

exports.updateTag = async (req, res) => {
    logger.info(`PUT request received to update tag ID: ${req.params.id}`);
    try {
        if (!req.body.name) {
            return res.status(422).json({ error: 'Name is required' });
        } else {
            if (!await tagService.checkTagExists(req.body.name)) {
                return res.status(409).json({ error: `Tag ${req.body.name} does not exists` });
            }
        }
        const result = await tagService.updateTag(req.params.id, req.body.name);
        if (!result) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        // Invalidate the cache when a tag is updated
        await cacheHelper.del(CACHE_KEY);
        logger.info(`Tag updated - ID: ${req.params.id}, New Name: ${req.body.name}`);
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Error in updateTag: ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.deleteTag = async (req, res) => {
    logger.info(`DELETE request received for tag ID: ${req.params.id}`);
    try {
        const result = await tagService.deleteTag(req.params.id);
        // Invalidate the cache when a tag is deleted
        await cacheHelper.del(CACHE_KEY);
        logger.info(`Tag deleted - ID: ${req.params.id}`);
        return res.status(204).json(result);
    } catch (error) {
        logger.error(`Error in deleteTag: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}