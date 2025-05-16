const express = require('express');
const router = express.Router();
const { auth, adminOnly, professionalOnly } = require('../middleware/auth');
const {
  getProfessionals,
  getProfessionalById,
  updateProfessionalProfile,
  uploadVerificationDocuments,
  verifyProfessional,
} = require('../controllers/professionalController');

// Public routes
router.get('/', getProfessionals);
router.get('/:id', getProfessionalById);

// Professional routes
router.put('/profile', auth, professionalOnly, updateProfessionalProfile);
router.post('/verification', auth, professionalOnly, uploadVerificationDocuments);

// Admin routes
router.put('/:id/verify', auth, adminOnly, verifyProfessional);

module.exports = router;