[
    {
        "id": "0e75b1bfbb4fa673",
        "type": "mysql",
        "z": "4db585e6a94fb7af",
        "mydb": "dc56ad4eb0f6eef7",
        "name": "",
        "x": 1115,
        "y": 65,
        "wires": [
            []
        ]
    },
    {
        "id": "a152431516a4878a",
        "type": "mysql",
        "z": "4db585e6a94fb7af",
        "mydb": "6e2a71cd13bdf08b",
        "name": "",
        "x": 740,
        "y": 1645,
        "wires": [
            []
        ]
    },
    {
        "id": "473819c182b42540",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "nais_produksi",
        "func": "// Fungsi mapping line_id ke line_name dan pg\nfunction getLineInfo(line_id) {\n    const lineMap = {\n        \"1\": { name: \"Common Rail 1\", pg: \"PG2.2\" },\n        \"2\": { name: \"Common Rail 2\", pg: \"PG2.2\" },\n        \"3\": { name: \"Common Rail 3\", pg: \"PG2.2\" },\n        \"4\": { name: \"Common Rail 4\", pg: \"PG2.1\" },\n        \"5\": { name: \"Common Rail 5\", pg: \"PG2.2\" },\n        \"6\": { name: \"Common Rail 6\", pg: \"PG2.1\" },\n        \"7\": { name: \"Common Rail 7\", pg: \"PG2.2\" },\n        \"8\": { name: \"Common Rail 8\", pg: \"PG2.2\" },\n        \"9\": { name: \"Common Rail 9\", pg: \"PG2.1\" },\n        \"10\": { name: \"Common Rail 10\", pg: \"PG2.1\" },\n        \"11\": { name: \"Common Rail 11\", pg: \"PG2.1\" },\n        \"12\": { name: \"Common Rail 12\", pg: \"PG2.3\" },\n        \"13\": { name: \"Cam housing\", pg: \"PG2.3\" },\n        \"13A\": { name: \"Cam housing A\", pg: \"PG2.3\" },\n        \"13B\": { name: \"Cam housing B\", pg: \"PG2.3\" },\n        \"14\": { name: \"Cam housing\", pg: \"PG2.3\" },\n        \"14A\": { name: \"Cam housing C\", pg: \"PG2.3\" },\n        \"14B\": { name: \"Cam housing D\", pg: \"PG2.3\" },\n        \"15\": { name: \"Cam housing\", pg: \"PG2.3\" },\n        \"15A\": { name: \"Cam housing E NR\", pg: \"PG2.3\" },\n        \"15B\": { name: \"Cam housing E D05E\", pg: \"PG2.3\" },\n        \"16\": { name: \"Cam housing Assy A\", pg: \"PG2.3\" },\n        \"17\": { name: \"Cam housing Assy B\", pg: \"PG2.3\" },\n        \"18\": { name: \"Cam housing Assy\", pg: \"PG2.3\" },\n        \"18A\": { name: \"Cam housing Assy C NR\", pg: \"PG2.3\" },\n        \"18B\": { name: \"Cam housing Assy C D05E\", pg: \"PG2.3\" },\n        \"19\": { name: \"Cam Cap 1A\", pg: \"PG2.3\" },\n        \"20\": { name: \"Cam Cap 1B\", pg: \"PG2.3\" },\n        \"21\": { name: \"Cam Cap 1\", pg: \"PG2.3\" },\n        \"21A\": { name: \"Cam Cap 1C NR\", pg: \"PG2.3\" },\n        \"21B\": { name: \"Cam Cap 1C D05E\", pg: \"PG2.3\" },\n        \"22\": { name: \"Cam Cap 2\", pg: \"PG2.3\" },\n        \"22A\": { name: \"Cam Cap 2 2MP\", pg: \"PG2.3\" },\n        \"22B\": { name: \"Cam Cap 2 3MP\", pg: \"PG2.3\" },\n        \"22C\": { name: \"Cam Cap 2 4MP\", pg: \"PG2.3\" },\n        \"22D\": { name: \"Cam Cap 2 5MP\", pg: \"PG2.3\" },\n        \"23\": { name: \"Cam Cap 3\", pg: \"PG2.3\" },\n        \"23A\": { name: \"Cam Cap 3 2MP\", pg: \"PG2.3\" },\n        \"23B\": { name: \"Cam Cap 3 3MP\", pg: \"PG2.3\" },\n        \"23C\": { name: \"Cam Cap 3 4MP\", pg: \"PG2.3\" },\n        \"23D\": { name: \"Cam Cap 3 5MP\", pg: \"PG2.3\" },\n        \"24\": { name: \"Cam Cap 4\", pg: \"PG2.3\" },\n        \"24A\": { name: \"Cam Cap 4 2MP\", pg: \"PG2.3\" },\n        \"24B\": { name: \"Cam Cap 4 3MP\", pg: \"PG2.3\" },\n        \"24C\": { name: \"Cam Cap 4 4MP\", pg: \"PG2.3\" },\n        \"24D\": { name: \"Cam Cap 4 5MP\", pg: \"PG2.3\" },\n        \"25\": { name: \"Cam Cap 2 & 3 D05E\", pg: \"PG2.3\" },\n        \"26\": { name: \"Spacer Drive Gear\", pg: \"PG1.1\" },\n        \"26A\": { name: \"Retainer\", pg: \"PG1.1\" },\n        \"27\": { name: \"Connector\", pg: \"PG1.1\" },\n        \"27A\": { name: \"Retainer\", pg: \"PG1.1\" },\n        \"27B\": { name: \"Drive Gear\", pg: \"PG1.1\" },\n        \"27C\": { name: \"Spacer Drive Gear\", pg: \"PG1.1\" },\n        \"28\": { name: \"Housing\", pg: \"PG1.1\" },\n        \"28A\": { name: \"Housing Inlet TR\", pg: \"PG1.1\" },\n        \"28B\": { name: \"Housing Inlet D13E\", pg: \"PG1.1\" },\n        \"29\": { name: \"Balance Shaft NO 1\", pg: \"PG1.1\" },\n        \"29A\": { name: \"Balance Shaft NO 2\", pg: \"PG1.1\" },\n        \"30\": { name: \"Roller Arm 1\", pg: \"PG1.1\" },\n        \"30A\": { name: \"Roller Arm 1 A\", pg: \"PG1.1\" },\n        \"30B\": { name: \"Roller Arm 1 B\", pg: \"PG1.1\" },\n        \"30C\": { name: \"Roller Arm 1 C\", pg: \"PG1.1\" },\n        \"30D\": { name: \"Roller Arm 1 D\", pg: \"PG1.1\" },\n        \"30E\": { name: \"Roller Arm 1 E\", pg: \"PG1.1\" },\n        \"31\": { name: \"Roller Arm 2\", pg: \"PG1.1\" },\n        \"31A\": { name: \"Roller Arm 2 A\", pg: \"PG1.1\" },\n        \"31B\": { name: \"Roller Arm 2 B\", pg: \"PG1.1\" },\n        \"31C\": { name: \"Roller Arm 2 C\", pg: \"PG1.1\" },\n        \"31D\": { name: \"Roller Arm 2 D\", pg: \"PG1.1\" },\n        \"31E\": { name: \"Roller Arm 2 E\", pg: \"PG1.1\" },\n        \"32\": { name: \"Hydraulic Lash Adjuster\", pg: \"PG1.1\" },\n        \"32A\": { name: \"Hydraulic Lash Adjuster A\", pg: \"PG1.1\" },\n        \"32B\": { name: \"Hydraulic Lash Adjuster B\", pg: \"PG1.1\" },\n        \"32C\": { name: \"Hydraulic Lash Adjuster C\", pg: \"PG1.1\" },\n        \"32D\": { name: \"Hydraulic Lash Adjuster D\", pg: \"PG1.1\" },\n        \"32E\": { name: \"Hydraulic Lash Adjuster E\", pg: \"PG1.1\" },\n        \"33\": { name: \"Housing Inlet Water\", pg: \"PG1.1\" },\n        \"34\": { name: \"Packing Assy A\", pg: \"PG1.2\" },\n        \"35\": { name: \"Packing Assy B\", pg: \"PG1.2\" },\n        \"36\": { name: \"Packing Assy C\", pg: \"PG1.2\" },\n        \"37\": { name: \"Packing IMV\", pg: \"PG1.2\" },\n        \"38\": { name: \"Packing IMV\", pg: \"PG1.2\" },\n        \"39\": { name: \"Packing IMV\", pg: \"PG1.2\" },\n        \"40\": { name: \"Packing IMV\", pg: \"PG1.2\" },\n        \"41\": { name: \"Packing IMV\", pg: \"PG1.2\" },\n        \"42\": { name: \"Packing IMV\", pg: \"PG1.2\" },\n        \"43\": { name: \"Packing IMV\", pg: \"PG1.2\" },\n        \"44\": { name: \"Packing IMV\", pg: \"PG1.2\" },\n        \"45\": { name: \"Packing IMV\", pg: \"PG1.2\" },\n        \"46\": { name: \"Packing IMV\", pg: \"PG1.2\" },\n        \"47\": { name: \"Packing IMV\", pg: \"PG1.2\" },\n        \"48\": { name: \"Packing IMV\", pg: \"PG1.2\" },\n        \"49\": { name: \"Packing IMV\", pg: \"PG1.2\" },\n        \"50\": { name: \"Packing IMV\", pg: \"PG1.2\" }\n    };\n\n    return lineMap[line_id] || null;\n}\n\n// Fungsi untuk mengubah line_name jadi format tabel\nfunction toTableName(name) {\n    return name\n        .toLowerCase()\n        .replace(/[^a-z0-9 ]/g, '') // Hapus karakter aneh\n        .replace(/\\s+/g, '_');      // Ganti spasi jadi _\n}\n\n// Main logic\nconst payload = msg.payload;\n\nif (payload.length < 12) {\n    return null; // Data tidak lengkap\n}\n\nconst line_id = payload[0];\nconst info = getLineInfo(line_id);\n\nif (!info) {\n    return null; // Tidak ada info untuk line_id ini\n}\n\n// Ekstrak semua field dari payload\nconst [\n    , name_product, target, actual, loading_time, efficiency,\n    delay, cycle_time, status_montiv, time_trouble,\n    time_trouble_quality, andon\n] = payload;\n\n// Buat nama tabel dinamis\nconst tableName = toTableName(info.name); // e.g., \"cam_cap_2_2mp\"\n\n// Bangun query SQL untuk tabel spesifik line\nconst specificLineQuery = `\nINSERT INTO ${tableName} (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${info.pg}', '${info.name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\n// Bangun query SQL untuk tabel production_data\nconst productionDataQuery = `\nINSERT INTO production_data (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${info.pg}', '${info.name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\n// Gabungkan kedua query dengan pemisah titik koma\nmsg.topic = `${specificLineQuery}; ${productionDataQuery}`;\n\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 635,
        "y": 65,
        "wires": [
            [
                "0e75b1bfbb4fa673"
            ]
        ]
    },
    {
        "id": "16ba0954368201e7",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "nais_hikitori",
        "func": "var name_hikitori = msg.payload[0];\nvar actual_pouling = msg.payload[1];\nvar loading_time = msg.payload[2];\nvar status = msg.payload[3];\nvar cycle_normal = msg.payload[4];\nvar andon = msg.payload[5];\n\nvar validHikitoriIds = [\n    \"HIKITORI A\", \"HIKITORI B\", \"HIKITORI C\", \"HIKITORI D\",\n    \"HIKITORI E\", \"HIKITORI F\", \"HIKITORI G\", \"HIKITORI H\"\n];\n\nif (validHikitoriIds.includes(name_hikitori)) {\n    // Map to table name (HIKITORI F → hikitori_f)\n    var tableSuffix = name_hikitori.toLowerCase().split(' ')[1];\n    var specificTable = `hikitori_${tableSuffix}`;\n\n    // Common table insertion\n    var commonQuery =\n        `INSERT INTO hikitori_data \n        (name_hikitori, actual_pouling, loading_time, status, cycle_normal, andon)\n        VALUES \n        ('${name_hikitori}', '${actual_pouling}', '${loading_time}', '${status}', '${cycle_normal}', '${andon}');`;\n\n    // Individual table insertion - match your table structure\n    var specificQuery =\n        `INSERT INTO ${specificTable} \n        (name_hikitori, actual_pouling, loading_time, status, cycle_normal, andon)\n        VALUES \n        ('${name_hikitori}', '${actual_pouling}', '${loading_time}', '${status}', '${cycle_normal}', '${andon}');`;\n\n    // Return both queries\n    return [\n        { topic: commonQuery },\n        { topic: specificQuery }\n    ];\n} else {\n    return null;\n}",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 520,
        "y": 1645,
        "wires": [
            [
                "a152431516a4878a"
            ]
        ]
    },
    {
        "id": "99ba1a3b3adb59e7",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 1",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 375,
        "y": 40,
        "wires": []
    },
    {
        "id": "49556903850fe0e5",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 9",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 510,
        "y": 1560,
        "wires": []
    },
    {
        "id": "aea483507b70446a",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 10",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 610,
        "y": 120,
        "wires": []
    },
    {
        "id": "a3af2c89e81392f6",
        "type": "string",
        "z": "4db585e6a94fb7af",
        "name": "montiv",
        "methods": [
            {
                "name": "split",
                "params": [
                    {
                        "type": "str",
                        "value": ","
                    },
                    {
                        "type": "num",
                        "value": "50"
                    }
                ]
            }
        ],
        "prop": "payload",
        "propout": "payload",
        "object": "msg",
        "objectout": "msg",
        "x": 360,
        "y": 115,
        "wires": [
            [
                "473819c182b42540",
                "aea483507b70446a",
                "3381600fce34a210"
            ]
        ]
    },
    {
        "id": "58cea9820cc4ac4c",
        "type": "string",
        "z": "4db585e6a94fb7af",
        "name": "hikitori",
        "methods": [
            {
                "name": "split",
                "params": [
                    {
                        "type": "str",
                        "value": "^"
                    },
                    {
                        "type": "num",
                        "value": "50"
                    }
                ]
            }
        ],
        "prop": "payload",
        "propout": "payload",
        "object": "msg",
        "objectout": "msg",
        "x": 360,
        "y": 1600,
        "wires": [
            [
                "49556903850fe0e5",
                "16ba0954368201e7"
            ]
        ]
    },
    {
        "id": "08372b7b1cc0bc84",
        "type": "serial in",
        "z": "4db585e6a94fb7af",
        "name": "",
        "serial": "b6ef892c0e14efe4",
        "x": 130,
        "y": 115,
        "wires": [
            [
                "a3af2c89e81392f6",
                "99ba1a3b3adb59e7",
                "58cea9820cc4ac4c"
            ]
        ]
    },
    {
        "id": "15e1ea48ba86f8a0",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "CR1",
        "func": "const line_id = \"1\";\nconst display_name = \"Common Rail 1\";\nconst pg = \"PG2.2\";\nconst tableName = \"common_rail_1\";\n\nconst payload = msg.payload;\n\nif (payload.length < 12) {\n    return null;\n}\n\nconst [\n    , name_product, target, actual, loading_time, efficiency,\n    delay, cycle_time, status_montiv, time_trouble,\n    time_trouble_quality, andon\n] = payload;\n\nconst query = `\nINSERT INTO ${tableName} (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${pg}', '${display_name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\nmsg.topic = query;\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 730,
        "y": 315,
        "wires": [
            [
                "27a17e1974864dc5",
                "0e75b1bfbb4fa673"
            ]
        ]
    },
    {
        "id": "015b1efc3a14747a",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "CR2",
        "func": "const line_id = \"2\";\nconst display_name = \"Common Rail 2\";\nconst pg = \"PG2.2\";\nconst tableName = \"common_rail_2\";\n\nconst payload = msg.payload;\n\nif (payload.length < 12) {\n    return null;\n}\n\nconst [\n    , name_product, target, actual, loading_time, efficiency,\n    delay, cycle_time, status_montiv, time_trouble,\n    time_trouble_quality, andon\n] = payload;\n\nconst query = `\nINSERT INTO ${tableName} (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${pg}', '${display_name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\nmsg.topic = query;\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 730,
        "y": 350,
        "wires": [
            [
                "5f7b2ca8513988d5",
                "0e75b1bfbb4fa673"
            ]
        ]
    },
    {
        "id": "55b4e50b3964e940",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "CR3",
        "func": "const line_id = \"3\";\nconst display_name = \"Common Rail 3\";\nconst pg = \"PG2.2\";\nconst tableName = \"common_rail_3\";\n\nconst payload = msg.payload;\n\nif (payload.length < 12) {\n    return null;\n}\n\nconst [\n    , name_product, target, actual, loading_time, efficiency,\n    delay, cycle_time, status_montiv, time_trouble,\n    time_trouble_quality, andon\n] = payload;\n\nconst query = `\nINSERT INTO ${tableName} (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${pg}', '${display_name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\nmsg.topic = query;\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 730,
        "y": 385,
        "wires": [
            [
                "4d19670127089dfc",
                "0e75b1bfbb4fa673"
            ]
        ]
    },
    {
        "id": "09b20127385deed9",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "CR4",
        "func": "const line_id = \"4\";\nconst display_name = \"Common Rail 4\";\nconst pg = \"PG2.2\";\nconst tableName = \"common_rail_4\";\n\nconst payload = msg.payload;\n\nif (payload.length < 12) {\n    return null;\n}\n\nconst [\n    , name_product, target, actual, loading_time, efficiency,\n    delay, cycle_time, status_montiv, time_trouble,\n    time_trouble_quality, andon\n] = payload;\n\nconst query = `\nINSERT INTO ${tableName} (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${pg}', '${display_name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\nmsg.topic = query;\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 730,
        "y": 420,
        "wires": [
            [
                "deddeb1d3652b4f8",
                "0e75b1bfbb4fa673"
            ]
        ]
    },
    {
        "id": "0c79edefde51fefb",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "CR5",
        "func": "const line_id = \"5\";\nconst display_name = \"Common Rail 5\";\nconst pg = \"PG2.2\";\nconst tableName = \"common_rail_5\";\n\nconst payload = msg.payload;\n\nif (payload.length < 12) {\n    return null;\n}\n\nconst [\n    , name_product, target, actual, loading_time, efficiency,\n    delay, cycle_time, status_montiv, time_trouble,\n    time_trouble_quality, andon\n] = payload;\n\nconst query = `\nINSERT INTO ${tableName} (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${pg}', '${display_name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\nmsg.topic = query;\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 730,
        "y": 455,
        "wires": [
            [
                "f38bdcf15564dd41",
                "0e75b1bfbb4fa673"
            ]
        ]
    },
    {
        "id": "d66b38bd136c8fe8",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "CR6",
        "func": "\nconst line_id = \"6\";\nconst display_name = \"Common Rail 6\";\nconst pg = \"PG2.2\";\nconst tableName = \"common_rail_6\";\n\nconst payload = msg.payload;\n\nif (payload.length < 12) {\n    return null;\n}\n\nconst [\n    , name_product, target, actual, loading_time, efficiency,\n    delay, cycle_time, status_montiv, time_trouble,\n    time_trouble_quality, andon\n] = payload;\n\nconst query = `\nINSERT INTO ${tableName} (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${pg}', '${display_name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\nmsg.topic = query;\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 730,
        "y": 490,
        "wires": [
            [
                "8fd23a4df6a33a92",
                "0e75b1bfbb4fa673"
            ]
        ]
    },
    {
        "id": "18e98308725d34aa",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "CR7",
        "func": "\nconst line_id = \"7\";\nconst display_name = \"Common Rail 7\";\nconst pg = \"PG2.2\";\nconst tableName = \"common_rail_7\";\n\nconst payload = msg.payload;\n\nif (payload.length < 12) {\n    return null;\n}\n\nconst [\n    , name_product, target, actual, loading_time, efficiency,\n    delay, cycle_time, status_montiv, time_trouble,\n    time_trouble_quality, andon\n] = payload;\n\nconst query = `\nINSERT INTO ${tableName} (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${pg}', '${display_name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\nmsg.topic = query;\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 730,
        "y": 525,
        "wires": [
            [
                "2cc7048833435eda",
                "0e75b1bfbb4fa673"
            ]
        ]
    },
    {
        "id": "e24215a9951bc4fe",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "CR8",
        "func": "\nconst line_id = \"8\";\nconst display_name = \"Common Rail 8\";\nconst pg = \"PG2.2\";\nconst tableName = \"common_rail_8\";\n\nconst payload = msg.payload;\n\nif (payload.length < 12) {\n    return null;\n}\n\nconst [\n    , name_product, target, actual, loading_time, efficiency,\n    delay, cycle_time, status_montiv, time_trouble,\n    time_trouble_quality, andon\n] = payload;\n\nconst query = `\nINSERT INTO ${tableName} (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${pg}', '${display_name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\nmsg.topic = query;\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 730,
        "y": 560,
        "wires": [
            [
                "6674016ec1ed2c1f",
                "0e75b1bfbb4fa673"
            ]
        ]
    },
    {
        "id": "92446e6e457c5b22",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "CR9",
        "func": "\nconst line_id = \"9\";\nconst display_name = \"Common Rail 9\";\nconst pg = \"PG2.2\";\nconst tableName = \"common_rail_9\";\n\nconst payload = msg.payload;\n\nif (payload.length < 12) {\n    return null;\n}\n\nconst [\n    , name_product, target, actual, loading_time, efficiency,\n    delay, cycle_time, status_montiv, time_trouble,\n    time_trouble_quality, andon\n] = payload;\n\nconst query = `\nINSERT INTO ${tableName} (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${pg}', '${display_name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\nmsg.topic = query;\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 730,
        "y": 595,
        "wires": [
            [
                "7f8f5ec6ad91930d",
                "0e75b1bfbb4fa673"
            ]
        ]
    },
    {
        "id": "4b2951fe4d363da9",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "CR11",
        "func": "\nconst line_id = \"11\";\nconst display_name = \"Common Rail 11\";\nconst pg = \"PG2.2\";\nconst tableName = \"common_rail_11\";\n\nconst payload = msg.payload;\n\nif (payload.length < 12) {\n    return null;\n}\n\nconst [\n    , name_product, target, actual, loading_time, efficiency,\n    delay, cycle_time, status_montiv, time_trouble,\n    time_trouble_quality, andon\n] = payload;\n\nconst query = `\nINSERT INTO ${tableName} (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${pg}', '${display_name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\nmsg.topic = query;\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 730,
        "y": 665,
        "wires": [
            [
                "240cad628b3b71b2",
                "0e75b1bfbb4fa673"
            ]
        ]
    },
    {
        "id": "7da3b23a93e45c32",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "CR12",
        "func": "\nconst line_id = \"12\";\nconst display_name = \"Common Rail 12\";\nconst pg = \"PG2.2\";\nconst tableName = \"common_rail_12\";\n\nconst payload = msg.payload;\n\nif (payload.length < 12) {\n    return null;\n}\n\nconst [\n    , name_product, target, actual, loading_time, efficiency,\n    delay, cycle_time, status_montiv, time_trouble,\n    time_trouble_quality, andon\n] = payload;\n\nconst query = `\nINSERT INTO ${tableName} (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${pg}', '${display_name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\nmsg.topic = query;\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 730,
        "y": 700,
        "wires": [
            [
                "86f0739d9c832dac",
                "0e75b1bfbb4fa673"
            ]
        ]
    },
    {
        "id": "dd6dbd6991585e1f",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "CR10",
        "func": "const line_id = \"10\";\nconst display_name = \"Common Rail 10\";\nconst pg = \"PG2.2\";\nconst tableName = \"common_rail_10\";\n\nconst payload = msg.payload;\n\nif (payload.length < 12) {\n    return null;\n}\n\nconst [\n    , name_product, target, actual, loading_time, efficiency,\n    delay, cycle_time, status_montiv, time_trouble,\n    time_trouble_quality, andon\n] = payload;\n\nconst query = `\nINSERT INTO ${tableName} (\n    idPrimary, line_id, pg, line_name, name_product, target, actual,\n    loading_time, efficiency, delay, cycle_time, status,\n    time_trouble, time_trouble_quality, andon\n) VALUES (\n    NULL, '${line_id}', '${pg}', '${display_name}', '${name_product}',\n    '${target}', '${actual}', '${loading_time}', '${efficiency}',\n    '${delay}', '${cycle_time}', '${status_montiv}', '${time_trouble}',\n    '${time_trouble_quality}', '${andon}'\n)`.replace(/\\s+/g, ' ').trim();\n\nmsg.topic = query;\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 730,
        "y": 630,
        "wires": [
            [
                "61abc5c82c211026",
                "0e75b1bfbb4fa673"
            ]
        ]
    },
    {
        "id": "27a17e1974864dc5",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 3",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1120,
        "y": 720,
        "wires": []
    },
    {
        "id": "1b5ad459cdfa3904",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 5",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1120,
        "y": 755,
        "wires": []
    },
    {
        "id": "5f7b2ca8513988d5",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 8",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1120,
        "y": 790,
        "wires": []
    },
    {
        "id": "4d19670127089dfc",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 11",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1120,
        "y": 825,
        "wires": []
    },
    {
        "id": "deddeb1d3652b4f8",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 12",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1120,
        "y": 860,
        "wires": []
    },
    {
        "id": "f38bdcf15564dd41",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 13",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1120,
        "y": 895,
        "wires": []
    },
    {
        "id": "8fd23a4df6a33a92",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 14",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1120,
        "y": 930,
        "wires": []
    },
    {
        "id": "2cc7048833435eda",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 15",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1120,
        "y": 965,
        "wires": []
    },
    {
        "id": "6674016ec1ed2c1f",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 16",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1120,
        "y": 1000,
        "wires": []
    },
    {
        "id": "7f8f5ec6ad91930d",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 17",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1120,
        "y": 1035,
        "wires": []
    },
    {
        "id": "61abc5c82c211026",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 18",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1120,
        "y": 1070,
        "wires": []
    },
    {
        "id": "240cad628b3b71b2",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 19",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1120,
        "y": 1105,
        "wires": []
    },
    {
        "id": "86f0739d9c832dac",
        "type": "debug",
        "z": "4db585e6a94fb7af",
        "name": "debug 20",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1120,
        "y": 1140,
        "wires": []
    },
    {
        "id": "e632150b93a044ec",
        "type": "inject",
        "z": "4db585e6a94fb7af",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 530,
        "y": 485,
        "wires": [
            [
                "15e1ea48ba86f8a0",
                "015b1efc3a14747a",
                "55b4e50b3964e940",
                "09b20127385deed9",
                "0c79edefde51fefb",
                "d66b38bd136c8fe8",
                "18e98308725d34aa",
                "e24215a9951bc4fe",
                "92446e6e457c5b22",
                "dd6dbd6991585e1f",
                "4b2951fe4d363da9",
                "7da3b23a93e45c32"
            ]
        ]
    },
    {
        "id": "3381600fce34a210",
        "type": "function",
        "z": "4db585e6a94fb7af",
        "name": "function 1",
        "func": "\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 565,
        "y": 225,
        "wires": [
            []
        ]
    },
    {
        "id": "dc56ad4eb0f6eef7",
        "type": "MySQLdatabase",
        "name": "",
        "host": "127.0.0.1",
        "port": "3306",
        "db": "database_tps_produksi",
        "tz": "",
        "charset": "UTF8"
    },
    {
        "id": "6e2a71cd13bdf08b",
        "type": "MySQLdatabase",
        "name": "",
        "host": "127.0.0.1",
        "port": "3306",
        "db": "database_tps_hikitori",
        "tz": "",
        "charset": "UTF8"
    },
    {
        "id": "b6ef892c0e14efe4",
        "type": "serial-port",
        "name": "",
        "serialport": "/dev/ttyUSB0",
        "serialbaud": "115200",
        "databits": 8,
        "parity": "none",
        "stopbits": 1,
        "waitfor": "",
        "dtr": "none",
        "rts": "none",
        "cts": "none",
        "dsr": "none",
        "newline": "\\n",
        "bin": "false",
        "out": "char",
        "addchar": "",
        "responsetimeout": "10000"
    },
    {
        "id": "116e696772d9405e",
        "type": "global-config",
        "env": [],
        "modules": {
            "node-red-node-mysql": "2.0.0",
            "node-red-contrib-string": "1.0.0",
            "node-red-node-serialport": "2.0.3"
        }
    }
]
