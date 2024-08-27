const router = require('express').Router()
const categoryController = require('../controllers/category.controller')
const authMiddleware = require("../middlewares/auth.middleware");
const ROLE = require('../common/role.constant')
const multer = require('multer');
// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

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
//import category from csv file
router.post('/categories/import',
    authMiddleware.authenticateJWT,
    authMiddleware.authorizeRole([ROLE.ADMIN]),
    upload.single('file'),
    (req, res) => {
        /**
         * #swagger.tags = ['Categories']
         * #swagger.description = 'Endpoint to import categories from a CSV file'
         * #swagger.security = [{ "bearerAuth": [] }]
         * #swagger.consumes = ['multipart/form-data']
         * #swagger.parameters['file'] = {
         *   in: 'formData',
         *   description: 'CSV file containing categories',
         *   required: true,
         *   type: 'file'
         * }
         * #swagger.responses[200] = {
         *   description: 'Categories imported successfully',
         *   schema: {
         *     message: 'Import completed. X categories imported successfully.',
         *     errors: ['Error 1', 'Error 2']
         *   }
         * }
         */
        categoryController.importCategoriesFromCSV(req, res);
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