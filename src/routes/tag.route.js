const router = require('express').Router()
const tagController = require('../controllers/tag.controller')
const authMiddleware = require('../middlewares/auth.middleware');
const ROLE = require("../common/role.constant");
/*router.get('/getAll', tagController.getAllTag )
router.post('/create', tagController.createTag)
router.put('/update/:id', tagController.updateTag)*/
//router.delete('/:id', categoryController.deleteCategory)

router.get('/',authMiddleware.authenticateJWT,authMiddleware.authorizeRole(ROLE.VIEWER,ROLE.EDITOR,ROLE.ADMIN), (req, res) => {
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

router.post('/',authMiddleware.authenticateJWT,authMiddleware.authorizeRole(ROLE.EDITOR,ROLE.ADMIN), (req, res) => {
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

router.put('/:id',authMiddleware.authenticateJWT,authMiddleware.authorizeRole(ROLE.EDITOR,ROLE.ADMIN), (req, res) => {
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
router.delete('/:id',authMiddleware.authenticateJWT,authMiddleware.authorizeRole(ROLE.EDITOR,ROLE.ADMIN), (req, res) => {
    /**
     * #swagger.tags = ['Tags']
     * #swagger.description = 'Delete a tag'
     * #swagger.parameters['id'] = { description: 'Tag ID' }
     */
    tagController.deleteTag(req, res);
});
module.exports = router