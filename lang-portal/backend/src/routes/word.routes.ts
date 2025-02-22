import express from 'express';
import { WordController } from '../controllers/word.controller';
import { validate } from '../middleware/validation.middleware';
import { createWordSchema, updateWordSchema, searchWordSchema } from '../validations/word.validation';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const wordController = new WordController();

/**
 * @swagger
 * /api/words:
 *   post:
 *     summary: Create a new word
 *     tags: [Words]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWordInput'
 *     responses:
 *       201:
 *         description: Word created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, validate(createWordSchema), wordController.createWord);

/**
 * @swagger
 * /api/words/search:
 *   get:
 *     summary: Search words
 *     tags: [Words]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Invalid input
 */
router.get('/search', validate(searchWordSchema), wordController.searchWords);

/**
 * @swagger
 * /api/words/{id}:
 *   get:
 *     summary: Get word by ID
 *     tags: [Words]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Word details
 *       404:
 *         description: Word not found
 */
router.get('/:id', wordController.getWord);

/**
 * @swagger
 * /api/words/{id}:
 *   put:
 *     summary: Update word
 *     tags: [Words]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWordInput'
 *     responses:
 *       200:
 *         description: Word updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Word not found
 */
router.put('/:id', authMiddleware, validate(updateWordSchema), wordController.updateWord);

/**
 * @swagger
 * /api/words/{id}:
 *   delete:
 *     summary: Delete word
 *     tags: [Words]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Word deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Word not found
 */
router.delete('/:id', authMiddleware, wordController.deleteWord);

/**
 * @swagger
 * /api/words/{id}/related:
 *   get:
 *     summary: Get related words
 *     tags: [Words]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of related words
 *       404:
 *         description: Word not found
 */
router.get('/:id/related', wordController.getRelatedWords);

export const wordRouter = router;
