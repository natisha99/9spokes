-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 12, 2020 at 10:46 AM
-- Server version: 8.0.20-0ubuntu0.20.04.1
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `projectapi`
--

-- --------------------------------------------------------

--
-- Table structure for table `googletrends`
--

CREATE TABLE `googletrends` (
  `keyword` varchar(65) NOT NULL,
  `url` text NOT NULL,
  `data` json NOT NULL,
  `date_retrieved` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `linkedin`
--

CREATE TABLE `linkedin` (
  `keyword` varchar(65) NOT NULL,
  `results` json NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nzcompaniesoffice`
--

CREATE TABLE `nzcompaniesoffice` (
  `company_number` bigint NOT NULL,
  `company_data` json NOT NULL,
  `date_retrieved` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nzcompaniesofficesearch`
--

CREATE TABLE `nzcompaniesofficesearch` (
  `keyword` varchar(65) NOT NULL,
  `result` json NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ukcompanieshouse`
--

CREATE TABLE `ukcompanieshouse` (
  `company_number` varchar(65) NOT NULL,
  `results` json NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ukcompanieshousesearch`
--

CREATE TABLE `ukcompanieshousesearch` (
  `keyword` varchar(65) NOT NULL,
  `results` json NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `yahoofinances`
--

CREATE TABLE `yahoofinances` (
  `ticker` varchar(65) NOT NULL,
  `iinterval` varchar(65) NOT NULL,
  `rrange` varchar(65) NOT NULL,
  `results` json NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `yahoofinancessearch`
--

CREATE TABLE `yahoofinancessearch` (
  `company_name` varchar(65) NOT NULL,
  `results` json NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `yahoofinancessustainable`
--

CREATE TABLE `yahoofinancessustainable` (
  `ticker` varchar(65) NOT NULL,
  `results` json NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `googletrends`
--
ALTER TABLE `googletrends`
  ADD PRIMARY KEY (`keyword`);

--
-- Indexes for table `linkedin`
--
ALTER TABLE `linkedin`
  ADD PRIMARY KEY (`keyword`);

--
-- Indexes for table `nzcompaniesoffice`
--
ALTER TABLE `nzcompaniesoffice`
  ADD PRIMARY KEY (`company_number`);

--
-- Indexes for table `nzcompaniesofficesearch`
--
ALTER TABLE `nzcompaniesofficesearch`
  ADD PRIMARY KEY (`keyword`);

--
-- Indexes for table `ukcompanieshouse`
--
ALTER TABLE `ukcompanieshouse`
  ADD PRIMARY KEY (`company_number`);

--
-- Indexes for table `yahoofinances`
--
ALTER TABLE `yahoofinances`
  ADD PRIMARY KEY (`ticker`,`iinterval`,`rrange`) USING BTREE;

--
-- Indexes for table `yahoofinancessearch`
--
ALTER TABLE `yahoofinancessearch`
  ADD PRIMARY KEY (`company_name`);

--
-- Indexes for table `yahoofinancessustainable`
--
ALTER TABLE `yahoofinancessustainable`
  ADD PRIMARY KEY (`ticker`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
