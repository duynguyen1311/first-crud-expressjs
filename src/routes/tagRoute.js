const router = require('express').Router()
const tagController = require('../controllers/tagController')

router.get('/getAll', tagController.getAllTag )
router.post('/create', tagController.createTag)
router.put('/update/:id', tagController.updateTag)
//router.delete('/:id', categoryController.deleteCategory)

module.exports = router