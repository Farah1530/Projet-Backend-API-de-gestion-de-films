/**
 * Fichier      : src/routes/genreRoutes.js
 * Auteur       : Farah1530
 * Date         : 18.11.2026
 * Description  : Liste des routes pour les genres.
 *                Chaque URL est reliée à une fonction du controller.
 */

// On importe Express
const express = require('express');
// On importe le controller des genres (les fonctions à appeler)
const genreController = require('../controllers/genreController');

// On crée un "router" : un petit groupe de routes qu'on branche dans app.js
const router = express.Router();

// Les chemins ci-dessous s'ajoutent à /api/genres (défini dans app.js).
// Avec Express 5, si une fonction lance une erreur, elle va directement dans errorHandler.

// GET /api/genres : liste de tous les genres
router.get('/', genreController.getAll);
// GET /api/genres/3 : le genre numéro 3
router.get('/:id', genreController.getOne);
// POST /api/genres : ajouter un genre
router.post('/', genreController.create);
// PUT /api/genres/3 : modifier le genre numéro 3
router.put('/:id', genreController.update);
// DELETE /api/genres/3 : supprimer le genre numéro 3
router.delete('/:id', genreController.remove);

// On exporte le router pour l'utiliser dans app.js
module.exports = router;
