/**
 * Fichier      : src/config/db.js
 * Auteur       : Farah1530
 * Date         : 11.11.2026
 * Description  : Connexion à la base MySQL via un pool de connexions.
 *                Les paramètres (hôte, utilisateur, mot de passe...)
 *                sont lus dans le fichier .env, jamais écrits en dur ici.
 */

// mysql2/promise : version de la librairie MySQL qui fonctionne avec
// async/await (plus lisible que les callbacks)
const mysql = require('mysql2/promise');

// Un "pool" est un groupe de connexions ouvertes à l'avance.
// À chaque requête SQL, on emprunte une connexion du pool puis on la rend.
// C'est plus rapide que d'ouvrir et fermer une connexion à chaque fois.
const pool = mysql.createPool({
    host: process.env.DB_HOST,         // adresse du serveur MySQL (localhost)
    port: process.env.DB_PORT,         // port MySQL (3306 par défaut)
    user: process.env.DB_USER,         // utilisateur MySQL (ex : root)
    password: process.env.DB_PASSWORD, // mot de passe MySQL (dans .env, pas sur GitHub)
    database: process.env.DB_NAME,     // nom de la base : api_films
    waitForConnections: true,          // si toutes les connexions sont prises, on attend
    connectionLimit: 10,               // 10 connexions maximum en même temps
    dateStrings: ['DATE']              // renvoie les dates comme du texte "1970-07-30"
                                       // (sinon le fuseau horaire peut décaler d'un jour)
});

/**
 * Vérifie que la base de données est accessible.
 * On emprunte une connexion puis on la rend tout de suite :
 * si ça marche, la base répond. Sinon, une erreur est levée
 * et elle sera attrapée dans app.js.
 */
async function testConnection() {
    const connection = await pool.getConnection();
    connection.release(); // on rend la connexion au pool
}

// On exporte le pool (pour faire les requêtes SQL dans les models)
// et la fonction de test (utilisée au démarrage dans app.js)
module.exports = { pool, testConnection };
