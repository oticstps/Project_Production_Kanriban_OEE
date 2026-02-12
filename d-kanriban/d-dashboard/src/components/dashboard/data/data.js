    const mockData = [
      {
          "idPrimary": 21,
          "cycle_number": 21,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-25T00:20:20.000Z",
          "end_time": "2025-09-25T12:01:22.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 162,
          "total_produced": 160,
          "record_count": 117,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 20,
          "cycle_number": 20,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-24T00:21:10.000Z",
          "end_time": "2025-09-24T12:01:21.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 1,
          "end_actual": 216,
          "total_produced": 215,
          "record_count": 169,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 19,
          "cycle_number": 19,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-23T00:25:41.000Z",
          "end_time": "2025-09-23T12:01:19.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 1,
          "end_actual": 246,
          "total_produced": 245,
          "record_count": 191,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 18,
          "cycle_number": 18,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-22T00:26:51.000Z",
          "end_time": "2025-09-22T09:31:17.000Z",
          "duration_minutes": 544, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 186,
          "total_produced": 184,
          "record_count": 148,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 17,
          "cycle_number": 17,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-19T00:16:09.000Z",
          "end_time": "2025-09-19T12:01:13.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 1,
          "end_actual": 246,
          "total_produced": 245,
          "record_count": 205,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 16,
          "cycle_number": 16,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-18T00:17:27.000Z",
          "end_time": "2025-09-18T12:01:11.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 252,
          "total_produced": 249,
          "record_count": 210,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 15,
          "cycle_number": 15,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-17T00:18:18.000Z",
          "end_time": "2025-09-17T12:01:10.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 240,
          "total_produced": 237,
          "record_count": 200,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 14,
          "cycle_number": 14,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-16T00:19:38.000Z",
          "end_time": "2025-09-16T12:01:09.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 277,
          "total_produced": 275,
          "record_count": 225,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 13,
          "cycle_number": 13,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-15T01:00:55.000Z",
          "end_time": "2025-09-15T12:01:07.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 1,
          "end_actual": 246,
          "total_produced": 245,
          "record_count": 175,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 12,
          "cycle_number": 12,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-12T10:42:14.000Z",
          "end_time": "2025-09-12T12:01:02.000Z",
          "duration_minutes": 78, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 246,
          "total_produced": 244,
          "record_count": 29,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 11,
          "cycle_number": 11,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-11T11:01:31.000Z",
          "end_time": "2025-09-12T10:40:54.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 1,
          "end_actual": 246,
          "total_produced": 245,
          "record_count": 195,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 10,
          "cycle_number": 10,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-11T00:23:59.000Z",
          "end_time": "2025-09-11T09:30:17.000Z",
          "duration_minutes": 546, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 246,
          "total_produced": 243,
          "record_count": 184,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 9,
          "cycle_number": 9,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-10T00:21:29.000Z",
          "end_time": "2025-09-10T12:00:10.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 246,
          "total_produced": 244,
          "record_count": 200,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 8,
          "cycle_number": 8,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-08T11:31:49.000Z",
          "end_time": "2025-09-09T12:00:15.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 246,
          "total_produced": 244,
          "record_count": 229,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 7,
          "cycle_number": 7,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-08T00:42:49.000Z",
          "end_time": "2025-09-08T10:43:30.000Z",
          "duration_minutes": 600, // Akan dihitung ulang
          "start_actual": 4,
          "end_actual": 259,
          "total_produced": 255,
          "record_count": 193,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 6,
          "cycle_number": 6,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-04T00:19:50.000Z",
          "end_time": "2025-09-04T10:21:24.000Z",
          "duration_minutes": 601, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 276,
          "total_produced": 273,
          "record_count": 232,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 5,
          "cycle_number": 5,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-03T00:26:29.000Z",
          "end_time": "2025-09-03T11:18:58.000Z",
          "duration_minutes": 652, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 247,
          "total_produced": 244,
          "record_count": 213,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 4,
          "cycle_number": 4,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-02T00:14:56.000Z",
          "end_time": "2025-09-02T11:20:56.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 300,
          "total_produced": 297,
          "record_count": 255,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 3,
          "cycle_number": 3,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-01T00:23:04.000Z",
          "end_time": "2025-09-01T09:00:50.000Z",
          "duration_minutes": 517, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 187,
          "total_produced": 185,
          "record_count": 171,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 2,
          "cycle_number": 2,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-08-29T00:16:19.000Z",
          "end_time": "2025-08-29T08:53:44.000Z",
          "duration_minutes": 493, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 245,
          "total_produced": 242,
          "record_count": 185,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 1,
          "cycle_number": 1,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-08-28T00:23:16.000Z",
          "end_time": "2025-08-28T08:37:15.000Z",
          "duration_minutes": 493, // Akan dihitung ulang
          "start_actual": 1,
          "end_actual": 271,
          "total_produced": 270,
          "record_count": 177,
          "created_at": "2025-09-26T04:06:55.000Z"
      }
    ];



    export default mockData;