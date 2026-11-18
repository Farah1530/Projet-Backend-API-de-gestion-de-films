/**
 * Fichier      : src/models/realisateurModel.js
 * Auteur       : Farah1530
 * Date         : 18.11.2026
 * Description  : Requêtes SQL sur la table realisateur.
 *                Ce fichier parle uniquement à la base de données,
 *                il ne s'occupe pas des réponses HTTP.
 */

// On récupère le pool de connexions MySQL créé dans db.js
const { pool } = require('../config/db');

// Récupère tous les réalisateurs
async function findAll() {
    // On demande tous les réalisateurs, triés par nom puis par prénom
    const [rows] = await pool.query('SELECT * FROM realisateur ORDER BY nom, prenom');
    // On renvoie la liste (un tableau d'objets)
    return rows;
}

// Récupère un seul réalisateur grâce à son id
async function findById(id) {
    // Le ? est remplacé par la valeur de id (protection contre les injections SQL)
    const [rows] = await pool.query('SELECT * FROM realisateur WHERE id_realisateur = ?', [id]);
    // On renvoie la première ligne, ou undefined s'il n'existe pas
    return rows[0];
}

// Ajoute un nouveau réalisateur
async function create(nom, prenom, dateNaissance, nationalite) {
    // On insère le réalisateur. Les 4 ? sont remplacés dans l'ordre par les valeurs.
    const [result] = await pool.query(
        'INSERT INTO realisateur (nom, prenom, date_naissance, nationalite) VALUES (?, ?, ?, ?)',
        [nom, prenom, dateNaissance, nationalite]
    );
    // MySQL nous donne l'id qu'il vient de créer
    return result.insertId;
}

// Modifie un réalisateur existant
async function update(id, nom, prenom, dateNaissance, nationalite) {
    // On met à jour toutes les colonnes du réalisateur qui a cet id
    const [result] = await pool.query(
        'UPDATE realisateur SET nom = ?, prenom = ?, date_naissance = ?, nationalite = ? WHERE id_realisateur = ?',
        [nom, prenom, dateNaissance, nationalite, id]
    );
    // Nombre de lignes trouvées : 0 veut dire que le réalisateur n'existe pas
    return result.affectedRows;
}

// Supprime un réalisateur
async function remove(id) {
    // On supprime le réalisateur qui a cet id.
    // MySQL refusera s'il a encore des films (ON DELETE RESTRICT).
    const [result] = await pool.query('DELETE FROM realisateur WHERE id_realisateur = ?', [id]);
    // Nombre de lignes supprimées : 0 veut dire qu'il n'existait pas
    return result.affectedRows;
}

// On rend ces 5 fonctions utilisables dans le controller
module.exports = { findAll, findById, create, update, remove };
