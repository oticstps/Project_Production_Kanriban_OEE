

-- logging data power meter
CREATE TABLE `tb_pm220_cr1` (
  `idPrimary` INT(11) NOT NULL AUTO_INCREMENT,
  `date_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `power_meter` VARCHAR(255) NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  `shift` VARCHAR(50) NOT NULL,
  `day` VARCHAR(50) NOT NULL,
  `week` VARCHAR(50) DEFAULT NULL,
  `month` VARCHAR(50) DEFAULT NULL,
  `year` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`idPrimary`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



-- Monthly report
CREATE TABLE your_table_name (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    pm_type VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    line_table VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    line_name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    start_wh VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
    last_wh VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
    total_wh VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
    month VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
    year VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
