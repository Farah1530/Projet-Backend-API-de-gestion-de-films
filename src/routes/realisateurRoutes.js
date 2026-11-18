/**
 * Fichier      : src/routes/realisateurRoutes.js
 * Auteur       : Farah1530
 * Date         : 18.11.2026
 * Description  : Liste des routes pour les réalisateurs.
 *                Chaque URL est reliée à une fonction du controller.
 */

// On importe Express
const express = require('express');
// On importe le controller des réalisateurs (les fonctions à appeler)
const realisateurController = require('../controllers/realisateurController');

// On crée un "router" : un petit groupe de routes qu'on branche dans app.js
const router = express.Router();

// Les chemins ci-dessous s'ajoutent à /api/realisateurs (défini dans app.js)

// GET /api/realisateurs : liste de tous les réalisateurs
router.get('/', realisateurController.getAll);
// GET /api/realisateurs/3 : le réalisateur numéro 3
router.get('/:id', realisateurController.getOne);
// POST /api/realisateurs : ajouter un réalisateur
router.post('/', realisateurController.create);
// PUT /api/realisateurs/3 : modifier le réalisateur numéro 3
router.put('/:id', realisateurController.update);
// DELETE /api/realisateurs/3 : supprimer le réalisateur numéro 3
router.delete('/:id', realisateurController.remove);

// On exporte le router pour l'utiliser dans app.js
module.exports = router;
