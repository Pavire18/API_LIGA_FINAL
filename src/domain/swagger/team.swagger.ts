/**
 * @swagger
 * components:
 *  schemas:
 *    Team:
 *      type: object
 *      required:
 *        - name
 *        - alias
 *        - delegate
 *        - players
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the team
 *        alias:
 *          type: string
 *          description: Alias of the team
 *        delegate:
 *           $ref: '#/components/schemas/User'
 *           description: Team of the user
 *        players:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *             description: List of players in the team
 */

/**
 * @swagger
 * tags:
 *   name: Team
 *   description: The team managing API
 */

/**
 * @swagger
 * /team:
 *   get:
 *     summary: Lists all the teams
 *     tags: [Team]
 *     responses:
 *       200:
 *         description: The list of the teams
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /team/{id}:
 *   get:
 *     summary: Get a team by ID
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Team ID
 *     responses:
 *       200:
 *         description: The Team info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 */

/**
 * @swagger
 * /team:
 *   post:
 *     summary: Create a new team
 *     tags: [Team]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Team'
 *     responses:
 *       201:
 *         description: The team was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: The request body is incorrect or missing
 */

/**
 * @swagger
 * /team/{id}:
 *   delete:
 *     summary: Deletes a team
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The team ID
 *     responses:
 *       200:
 *         description: The team was deleted successfully
 *       404:
 *         description: The team was not found
 */

/**
 * @swagger
 * /team/{id}:
 *   put:
 *     summary: Update a team
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Team'
 *     responses:
 *       200:
 *         description: The team was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: The request body is incorrect or missing
 *       404:
 *         description: The team was not found
 */
