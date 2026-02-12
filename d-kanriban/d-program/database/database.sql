


-- MONTIV CONTROL DATABASE------------------------------------
-- database new line produksi
CREATE TABLE name_production_data (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  delay VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (idPrimary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- database filtered
CREATE TABLE name_production_data_filtered (
  idPrimary INT(11) NOT NULL AUTO_INCREMENT,
  line_id VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  pg VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  line_name VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  name_product VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  target VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  actual VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  loading_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  efficiency VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  delay VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  status VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  andon VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (idPrimary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;







-- Database manhour
CREATE TABLE manhour_data (
    idPrimary INT PRIMARY KEY AUTO_INCREMENT,
    cycle_number INT,
    line_id VARCHAR(10),
    line_name VARCHAR(50),
    product_name VARCHAR(50),
    shift VARCHAR(20),
    start_time DATETIME,
    end_time DATETIME,
    duration_minutes INT DEFAULT 0,
    start_actual INT,
    end_actual INT,
    total_produced INT,
    record_count INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contoh insert data

INSERT INTO manhour_data (idPrimary, cycle_number, line_id, line_name, product_name, shift, start_time, end_time, duration_minutes, start_actual, end_actual, total_produced, record_count, created_at) VALUES
(21, 21, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-25 00:20:20', '2025-09-25 12:01:22', 660, 2, 162, 160, 117, '2025-09-26 04:06:55'),
(20, 20, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-24 00:21:10', '2025-09-24 12:01:21', 660, 1, 216, 215, 169, '2025-09-26 04:06:55'),
(19, 19, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-23 00:25:41', '2025-09-23 12:01:19', 660, 1, 246, 245, 191, '2025-09-26 04:06:55'),
(18, 18, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-22 00:26:51', '2025-09-22 09:31:17', 544, 2, 186, 184, 148, '2025-09-26 04:06:55'),
(17, 17, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-19 00:16:09', '2025-09-19 12:01:13', 660, 1, 246, 245, 205, '2025-09-26 04:06:55'),
(16, 16, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-18 00:17:27', '2025-09-18 12:01:11', 660, 3, 252, 249, 210, '2025-09-26 04:06:55'),
(15, 15, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-17 00:18:18', '2025-09-17 12:01:10', 660, 3, 240, 237, 200, '2025-09-26 04:06:55'),
(14, 14, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-16 00:19:38', '2025-09-16 12:01:09', 660, 2, 277, 275, 225, '2025-09-26 04:06:55'),
(13, 13, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-15 01:00:55', '2025-09-15 12:01:07', 660, 1, 246, 245, 175, '2025-09-26 04:06:55'),
(12, 12, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-12 10:42:14', '2025-09-12 12:01:02', 78, 2, 246, 244, 29, '2025-09-26 04:06:55'),
(11, 11, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-11 11:01:31', '2025-09-12 10:40:54', 660, 1, 246, 245, 195, '2025-09-26 04:06:55'),
(10, 10, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-11 00:23:59', '2025-09-11 09:30:17', 546, 3, 246, 243, 184, '2025-09-26 04:06:55'),
(9, 9, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-10 00:21:29', '2025-09-10 12:00:10', 660, 2, 246, 244, 200, '2025-09-26 04:06:55'),
(8, 8, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-08 11:31:49', '2025-09-09 12:00:15', 660, 2, 246, 244, 229, '2025-09-26 04:06:55'),
(7, 7, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-08 00:42:49', '2025-09-08 10:43:30', 600, 4, 259, 255, 193, '2025-09-26 04:06:55'),
(6, 6, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-04 00:19:50', '2025-09-04 10:21:24', 601, 3, 276, 273, 232, '2025-09-26 04:06:55'),
(5, 5, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-03 00:26:29', '2025-09-03 11:18:58', 652, 3, 247, 244, 213, '2025-09-26 04:06:55'),
(4, 4, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-02 00:14:56', '2025-09-02 11:20:56', 660, 3, 300, 297, 255, '2025-09-26 04:06:55'),
(3, 3, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-09-01 00:23:04', '2025-09-01 09:00:50', 517, 2, 187, 185, 171, '2025-09-26 04:06:55'),
(2, 2, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-08-29 00:16:19', '2025-08-29 08:53:44', 493, 3, 245, 242, 185, '2025-09-26 04:06:55'),
(1, 1, '3', 'Common Rail 3', '4N13', 'Shift 1', '2025-08-28 00:23:16', '2025-08-28 08:37:15', 493, 1, 271, 270, 177, '2025-09-26 04:06:55');





