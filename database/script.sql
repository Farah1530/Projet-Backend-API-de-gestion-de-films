-- ============================================================
-- Fichier      : database/script.sql
-- Auteur       : Farah1530
-- Date         : 11.11.2026
-- Description  : Création de la base api_films à partir du MLD
--                (6 tables : realisateur, film, genre, film_genre,
--                utilisateur, avis).
-- ============================================================

DROP DATABASE IF EXISTS api_films;
CREATE DATABASE api_films CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE api_films;

-- ------------------------------------------------------------
-- Réalisateurs
-- ------------------------------------------------------------
CREATE TABLE realisateur (
    id_realisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom            VARCHAR(100) NOT NULL,
    prenom         VARCHAR(100) NOT NULL,
    date_naissance DATE NULL,
    nationalite    VARCHAR(100) NULL
);

-- ------------------------------------------------------------
-- Films (un film a un seul réalisateur)
-- ------------------------------------------------------------
CREATE TABLE film (
    id_film        INT AUTO_INCREMENT PRIMARY KEY,
    titre          VARCHAR(255) NOT NULL,
    annee_sortie   SMALLINT NOT NULL,
    duree          SMALLINT NOT NULL,
    synopsis       TEXT NULL,
    affiche        VARCHAR(255) NULL,
    id_realisateur INT NOT NULL,
    CONSTRAINT chk_film_duree CHECK (duree > 0),
    CONSTRAINT fk_film_realisateur FOREIGN KEY (id_realisateur)
        REFERENCES realisateur (id_realisateur) ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- Genres
-- ------------------------------------------------------------
CREATE TABLE genre (
    id_genre    INT AUTO_INCREMENT PRIMARY KEY,
    nom         VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL
);

-- ------------------------------------------------------------
-- Liaison film <-> genre (association APPARTENIR, n-n)
-- ------------------------------------------------------------
CREATE TABLE film_genre (
    id_film  INT NOT NULL,
    id_genre INT NOT NULL,
    PRIMARY KEY (id_film, id_genre),
    CONSTRAINT fk_film_genre_film FOREIGN KEY (id_film)
        REFERENCES film (id_film) ON DELETE CASCADE,
    CONSTRAINT fk_film_genre_genre FOREIGN KEY (id_genre)
        REFERENCES genre (id_genre) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Utilisateurs (mot de passe stocké haché)
-- ------------------------------------------------------------
CREATE TABLE utilisateur (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    pseudo         VARCHAR(50)  NOT NULL UNIQUE,
    email          VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe   VARCHAR(255) NOT NULL,
    role           ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

-- ------------------------------------------------------------
-- Avis (un seul avis par utilisateur et par film)
-- ------------------------------------------------------------
CREATE TABLE avis (
    id_avis        INT AUTO_INCREMENT PRIMARY KEY,
    note           TINYINT NOT NULL,
    commentaire    TEXT NULL,
    date_avis      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_film        INT NOT NULL,
    id_utilisateur INT NOT NULL,
    CONSTRAINT chk_avis_note CHECK (note BETWEEN 1 AND 5),
    CONSTRAINT uq_avis_film_utilisateur UNIQUE (id_film, id_utilisateur),
    CONSTRAINT fk_avis_film FOREIGN KEY (id_film)
        REFERENCES film (id_film) ON DELETE CASCADE,
    CONSTRAINT fk_avis_utilisateur FOREIGN KEY (id_utilisateur)
        REFERENCES utilisateur (id_utilisateur) ON DELETE CASCADE
);
