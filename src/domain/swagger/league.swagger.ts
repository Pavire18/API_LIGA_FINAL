/**
 * @swagger
 * components:
 *  schemas:
 *    League:
 *      type: object
 *      required:
 *        - games
 *      properties:
 *        games:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MatchDay'
 *             description: List of matches of the league
 */

/**
 * @swagger
 * tags:
 *   name: League
 *   description: The league managing API
 */

/**
 * @swagger
 * /league:
 *   get:
 *     summary: Lists all the leagues
 *     tags: [League]
 *     responses:
 *       200:
 *         description: The list of the league
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/League'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /league:
 *   post:
 *     summary: Create a new league
 *     tags: [League]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/League'
 *     responses:
 *       201:
 *         description: The league was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/League'
 *       400:
 *         description: The request body is incorrect or missing
 */

/**
 * @swagger
 * /league/reset:
 *   post:
 *     summary: Reset the league
 *     tags: [League]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/League'
 *     responses:
 *       201:
 *         description: The league was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/League'
 *       400:
 *         description: The request body is incorrect or missing
 */

/**
 * @swagger
 * /league/{id}:
 *   put:
 *     summary: Update a league
 *     tags: [League]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The league ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/League'
 *     responses:
 *       200:
 *         description: The league was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/League'
 *       400:
 *         description: The request body is incorrect or missing
 *       404:
 *         description: The league was not found
 */
