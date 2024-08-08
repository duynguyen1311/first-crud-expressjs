const router = require('express').Router()
const categoryController = require('../controllers/categoryController')
const authMiddleware = require("../utils/authMiddleware");

router.get('/getAll',authMiddleware.isAuthenticated, categoryController.getAllCategories )
router.post('/create',authMiddleware.isAuthenticated, categoryController.createCategory)
router.put('/update/:id',authMiddleware.isAuthenticated, categoryController.updateCategory)
//router.delete('/:id', categoryController.deleteCategory)

module.exports = router