# Project Playpal

- [Project Playpal](#project-playpal)
	- [1. Objectifs du projet](#1-objectifs-du-projet)
	- [2. Fonctionnalités](#2-fonctionnalités)
		- [2.1 Gestion des utilisateurs](#21-gestion-des-utilisateurs)
		- [2.2 Gestion des jeux](#22-gestion-des-jeux)
		- [2.2 Gestion des Prêts et Emprunts](#22-gestion-des-prêts-et-emprunts)
		- [2.3 Wishlist de Jeux](#23-wishlist-de-jeux)
		- [2.4 Propositions de jeux](#24-propositions-de-jeux)
		- [2.5 Statistiques et Récompenses](#25-statistiques-et-récompenses)
	- [3. Aspects Techniques](#3-aspects-techniques)
		- [3.1 Architecture](#31-architecture)
		- [3.2 Base de Données](#32-base-de-données)
		- [3.3 Choix Technologiques](#33-choix-technologiques)

## 1. Objectifs du projet

- Faciliter la gestion d'un stock variable de jeux de sociétés à destination d'une ludothèque, d'un bar a jeu ou d'une médiathèque.
- Gestion de la location/du prêt des jeux en question.
- Création de rapports hebdomadaire sur l'utilisation/le prêt des jeux.
- Notification de disponibilité
- Proposition d'ajout de jeux (via un vote ?)

## 2. Fonctionnalités

### 2.1 Gestion des utilisateurs

- **Inscription et Authentification** : Permettre aux utilisateurs de s'inscrire et de se connecter.
- **Profil Utilisateur** : Afficher les informations de l'utilisateur, y compris les jeux possédés, les prêts en cours. L'admin peut noter l'utilisateur dépendant de l'état du jeu rendu, les potentiels retards, etc.
- **Roles des utilisateur** : Gestion des roles (client ou business owner)

### 2.2 Gestion des jeux

- **Notes et Commentaires** : Permettre aux utilisateurs de noter et commenter les jeux.
- **Instructions et Vidéos de Jeu** : Ajouter des règles ou des vidéos pour comprendre le jeu.
- **Suggestions de Jeux Similaires** : Proposer des recommandations de jeux similaires basé sur des tags.

### 2.2 Gestion des Prêts et Emprunts

- **Système de Prêts** : Permettre aux utilisateurs de proposer leurs jeux en prêt et de définir les conditions (durée, état du jeu).
- **Historique d’Emprunt** : Suivre qui a emprunté les jeux, la date de retour prévue, etc.
- **Rappels de Retour** : Envoyer des notifications automatiques pour rappeler aux utilisateurs de rendre les jeux empruntés.
- **Compte rendu en fin de prêt** : Permettre au gestionnaires du commerce/bar de faire un compte rendu s'il y a eu des problèmes.

### 2.3 Wishlist de Jeux

- **Liste de Souhaits** : Permettre aux utilisateurs de créer une wishlist des jeux qu’ils aimeraient essayer ou ajouter à leur collection.
- **Notifications de Disponibilité** : Envoyer une notification si un autre utilisateur possède le jeu souhaité et le propose en prêt.

### 2.4 Propositions de jeux

- **Proposition de Jeux** : Permettre aux utilisateurs de proposer des jeux à ajouter à la collection.
- **Votes pour les Propositions** : Permettre aux utilisateurs de voter pour les jeux proposés.

### 2.5 Statistiques et Récompenses

- **Statistiques d’Utilisation** : Afficher des rapports hebdomadaires sur l'utilisation des jeux, les jeux les plus populaires, etc.
- **Demande de Rapport sur un Jeu** : Permettre aux administrateurs de demander un rapport sur un jeu spécifique.

## 3. Aspects Techniques

### 3.1 Architecture

- **Microservices** :
  - User Service (Opérations liées aux utilisateurs)
  - Game Service (Opérations liées aux jeux)
  - Loan Service (Opérations liées aux prêts des jeux)
  - Notification Service (Envoi de notifications)
  - Report Service (Génération de rapports)
- **API Gateway** : Point d'entrée pour les clients, routage des requêtes vers les services appropriés.

### 3.2 Base de Données

/* A définir */

### 3.3 Choix Technologiques

- **Backend** : NestJS, TypeScript, PostgreSQL, Redis, BullMQ
- **Frontend** : React
- **Déploiement** : Docker