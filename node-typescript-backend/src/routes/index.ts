import { Router } from 'express';
import { getAllItems, createItem } from '../controllers';

const router = Router();

router.get('/items', getAllItems);
router.post('/items', createItem);

export default router;