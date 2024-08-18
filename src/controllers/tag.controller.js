const tagService = require("../services/tag.service");
const cacheHelper = require('../utils/cacheHelper.utils');

const CACHE_KEY = 'all_tags';
const CACHE_TTL = 3600; // Cache for 1 hour

exports.getAllTag = async (req,res) => {
    try{
        //If cache has tags data, return it
        const tags = await cacheHelper.get(CACHE_KEY);
        if(tags) return res.status(200).json(tags);
        //If not found in Redis, fetch from database
        const result = await tagService.getAllTags()
        //Store the tags in Redis for future requests
        await cacheHelper.set(CACHE_KEY, result, CACHE_TTL);
        return res.status(200).json(result);
    }catch (error){
        return res.status(500).json({error: error.message});
    }
}
exports.createTag = async (req,res) => {
    try{
        if(!req.body.name){
            return res.status(422).json({
                error: "Name is required !"
            });
        }
        if(await tagService.checkTagExists(req.body.name)){
            return res.status(409).json({
                error: `Tag ${req.body.name} already exists`
            });
        }
        const result = await tagService.createTag(req.body.name);
        //Invalidate the cache when a new tag is created
        await cacheHelper.del(CACHE_KEY);
        return res.status(201).json(result);
    }catch (error){
        return res.status(500).json({error: error.message});
    }
}
exports.updateTag = async (req,res) => {
    try{
        if (!req.body.name) {
            return res.status(422).json({ error: 'Name is required' });
        } else {
            if (await tagService.checkTagExists(req.body.name)) {
                return res.status(409).json({ error: `Tag ${req.body.name} already exists` });
            }
        }
        const result = await tagService.updateTag(req.params.id, req.body.name);
        if(result) return res.status(404).json({error: 'Tag not found'});
        //Invalidate the cache when a new tag is created
        await cacheHelper.del(CACHE_KEY);
        return res.status(200).json(result);
    }catch (error){
        return res.status(500).json({
            error: error.message
        });
    }
}
exports.deleteTag = async (req, res) => {
    try {
        const result = await tagService.deleteTag(req.params.id);
        //Invalidate the cache when a new tag is created
        await cacheHelper.del(CACHE_KEY);
        return res.status(204).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
