const db = require('../database/connection');

async function create({ placa, modelo, capacidadeCarga }) {
  const [result] = await db.execute(
    'INSERT INTO veiculos (placa, modelo, capacidadeCarga) VALUES (?, ?, ?)',
    [placa, modelo, capacidadeCarga]
  );
  return findById(result.insertId);
}

async function findAll() {
  const [rows] = await db.execute('SELECT id, placa, modelo, capacidadeCarga FROM veiculos ORDER BY id');
  return rows;
}

async function findById(id) {
  const [rows] = await db.execute(
    'SELECT id, placa, modelo, capacidadeCarga FROM veiculos WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function update(id, { placa, modelo, capacidadeCarga }) {
  await db.execute(
    'UPDATE veiculos SET placa = ?, modelo = ?, capacidadeCarga = ? WHERE id = ?',
    [placa, modelo, capacidadeCarga, id]
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await db.execute('DELETE FROM veiculos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { create, findAll, findById, update, remove };
