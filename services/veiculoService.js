const repository = require('../repositories/veiculoRepository');

function validatePayload(data) {
  const { placa, modelo, capacidadeCarga } = data;
  if (!placa || !String(placa).trim() || !modelo || !String(modelo).trim() || capacidadeCarga === undefined || capacidadeCarga === null || capacidadeCarga === '') {
    const error = new Error('Placa, modelo e capacidade de carga são obrigatórios');
    error.status = 400;
    throw error;
  }
  if (!Number.isFinite(Number(capacidadeCarga)) || Number(capacidadeCarga) <= 0) {
    const error = new Error('Capacidade de carga deve ser um número maior que zero');
    error.status = 400;
    throw error;
  }
}

function validateId(id) {
  if (!/^\d+$/.test(String(id)) || Number(id) <= 0) {
    const error = new Error('ID inválido');
    error.status = 400;
    throw error;
  }
  return Number(id);
}

async function create(data) {
  validatePayload(data);
  return repository.create({
    placa: String(data.placa).trim(),
    modelo: String(data.modelo).trim(),
    capacidadeCarga: Number(data.capacidadeCarga)
  });
}

async function findAll() { return repository.findAll(); }

async function findById(id) {
  const numericId = validateId(id);
  const veiculo = await repository.findById(numericId);
  if (!veiculo) {
    const error = new Error('Veículo não encontrado');
    error.status = 404;
    throw error;
  }
  return veiculo;
}

async function update(id, data) {
  const numericId = validateId(id);
  validatePayload(data);
  await findById(numericId);
  return repository.update(numericId, {
    placa: String(data.placa).trim(),
    modelo: String(data.modelo).trim(),
    capacidadeCarga: Number(data.capacidadeCarga)
  });
}

async function remove(id) {
  const numericId = validateId(id);
  await findById(numericId);
  try {
    await repository.remove(numericId);
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      error.status = 409;
      error.message = 'Veículo possui entregas vinculadas e não pode ser excluído';
    }
    throw error;
  }
}

module.exports = { create, findAll, findById, update, remove };
