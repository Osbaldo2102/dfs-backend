const { pool } = require('../db');

class UsersRepository {
  async findByEmail(email) {
    const r = await pool.query(
      'select id, email, password_hash, role from users where email = $1', [email]
    );
    return r.rows[0] || null;
  }

  async create({ email, passwordHash, role = 'user' }) {

    console.log(email, passwordHash, role);
    const r = await pool.query(
      'insert into users (email, password_hash, role) values ($1, $2, $3) returning id, email, role', [email, passwordHash, role]
    );
    return r.rows[0];
  }

  async findById(id) {
    const r = pool.query(
      'select id, email, role from users where id = $1', [id]
    );
    return r.rows[0] || null;
  }
}

module.exports = { UsersRepository }