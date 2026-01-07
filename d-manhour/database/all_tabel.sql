



CREATE TABLE IF NOT EXISTS tb_pm_weekly_report (
    idPrimary INT(11) NOT NULL AUTO_INCREMENT,
    pm_type VARCHAR(20) NOT NULL,
    line_table VARCHAR(100) NOT NULL,
    line_name VARCHAR(100) DEFAULT NULL,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    start_wh VARCHAR(50) DEFAULT NULL,
    last_wh VARCHAR(50) DEFAULT NULL,
    total_wh VARCHAR(50) DEFAULT NULL,
    month VARCHAR(50) DEFAULT NULL,
    year VARCHAR(50) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idPrimary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;














balance_shaft_no_1
balance_shaft_no_2
cam_cap
cam_cap_1
cam_cap_1a
cam_cap_1b
cam_cap_1c_d05e
cam_cap_1c_nr
cam_cap_2
cam_cap_3
cam_cap_4
cam_housing
cam_housing_a
cam_housing_assy
cam_housing_assy_a
cam_housing_assy_b
cam_housing_assy_c_d05e
cam_housing_assy_c_nr
cam_housing_b
cam_housing_c
cam_housing_d
cam_housing_e_d05e
cam_housing_e_nr
common_rail_1
common_rail_1_core
common_rail_1_filtered
common_rail_1_hourly
common_rail_1_transit_manhour
common_rail_2
common_rail_2_core
common_rail_2_filtered
common_rail_2_hourly
common_rail_2_transit_manhour
common_rail_3
common_rail_3_4n13
common_rail_10
common_rail_10_core
common_rail_10_filtered
common_rail_10_hourly
common_rail_10_transit_manhour
common_rail_11
common_rail_11_core
common_rail_11_filtered
common_rail_11_hourly
common_rail_11_transit_manhour
common_rail_12
common_rail_12_core
common_rail_12_filtered
common_rail_12_hourly
common_rail_12_transit_manhour



common_rail_3_4n13_report
common_rail_3_902f_i
common_rail_3_902f_i_report
common_rail_3_core
common_rail_3_filtered
common_rail_3_hourly
common_rail_3_jde20
common_rail_3_jde20_report
common_rail_3_manhour
common_rail_3_rt56
common_rail_3_rt56_report
common_rail_3_transit_manhour
common_rail_3_vm
common_rail_3_vm_report
common_rail_3_vm_usa_a
common_rail_3_vm_usa_a_report
common_rail_4
common_rail_4_core
common_rail_4_filtered
common_rail_4_hourly
common_rail_4_transit_manhour
common_rail_5
common_rail_5_core
common_rail_5_filtered
common_rail_5_hourly
common_rail_5_transit_manhour
common_rail_6
common_rail_6_core
common_rail_6_filtered
common_rail_6_hourly
common_rail_6_transit_manhour
common_rail_7
common_rail_7_core
common_rail_7_filtered
common_rail_7_hourly
common_rail_7_transit_manhour
common_rail_8
common_rail_8_core
common_rail_8_filtered
common_rail_8_hourly
common_rail_8_transit_manhour
common_rail_9
common_rail_9_core
common_rail_9_filtered
common_rail_9_hourly
common_rail_9_transit_manhour
connector
drive_gear
hikitori_a
hikitori_b



hikitori_c
hikitori_d
hikitori_data
hikitori_e
hikitori_f
hikitori_g
hikitori_h
housing
housing_inlet_d13e
housing_inlet_tr
housing_inlet_water
packing_assy_a
packing_assy_b
packing_assy_c
production_data
retainer
roller_arm_1
roller_arm_1_a
roller_arm_1_b
roller_arm_1_c
roller_arm_1_d
roller_arm_1_e
roller_arm_2
roller_arm_2_a
roller_arm_2_b
roller_arm_2_c
roller_arm_2_d
roller_arm_2_e
spacer_drive_gear
table_all_montiv
tb_area_cr1cr2
tb_kub1_active_power
tb_kub1_pershift
tb_kub1_total_kwh
tb_kub2_panel_1_total_kwh
tb_kub2_panel_2_total_kwh
tb_lpdmtc
tb_lpf1
tb_lpf2
tb_lpqad
tb_lpsec
tb_lputils
tb_pm200_bs1
tb_pm200_bs2
tb_pm200_cc1
tb_pm200_cc234
tb_pm200_chab
tb_pm200_chcd
tb_pm200_chef
tb_pm200_chsaa



tb_pm200_chsab
tb_pm200_chsac
tb_pm200_conn
tb_pm200_cr1
tb_pm200_cr2
tb_pm200_cr3
tb_pm200_cr4
tb_pm200_cr5
tb_pm200_cr6
tb_pm200_cr7
tb_pm200_cr8
tb_pm200_cr9
tb_pm200_cr10
tb_pm200_cr11
tb_pm200_cr12
tb_pm200_ct
tb_pm200_hla
tb_pm200_ra
tb_pm200_ret
tb_pm200_weng
tb_pm220_bs1
tb_pm220_bs2
tb_pm220_cc1
tb_pm220_cc234
tb_pm220_chab
tb_pm220_chcd
tb_pm220_chef
tb_pm220_chsaa
tb_pm220_chsab
tb_pm220_chsac
tb_pm220_conn
tb_pm220_cr1
tb_pm220_cr2
tb_pm220_cr3
tb_pm220_cr4
tb_pm220_cr5
tb_pm220_cr6
tb_pm220_cr6_bakcup
tb_pm220_cr6_bakcup_2
tb_pm220_cr7
tb_pm220_cr8
tb_pm220_cr9
tb_pm220_cr10
tb_pm220_cr11
tb_pm220_cr12
tb_pm220_ct
tb_pm220_hla
tb_pm220_lpf3
tb_pm220_ra
tb_pm220_ret

tb_pm_monthly_report





query :

ALTER TABLE balance_shaft_no_1 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE balance_shaft_no_2 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_cap MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_cap_1 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_cap_1a MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_cap_1b MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_cap_1c_d05e MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_cap_1c_nr MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_cap_2 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_cap_3 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_cap_4 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_housing MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_housing_a MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_housing_assy MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_housing_assy_a MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_housing_assy_b MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_housing_assy_c_d05e MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_housing_assy_c_nr MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_housing_b MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_housing_c MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_housing_d MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_housing_e_d05e MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE cam_housing_e_nr MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_1 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_1_core MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_1_filtered MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_1_hourly MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_1_transit_manhour MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_2 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_2_core MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_2_filtered MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_2_hourly MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_2_transit_manhour MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_4n13 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_10 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_10_core MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_10_filtered MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_10_hourly MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_10_transit_manhour MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_11 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_11_core MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_11_filtered MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_11_hourly MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_11_transit_manhour MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_12 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_12_core MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_12_filtered MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_12_hourly MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_12_transit_manhour MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_4n13_report MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_902f_i MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_902f_i_report MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_core MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_filtered MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_hourly MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_jde20 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_jde20_report MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_manhour MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_rt56 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_rt56_report MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_transit_manhour MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_vm MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_vm_report MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_vm_usa_a MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_3_vm_usa_a_report MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_4 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_4_core MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_4_filtered MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_4_hourly MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_4_transit_manhour MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_5 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_5_core MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_5_filtered MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_5_hourly MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_5_transit_manhour MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_6 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_6_core MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_6_filtered MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_6_hourly MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_6_transit_manhour MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_7 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_7_core MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_7_filtered MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_7_hourly MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_7_transit_manhour MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_8 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_8_core MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_8_filtered MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_8_hourly MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_8_transit_manhour MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_9 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_9_core MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_9_filtered MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_9_hourly MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE common_rail_9_transit_manhour MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE connector MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE drive_gear MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE hikitori_a MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE hikitori_b MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE hikitori_c MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE hikitori_d MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE hikitori_data MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE hikitori_e MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE hikitori_f MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE hikitori_g MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE hikitori_h MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE housing MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE housing_inlet_d13e MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE housing_inlet_tr MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE housing_inlet_water MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE packing_assy_a MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE packing_assy_b MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE packing_assy_c MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE production_data MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE retainer MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE roller_arm_1 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE roller_arm_1_a MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE roller_arm_1_b MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE roller_arm_1_c MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE roller_arm_1_d MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE roller_arm_1_e MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE roller_arm_2 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE roller_arm_2_a MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE roller_arm_2_b MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE roller_arm_2_c MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE roller_arm_2_d MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE roller_arm_2_e MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE spacer_drive_gear MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE table_all_montiv MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_area_cr1cr2 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_kub1_active_power MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_kub1_pershift MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_kub1_total_kwh MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_kub2_panel_1_total_kwh MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_kub2_panel_2_total_kwh MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_lpdmtc MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_lpf1 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_lpf2 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_lpqad MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_lpsec MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_lputils MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_bs1 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_bs2 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cc1 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cc234 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_chab MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_chcd MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_chef MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_chsaa MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_chsab MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_chsac MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_conn MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cr1 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cr2 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cr3 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cr4 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cr5 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cr6 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cr7 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cr8 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cr9 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cr10 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cr11 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_cr12 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_ct MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_hla MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_ra MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_ret MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm200_weng MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_bs1 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_bs2 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cc1 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cc234 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_chab MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_chcd MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_chef MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_chsaa MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_chsab MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_chsac MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_conn MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr1 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr2 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr3 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr4 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr5 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr6 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr6_bakcup MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr6_bakcup_2 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr7 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr8 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr9 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr10 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr11 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_cr12 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_ct MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_hla MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_lpf3 MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_ra MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm220_ret MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);
ALTER TABLE tb_pm_monthly_report MODIFY COLUMN idPrimary INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (idPrimary);