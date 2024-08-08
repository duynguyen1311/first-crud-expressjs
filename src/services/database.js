const { Pool } = require('pg');

const pool = new Pool({
    host: '103.245.237.10',
    user: 'ans',
    password: 'bC0q7Xm4Sbr',
    port: '5432',
    database:'demo-expressjs'
});

module.exports = {
    pool
}