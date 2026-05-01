import express from 'express';
import { getNote, saveNote } from '../controllers/note.controller.js';
import { authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/getNote', authorize, getNote);
router.post('/saveNote', authorize, saveNote);

export default router;
