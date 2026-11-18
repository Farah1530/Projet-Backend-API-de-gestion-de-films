/**
 * Fichier      : src/models/genreModel.js
 * Auteur       : Farah1530
 * Date         : 18.11.2026
 * Description  : Requêtes SQL sur la table genre.
 *                Ce fichier parle uniquement à la base de données,
 *                il ne s'occupe pas des réponses HTTP.
 */

// On récupère le pool de connexions MySQL créé dans db.js
const { pool } = require('../config/db');

// Récupère tous les genres
async function findAll() {
    // On envoie la requête à MySQL et on attend la réponse (await).
    // pool.query renvoie un tableau [lignes, infos] : on garde seulement les lignes.
    const [rows] = await pool.query('SELECT * FROM genre ORDER BY nom');
    // On renvoie la liste des genres (un tableau d'objets)
    return rows;
}

// Récupère un seul genre grâce à son id
async function findById(id) {
    // Le ? est remplacé par la valeur de id (protection contre les injections SQL)
    const [rows] = await pool.query('SELECT * FROM genre WHERE id_genre = ?', [id]);
    // On renvoie la première ligne. S'il n'y en a pas, ça renvoie undefined.
    return rows[0];
}

// Ajoute un nouveau genre
async function create(nom, description) {
    // On insère le genre. Les deux ? sont remplacés dans l'ordre par nom et description.
    const [result] = await pool.query(
        'INSERT INTO genre (nom, description) VALUES (?, ?)',
        [nom, description]
    );
    // MySQL nous donne l'id qu'il vient de créer (auto-incrément)
    return result.insertId;
}

// Modifie un genre existant
async function update(id, nom, description) {
    // On met à jour le nom et la description du genre qui a cet id
    const [result] = await pool.query(
        'UPDATE genre SET nom = ?, description = ? WHERE id_genre = ?',
        [nom, description, id]
    );
    // Nombre de lignes trouvées : 0 veut dire que le genre n'existe pas
    return result.affectedRows;
}

// Supprime un genre
async function remove(id) {
    // On supprime le genre qui a cet id
    const [result] = await pool.query('DELETE FROM genre WHERE id_genre = ?', [id]);
    // Nombre de lignes supprimées : 0 veut dire que le genre n'existait pas
    return result.affectedRows;
}

// On rend ces 5 fonctions utilisables dans les autres fichiers (le controller)
module.exports = { findAll, findById, create, update, remove };
