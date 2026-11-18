/**
 * Fichier      : src/controllers/genreController.js
 * Auteur       : Farah1530
 * Date         : 18.11.2026
 * Description  : Logique des routes /api/genres.
 *                Vérifie les données reçues, appelle le model,
 *                puis renvoie la bonne réponse (code HTTP + JSON).
 */

// On importe le model des genres (les fonctions qui font le SQL)
const Genre = require('../models/genreModel');

// Crée une erreur avec un code HTTP (400, 404, 409...)
function httpError(status, message) {
    // On crée une erreur normale avec le message
    const err = new Error(message);
    // On lui ajoute le code HTTP, que errorHandler lira
    err.status = status;
    // On renvoie l'erreur pour pouvoir la lancer avec throw
    return err;
}

// Vérifie que le nom est correct. Renvoie un message d'erreur ou null.
function checkNom(nom) {
    // Si le nom est absent, n'est pas du texte, ou ne contient que des espaces
    if (!nom || typeof nom !== 'string' || nom.trim() === '') {
        // on renvoie le message d'erreur
        return 'Le nom du genre est obligatoire';
    }
    // Si le nom est trop long (la colonne fait 50 caractères max)
    if (nom.length > 50) {
        // on renvoie le message d'erreur
        return 'Le nom du genre ne doit pas dépasser 50 caractères';
    }
    // Pas d'erreur : le nom est bon
    return null;
}

// GET /api/genres : renvoie tous les genres
async function getAll(req, res) {
    // On demande la liste des genres au model
    const genres = await Genre.findAll();
    // On renvoie la liste en JSON (code 200 par défaut)
    res.json(genres);
}

// GET /api/genres/:id : renvoie un seul genre
async function getOne(req, res) {
    // On cherche le genre avec l'id de l'URL (req.params.id)
    const genre = await Genre.findById(req.params.id);
    // Si on ne l'a pas trouvé
    if (!genre) {
        // on lance une erreur 404
        throw httpError(404, 'Genre introuvable');
    }
    // Sinon on renvoie le genre en JSON
    res.json(genre);
}

// POST /api/genres : ajoute un genre
async function create(req, res) {
    // On récupère le nom et la description envoyés dans le body.
    // Si aucun body n'est envoyé, req.body est vide : on prend {} pour éviter un plantage.
    const { nom, description } = req.body || {};

    // On vérifie le nom
    const erreur = checkNom(nom);
    // S'il y a un problème
    if (erreur) {
        // on lance une erreur 400 (données invalides)
        throw httpError(400, erreur);
    }

    // try : on essaie d'ajouter le genre, catch : on attrape l'erreur si ça rate
    try {
        // On ajoute le genre (trim enlève les espaces au début et à la fin).
        // Si pas de description, on met null.
        const id = await Genre.create(nom.trim(), description || null);
        // On relit le genre créé dans la base
        const genre = await Genre.findById(id);
        // On le renvoie avec le code 201 (créé)
        res.status(201).json(genre);
    } catch (err) {
        // Si MySQL refuse parce que le nom existe déjà (colonne UNIQUE)
        if (err.code === 'ER_DUP_ENTRY') {
            // on lance une erreur 409 (conflit)
            throw httpError(409, 'Ce genre existe déjà');
        }
        // Autre problème : on relance l'erreur, ça donnera une erreur 500
        throw err;
    }
}

// PUT /api/genres/:id : modifie un genre
async function update(req, res) {
    // On récupère le nom et la description envoyés dans le body
    // (ou {} si aucun body n'est envoyé, pour éviter un plantage)
    const { nom, description } = req.body || {};

    // On vérifie le nom
    const erreur = checkNom(nom);
    // S'il y a un problème
    if (erreur) {
        // on lance une erreur 400
        throw httpError(400, erreur);
    }

    // On essaie de modifier le genre
    try {
        // On modifie le genre qui a l'id de l'URL
        const lignes = await Genre.update(req.params.id, nom.trim(), description || null);
        // Si aucune ligne n'a été trouvée, le genre n'existe pas
        if (lignes === 0) {
            // on lance une erreur 404
            throw httpError(404, 'Genre introuvable');
        }
        // On relit le genre modifié dans la base
        const genre = await Genre.findById(req.params.id);
        // On le renvoie en JSON
        res.json(genre);
    } catch (err) {
        // Si le nouveau nom est déjà utilisé par un autre genre
        if (err.code === 'ER_DUP_ENTRY') {
            // on lance une erreur 409
            throw httpError(409, 'Ce genre existe déjà');
        }
        // Sinon on relance l'erreur telle quelle (404 ou 500)
        throw err;
    }
}

// DELETE /api/genres/:id : supprime un genre
async function remove(req, res) {
    // On supprime le genre qui a l'id de l'URL
    const lignes = await Genre.remove(req.params.id);
    // Si aucune ligne n'a été supprimée, le genre n'existait pas
    if (lignes === 0) {
        // on lance une erreur 404
        throw httpError(404, 'Genre introuvable');
    }
    // On confirme la suppression
    res.json({ message: 'Genre supprimé' });
}

// On rend ces fonctions utilisables dans le fichier des routes
module.exports = { getAll, getOne, create, update, remove };
