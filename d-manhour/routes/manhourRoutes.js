// routes/manhourRoutes.js
const express = require('express');
const router = express.Router();
const manhourController = require('../controllers/manhourController');
const { authenticateToken } = require('../middleware/auth'); // Jika menggunakan auth

// Gunakan middleware auth jika diperlukan
// router.use(authenticateToken);

router.get('/', manhourController.getAll);
router.get('/:id', manhourController.getById);
router.post('/', manhourController.create);
router.put('/:id', manhourController.update);
router.delete('/:id', manhourController.delete);

module.exports = router;