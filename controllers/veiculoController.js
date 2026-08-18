const service = require('../services/veiculoService');

async function create(req, res, next) {
  try {
    const data = await service.create(req.body || {});
    res.status(201).json({ message: 'Veículo cadastrado com sucesso', data });
  } catch (error) { next(error); }
}

async function findAll(req, res, next) {
  try {
    const data = await service.findAll();
    res.status(200).json({ message: 'Veículos listados com sucesso', data });
  } catch (error) { next(error); }
}

async function findById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).json({ message: 'Veículo encontrado com sucesso', data });
  } catch (error) { next(error); }
}

async function update(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body || {});
    res.status(200).json({ message: 'Veículo atualizado com sucesso', data });
  } catch (error) { next(error); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    res.status(200).json({ message: 'Veículo excluído com sucesso', data: {} });
  } catch (error) { next(error); }
}

module.exports = { create, findAll, findById, update, remove };
