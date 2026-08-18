CREATE DATABASE IF NOT EXISTS logitech_express;
USE logitech_express;

CREATE TABLE IF NOT EXISTS motoristas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  telefone VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS veiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  placa VARCHAR(10) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  capacidadeCarga DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS entregas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NULL,
  origem VARCHAR(120) NOT NULL,
  destino VARCHAR(120) NOT NULL,
  motoristaId INT NOT NULL,
  veiculoId INT NOT NULL,
  status ENUM('Pendente', 'Em Transporte', 'Entregue', 'Cancelada') NOT NULL DEFAULT 'Pendente',
  CONSTRAINT fk_entrega_motorista FOREIGN KEY (motoristaId) REFERENCES motoristas(id),
  CONSTRAINT fk_entrega_veiculo FOREIGN KEY (veiculoId) REFERENCES veiculos(id)
);
