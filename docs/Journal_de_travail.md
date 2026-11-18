# Journal de travail – API de gestion de films

Projet Backend – CPNV SI-CA2a – 2026-2027
Auteur : Farah1530 (projet réalisé seul)
Période : du 4 novembre 2026 au 13 janvier 2027 (≈ 27 h prévues)

> À remplir à chaque séance : ce qui a été fait, le temps passé, les problèmes et leurs solutions.
> Le but est qu'une autre personne puisse refaire le même chemin en lisant ce journal.

## Récapitulatif du temps

| Sprint | Période | Temps prévu | Temps réel |
|---|---|---|---|
| Analyse | 4 – 11 nov. | 4 h | 7 h 10 |
| Sprint 1 | 11 – 24 nov. | 7 h | 5 h 10 (en cours) |
| Sprint 2 | 25 nov. – 8 déc. | 5 h | … |
| Sprint 3 | 9 – 22 déc. | 7 h | … |
| Sprint 4 | 23 déc. – 13 janv. | 4 h | … |
| **Total** | | **27 h** | **12 h 20** (en cours) |

---

## Semaine 1 – 4 novembre 2026

| Tâche | Durée | Story / livrable |
|---|---|---|
| Lecture du cahier des charges de la prof et de la grille d'évaluation | 30 min | – |
| Choix du sujet : API de gestion de films | 15 min | – |
| Rédaction du cahier des charges du projet | 1 h 45 | Livrable semaine 1 |
| Création du dépôt GitHub, du README et du `.gitignore` | 30 min | – |

**Problèmes rencontrés :** aucun.
**Livré :** cahier des charges (PDF sur Teams).

---

## Semaine 2 – 11 novembre 2026

| Tâche | Durée | Story / livrable |
|---|---|---|
| Conception du MCD : 5 entités (film, réalisateur, genre, utilisateur, avis) et 4 associations | 1 h 15 | Livrable semaine 2 |
| Vérification des cardinalités et des règles de gestion | 20 min | – |
| Première version du MLD (6 tables dont la table de liaison `film_genre`) | 45 min | Livrable semaine 3 |
| Version modifiable du MCD dans draw.io | 20 min | – |
| Rédaction des 15 stories avec leurs tests d'acceptation | 1 h | – |
| Création du GitHub Project : tableau Todo / In Progress / Done, champ Sprint (4 sprints de 2 semaines), une issue par story | 30 min | – |

**Problèmes rencontrés :** aucun.

**Livré :** MCD (PDF) et lien GitHub sur Teams.

**Utilisation de l'IA :** aide pour vérifier le MCD, proposer une première version du MLD et des stories. Tout a été relu et validé par moi.

---

## Semaine 3 – 18 novembre 2026

| Tâche | Durée | Story / livrable |
|---|---|---|
| Mise en place de l'API : Node.js, Express, connexion MySQL (pool), gestion des erreurs, route 404 | 1 h 30 | S1 |
| Script SQL de création de la base `api_films` (6 tables) exécuté dans HeidiSQL | 45 min | S1 |
| Commit de la story S1 | 10 min | S1 |
| MLD mis en PDF : détail des colonnes + schéma généré avec MySQL Workbench (Reverse Engineer) | 30 min | Livrable semaine 3 |
| CRUD des genres : model, controller, routes (`/api/genres`) | 1 h 45 | S2 / S3 |
| Tests des routes des genres dans Postman (201, 200, 400, 404, 409) | 30 min | S2 / S3 |

**Problèmes rencontrés :**
- Un POST envoyé sans body dans Postman renvoyait une erreur 500.

**Solutions :**
- Avec Express 5, `req.body` est vide quand aucun body n'est envoyé : ajout de `req.body || {}` pour renvoyer une erreur 400 claire à la place.
- Dans Postman, toujours choisir Body → raw → JSON.

**Livré / terminé :** MLD (PDF) sur Teams, stories S1, S2 et S3.
**Prochaine étape :** CRUD des réalisateurs (S4 / S5) avant la fin du sprint 1 (24 novembre).

**Utilisation de l'IA :** je me suis aidée de l'IA pour déboguer le code qui ne marchait pas et pour comprendre où j'avais fait des fautes.

---

## Modèle pour les prochaines séances

```
## Semaine X – JJ mois 2026

| Tâche | Durée | Story / livrable |
|---|---|---|
| … | … | S… |

**Problèmes rencontrés :** …
**Solutions :** …
**Livré / terminé :** …
**Prochaine étape :** …
```
