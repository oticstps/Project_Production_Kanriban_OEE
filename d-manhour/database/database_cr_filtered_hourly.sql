-- Tabel asal (contoh - jika Anda memerlukan struktur umum)
CREATE TABLE common_rail_3 (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel filtered untuk semua line
CREATE TABLE common_rail_1_filtered (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    INDEX idx_product_created (name_product)
);

CREATE TABLE common_rail_2_filtered (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    INDEX idx_product_created (name_product)
);

CREATE TABLE common_rail_3_filtered (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    INDEX idx_product_created (name_product)
);

CREATE TABLE common_rail_4_filtered (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    INDEX idx_product_created (name_product)
);

CREATE TABLE common_rail_5_filtered (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    INDEX idx_product_created (name_product)
);

CREATE TABLE common_rail_6_filtered (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    INDEX idx_product_created (name_product)
);

CREATE TABLE common_rail_7_filtered (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    INDEX idx_product_created (name_product)
);

CREATE TABLE common_rail_8_filtered (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    INDEX idx_product_created (name_product)
);

CREATE TABLE common_rail_9_filtered (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    INDEX idx_product_created (name_product)
);

CREATE TABLE common_rail_10_filtered (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    INDEX idx_product_created (name_product)
);

CREATE TABLE common_rail_11_filtered (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    INDEX idx_product_created (name_product)
);

CREATE TABLE common_rail_12_filtered (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    INDEX idx_product_created (name_product)
);

-- Tabel hourly untuk semua line
CREATE TABLE common_rail_1_hourly (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    delta_actual VARCHAR(50) NOT NULL,
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    created_at TIMESTAMP NULL,
    INDEX idx_product_created (name_product, created_at)
);

CREATE TABLE common_rail_2_hourly (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    delta_actual VARCHAR(50) NOT NULL,
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    created_at TIMESTAMP NULL,
    INDEX idx_product_created (name_product, created_at)
);

CREATE TABLE common_rail_3_hourly (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    delta_actual VARCHAR(50) NOT NULL,
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    created_at TIMESTAMP NULL,
    INDEX idx_product_created (name_product, created_at)
);

CREATE TABLE common_rail_4_hourly (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    delta_actual VARCHAR(50) NOT NULL,
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    created_at TIMESTAMP NULL,
    INDEX idx_product_created (name_product, created_at)
);

CREATE TABLE common_rail_5_hourly (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    delta_actual VARCHAR(50) NOT NULL,
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    created_at TIMESTAMP NULL,
    INDEX idx_product_created (name_product, created_at)
);

CREATE TABLE common_rail_6_hourly (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    delta_actual VARCHAR(50) NOT NULL,
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    created_at TIMESTAMP NULL,
    INDEX idx_product_created (name_product, created_at)
);

CREATE TABLE common_rail_7_hourly (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    delta_actual VARCHAR(50) NOT NULL,
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    created_at TIMESTAMP NULL,
    INDEX idx_product_created (name_product, created_at)
);

CREATE TABLE common_rail_8_hourly (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    delta_actual VARCHAR(50) NOT NULL,
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    created_at TIMESTAMP NULL,
    INDEX idx_product_created (name_product, created_at)
);

CREATE TABLE common_rail_9_hourly (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    delta_actual VARCHAR(50) NOT NULL,
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    created_at TIMESTAMP NULL,
    INDEX idx_product_created (name_product, created_at)
);

CREATE TABLE common_rail_10_hourly (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    delta_actual VARCHAR(50) NOT NULL,
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    created_at TIMESTAMP NULL,
    INDEX idx_product_created (name_product, created_at)
);

CREATE TABLE common_rail_11_hourly (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    delta_actual VARCHAR(50) NOT NULL,
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    created_at TIMESTAMP NULL,
    INDEX idx_product_created (name_product, created_at)
);

CREATE TABLE common_rail_12_hourly (
    idPrimary INT AUTO_INCREMENT PRIMARY KEY,
    line_id VARCHAR(10),
    pg VARCHAR(10),
    line_name VARCHAR(50),
    name_product VARCHAR(100),
    target VARCHAR(50),
    actual VARCHAR(50),
    delta_actual VARCHAR(50) NOT NULL,
    loading_time VARCHAR(50),
    efficiency VARCHAR(50),
    delay VARCHAR(50),
    cycle_time VARCHAR(50),
    status VARCHAR(50),
    time_trouble VARCHAR(50),
    time_trouble_quality VARCHAR(50),
    andon VARCHAR(50),
    created_at TIMESTAMP NULL,
    INDEX idx_product_created (name_product, created_at)
);