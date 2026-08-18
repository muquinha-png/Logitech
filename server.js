require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database/connection');

const motoristaRoutes = require('./routes/motoristaRoutes');
const veiculoRoutes = require('./routes/veiculoRoutes');
const entregaRoutes = require('./routes/entregaRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API LogiTech Express funcionando' });
});

app.use('/motoristas', motoristaRoutes);
app.use('/veiculos', veiculoRoutes);
app.use('/entregas', entregaRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  let status = error.status || 500;
  let message = error.message || 'Erro interno do servidor';

  if (error.code === 'ER_DUP_ENTRY') {
    status = 409;
    message = 'CPF já cadastrado';
  } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    status = 404;
    message = 'Motorista ou veículo informado não existe';
  } else if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    status = 409;
    message = 'Registro possui entregas vinculadas e não pode ser excluído';
  } else if (error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed') {
    status = 400;
    message = 'JSON inválido';
  } else if (!error.status) {
    console.error('Erro interno:', error.message);
  }

  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`LogiTech Express rodando em http://localhost:${PORT}`);

  db.getConnection()
    .then((connection) => {
      console.log('Conexão com MySQL estabelecida com sucesso');
      connection.release();
    })
    .catch((error) => {
      console.error('Não foi possível conectar ao MySQL:', error.message);
      console.error('Confira o .env e se o MySQL está em execução.');
    });
});

module.exports = app;
