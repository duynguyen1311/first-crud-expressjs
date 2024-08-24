const router = require('express').Router()
const categoryController = require('../controllers/category.controller')
const authMiddleware = require("../middlewares/auth.middleware");
const ROLE = require('../common/role.constant')

/*router.get('/getAll',authMiddleware.isAuthenticated, categoryController.getAllCategories )
router.post('/create',authMiddleware.isAuthenticated, categoryController.createCategory)
router.put('/update/:id',authMiddleware.isAuthenticated, categoryController.updateCategory)*/
//router.delete('/:id', categoryController.deleteCategory)

router.post('/categories', authMiddleware.authenticateJWT,authMiddleware.authorizeRole([ROLE.ADMIN]),
    (req, res) => {
    /**
     * #swagger.tags = ['Categories']
     * #swagger.description = 'Endpoint to create a new category'
     * #swagger.security = [{ "bearerAuth": [] }]
     * #swagger.parameters['newCategory'] = {
     *   in: 'body',
     *   description: 'New category information',
     *   required: true,
     *   schema: { $ref: '#/definitions/NewCategory' }
     * }
     * #swagger.responses[201] = {
     *   description: 'Category created successfully',
     *   schema: { $ref: '#/definitions/Category' }
     * }
     */
    categoryController.createCategory(req, res);
});

router.put('/categories/:id', authMiddleware.authenticateJWT,authMiddleware.authorizeRole([ROLE.ADMIN]),
    (req, res) => {
    /**
     * #swagger.tags = ['Categories']
     * #swagger.description = 'Endpoint to update a category'
     * #swagger.security = [{ "bearerAuth": [] }]
     * #swagger.parameters['id'] = { description: 'Category ID' }
     * #swagger.parameters['updatedCategory'] = {
     *   in: 'body',
     *   description: 'Updated category information',
     *   required: true,
     *   schema: { $ref: '#/definitions/UpdateCategory' }
     * }
     * #swagger.responses[200] = {
     *   description: 'Category updated successfully',
     *   schema: { $ref: '#/definitions/Category' }
     * }
     */
    categoryController.updateCategory(req, res);
});

router.delete('/categories/:id', authMiddleware.authenticateJWT,authMiddleware.authorizeRole([ROLE.ADMIN]),
    (req, res) => {
    /**
     * #swagger.tags = ['Categories']
     * #swagger.description = 'Endpoint to delete a category'
     * #swagger.security = [{ "bearerAuth": [] }]
     * #swagger.parameters['id'] = { description: 'Category ID' }
     * #swagger.responses[204] = {
     *   description: 'Category deleted successfully'
     * }
     */
    categoryController.deleteCategory(req, res);
});
router.get('/categories', authMiddleware.authenticateJWT
    ,authMiddleware.authorizeRole([ROLE.VIEWER]), (req, res) => {
    /**
     * #swagger.tags = ['Categories']
     * #swagger.description = 'Endpoint to get all categories'
     * #swagger.security = [{ "bearerAuth": [] }]
     * #swagger.responses[200] = {
     *   description: 'Successful response',
     *   schema: {
     *     type: 'array',
     *     items: { $ref: '#/definitions/Category' }
     *   }
     * }
     */
    categoryController.getAllCategories(req, res);
});





module.exports = router