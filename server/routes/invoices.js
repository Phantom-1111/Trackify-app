import express from 'express';
import protect from '../middleware/auth.js';
import { getInvoiceData } from '../controllers/invoiceController.js';
const router = express.Router();
router.use(protect);
router.get('/generate', getInvoiceData);
export default router;