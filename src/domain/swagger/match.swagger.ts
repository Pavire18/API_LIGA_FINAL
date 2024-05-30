/**
 * @swagger
 * components:
 *   schemas:
 *     Match:
 *       type: object
 *       properties:
 *        team1:
 *           $ref: '#/components/schemas/Team'
 *           description: Team 1 of the match
 *        team2:
 *           $ref: '#/components/schemas/Team'
 *           description: Team 2 of the match
 *        goalsTeam1:
 *           type: number
 *           description: Goals of team 1
 *        goalsTeam2:
 *           type: number
 *           description: Goals of team 2
 *        matchDate:
 *           type: date
 *           description: Date of the match
 */

/**
 * @swagger
 * tags:
 *   name: Match
 *   description: The match managing API
 */

/**
 * @swagger
 * /match:
 *   get:
 *     summary: Lists all the matches
 *     tags: [Match]
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

/**
 * @swagger
 * /match/{id}:
 *   get:
 *     summary: Get a match by ID
 *     tags: [Match]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Match ID
 *     responses:
 *       200:
 *         description: The Match info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 */

/**
 * @swagger
 * /match:
 *   post:
 *     summary: Create a new match
 *     tags: [Match]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Match'
 *     responses:
 *       201:
 *         description: The match was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       400:
 *         description: The request body is incorrect or missing
 */

/**
 * @swagger
 * /match/{id}:
 *   delete:
 *     summary: Deletes a match
 *     tags: [Match]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The match ID
 *     responses:
 *       200:
 *         description: The match was deleted successfully
 *       404:
 *         description: The match was not found
 */

/**
 * @swagger
 * /match/{id}:
 *   put:
 *     summary: Update a match
 *     tags: [Match]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The match ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Match'
 *     responses:
 *       200:
 *         description: The match was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       400:
 *         description: The request body is incorrect or missing
 *       404:
 *         description: The match was not found
 */
