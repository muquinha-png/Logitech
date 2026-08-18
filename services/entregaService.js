const repository = require('../repositories/entregaRepository');
const motoristaRepository = require('../repositories/motoristaRepository');
const veiculoRepository = require('../repositories/veiculoRepository');

const STATUS_VALIDOS = ['Pendente', 'Em Transporte', 'Entregue', 'Cancelada'];

function validateId(id) {
  if (!/^\d+$/.test(String(id)) || Number(id) <= 0) {
    const error = new Error('ID inválido');
    error.status = 400;
    throw error;
  }
  return Number(id);
}

function validateText(value, field) {
  if (!value || !String(value).trim()) {
    const error = new Error(`${field} é obrigatório`);
    error.status = 400;
    throw error;
  }
}

async function validateReferences(motoristaId, veiculoId) {
  const motorista = await motoristaRepository.findById(motoristaId);
  if (!motorista) {
    const error = new Error('Motorista não encontrado');
    error.status = 404;
    throw error;
  }
  const veiculo = await veiculoRepository.findById(veiculoId);
  if (!veiculo) {
    const error = new Error('Veículo não encontrado');
    error.status = 404;
    throw error;
  }
}

function validateStatus(status) {
  if (!STATUS_VALIDOS.includes(status)) {
    const error = new Error(`Status inválido. Use: ${STATUS_VALIDOS.join(', ')}`);
    error.status = 400;
    throw error;
  }
}

async function create(data) {
  validateText(data.origem, 'Origem');
  validateText(data.destino, 'Destino');
  const motoristaId = validateId(data.motoristaId);
  const veiculoId = validateId(data.veiculoId);
  await validateReferences(motoristaId, veiculoId);
  return repository.create({
    descricao: data.descricao,
    origem: String(data.origem).trim(),
    destino: String(data.destino).trim(),
    motoristaId,
    veiculoId
  });
}

async function findAll() { return repository.findAll(); }

async function findById(id) {
  const numericId = validateId(id);
  const entrega = await repository.findById(numericId);
  if (!entrega) {
    const error = new Error('Entrega não encontrada');
    error.status = 404;
    throw error;
  }
  return entrega;
}

async function update(id, data) {
  const numericId = validateId(id);
  const current = await findById(numericId);
  const origem = data.origem ?? current.origem;
  const destino = data.destino ?? current.destino;
  const motoristaId = validateId(data.motoristaId ?? current.motoristaId);
  const veiculoId = validateId(data.veiculoId ?? current.veiculoId);
  const status = data.status ?? current.status;

  validateText(origem, 'Origem');
  validateText(destino, 'Destino');
  validateStatus(status);
  await validateReferences(motoristaId, veiculoId);

  return repository.update(numericId, {
    descricao: data.descricao ?? current.descricao,
    origem: String(origem).trim(),
    destino: String(destino).trim(),
    motoristaId,
    veiculoId,
    status
  });
}

async function remove(id) {
  const numericId = validateId(id);
  await findById(numericId);
  await repository.remove(numericId);
}

module.exports = { create, findAll, findById, update, remove, STATUS_VALIDOS };
