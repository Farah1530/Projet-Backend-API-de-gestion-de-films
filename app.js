/**
 * Fichier      : app.js
 * Auteur       : Farah1530
 * Date         : 11.11.2026
 * Description  : Point d'entrée de l'API Films. Configure Express,
 *                vérifie la connexion à la base et démarre le serveur.
 *                C'est ce fichier qui est lancé par la commande "npm start".
 */

// Charge les variables du fichier .env (mot de passe MySQL, port...)
// dans process.env. Doit être fait en premier, avant d'utiliser ces variables.
require('dotenv').config();

// express : la librairie qui permet de créer le serveur web et les routes
const express = require('express');
// db : notre fichier de connexion à MySQL (src/config/db.js)
const db = require('./src/config/db');
// errorHandler : notre fonction qui transforme les erreurs en réponses JSON propres
const errorHandler = require('./src/middlewares/errorHandler');

// Création de l'application Express (c'est notre serveur)
const app = express();

// Port d'écoute : celui du .env s'il existe, sinon 3000 par défaut
const PORT = process.env.PORT || 3000;

// Middleware : permet à Express de lire le JSON envoyé dans le corps
// des requêtes POST et PUT (par exemple depuis Postman).
// Sans cette ligne, req.body serait vide.
app.use(express.json());

// Route de test : GET http://localhost:3000/
// Sert uniquement à vérifier que l'API répond.
// req = la requête reçue, res = la réponse qu'on renvoie
app.get('/', (req, res) => {
    res.json({ message: 'API Films opérationnelle' });
});

// Routes des genres : toutes les URL qui commencent par /api/genres
// sont gérées dans src/routes/genreRoutes.js
app.use('/api/genres', require('./src/routes/genreRoutes'));

// --- Les routes des autres entités (films, réalisateurs...) seront ajoutées ici ---

// Route inconnue : si aucune route au-dessus ne correspond,
// Express arrive ici. On renvoie une erreur 404 en JSON
// au lieu de la page HTML par défaut d'Express.
// Elle doit être placée APRÈS toutes les autres routes.
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} introuvable` });
});

// Gestion des erreurs : si une route lève une erreur, Express l'envoie ici.
// Ce middleware doit être déclaré en tout dernier.
app.use(errorHandler);

/**
 * Démarre le serveur après avoir vérifié la connexion à MySQL.
 * "async" permet d'utiliser "await" pour attendre la réponse de la base.
 * Si la base est inaccessible, on affiche un message clair et on arrête
 * le programme proprement, au lieu de laisser l'API planter plus tard.
 */
async function startServer() {
    try {
        // On attend que la base réponde avant d'aller plus loin
        await db.testConnection();
        console.log('Connexion à la base de données réussie');
    } catch (error) {
        // La connexion a échoué : MySQL éteint, mauvais mot de passe, base inexistante...
        console.error('Impossible de se connecter à la base de données :', error.message);
        console.error('Vérifie que MySQL est démarré et que le fichier .env est correct.');
        // Arrête le programme avec le code 1 (= erreur)
        process.exit(1);
    }

    // La base est OK : le serveur commence à écouter les requêtes sur le port
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
}

// Lancement du serveur
startServer();
