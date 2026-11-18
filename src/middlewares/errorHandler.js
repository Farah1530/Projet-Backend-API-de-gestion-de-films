/**
 * Fichier      : src/middlewares/errorHandler.js
 * Auteur       : Farah1530
 * Date         : 11.11.2026
 * Description  : Middleware de gestion des erreurs. Renvoie toujours
 *                une réponse JSON { message } avec le bon code HTTP,
 *                sans faire planter le serveur.
 */

/**
 * Express reconnaît un middleware d'erreur parce qu'il a 4 paramètres
 * (err, req, res, next). Quand une route lève une erreur, Express
 * saute directement ici.
 *
 * Pour renvoyer une erreur précise depuis une route, on crée une erreur
 * avec un code : const err = new Error('Genre introuvable'); err.status = 404;
 *
 * @param {Error} err - L'erreur levée (peut contenir un champ status)
 * @param {object} req - La requête reçue
 * @param {object} res - La réponse à renvoyer
 * @param {function} next - Fonction suivante (non utilisée, mais obligatoire)
 */
function errorHandler(err, req, res, next) {
    // Si l'erreur a un code (400, 404, 409...), on l'utilise.
    // Sinon c'est une erreur imprévue : code 500 (erreur serveur).
    const status = err.status || 500;

    // Message renvoyé à l'utilisateur : par défaut, celui de l'erreur
    let message = err.message;

    if (status === 500) {
        // Une erreur 500 est un bug : on l'affiche dans la console pour le corriger
        console.error(err);
        // On ne montre pas le détail technique à l'utilisateur (sécurité)
        message = 'Erreur interne du serveur';
    }

    res.status(status).json({ message: message });
}

module.exports = errorHandler;
