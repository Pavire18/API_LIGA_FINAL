/**
 * @swagger
 * components:
 *   schemas:
 *     MatchDay:
 *       type: object
 *       properties:
 *        matches:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Match'
 *             description: List of matches of the match day
 *        matchDate:
 *           type: date
 *           description: Date of the match
 */

/**
 * @swagger
 * tags:
 *   name: MatchDay
 *   description: The match day managing API
 */

/**
 * @swagger
 * /matchDay:
 *   get:
 *     summary: Lists all the matches
 *     tags: [MatchDay]
 *     responses:
 *       200:
 *         description: The list of the matches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Match'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
