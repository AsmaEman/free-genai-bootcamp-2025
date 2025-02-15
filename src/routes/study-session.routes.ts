import express from 'express';
import { StudySessionController } from '../controllers/study-session.controller';
import { validate } from '../middleware/validation.middleware';
import { createSessionSchema, updateSessionSchema, getSessionsSchema } from '../validations/study-session.validation';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const studySessionController = new StudySessionController();

// All study session routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/study-sessions:
 *   post:
 *     summary: Create a new study session
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSessionInput'
 *     responses:
 *       201:
 *         description: Study session created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', validate(createSessionSchema), studySessionController.createSession);

/**
 * @swagger
 * /api/study-sessions/user:
 *   get:
 *     summary: Get user's study sessions
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [completed, interrupted, in_progress]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
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
 *         description: List of study sessions
 *       401:
 *         description: Unauthorized
 */
router.get('/user/:userId', validate(getSessionsSchema), studySessionController.getUserSessions);

/**
 * @swagger
 * /api/study-sessions/{id}:
 *   get:
 *     summary: Get study session by ID
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Study session details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
router.get('/:id', studySessionController.getSession);

/**
 * @swagger
 * /api/study-sessions/{id}:
 *   put:
 *     summary: Update study session
 *     tags: [Study Sessions]
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
 *             $ref: '#/components/schemas/UpdateSessionInput'
 *     responses:
 *       200:
 *         description: Study session updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
router.put('/:id', validate(updateSessionSchema), studySessionController.updateSession);

/**
 * @swagger
 * /api/study-sessions/{id}:
 *   delete:
 *     summary: Delete study session
 *     tags: [Study Sessions]
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
 *         description: Study session deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
router.delete('/:id', studySessionController.deleteSession);

export const studySessionRouter = router;
