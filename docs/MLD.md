# MLD – API de gestion de films

Projet Backend – CPNV SI-CA2a – 2026-2027

Notation : **clé primaire** en gras, `#clé_étrangère` précédée d'un dièse.

## Tables

- **realisateur** (**id_realisateur**, nom, prenom, date_naissance, nationalite)
- **film** (**id_film**, titre, annee_sortie, duree, synopsis, affiche, `#id_realisateur`)
- **genre** (**id_genre**, nom, description)
- **film_genre** (**`#id_film`**, **`#id_genre`**)
- **utilisateur** (**id_utilisateur**, pseudo, email, mot_de_passe, role)
- **avis** (**id_avis**, note, commentaire, date_avis, `#id_film`, `#id_utilisateur`)

## Passage MCD → MLD

| Association MCD | Cardinalités | Traduction MLD |
|---|---|---|
| REALISER | 0,n – 1,1 | Clé étrangère `id_realisateur` dans `film` |
| APPARTENIR | 1,n – 0,n | Table de liaison `film_genre` (clé primaire composée) |
| CONCERNER | 0,n – 1,1 | Clé étrangère `id_film` dans `avis` |
| ECRIRE | 0,n – 1,1 | Clé étrangère `id_utilisateur` dans `avis` |

## Détail des colonnes

### realisateur
| Colonne | Type | Contraintes |
|---|---|---|
| id_realisateur | INT | PK, auto-incrément |
| nom | VARCHAR(100) | NOT NULL |
| prenom | VARCHAR(100) | NOT NULL |
| date_naissance | DATE | NULL |
| nationalite | VARCHAR(100) | NULL |

### film
| Colonne | Type | Contraintes |
|---|---|---|
| id_film | INT | PK, auto-incrément |
| titre | VARCHAR(255) | NOT NULL |
| annee_sortie | SMALLINT | NOT NULL |
| duree | SMALLINT | NOT NULL, en minutes, > 0 |
| synopsis | TEXT | NULL |
| affiche | VARCHAR(255) | NULL (URL ou chemin de l'image) |
| id_realisateur | INT | FK → realisateur, NOT NULL |

### genre
| Colonne | Type | Contraintes |
|---|---|---|
| id_genre | INT | PK, auto-incrément |
| nom | VARCHAR(50) | NOT NULL, UNIQUE |
| description | TEXT | NULL |

### film_genre
| Colonne | Type | Contraintes |
|---|---|---|
| id_film | INT | PK, FK → film (ON DELETE CASCADE) |
| id_genre | INT | PK, FK → genre (ON DELETE CASCADE) |

### utilisateur
| Colonne | Type | Contraintes |
|---|---|---|
| id_utilisateur | INT | PK, auto-incrément |
| pseudo | VARCHAR(50) | NOT NULL, UNIQUE |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| mot_de_passe | VARCHAR(255) | NOT NULL (stocké haché, jamais en clair) |
| role | VARCHAR(20) | NOT NULL, `user` ou `admin`, défaut `user` |

### avis
| Colonne | Type | Contraintes |
|---|---|---|
| id_avis | INT | PK, auto-incrément |
| note | TINYINT | NOT NULL, entre 1 et 5 |
| commentaire | TEXT | NULL |
| date_avis | DATETIME | NOT NULL, défaut date du jour |
| id_film | INT | FK → film (ON DELETE CASCADE), NOT NULL |
| id_utilisateur | INT | FK → utilisateur (ON DELETE CASCADE), NOT NULL |

Contrainte supplémentaire : UNIQUE (id_film, id_utilisateur), un seul avis par utilisateur et par film.

## Suppressions (intégrité référentielle)

- Supprimer un **film** supprime ses avis et ses liens dans `film_genre`.
- Supprimer un **genre** supprime seulement ses liens dans `film_genre`.
- Supprimer un **utilisateur** supprime ses avis.
- Supprimer un **réalisateur** est **refusé** s'il a encore des films (ON DELETE RESTRICT). L'API renvoie alors une erreur claire (409 Conflict).
