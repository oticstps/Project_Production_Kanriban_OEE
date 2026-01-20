const mysql = require('mysql2/promise')
const app = express();
const port = 4000;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');




app.use(cors())
app.use(express.json())


const pool = mysql.createPool({
  host: 'localhost',
  user: 'wandaadii',
  password: 'pasbatron',
  database: 'database_v1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
