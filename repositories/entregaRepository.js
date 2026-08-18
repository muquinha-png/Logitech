const db = require('../database/connection');

async function create({ descricao, origem, destino, motoristaId, veiculoId }) {
  const [result] = await db.execute(
    `INSERT INTO entregas (descricao, origem, destino, motoristaId, veiculoId, status)
     VALUES (?, ?, ?, ?, ?, 'Pendente')`,
    [descricao || null, origem, destino, motoristaId, veiculoId]
  );
  return findById(result.insertId);
}

async function findAll() {
  const [rows] = await db.execute(
    'SELECT id, descricao, origem, destino, motoristaId, veiculoId, status FROM entregas ORDER BY id'
  );
  return rows;
}

async function findById(id) {
  const [rows] = await db.execute(
    'SELECT id, descricao, origem, destino, motoristaId, veiculoId, status FROM entregas WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function update(id, { descricao, origem, destino, motoristaId, veiculoId, status }) {
  await db.execute(
    `UPDATE entregas
     SET descricao = ?, origem = ?, destino = ?, motoristaId = ?, veiculoId = ?, status = ?
     WHERE id = ?`,
    [descricao ?? null, origem, destino, motoristaId, veiculoId, status, id]
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await db.execute('DELETE FROM entregas WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { create, findAll, findById, update, remove };
