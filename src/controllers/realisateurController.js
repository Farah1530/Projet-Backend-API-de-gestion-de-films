/**
 * Fichier      : src/controllers/realisateurController.js
 * Auteur       : Farah1530
 * Date         : 18.11.2026
 * Description  : Logique des routes /api/realisateurs.
 *                Vérifie les données reçues, appelle le model,
 *                puis renvoie la bonne réponse (code HTTP + JSON).
 */

// On importe le model des réalisateurs (les fonctions qui font le SQL)
const Realisateur = require('../models/realisateurModel');

// Crée une erreur avec un code HTTP (400, 404, 409...)
function httpError(status, message) {
    // On crée une erreur normale avec le message
    const err = new Error(message);
    // On lui ajoute le code HTTP, que errorHandler lira
    err.status = status;
    // On renvoie l'erreur pour pouvoir la lancer avec throw
    return err;
}

// Vérifie un texte obligatoire (nom ou prénom). Renvoie un message d'erreur ou null.
function checkTexte(valeur, champ) {
    // Si la valeur est absente, n'est pas du texte, ou ne contient que des espaces
    if (!valeur || typeof valeur !== 'string' || valeur.trim() === '') {
        // on renvoie le message d'erreur avec le nom du champ
        return 'Le champ ' + champ + ' est obligatoire';
    }
    // Si le texte est trop long (les colonnes font 100 caractères max)
    if (valeur.length > 100) {
        // on renvoie le message d'erreur
        return 'Le champ ' + champ + ' ne doit pas dépasser 100 caractères';
    }
    // Pas d'erreur
    return null;
}

// Vérifie toutes les données d'un réalisateur. Renvoie un message d'erreur ou null.
function checkRealisateur(data) {
    // On vérifie le nom
    const erreurNom = checkTexte(data.nom, 'nom');
    // S'il y a une erreur sur le nom, on la renvoie
    if (erreurNom) return erreurNom;

    // On vérifie le prénom
    const erreurPrenom = checkTexte(data.prenom, 'prenom');
    // S'il y a une erreur sur le prénom, on la renvoie
    if (erreurPrenom) return erreurPrenom;

    // La date de naissance est facultative, mais si elle est donnée,
    // elle doit avoir le format AAAA-MM-JJ (par exemple 1970-07-30)
    if (data.date_naissance && !/^\d{4}-\d{2}-\d{2}$/.test(data.date_naissance)) {
        // on renvoie le message d'erreur
        return 'La date de naissance doit avoir le format AAAA-MM-JJ';
    }

    // La nationalité est facultative, mais si elle est donnée, 100 caractères max
    if (data.nationalite && data.nationalite.length > 100) {
        // on renvoie le message d'erreur
        return 'Le champ nationalite ne doit pas dépasser 100 caractères';
    }

    // Tout est bon
    return null;
}

// GET /api/realisateurs : renvoie tous les réalisateurs
async function getAll(req, res) {
    // On demande la liste au model
    const realisateurs = await Realisateur.findAll();
    // On renvoie la liste en JSON (code 200 par défaut)
    res.json(realisateurs);
}

// GET /api/realisateurs/:id : renvoie un seul réalisateur
async function getOne(req, res) {
    // On cherche le réalisateur avec l'id de l'URL
    const realisateur = await Realisateur.findById(req.params.id);
    // Si on ne l'a pas trouvé
    if (!realisateur) {
        // on lance une erreur 404
        throw httpError(404, 'Réalisateur introuvable');
    }
    // Sinon on le renvoie en JSON
    res.json(realisateur);
}

// POST /api/realisateurs : ajoute un réalisateur
async function create(req, res) {
    // On récupère les données du body (ou {} si aucun body n'est envoyé)
    const data = req.body || {};

    // On vérifie les données
    const erreur = checkRealisateur(data);
    // S'il y a un problème
    if (erreur) {
        // on lance une erreur 400 (données invalides)
        throw httpError(400, erreur);
    }

    // On ajoute le réalisateur. Les champs facultatifs absents deviennent null.
    const id = await Realisateur.create(
        data.nom.trim(),
        data.prenom.trim(),
        data.date_naissance || null,
        data.nationalite || null
    );
    // On relit le réalisateur créé dans la base
    const realisateur = await Realisateur.findById(id);
    // On le renvoie avec le code 201 (créé)
    res.status(201).json(realisateur);
}

// PUT /api/realisateurs/:id : modifie un réalisateur
async function update(req, res) {
    // On récupère les données du body (ou {} si aucun body n'est envoyé)
    const data = req.body || {};

    // On vérifie les données
    const erreur = checkRealisateur(data);
    // S'il y a un problème
    if (erreur) {
        // on lance une erreur 400
        throw httpError(400, erreur);
    }

    // On modifie le réalisateur qui a l'id de l'URL
    const lignes = await Realisateur.update(
        req.params.id,
        data.nom.trim(),
        data.prenom.trim(),
        data.date_naissance || null,
        data.nationalite || null
    );
    // Si aucune ligne n'a été trouvée, le réalisateur n'existe pas
    if (lignes === 0) {
        // on lance une erreur 404
        throw httpError(404, 'Réalisateur introuvable');
    }
    // On relit le réalisateur modifié
    const realisateur = await Realisateur.findById(req.params.id);
    // On le renvoie en JSON
    res.json(realisateur);
}

// DELETE /api/realisateurs/:id : supprime un réalisateur
async function remove(req, res) {
    // On essaie de supprimer le réalisateur
    try {
        // On supprime le réalisateur qui a l'id de l'URL
        const lignes = await Realisateur.remove(req.params.id);
        // Si aucune ligne n'a été supprimée, il n'existait pas
        if (lignes === 0) {
            // on lance une erreur 404
            throw httpError(404, 'Réalisateur introuvable');
        }
        // On confirme la suppression
        res.json({ message: 'Réalisateur supprimé' });
    } catch (err) {
        // Si MySQL refuse parce que le réalisateur a encore des films
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            // on lance une erreur 409 (conflit)
            throw httpError(409, 'Impossible de supprimer ce réalisateur : il a encore des films');
        }
        // Sinon on relance l'erreur telle quelle (404 ou 500)
        throw err;
    }
}

// On rend ces fonctions utilisables dans le fichier des routes
module.exports = { getAll, getOne, create, update, remove };
