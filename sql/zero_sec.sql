-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Jeu 01 Octobre 2015 à 11:00
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `zero_sec`
--
CREATE DATABASE IF NOT EXISTS `zero_sec` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `zero_sec`;

-- --------------------------------------------------------

--
-- Structure de la table `zs_cause_retard`
--

CREATE TABLE IF NOT EXISTS `zs_cause_retard` (
  `id_retard` int(11) NOT NULL,
  `id_unite` int(11) NOT NULL,
  `libelle` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id_retard`),
  KEY `fk_retard_unite` (`id_unite`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Contenu de la table `zs_cause_retard`
--

INSERT INTO `zs_cause_retard` (`id_retard`, `id_unite`, `libelle`) VALUES
(1, 1, 'Oubli expédition'),
(2, 1, 'Client retardataire'),
(3, 1, 'Dépassement TS'),
(4, 1, 'Mise à quai tardive'),
(5, 1, 'Erreur saisie CATI'),
(6, 1, 'Espacement induit'),
(7, 2, 'Affluence'),
(8, 2, 'Groupe'),
(9, 2, 'PMR'),
(10, 2, 'Junior et Cie'),
(11, 2, 'Oubli bagage'),
(12, 2, 'Espacement induit'),
(13, 3, 'SUGE'),
(14, 3, 'Police'),
(15, 3, 'SDIS - SAMU'),
(16, 3, 'Nettoyage'),
(17, 3, 'Espacement induit'),
(18, 4, 'Retard ADC'),
(19, 4, 'Commande ADC'),
(20, 4, 'Démarrage tardif'),
(21, 4, 'Refus départ R.CLI'),
(22, 4, 'Arrêt après départ'),
(23, 4, 'Dépassement EF'),
(24, 4, 'Erreur procédure'),
(25, 4, 'Espacement induit'),
(26, 5, 'Retard ASCT'),
(27, 5, 'Commande ASCT'),
(28, 5, 'Procédure VSTT'),
(29, 5, 'Procédure annonce'),
(30, 5, 'Procédure clients'),
(31, 5, 'Client retardataire'),
(32, 5, 'Espacement induit'),
(33, 6, 'Incident portes'),
(34, 6, 'Dépannage PAC'),
(35, 6, 'Dépannage PMR'),
(36, 6, 'REVER HS'),
(37, 6, 'Fuite CG'),
(38, 6, 'EM HS'),
(39, 6, 'Espacement induit'),
(40, 7, 'Correspondance'),
(41, 7, 'Croisement matériel'),
(42, 7, 'Crochet court'),
(43, 7, 'Sous capacité'),
(44, 7, 'Espacement induit'),
(45, 8, 'Non ouverture signal'),
(46, 8, 'Croisement, espacement'),
(47, 8, 'Sortie chantiers'),
(48, 8, 'Difficultés réception'),
(49, 8, 'Erreur itinéraire'),
(50, 8, 'Correspondance éléments'),
(51, 8, 'Espacement induit'),
(52, 9, 'Dérangement IS'),
(53, 9, 'Restitution travaux'),
(54, 9, 'Espacement induit');

-- --------------------------------------------------------

--
-- Structure de la table `zs_gare`
--

CREATE TABLE IF NOT EXISTS `zs_gare` (
  `id_gare` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id_gare`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=2 ;

--
-- Contenu de la table `zs_gare`
--

INSERT INTO `zs_gare` (`id_gare`, `libelle`) VALUES
(1, 'Dijon Ville');

-- --------------------------------------------------------

--
-- Structure de la table `zs_historique`
--

CREATE TABLE IF NOT EXISTS `zs_historique` (
  `id_historique` int(11) NOT NULL AUTO_INCREMENT,
  `id_OD` int(11) NOT NULL,
  `id_ACE` int(11) DEFAULT NULL,
  `id_prevision` int(11) NOT NULL,
  `id_retard` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `etat` enum('ok','ko','attente','inattendu') NOT NULL,
  `retard` tinyint(1) NOT NULL,
  `duree_retard` int(11) DEFAULT NULL,
  `commentaire` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id_historique`),
  KEY `zs_historique_ibfk_1` (`id_OD`),
  KEY `zs_historique_ibfk_2` (`id_ACE`),
  KEY `id_retard` (`id_retard`),
  KEY `zs_historique_ibfk_4` (`id_prevision`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Contenu de la table `zs_historique`
--

INSERT INTO `zs_historique` (`id_historique`, `id_OD`, `id_ACE`, `id_prevision`, `id_retard`, `date`, `etat`, `retard`, `duree_retard`, `commentaire`) VALUES
(1, 1, 11, 20, 42, '2015-09-14', 'ok', 1, 2, 'RETARD FC'),
(2, 1, NULL, 21, 36, '2015-09-14', 'ok', 1, NULL, 'RETARD FC'),
(3, 1, NULL, 24, 52, '2015-09-14', 'ok', 1, NULL, 'RETARD FC'),
(4, 1, NULL, 33, NULL, '2015-09-14', 'ok', 0, NULL, NULL),
(5, 1, NULL, 34, NULL, '2015-09-14', 'ok', 0, NULL, NULL),
(6, 1, NULL, 37, 26, '2015-09-14', 'ok', 1, NULL, 'RETARD BG'),
(7, 1, NULL, 39, 29, '2015-09-14', 'ok', 1, NULL, 'RETARD BG'),
(8, 1, NULL, 64, 35, '2015-09-14', 'ok', 1, NULL, 'RETARD BG'),
(9, 1, NULL, 41, 52, '2015-09-14', 'ok', 1, NULL, 'RETARD BG'),
(10, 1, NULL, 40, 35, '2015-09-14', 'ok', 1, NULL, 'RETARD BG'),
(11, 1, NULL, 28, NULL, '2015-09-14', 'ok', 0, NULL, NULL),
(12, 1, NULL, 30, NULL, '2015-09-14', 'ok', 0, NULL, NULL),
(13, 1, NULL, 35, NULL, '2015-09-14', 'ok', 0, NULL, NULL),
(14, 1, NULL, 26, 34, '2015-09-14', 'ok', 1, NULL, 'RETARD VOYAGE'),
(15, 1, NULL, 46, NULL, '2015-09-14', 'ok', 0, NULL, NULL),
(16, 1, NULL, 49, NULL, '2015-09-14', 'ok', 0, NULL, NULL),
(17, 1, NULL, 68, NULL, '2015-09-14', 'ok', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `zs_prevision`
--

CREATE TABLE IF NOT EXISTS `zs_prevision` (
  `id_prevision` int(11) NOT NULL AUTO_INCREMENT,
  `id_gare` int(11) NOT NULL,
  `heure` time NOT NULL,
  PRIMARY KEY (`id_prevision`),
  KEY `id_gare` (`id_gare`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=185 ;

--
-- Contenu de la table `zs_prevision`
--

INSERT INTO `zs_prevision` (`id_prevision`, `id_gare`, `heure`) VALUES
(1, 1, '00:03:00'),
(2, 1, '05:09:00'),
(3, 1, '05:29:00'),
(4, 1, '05:37:00'),
(5, 1, '05:40:00'),
(6, 1, '05:45:00'),
(7, 1, '06:12:00'),
(8, 1, '06:12:00'),
(9, 1, '06:13:00'),
(10, 1, '06:16:00'),
(11, 1, '06:19:00'),
(12, 1, '06:21:00'),
(13, 1, '06:25:00'),
(14, 1, '06:29:00'),
(15, 1, '06:33:00'),
(16, 1, '06:35:00'),
(17, 1, '06:40:00'),
(18, 1, '06:41:00'),
(19, 1, '06:46:00'),
(20, 1, '07:00:00'),
(21, 1, '07:09:00'),
(22, 1, '07:12:00'),
(23, 1, '07:12:00'),
(24, 1, '07:13:00'),
(25, 1, '07:19:00'),
(26, 1, '07:25:00'),
(27, 1, '07:25:00'),
(28, 1, '07:29:00'),
(29, 1, '07:29:00'),
(30, 1, '07:33:00'),
(31, 1, '07:35:00'),
(32, 1, '07:40:00'),
(33, 1, '07:41:00'),
(34, 1, '08:09:00'),
(35, 1, '08:12:00'),
(36, 1, '08:19:00'),
(37, 1, '08:25:00'),
(38, 1, '08:29:00'),
(39, 1, '08:29:00'),
(40, 1, '08:33:00'),
(41, 1, '08:33:00'),
(42, 1, '08:37:00'),
(43, 1, '08:37:00'),
(44, 1, '08:38:00'),
(45, 1, '08:40:00'),
(46, 1, '08:46:00'),
(47, 1, '09:00:00'),
(48, 1, '09:07:00'),
(49, 1, '09:25:00'),
(50, 1, '09:29:00'),
(51, 1, '09:29:00'),
(52, 1, '09:40:00'),
(53, 1, '09:45:00'),
(54, 1, '09:55:00'),
(55, 1, '10:06:00'),
(56, 1, '10:09:00'),
(57, 1, '10:12:00'),
(58, 1, '10:19:00'),
(59, 1, '10:27:00'),
(60, 1, '10:34:00'),
(61, 1, '10:37:00'),
(62, 1, '10:40:00'),
(63, 1, '10:50:00'),
(64, 1, '10:55:00'),
(65, 1, '11:00:00'),
(66, 1, '11:02:00'),
(67, 1, '11:09:00'),
(68, 1, '11:21:00'),
(69, 1, '11:26:00'),
(70, 1, '11:40:00'),
(71, 1, '12:00:00'),
(72, 1, '12:05:00'),
(73, 1, '12:07:00'),
(74, 1, '12:12:00'),
(75, 1, '12:13:00'),
(76, 1, '12:19:00'),
(77, 1, '12:21:00'),
(78, 1, '12:23:00'),
(79, 1, '12:29:00'),
(80, 1, '12:33:00'),
(81, 1, '12:35:00'),
(82, 1, '12:39:00'),
(83, 1, '12:40:00'),
(84, 1, '12:40:00'),
(85, 1, '12:41:00'),
(86, 1, '13:29:00'),
(87, 1, '13:40:00'),
(88, 1, '13:46:00'),
(89, 1, '14:05:00'),
(90, 1, '14:05:00'),
(91, 1, '14:05:00'),
(92, 1, '14:05:00'),
(93, 1, '14:12:00'),
(94, 1, '14:12:00'),
(95, 1, '14:19:00'),
(96, 1, '14:33:00'),
(97, 1, '14:40:00'),
(98, 1, '14:50:00'),
(99, 1, '14:50:00'),
(100, 1, '15:00:00'),
(101, 1, '15:09:00'),
(102, 1, '15:29:00'),
(103, 1, '15:29:00'),
(104, 1, '15:35:00'),
(105, 1, '15:40:00'),
(106, 1, '15:51:00'),
(107, 1, '15:51:00'),
(108, 1, '15:51:00'),
(109, 1, '16:09:00'),
(110, 1, '16:09:00'),
(111, 1, '16:12:00'),
(112, 1, '16:13:00'),
(113, 1, '16:16:00'),
(114, 1, '16:19:00'),
(115, 1, '16:25:00'),
(116, 1, '16:29:00'),
(117, 1, '16:30:00'),
(118, 1, '16:33:00'),
(119, 1, '16:35:00'),
(120, 1, '16:37:00'),
(121, 1, '16:37:00'),
(122, 1, '16:37:00'),
(123, 1, '16:40:00'),
(124, 1, '16:40:00'),
(125, 1, '16:46:00'),
(126, 1, '16:50:00'),
(127, 1, '16:55:00'),
(128, 1, '17:12:00'),
(129, 1, '17:12:00'),
(130, 1, '17:12:00'),
(131, 1, '17:13:00'),
(132, 1, '17:19:00'),
(133, 1, '17:19:00'),
(134, 1, '17:25:00'),
(135, 1, '17:25:00'),
(136, 1, '17:29:00'),
(137, 1, '17:29:00'),
(138, 1, '17:33:00'),
(139, 1, '17:35:00'),
(140, 1, '17:41:00'),
(141, 1, '17:44:00'),
(142, 1, '17:50:00'),
(143, 1, '18:01:00'),
(144, 1, '18:02:00'),
(145, 1, '18:05:00'),
(146, 1, '18:05:00'),
(147, 1, '18:09:00'),
(148, 1, '18:12:00'),
(149, 1, '18:13:00'),
(150, 1, '18:13:00'),
(151, 1, '18:19:00'),
(152, 1, '18:25:00'),
(153, 1, '18:29:00'),
(154, 1, '18:35:00'),
(155, 1, '18:35:00'),
(156, 1, '18:40:00'),
(157, 1, '18:43:00'),
(158, 1, '18:43:00'),
(159, 1, '18:46:00'),
(160, 1, '18:47:00'),
(161, 1, '18:50:00'),
(162, 1, '18:58:00'),
(163, 1, '19:12:00'),
(164, 1, '19:13:00'),
(165, 1, '19:25:00'),
(166, 1, '19:29:00'),
(167, 1, '19:29:00'),
(168, 1, '19:35:00'),
(169, 1, '19:40:00'),
(170, 1, '19:44:00'),
(171, 1, '19:50:00'),
(172, 1, '19:51:00'),
(173, 1, '19:56:00'),
(174, 1, '20:00:00'),
(175, 1, '20:09:00'),
(176, 1, '20:20:00'),
(177, 1, '20:29:00'),
(178, 1, '20:37:00'),
(179, 1, '20:40:00'),
(180, 1, '20:44:00'),
(181, 1, '21:09:00'),
(182, 1, '22:09:00'),
(183, 1, '22:12:00'),
(184, 1, '22:20:00');

-- --------------------------------------------------------

--
-- Structure de la table `zs_prevision_train`
--

CREATE TABLE IF NOT EXISTS `zs_prevision_train` (
  `id_prevision_train` int(11) NOT NULL AUTO_INCREMENT,
  `id_prevision` int(11) NOT NULL,
  `id_train` int(11) NOT NULL,
  `second_train` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_prevision_train`),
  KEY `fk_prevision_train_train` (`id_train`),
  KEY `fk_prevision_train_prevision` (`id_prevision`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=220 ;

--
-- Contenu de la table `zs_prevision_train`
--

INSERT INTO `zs_prevision_train` (`id_prevision_train`, `id_prevision`, `id_train`, `second_train`) VALUES
(1, 1, 1, 0),
(2, 2, 2, 0),
(3, 3, 3, 0),
(4, 4, 4, 0),
(5, 5, 5, 0),
(6, 6, 6, 0),
(7, 7, 7, 0),
(8, 7, 8, 1),
(9, 8, 9, 0),
(10, 8, 10, 1),
(11, 9, 11, 0),
(12, 10, 12, 0),
(13, 10, 13, 1),
(14, 11, 14, 0),
(15, 12, 15, 0),
(16, 13, 16, 0),
(17, 14, 17, 0),
(18, 14, 18, 1),
(19, 15, 19, 0),
(20, 16, 20, 0),
(21, 17, 21, 0),
(22, 18, 22, 0),
(23, 19, 23, 0),
(24, 20, 24, 0),
(25, 21, 25, 0),
(26, 22, 26, 0),
(27, 22, 27, 1),
(28, 23, 28, 0),
(29, 23, 29, 1),
(30, 24, 30, 0),
(31, 25, 31, 0),
(32, 26, 32, 0),
(33, 27, 33, 0),
(34, 28, 34, 0),
(35, 29, 35, 0),
(36, 30, 36, 0),
(37, 31, 37, 0),
(38, 32, 38, 0),
(39, 33, 39, 0),
(40, 34, 40, 0),
(41, 35, 41, 0),
(42, 35, 42, 1),
(43, 36, 43, 0),
(44, 37, 44, 0),
(45, 38, 45, 0),
(46, 38, 46, 1),
(47, 39, 47, 0),
(48, 39, 48, 1),
(49, 40, 49, 0),
(50, 41, 50, 0),
(51, 42, 51, 0),
(52, 43, 52, 0),
(53, 44, 53, 0),
(54, 45, 54, 0),
(55, 46, 55, 0),
(56, 47, 56, 0),
(57, 48, 57, 0),
(58, 48, 35, 1),
(59, 49, 58, 0),
(60, 50, 59, 0),
(61, 51, 60, 0),
(62, 52, 61, 0),
(63, 53, 62, 0),
(64, 54, 63, 0),
(65, 55, 64, 0),
(66, 55, 65, 1),
(67, 56, 66, 0),
(68, 57, 67, 0),
(69, 57, 68, 1),
(70, 58, 69, 0),
(71, 59, 70, 0),
(72, 60, 71, 0),
(73, 61, 72, 0),
(74, 62, 73, 0),
(75, 63, 74, 0),
(76, 64, 75, 0),
(77, 65, 76, 0),
(78, 66, 77, 0),
(79, 67, 78, 0),
(80, 68, 79, 0),
(81, 69, 80, 0),
(82, 70, 81, 0),
(83, 71, 82, 0),
(84, 72, 83, 0),
(85, 73, 84, 0),
(86, 74, 85, 0),
(87, 74, 86, 1),
(88, 75, 87, 0),
(89, 76, 88, 0),
(90, 77, 89, 0),
(91, 78, 90, 0),
(92, 79, 91, 0),
(93, 80, 92, 0),
(94, 81, 93, 0),
(95, 82, 94, 0),
(96, 83, 95, 0),
(97, 84, 96, 0),
(98, 85, 97, 0),
(99, 86, 98, 0),
(100, 87, 99, 0),
(101, 88, 100, 0),
(102, 89, 101, 0),
(103, 89, 102, 1),
(104, 90, 103, 0),
(105, 90, 104, 1),
(106, 91, 105, 0),
(107, 91, 106, 1),
(108, 92, 107, 0),
(109, 92, 108, 1),
(110, 93, 109, 0),
(111, 93, 110, 1),
(112, 94, 111, 0),
(113, 94, 112, 1),
(114, 95, 113, 0),
(115, 96, 114, 0),
(116, 97, 115, 0),
(117, 98, 116, 0),
(118, 98, 117, 1),
(119, 99, 118, 0),
(120, 100, 119, 0),
(121, 101, 120, 0),
(122, 102, 121, 0),
(123, 103, 122, 0),
(124, 104, 123, 0),
(125, 105, 124, 0),
(126, 106, 125, 0),
(127, 107, 126, 0),
(128, 107, 125, 1),
(129, 108, 127, 0),
(130, 108, 128, 1),
(131, 109, 129, 0),
(132, 109, 130, 1),
(133, 110, 131, 0),
(134, 111, 132, 0),
(135, 111, 133, 1),
(136, 112, 134, 0),
(137, 113, 135, 0),
(138, 114, 136, 0),
(139, 115, 137, 0),
(140, 116, 138, 0),
(141, 117, 139, 0),
(142, 117, 140, 1),
(143, 118, 141, 0),
(144, 119, 142, 0),
(145, 120, 143, 0),
(146, 121, 144, 0),
(147, 122, 145, 0),
(148, 123, 146, 0),
(149, 124, 147, 0),
(150, 125, 148, 0),
(151, 126, 149, 0),
(152, 127, 150, 0),
(153, 128, 151, 0),
(154, 128, 152, 1),
(155, 129, 153, 0),
(156, 129, 154, 1),
(157, 130, 155, 0),
(158, 130, 156, 1),
(159, 131, 157, 0),
(160, 132, 158, 0),
(161, 133, 159, 0),
(162, 134, 160, 0),
(163, 135, 161, 0),
(164, 136, 162, 0),
(165, 137, 163, 0),
(166, 138, 164, 0),
(167, 139, 165, 0),
(168, 140, 166, 0),
(169, 141, 167, 0),
(170, 142, 168, 0),
(171, 143, 169, 0),
(172, 143, 170, 1),
(173, 144, 171, 0),
(174, 144, 172, 1),
(175, 145, 173, 0),
(176, 146, 174, 0),
(177, 147, 175, 0),
(178, 147, 176, 1),
(179, 148, 177, 0),
(180, 148, 178, 1),
(181, 149, 179, 0),
(182, 150, 180, 0),
(183, 151, 181, 0),
(184, 152, 182, 0),
(185, 153, 183, 0),
(186, 154, 184, 0),
(187, 155, 185, 0),
(188, 156, 186, 0),
(189, 157, 187, 0),
(190, 158, 188, 0),
(191, 159, 189, 0),
(192, 160, 190, 0),
(193, 161, 191, 0),
(194, 162, 192, 0),
(195, 162, 193, 1),
(196, 163, 194, 0),
(197, 163, 195, 1),
(198, 164, 196, 0),
(199, 165, 197, 0),
(200, 166, 198, 0),
(201, 167, 199, 0),
(202, 168, 200, 0),
(203, 169, 201, 0),
(204, 170, 202, 0),
(205, 171, 203, 0),
(206, 172, 204, 0),
(207, 173, 205, 0),
(208, 174, 206, 0),
(209, 175, 207, 0),
(210, 176, 208, 0),
(211, 177, 209, 0),
(212, 177, 210, 1),
(213, 178, 211, 0),
(214, 179, 212, 0),
(215, 180, 213, 0),
(216, 181, 214, 0),
(217, 182, 215, 0),
(218, 183, 216, 0),
(219, 184, 217, 0);

-- --------------------------------------------------------

--
-- Structure de la table `zs_train`
--

CREATE TABLE IF NOT EXISTS `zs_train` (
  `id_train` int(11) NOT NULL AUTO_INCREMENT,
  `num_train` int(11) NOT NULL,
  `famille` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id_train`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=218 ;

--
-- Contenu de la table `zs_train`
--

INSERT INTO `zs_train` (`id_train`, `num_train`, `famille`) VALUES
(1, 894299, 'TER Franche Comte'),
(2, 894101, 'TER Franche Comte'),
(3, 17750, 'TER Bourgogne'),
(4, 21899, 'TER Bourgogne'),
(5, 17801, 'TER Bourgogne'),
(6, 734701, 'TER Bourgogne'),
(7, 893001, 'TER Bourgogne'),
(8, 893000, 'TER Bourgogne'),
(9, 893017, 'TER Bourgogne'),
(10, 893016, 'TER Bourgogne'),
(11, 894103, 'TER Franche Comte'),
(12, 17833, 'TER Bourgogne'),
(13, 17832, 'TER Bourgogne'),
(14, 891701, 'TER Bourgogne'),
(15, 6801, 'Voyages'),
(16, 891501, 'TER Bourgogne'),
(17, 891350, 'TER Bourgogne'),
(18, 891351, 'TER Bourgogne'),
(19, 891801, 'TER Bourgogne'),
(20, 891900, 'TER Bourgogne'),
(21, 17803, 'TER Bourgogne'),
(22, 894211, 'TER Franche Comte'),
(23, 891403, 'TER Bourgogne'),
(24, 21907, 'TER Franche Comte'),
(25, 894213, 'TER Franche Comte'),
(26, 860883, 'TER Bourgogne'),
(27, 860882, 'TER Bourgogne'),
(28, 893027, 'TER Bourgogne'),
(29, 893026, 'TER Bourgogne'),
(30, 894215, 'TER Franche Comte'),
(31, 891703, 'TER Bourgogne'),
(32, 6744, 'Voyages'),
(33, 891405, 'TER Bourgogne'),
(34, 17754, 'TER Bourgogne'),
(35, 21986, 'TER Bourgogne'),
(36, 891803, 'TER Bourgogne'),
(37, 891902, 'TER Bourgogne'),
(38, 17805, 'TER Bourgogne'),
(39, 894217, 'TER Franche Comte'),
(40, 894219, 'TER Franche Comte'),
(41, 893003, 'TER Bourgogne'),
(42, 893002, 'TER Bourgogne'),
(43, 891705, 'TER Bourgogne'),
(44, 891407, 'TER Bourgogne'),
(45, 891352, 'TER Bourgogne'),
(46, 891353, 'TER Bourgogne'),
(47, 891364, 'TER Bourgogne'),
(48, 891365, 'TER Bourgogne'),
(49, 891805, 'TER Bourgogne'),
(50, 891807, 'TER Bourgogne'),
(51, 21997, 'TER Bourgogne'),
(52, 542099, 'TER Bourgogne'),
(53, 21991, 'TER Bourgogne'),
(54, 17807, 'TER Bourgogne'),
(55, 6781, 'Voyages'),
(56, 784801, 'TER Franche Comte'),
(57, 21987, 'TER Bourgogne'),
(58, 6821, 'Voyages'),
(59, 17756, 'TER Bourgogne'),
(60, 21756, 'TER Rhône Alpes'),
(61, 17809, 'TER Bourgogne'),
(62, 21909, 'TER Franche Comte'),
(63, 21955, 'TER Bourgogne'),
(64, 893005, 'TER Bourgogne'),
(65, 893004, 'TER Bourgogne'),
(66, 894231, 'TER Franche Comte'),
(67, 893025, 'TER Bourgogne'),
(68, 893024, 'TER Bourgogne'),
(69, 891707, 'TER Bourgogne'),
(70, 21913, 'TER Bourgogne'),
(71, 21985, 'TER Bourgogne'),
(72, 17755, 'TER Bourgogne'),
(73, 17753, 'TER Bourgogne'),
(74, 891411, 'TER Bourgogne'),
(75, 784633, 'TER Bourgogne'),
(76, 784533, 'TER Franche Comte'),
(77, 6704, 'Voyages'),
(78, 894237, 'TER Franche Comte'),
(79, 6839, 'Voyages'),
(80, 784957, 'TER Franche Comte'),
(81, 17811, 'TER Bourgogne'),
(82, 506199, 'Voyages'),
(83, 6703, 'Voyages'),
(84, 891354, 'TER Bourgogne'),
(85, 893007, 'TER Bourgogne'),
(86, 893006, 'TER Bourgogne'),
(87, 894245, 'TER Franche Comte'),
(88, 891709, 'TER Bourgogne'),
(89, 891413, 'TER Bourgogne'),
(90, 506839, 'Voyages'),
(91, 891356, 'TER Bourgogne'),
(92, 891809, 'TER Bourgogne'),
(93, 891904, 'TER Bourgogne'),
(94, 21977, 'TER Bourgogne'),
(95, 17757, 'TER Bourgogne'),
(96, 891906, 'TER Bourgogne'),
(97, 894247, 'TER Franche Comte'),
(98, 17760, 'TER Bourgogne'),
(99, 17813, 'TER Bourgogne'),
(100, 894253, 'TER Franche Comte'),
(101, 1543, 'TER Champagne Ardennes'),
(102, 1542, 'TER Champagne Ardennes'),
(103, 21971, 'TER Bourgogne'),
(104, 21970, 'TER Bourgogne'),
(105, 21975, 'TER Bourgogne'),
(106, 21974, 'TER Bourgogne'),
(107, 21981, 'TER Bourgogne'),
(108, 21980, 'TER Bourgogne'),
(109, 893009, 'TER Bourgogne'),
(110, 893008, 'TER Bourgogne'),
(111, 893039, 'TER Bourgogne'),
(112, 893038, 'TER Bourgogne'),
(113, 891711, 'TER Bourgogne'),
(114, 891811, 'TER Bourgogne'),
(115, 17815, 'TER Bourgogne'),
(116, 17835, 'TER Bourgogne'),
(117, 17834, 'TER Bourgogne'),
(118, 891415, 'TER Bourgogne'),
(119, 809225, 'TER Franche Comte'),
(120, 894261, 'TER Franche Comte'),
(121, 21988, 'TER Bourgogne'),
(122, 542080, 'TER Bourgogne'),
(123, 734908, 'TER Bourgogne'),
(124, 17817, 'TER Bourgogne'),
(125, 11946, 'TER Champagne Ardennes'),
(126, 11947, 'TER Champagne Ardennes'),
(127, 839851, 'TER Bourgogne'),
(128, 839850, 'TER Bourgogne'),
(129, 860889, 'TER Bourgogne'),
(130, 860888, 'TER Bourgogne'),
(131, 894267, 'TER Franche Comte'),
(132, 893031, 'TER Bourgogne'),
(133, 893030, 'TER Bourgogne'),
(134, 894123, 'TER Franche Comte'),
(135, 6815, 'Voyages'),
(136, 891713, 'TER Bourgogne'),
(137, 891503, 'TER Bourgogne'),
(138, 891358, 'TER Bourgogne'),
(139, 17829, 'TER Bourgogne'),
(140, 17828, 'TER Bourgogne'),
(141, 891813, 'TER Bourgogne'),
(142, 891908, 'TER Bourgogne'),
(143, 17761, 'TER Bourgogne'),
(144, 21931, 'TER Bourgogne'),
(145, 542081, 'TER Bourgogne'),
(146, 17819, 'TER Bourgogne'),
(147, 21999, 'TER Bourgogne'),
(148, 894271, 'TER Franche Comte'),
(149, 891419, 'TER Bourgogne'),
(150, 891715, 'TER Bourgogne'),
(151, 893011, 'TER Bourgogne'),
(152, 893010, 'TER Bourgogne'),
(153, 893019, 'TER Bourgogne'),
(154, 893018, 'TER Bourgogne'),
(155, 893023, 'TER Bourgogne'),
(156, 893022, 'TER Bourgogne'),
(157, 894125, 'TER Franche Comte'),
(158, 784500, 'TER Bourgogne'),
(159, 891717, 'TER Bourgogne'),
(160, 6740, 'Voyages'),
(161, 891505, 'TER Bourgogne'),
(162, 21964, 'TER Bourgogne'),
(163, 21994, 'TER Bourgogne'),
(164, 891815, 'TER Bourgogne'),
(165, 891910, 'TER Bourgogne'),
(166, 894277, 'TER Franche Comte'),
(167, 17821, 'TER Bourgogne'),
(168, 891423, 'TER Bourgogne'),
(169, 839831, 'TER Bourgogne'),
(170, 839830, 'TER Bourgogne'),
(171, 14355, 'Téoz Sud Est'),
(172, 14354, 'Téoz Sud Est'),
(173, 21915, 'TER Bourgogne'),
(174, 891817, 'TER Bourgogne'),
(175, 893021, 'TER Bourgogne'),
(176, 893020, 'TER Bourgogne'),
(177, 893015, 'TER Bourgogne'),
(178, 893014, 'TER Bourgogne'),
(179, 21911, 'TER Bourgogne'),
(180, 894281, 'TER Franche Comte'),
(181, 891719, 'TER Bourgogne'),
(182, 891425, 'TER Bourgogne'),
(183, 891360, 'TER Bourgogne'),
(184, 17763, 'TER Bourgogne'),
(185, 891912, 'TER Bourgogne'),
(186, 21993, 'TER Bourgogne'),
(187, 891819, 'TER Bourgogne'),
(188, 894283, 'TER Franche Comte'),
(189, 6783, 'Voyages'),
(190, 6885, 'Voyages'),
(191, 891427, 'TER Bourgogne'),
(192, 1545, 'TER Champagne Ardennes'),
(193, 1544, 'TER Champagne Ardennes'),
(194, 893013, 'TER Bourgogne'),
(195, 893012, 'TER Bourgogne'),
(196, 894287, 'TER Franche Comte'),
(197, 891439, 'TER Bourgogne'),
(198, 17766, 'TER Bourgogne'),
(199, 21996, 'TER Bourgogne'),
(200, 891914, 'TER Bourgogne'),
(201, 891821, 'TER Bourgogne'),
(202, 17823, 'TER Bourgogne'),
(203, 891429, 'TER Bourgogne'),
(204, 6869, 'Voyages'),
(205, 891721, 'TER Bourgogne'),
(206, 506827, 'Voyages'),
(207, 894291, 'TER Franche Comte'),
(208, 891435, 'TER Bourgogne'),
(209, 891362, 'TER Bourgogne'),
(210, 891363, 'TER Bourgogne'),
(211, 21995, 'TER Bourgogne'),
(212, 17827, 'TER Bourgogne'),
(213, 891431, 'TER Bourgogne'),
(214, 894293, 'TER Franche Comte'),
(215, 894295, 'TER Franche Comte'),
(216, 891433, 'TER Bourgogne'),
(217, 784883, 'TER Bourgogne');

-- --------------------------------------------------------

--
-- Structure de la table `zs_unite`
--

CREATE TABLE IF NOT EXISTS `zs_unite` (
  `id_unite` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id_unite`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=11 ;

--
-- Contenu de la table `zs_unite`
--

INSERT INTO `zs_unite` (`id_unite`, `libelle`) VALUES
(1, 'Escale'),
(2, 'Embarquement'),
(3, 'Prestations externes'),
(4, 'ET'),
(5, 'ECT'),
(6, 'MATERIEL'),
(7, 'COP_COS'),
(8, 'Infra C'),
(9, 'Infra V'),
(10, 'Incidents');

-- --------------------------------------------------------

--
-- Structure de la table `zs_utilisateur`
--

CREATE TABLE IF NOT EXISTS `zs_utilisateur` (
  `id_utilisateur` int(11) NOT NULL AUTO_INCREMENT,
  `id_gare` int(11) NOT NULL,
  `identifiant` varchar(20) NOT NULL,
  `mot_de_passe` varchar(30) NOT NULL,
  `nom` varchar(25) DEFAULT NULL,
  `prenom` varchar(25) DEFAULT NULL,
  `email` varchar(40) NOT NULL,
  `fonction` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_utilisateur`),
  KEY `id_gare` (`id_gare`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Contenu de la table `zs_utilisateur`
--

INSERT INTO `zs_utilisateur` (`id_utilisateur`, `id_gare`, `identifiant`, `mot_de_passe`, `nom`, `prenom`, `email`, `fonction`) VALUES
(1, 1, 'od', 'od', 'MORIN', 'Alan', 'ext.stage.alan.morin@sncf.fr', 'OD'),
(11, 1, 'ace', 'ace', NULL, NULL, 'ace@sncf.fr', 'ACE'),
(12, 1, 'od2', 'od2', 'OD2', 'OD2', '', 'OD');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `zs_cause_retard`
--
ALTER TABLE `zs_cause_retard`
  ADD CONSTRAINT `zs_cause_retard_ibfk_1` FOREIGN KEY (`id_unite`) REFERENCES `zs_unite` (`id_unite`);

--
-- Contraintes pour la table `zs_historique`
--
ALTER TABLE `zs_historique`
  ADD CONSTRAINT `zs_historique_ibfk_1` FOREIGN KEY (`id_OD`) REFERENCES `zs_utilisateur` (`id_utilisateur`) ON DELETE CASCADE,
  ADD CONSTRAINT `zs_historique_ibfk_2` FOREIGN KEY (`id_ACE`) REFERENCES `zs_utilisateur` (`id_utilisateur`) ON DELETE CASCADE,
  ADD CONSTRAINT `zs_historique_ibfk_3` FOREIGN KEY (`id_retard`) REFERENCES `zs_cause_retard` (`id_retard`),
  ADD CONSTRAINT `zs_historique_ibfk_4` FOREIGN KEY (`id_prevision`) REFERENCES `zs_prevision` (`id_prevision`);

--
-- Contraintes pour la table `zs_prevision`
--
ALTER TABLE `zs_prevision`
  ADD CONSTRAINT `zs_prevision_ibfk_1` FOREIGN KEY (`id_gare`) REFERENCES `zs_gare` (`id_gare`);

--
-- Contraintes pour la table `zs_prevision_train`
--
ALTER TABLE `zs_prevision_train`
  ADD CONSTRAINT `zs_prevision_train_ibfk_1` FOREIGN KEY (`id_train`) REFERENCES `zs_train` (`id_train`),
  ADD CONSTRAINT `zs_prevision_train_ibfk_2` FOREIGN KEY (`id_prevision`) REFERENCES `zs_prevision` (`id_prevision`);

--
-- Contraintes pour la table `zs_utilisateur`
--
ALTER TABLE `zs_utilisateur`
  ADD CONSTRAINT `zs_utilisateur_ibfk_1` FOREIGN KEY (`id_gare`) REFERENCES `zs_gare` (`id_gare`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
