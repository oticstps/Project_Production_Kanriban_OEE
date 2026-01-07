CREATE TABLE IF NOT EXISTS common_rail_11_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,
  
  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE IF NOT EXISTS common_rail_10_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,
  
  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS common_rail_9_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,
  
  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;




CREATE TABLE IF NOT EXISTS common_rail_8_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,
  
  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS common_rail_7_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,
  
  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE IF NOT EXISTS common_rail_6_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,
  
  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS common_rail_5_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,
  
  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE IF NOT EXISTS common_rail_4_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,
  
  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS common_rail_3_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,
  
  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE IF NOT EXISTS common_rail_2_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,
  
  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS common_rail_1_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,
  
  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;










===============================================================







DROP TABLE IF EXISTS 
  common_rail_1_core,
  common_rail_2_core,
  common_rail_3_core,
  common_rail_4_core,
  common_rail_5_core,
  common_rail_6_core,
  common_rail_7_core,
  common_rail_8_core,
  common_rail_9_core,
  common_rail_10_core,
  common_rail_11_core,
  common_rail_12_core;







CREATE TABLE IF NOT EXISTS common_rail_1_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,

  -- 🕒 Kolom tambahan hasil breakdown waktu
  year INT(4) DEFAULT NULL,
  month INT(2) DEFAULT NULL,
  day INT(2) DEFAULT NULL,
  shift VARCHAR(10) DEFAULT NULL,
  time_only TIME DEFAULT NULL,

  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE IF NOT EXISTS common_rail_2_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,

  -- 🕒 Kolom tambahan hasil breakdown waktu
  year INT(4) DEFAULT NULL,
  month INT(2) DEFAULT NULL,
  day INT(2) DEFAULT NULL,
  shift VARCHAR(10) DEFAULT NULL,
  time_only TIME DEFAULT NULL,

  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE IF NOT EXISTS common_rail_3_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,

  -- 🕒 Kolom tambahan hasil breakdown waktu
  year INT(4) DEFAULT NULL,
  month INT(2) DEFAULT NULL,
  day INT(2) DEFAULT NULL,
  shift VARCHAR(10) DEFAULT NULL,
  time_only TIME DEFAULT NULL,

  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS common_rail_4_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,

  -- 🕒 Kolom tambahan hasil breakdown waktu
  year INT(4) DEFAULT NULL,
  month INT(2) DEFAULT NULL,
  day INT(2) DEFAULT NULL,
  shift VARCHAR(10) DEFAULT NULL,
  time_only TIME DEFAULT NULL,

  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS common_rail_5_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,

  -- 🕒 Kolom tambahan hasil breakdown waktu
  year INT(4) DEFAULT NULL,
  month INT(2) DEFAULT NULL,
  day INT(2) DEFAULT NULL,
  shift VARCHAR(10) DEFAULT NULL,
  time_only TIME DEFAULT NULL,

  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS common_rail_6_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,

  -- 🕒 Kolom tambahan hasil breakdown waktu
  year INT(4) DEFAULT NULL,
  month INT(2) DEFAULT NULL,
  day INT(2) DEFAULT NULL,
  shift VARCHAR(10) DEFAULT NULL,
  time_only TIME DEFAULT NULL,

  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS common_rail_7_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,

  -- 🕒 Kolom tambahan hasil breakdown waktu
  year INT(4) DEFAULT NULL,
  month INT(2) DEFAULT NULL,
  day INT(2) DEFAULT NULL,
  shift VARCHAR(10) DEFAULT NULL,
  time_only TIME DEFAULT NULL,

  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE IF NOT EXISTS common_rail_8_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,

  -- 🕒 Kolom tambahan hasil breakdown waktu
  year INT(4) DEFAULT NULL,
  month INT(2) DEFAULT NULL,
  day INT(2) DEFAULT NULL,
  shift VARCHAR(10) DEFAULT NULL,
  time_only TIME DEFAULT NULL,

  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS common_rail_9_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,

  -- 🕒 Kolom tambahan hasil breakdown waktu
  year INT(4) DEFAULT NULL,
  month INT(2) DEFAULT NULL,
  day INT(2) DEFAULT NULL,
  shift VARCHAR(10) DEFAULT NULL,
  time_only TIME DEFAULT NULL,

  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS common_rail_10_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,

  -- 🕒 Kolom tambahan hasil breakdown waktu
  year INT(4) DEFAULT NULL,
  month INT(2) DEFAULT NULL,
  day INT(2) DEFAULT NULL,
  shift VARCHAR(10) DEFAULT NULL,
  time_only TIME DEFAULT NULL,

  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS common_rail_11_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,

  -- 🕒 Kolom tambahan hasil breakdown waktu
  year INT(4) DEFAULT NULL,
  month INT(2) DEFAULT NULL,
  day INT(2) DEFAULT NULL,
  shift VARCHAR(10) DEFAULT NULL,
  time_only TIME DEFAULT NULL,

  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS common_rail_12_core (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) DEFAULT NULL,
  pg VARCHAR(10) DEFAULT NULL,
  line_name VARCHAR(50) DEFAULT NULL,
  name_product VARCHAR(100) DEFAULT NULL,
  target VARCHAR(50) DEFAULT NULL,
  actual VARCHAR(50) DEFAULT NULL,
  loading_time VARCHAR(50) DEFAULT NULL,
  efficiency VARCHAR(50) DEFAULT NULL,
  delay VARCHAR(50) DEFAULT NULL,
  cycle_time VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  time_trouble VARCHAR(50) DEFAULT NULL,
  time_trouble_quality VARCHAR(50) DEFAULT NULL,
  andon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  delta_time VARCHAR(100) DEFAULT NULL,

  -- 🕒 Kolom tambahan hasil breakdown waktu
  year INT(4) DEFAULT NULL,
  month INT(2) DEFAULT NULL,
  day INT(2) DEFAULT NULL,
  shift VARCHAR(10) DEFAULT NULL,
  time_only TIME DEFAULT NULL,

  PRIMARY KEY (idPrimary),
  INDEX idx_line_id (line_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;




ALTER TABLE common_rail_1_core MODIFY day VARCHAR(20) DEFAULT NULL;
ALTER TABLE common_rail_2_core MODIFY day VARCHAR(20) DEFAULT NULL;
ALTER TABLE common_rail_3_core MODIFY day VARCHAR(20) DEFAULT NULL;
ALTER TABLE common_rail_4_core MODIFY day VARCHAR(20) DEFAULT NULL;
ALTER TABLE common_rail_5_core MODIFY day VARCHAR(20) DEFAULT NULL;
ALTER TABLE common_rail_6_core MODIFY day VARCHAR(20) DEFAULT NULL;
ALTER TABLE common_rail_7_core MODIFY day VARCHAR(20) DEFAULT NULL;
ALTER TABLE common_rail_8_core MODIFY day VARCHAR(20) DEFAULT NULL;
ALTER TABLE common_rail_9_core MODIFY day VARCHAR(20) DEFAULT NULL;
ALTER TABLE common_rail_10_core MODIFY day VARCHAR(20) DEFAULT NULL;
ALTER TABLE common_rail_11_core MODIFY day VARCHAR(20) DEFAULT NULL;
ALTER TABLE common_rail_12_core MODIFY day VARCHAR(20) DEFAULT NULL;





ALTER TABLE `common_rail_1_core` ADD COLUMN `loading_time_server` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Durasi kerja bersih (delta_time - total_istirahat)';
ALTER TABLE `common_rail_2_core` ADD COLUMN `loading_time_server` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Durasi kerja bersih (delta_time - total_istirahat)';
ALTER TABLE `common_rail_3_core` ADD COLUMN `loading_time_server` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Durasi kerja bersih (delta_time - total_istirahat)';
ALTER TABLE `common_rail_4_core` ADD COLUMN `loading_time_server` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Durasi kerja bersih (delta_time - total_istirahat)';
ALTER TABLE `common_rail_5_core` ADD COLUMN `loading_time_server` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Durasi kerja bersih (delta_time - total_istirahat)';
ALTER TABLE `common_rail_6_core` ADD COLUMN `loading_time_server` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Durasi kerja bersih (delta_time - total_istirahat)';
ALTER TABLE `common_rail_7_core` ADD COLUMN `loading_time_server` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Durasi kerja bersih (delta_time - total_istirahat)';
ALTER TABLE `common_rail_8_core` ADD COLUMN `loading_time_server` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Durasi kerja bersih (delta_time - total_istirahat)';
ALTER TABLE `common_rail_9_core` ADD COLUMN `loading_time_server` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Durasi kerja bersih (delta_time - total_istirahat)';
ALTER TABLE `common_rail_10_core` ADD COLUMN `loading_time_server` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Durasi kerja bersih (delta_time - total_istirahat)';
ALTER TABLE `common_rail_11_core` ADD COLUMN `loading_time_server` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Durasi kerja bersih (delta_time - total_istirahat)';
ALTER TABLE `common_rail_12_core` ADD COLUMN `loading_time_server` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Durasi kerja bersih (delta_time - total_istirahat)';





ALTER TABLE `common_rail_1_core` ADD COLUMN `total_break` DECIMAL(5,2) NULL DEFAULT NULL COMMENT 'Total durasi istirahat dalam siklus produksi (menit)';
ALTER TABLE `common_rail_2_core` ADD COLUMN `total_break` DECIMAL(5,2) NULL DEFAULT NULL COMMENT 'Total durasi istirahat dalam siklus produksi (menit)';
ALTER TABLE `common_rail_3_core` ADD COLUMN `total_break` DECIMAL(5,2) NULL DEFAULT NULL COMMENT 'Total durasi istirahat dalam siklus produksi (menit)';
ALTER TABLE `common_rail_4_core` ADD COLUMN `total_break` DECIMAL(5,2) NULL DEFAULT NULL COMMENT 'Total durasi istirahat dalam siklus produksi (menit)';
ALTER TABLE `common_rail_5_core` ADD COLUMN `total_break` DECIMAL(5,2) NULL DEFAULT NULL COMMENT 'Total durasi istirahat dalam siklus produksi (menit)';
ALTER TABLE `common_rail_6_core` ADD COLUMN `total_break` DECIMAL(5,2) NULL DEFAULT NULL COMMENT 'Total durasi istirahat dalam siklus produksi (menit)';
ALTER TABLE `common_rail_7_core` ADD COLUMN `total_break` DECIMAL(5,2) NULL DEFAULT NULL COMMENT 'Total durasi istirahat dalam siklus produksi (menit)';
ALTER TABLE `common_rail_8_core` ADD COLUMN `total_break` DECIMAL(5,2) NULL DEFAULT NULL COMMENT 'Total durasi istirahat dalam siklus produksi (menit)';
ALTER TABLE `common_rail_9_core` ADD COLUMN `total_break` DECIMAL(5,2) NULL DEFAULT NULL COMMENT 'Total durasi istirahat dalam siklus produksi (menit)';
ALTER TABLE `common_rail_10_core` ADD COLUMN `total_break` DECIMAL(5,2) NULL DEFAULT NULL COMMENT 'Total durasi istirahat dalam siklus produksi (menit)';
ALTER TABLE `common_rail_11_core` ADD COLUMN `total_break` DECIMAL(5,2) NULL DEFAULT NULL COMMENT 'Total durasi istirahat dalam siklus produksi (menit)';
ALTER TABLE `common_rail_12_core` ADD COLUMN `total_break` DECIMAL(5,2) NULL DEFAULT NULL COMMENT 'Total durasi istirahat dalam siklus produksi (menit)';


ALTER TABLE common_rail_1_core ADD COLUMN ideal_time_start TIME NULL DEFAULT NULL COMMENT 'Waktu ideal mulai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_2_core ADD COLUMN ideal_time_start TIME NULL DEFAULT NULL COMMENT 'Waktu ideal mulai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_3_core ADD COLUMN ideal_time_start TIME NULL DEFAULT NULL COMMENT 'Waktu ideal mulai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_4_core ADD COLUMN ideal_time_start TIME NULL DEFAULT NULL COMMENT 'Waktu ideal mulai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_5_core ADD COLUMN ideal_time_start TIME NULL DEFAULT NULL COMMENT 'Waktu ideal mulai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_6_core ADD COLUMN ideal_time_start TIME NULL DEFAULT NULL COMMENT 'Waktu ideal mulai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_7_core ADD COLUMN ideal_time_start TIME NULL DEFAULT NULL COMMENT 'Waktu ideal mulai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_8_core ADD COLUMN ideal_time_start TIME NULL DEFAULT NULL COMMENT 'Waktu ideal mulai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_9_core ADD COLUMN ideal_time_start TIME NULL DEFAULT NULL COMMENT 'Waktu ideal mulai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_10_core ADD COLUMN ideal_time_start TIME NULL DEFAULT NULL COMMENT 'Waktu ideal mulai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_11_core ADD COLUMN ideal_time_start TIME NULL DEFAULT NULL COMMENT 'Waktu ideal mulai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_12_core ADD COLUMN ideal_time_start TIME NULL DEFAULT NULL COMMENT 'Waktu ideal mulai produksi dalam satu shift/siklus';


ALTER TABLE common_rail_1_core ADD COLUMN ideal_time_stop TIME NULL DEFAULT NULL COMMENT 'Waktu ideal selesai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_2_core ADD COLUMN ideal_time_stop TIME NULL DEFAULT NULL COMMENT 'Waktu ideal selesai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_3_core ADD COLUMN ideal_time_stop TIME NULL DEFAULT NULL COMMENT 'Waktu ideal selesai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_4_core ADD COLUMN ideal_time_stop TIME NULL DEFAULT NULL COMMENT 'Waktu ideal selesai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_5_core ADD COLUMN ideal_time_stop TIME NULL DEFAULT NULL COMMENT 'Waktu ideal selesai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_6_core ADD COLUMN ideal_time_stop TIME NULL DEFAULT NULL COMMENT 'Waktu ideal selesai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_7_core ADD COLUMN ideal_time_stop TIME NULL DEFAULT NULL COMMENT 'Waktu ideal selesai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_8_core ADD COLUMN ideal_time_stop TIME NULL DEFAULT NULL COMMENT 'Waktu ideal selesai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_9_core ADD COLUMN ideal_time_stop TIME NULL DEFAULT NULL COMMENT 'Waktu ideal selesai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_10_core ADD COLUMN ideal_time_stop TIME NULL DEFAULT NULL COMMENT 'Waktu ideal selesai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_11_core ADD COLUMN ideal_time_stop TIME NULL DEFAULT NULL COMMENT 'Waktu ideal selesai produksi dalam satu shift/siklus';
ALTER TABLE common_rail_12_core ADD COLUMN ideal_time_stop TIME NULL DEFAULT NULL COMMENT 'Waktu ideal selesai produksi dalam satu shift/siklus';

















CREATE TABLE common_rail_12_transit_manhour (
    id INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) DEFAULT NULL,
    pg VARCHAR(10) DEFAULT NULL,
    line_name VARCHAR(50) DEFAULT NULL,
    name_product VARCHAR(100) DEFAULT NULL,
    target VARCHAR(50) DEFAULT NULL,
    actual VARCHAR(50) DEFAULT NULL,
    loading_time VARCHAR(50) DEFAULT NULL,
    efficiency VARCHAR(50) DEFAULT NULL,
    delay VARCHAR(50) DEFAULT NULL,
    cycle_time VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    time_trouble VARCHAR(50) DEFAULT NULL,
    time_trouble_quality VARCHAR(50) DEFAULT NULL,
    andon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_line_id (line_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;




CREATE TABLE common_rail_11_transit_manhour (
    id INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) DEFAULT NULL,
    pg VARCHAR(10) DEFAULT NULL,
    line_name VARCHAR(50) DEFAULT NULL,
    name_product VARCHAR(100) DEFAULT NULL,
    target VARCHAR(50) DEFAULT NULL,
    actual VARCHAR(50) DEFAULT NULL,
    loading_time VARCHAR(50) DEFAULT NULL,
    efficiency VARCHAR(50) DEFAULT NULL,
    delay VARCHAR(50) DEFAULT NULL,
    cycle_time VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    time_trouble VARCHAR(50) DEFAULT NULL,
    time_trouble_quality VARCHAR(50) DEFAULT NULL,
    andon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_line_id (line_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;





CREATE TABLE common_rail_10_transit_manhour (
    id INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) DEFAULT NULL,
    pg VARCHAR(10) DEFAULT NULL,
    line_name VARCHAR(50) DEFAULT NULL,
    name_product VARCHAR(100) DEFAULT NULL,
    target VARCHAR(50) DEFAULT NULL,
    actual VARCHAR(50) DEFAULT NULL,
    loading_time VARCHAR(50) DEFAULT NULL,
    efficiency VARCHAR(50) DEFAULT NULL,
    delay VARCHAR(50) DEFAULT NULL,
    cycle_time VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    time_trouble VARCHAR(50) DEFAULT NULL,
    time_trouble_quality VARCHAR(50) DEFAULT NULL,
    andon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_line_id (line_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;





CREATE TABLE common_rail_9_transit_manhour (
    id INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) DEFAULT NULL,
    pg VARCHAR(10) DEFAULT NULL,
    line_name VARCHAR(50) DEFAULT NULL,
    name_product VARCHAR(100) DEFAULT NULL,
    target VARCHAR(50) DEFAULT NULL,
    actual VARCHAR(50) DEFAULT NULL,
    loading_time VARCHAR(50) DEFAULT NULL,
    efficiency VARCHAR(50) DEFAULT NULL,
    delay VARCHAR(50) DEFAULT NULL,
    cycle_time VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    time_trouble VARCHAR(50) DEFAULT NULL,
    time_trouble_quality VARCHAR(50) DEFAULT NULL,
    andon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_line_id (line_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;





CREATE TABLE common_rail_8_transit_manhour (
    id INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) DEFAULT NULL,
    pg VARCHAR(10) DEFAULT NULL,
    line_name VARCHAR(50) DEFAULT NULL,
    name_product VARCHAR(100) DEFAULT NULL,
    target VARCHAR(50) DEFAULT NULL,
    actual VARCHAR(50) DEFAULT NULL,
    loading_time VARCHAR(50) DEFAULT NULL,
    efficiency VARCHAR(50) DEFAULT NULL,
    delay VARCHAR(50) DEFAULT NULL,
    cycle_time VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    time_trouble VARCHAR(50) DEFAULT NULL,
    time_trouble_quality VARCHAR(50) DEFAULT NULL,
    andon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_line_id (line_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;





CREATE TABLE common_rail_7_transit_manhour (
    id INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) DEFAULT NULL,
    pg VARCHAR(10) DEFAULT NULL,
    line_name VARCHAR(50) DEFAULT NULL,
    name_product VARCHAR(100) DEFAULT NULL,
    target VARCHAR(50) DEFAULT NULL,
    actual VARCHAR(50) DEFAULT NULL,
    loading_time VARCHAR(50) DEFAULT NULL,
    efficiency VARCHAR(50) DEFAULT NULL,
    delay VARCHAR(50) DEFAULT NULL,
    cycle_time VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    time_trouble VARCHAR(50) DEFAULT NULL,
    time_trouble_quality VARCHAR(50) DEFAULT NULL,
    andon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_line_id (line_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;





CREATE TABLE common_rail_6_transit_manhour (
    id INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) DEFAULT NULL,
    pg VARCHAR(10) DEFAULT NULL,
    line_name VARCHAR(50) DEFAULT NULL,
    name_product VARCHAR(100) DEFAULT NULL,
    target VARCHAR(50) DEFAULT NULL,
    actual VARCHAR(50) DEFAULT NULL,
    loading_time VARCHAR(50) DEFAULT NULL,
    efficiency VARCHAR(50) DEFAULT NULL,
    delay VARCHAR(50) DEFAULT NULL,
    cycle_time VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    time_trouble VARCHAR(50) DEFAULT NULL,
    time_trouble_quality VARCHAR(50) DEFAULT NULL,
    andon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_line_id (line_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;





CREATE TABLE common_rail_5_transit_manhour (
    id INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) DEFAULT NULL,
    pg VARCHAR(10) DEFAULT NULL,
    line_name VARCHAR(50) DEFAULT NULL,
    name_product VARCHAR(100) DEFAULT NULL,
    target VARCHAR(50) DEFAULT NULL,
    actual VARCHAR(50) DEFAULT NULL,
    loading_time VARCHAR(50) DEFAULT NULL,
    efficiency VARCHAR(50) DEFAULT NULL,
    delay VARCHAR(50) DEFAULT NULL,
    cycle_time VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    time_trouble VARCHAR(50) DEFAULT NULL,
    time_trouble_quality VARCHAR(50) DEFAULT NULL,
    andon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_line_id (line_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;





CREATE TABLE common_rail_4_transit_manhour (
    id INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) DEFAULT NULL,
    pg VARCHAR(10) DEFAULT NULL,
    line_name VARCHAR(50) DEFAULT NULL,
    name_product VARCHAR(100) DEFAULT NULL,
    target VARCHAR(50) DEFAULT NULL,
    actual VARCHAR(50) DEFAULT NULL,
    loading_time VARCHAR(50) DEFAULT NULL,
    efficiency VARCHAR(50) DEFAULT NULL,
    delay VARCHAR(50) DEFAULT NULL,
    cycle_time VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    time_trouble VARCHAR(50) DEFAULT NULL,
    time_trouble_quality VARCHAR(50) DEFAULT NULL,
    andon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_line_id (line_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;





CREATE TABLE common_rail_3_transit_manhour (
    id INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) DEFAULT NULL,
    pg VARCHAR(10) DEFAULT NULL,
    line_name VARCHAR(50) DEFAULT NULL,
    name_product VARCHAR(100) DEFAULT NULL,
    target VARCHAR(50) DEFAULT NULL,
    actual VARCHAR(50) DEFAULT NULL,
    loading_time VARCHAR(50) DEFAULT NULL,
    efficiency VARCHAR(50) DEFAULT NULL,
    delay VARCHAR(50) DEFAULT NULL,
    cycle_time VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    time_trouble VARCHAR(50) DEFAULT NULL,
    time_trouble_quality VARCHAR(50) DEFAULT NULL,
    andon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_line_id (line_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;





CREATE TABLE common_rail_2_transit_manhour (
    id INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) DEFAULT NULL,
    pg VARCHAR(10) DEFAULT NULL,
    line_name VARCHAR(50) DEFAULT NULL,
    name_product VARCHAR(100) DEFAULT NULL,
    target VARCHAR(50) DEFAULT NULL,
    actual VARCHAR(50) DEFAULT NULL,
    loading_time VARCHAR(50) DEFAULT NULL,
    efficiency VARCHAR(50) DEFAULT NULL,
    delay VARCHAR(50) DEFAULT NULL,
    cycle_time VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    time_trouble VARCHAR(50) DEFAULT NULL,
    time_trouble_quality VARCHAR(50) DEFAULT NULL,
    andon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_line_id (line_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;





CREATE TABLE common_rail_1_transit_manhour (
    id INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) DEFAULT NULL,
    pg VARCHAR(10) DEFAULT NULL,
    line_name VARCHAR(50) DEFAULT NULL,
    name_product VARCHAR(100) DEFAULT NULL,
    target VARCHAR(50) DEFAULT NULL,
    actual VARCHAR(50) DEFAULT NULL,
    loading_time VARCHAR(50) DEFAULT NULL,
    efficiency VARCHAR(50) DEFAULT NULL,
    delay VARCHAR(50) DEFAULT NULL,
    cycle_time VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    time_trouble VARCHAR(50) DEFAULT NULL,
    time_trouble_quality VARCHAR(50) DEFAULT NULL,
    andon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_line_id (line_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
















CREATE TABLE common_rail_1_filtered (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `delay` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

CREATE TABLE common_rail_2_filtered (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `delay` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


CREATE TABLE common_rail_3_filtered (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `delay` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


CREATE TABLE common_rail_4_filtered (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `delay` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


CREATE TABLE common_rail_5_filtered (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `delay` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;



CREATE TABLE common_rail_6_filtered (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `delay` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;



CREATE TABLE common_rail_7_filtered (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `delay` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


CREATE TABLE common_rail_8_filtered (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `delay` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


CREATE TABLE common_rail_9_filtered (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `delay` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


CREATE TABLE common_rail_10_filtered (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `delay` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

CREATE TABLE common_rail_11_filtered (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `delay` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

CREATE TABLE common_rail_12_filtered (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
    line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `delay` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;