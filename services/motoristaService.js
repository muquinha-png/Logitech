const repository = require('../repositories/motoristaRepository');

function validatePayload(data) {
  const { nome, cpf, telefone } = data;
  if (!nome || !String(nome).trim() || !cpf || !String(cpf).trim() || !telefone || !String(telefone).trim()) {
    const error = new Error('Nome, CPF e telefone são obrigatórios');
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
  const existing = await repository.findByCpf(String(data.cpf).trim());
  if (existing) {
    const error = new Error('CPF já cadastrado');
    error.status = 409;
    throw error;
  }
  return repository.create({
    nome: String(data.nome).trim(),
    cpf: String(data.cpf).trim(),
    telefone: String(data.telefone).trim()
  });
}

async function findAll() { return repository.findAll(); }

async function findById(id) {
  const numericId = validateId(id);
  const motorista = await repository.findById(numericId);
  if (!motorista) {
    const error = new Error('Motorista não encontrado');
    error.status = 404;
    throw error;
  }
  return motorista;
}

async function update(id, data) {
  const numericId = validateId(id);
  validatePayload(data);
  await findById(numericId);
  const existing = await repository.findByCpf(String(data.cpf).trim());
  if (existing && existing.id !== numericId) {
    const error = new Error('CPF já cadastrado');
    error.status = 409;
    throw error;
  }
  return repository.update(numericId, {
    nome: String(data.nome).trim(),
    cpf: String(data.cpf).trim(),
    telefone: String(data.telefone).trim()
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
      error.message = 'Motorista possui entregas vinculadas e não pode ser excluído';
    }
    throw error;
  }
}

module.exports = { create, findAll, findById, update, remove };
