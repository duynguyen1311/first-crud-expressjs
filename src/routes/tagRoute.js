const router = require('express').Router()
const tagController = require('../controllers/tagController')

/*router.get('/getAll', tagController.getAllTag )
router.post('/create', tagController.createTag)
router.put('/update/:id', tagController.updateTag)*/
//router.delete('/:id', categoryController.deleteCategory)

router.get('/getAll', (req, res) => {
    /**
     * #swagger.tags = ['Tags']
     * #swagger.description = 'Get all tags'
     * #swagger.responses[200] = {
     *   description: 'Successful response',
     *   schema: {
     *     type: 'array',
     *     items: { $ref: '#/definitions/Tag' }
     *   }
     * }
     */
    tagController.getAllTag(req, res);
});

router.post('/create', (req, res) => {
    /**
     * #swagger.tags = ['Tags']
     * #swagger.description = 'Create a new tag'
     * #swagger.parameters['newTag'] = {
     *   in: 'body',
     *   description: 'New tag information',
     *   required: true,
     *   schema: { $ref: '#/definitions/NewTag' }
     * }
     */
    tagController.createTag(req, res);
});

router.put('/update/:id', (req, res) => {
    /**
     * #swagger.tags = ['Tags']
     * #swagger.description = 'Update a tag'
     * #swagger.parameters['id'] = { description: 'Tag ID' }
     * #swagger.parameters['updatedTag'] = {
     *   in: 'body',
     *   description: 'Updated tag information',
     *   required: true,
     *   schema: { $ref: '#/definitions/UpdateTag' }
     * }
     */
    tagController.updateTag(req, res);
});

module.exports = router