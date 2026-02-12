CREATE TABLE common_rail_12_manhour (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,

    line_id VARCHAR(10) COLLATE utf8mb4_general_ci NULL,
    pg VARCHAR(10) COLLATE utf8mb4_general_ci NULL,
    line_name VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    name_product VARCHAR(100) COLLATE utf8mb4_general_ci NULL,
    target VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    actual VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    loading_time VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    efficiency VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    delay VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    cycle_time VARCHAR(50) COLLATE utf8mb4_general_ci NULL,

    status VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    time_trouble VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    time_trouble_quality VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    andon VARCHAR(50) COLLATE utf8mb4_general_ci NULL,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

    manpower VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    manpower_help VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    loading_time_manpower_help VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    machine_fault_preq VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    machine_fault_duration VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    quality_check VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    another VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    kaizen VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    five_s VARCHAR(50) COLLATE utf8mb4_general_ci NULL,

    manhour_in_line VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    manhour_helper VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    manhour_five_s VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    total_manhour VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    manhour_man_minutes_per_pcs VARCHAR(50) COLLATE utf8mb4_general_ci NULL,

    PE VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    bottle_neck_process VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    bottle_neck_process_duration VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    bottle_neck_mct VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    bottle_neck_mct_duration VARCHAR(50) COLLATE utf8mb4_general_ci NULL,

    setup_manpower VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    setup_ct VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    dangae VARCHAR(50) COLLATE utf8mb4_general_ci NULL,
    delta_time VARCHAR(100) COLLATE utf8mb4_general_ci NULL,

    year INT(4) NULL,
    month INT(2) NULL,
    day VARCHAR(20) COLLATE utf8mb4_general_ci NULL,
    shift VARCHAR(10) COLLATE utf8mb4_general_ci NULL,

    time_only TIME NULL,
    loading_time_server VARCHAR(255) COLLATE utf8mb4_general_ci NULL,
    total_break DECIMAL(5,2) NULL,

    PRIMARY KEY (idPrimary),
    KEY idx_line_id (line_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at),
    KEY idx_shift (shift)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;
