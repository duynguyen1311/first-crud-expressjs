const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/register', userController.register )
router.post('/login', userController.login )
router.get('/getAll', userController.getAllUsers)
router.get('/detail/:id', userController.getUserById)
//router.delete('/:id', categoryController.deleteCategory)

module.exports = router