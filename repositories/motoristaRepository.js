const db = require('../database/connection');

async function create({ nome, cpf, telefone }) {
  const [result] = await db.execute(
    'INSERT INTO motoristas (nome, cpf, telefone) VALUES (?, ?, ?)',
    [nome, cpf, telefone]
  );
  return findById(result.insertId);
}

async function findAll() {
  const [rows] = await db.execute('SELECT id, nome, cpf, telefone FROM motoristas ORDER BY id');
  return rows;
}

async function findById(id) {
  const [rows] = await db.execute(
    'SELECT id, nome, cpf, telefone FROM motoristas WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function findByCpf(cpf) {
  const [rows] = await db.execute('SELECT id FROM motoristas WHERE cpf = ?', [cpf]);
  return rows[0] || null;
}

async function update(id, { nome, cpf, telefone }) {
  await db.execute(
    'UPDATE motoristas SET nome = ?, cpf = ?, telefone = ? WHERE id = ?',
    [nome, cpf, telefone, id]
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await db.execute('DELETE FROM motoristas WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { create, findAll, findById, findByCpf, update, remove };
