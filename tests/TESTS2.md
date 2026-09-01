TESTS.md
LogiTech Express - Roteiro Técnico de Testes

CT001 - Cadastro de Motorista com CPF Duplicado

- Requisito: POST /motoristas
- Tipo: Funcional / Caixa Preta
- Nível: Sistema (API)

Pré-condição
Existe um motorista cadastrado com CPF 12345678900.

Payload

{
    "nome": "João Silva",
    "cpf": "12345678900",
    "telefone": "49999999999"
}
/

Passos

1. Enviar requisição POST /motoristas.
2. Informar CPF já existente.

Resultado Esperado

- HTTP 409 Conflict.
- Mensagem: "CPF já cadastrado."
- Nenhum registro deve ser criado.

---

CT002 - Campos Obrigatórios

- Requisito: POST /motoristas
- Tipo: Funcional / Caixa Preta
- Nível: Sistema (API)

Pré-condição

API disponível.

Payload

{
    "telefone":"49999999999"
}


Passos

1. Enviar POST /motoristas.
2. Omitir nome e CPF.

Resultado Esperado

- HTTP 400 Bad Request.
- Informar que nome e CPF são obrigatórios.
- Nenhum registro salvo.

---

CT003 - Login Inválido

- Requisito: POST /login
- Tipo: Funcional / Caixa Preta
- Nível: Sistema (API)

Pré-condição

Existe um usuário cadastrado.

Payload

{
    "email":"admin@email.com",
    "senha":"123Errada"
}


Passos

1. Fazer login.
2. Informar senha incorreta.

Resultado Esperado

- HTTP 401 Unauthorized.
- Mensagem de usuário ou senha inválidos.
- Não gerar token.

---

CT004 - Cálculo de Frete

- Requisito: Regra de cálculo do frete.
- Tipo: Caixa Branca
- Nível: Unitário
- Camada: Service

Pré-condição

Função calcularFrete() disponível.

Entrada

Distância = 20 km

Passos

1. Executar calcularFrete(20).

Resultado Esperado

Retornar o valor correto conforme a regra de negócio sem acessar o banco de dados.

---

CT005 - Persistência de Motorista

- Requisito: Cadastro de Motoristas
- Tipo: Caixa Branca
- Nível: Integração

Pré-condição

Banco de testes disponível.

Entrada

{
    "nome":"Carlos Souza",
    "cpf":"98765432100",
    "telefone":"48999998888"
}

Passos

1. Executar cadastro.
2. Consultar o banco.

Resultado Esperado

- Registro salvo corretamente.
- Dados persistidos.
- Sem erros de SQL.

---

CT006 - Atualização com Status Inválido

- Requisito: PUT /entregas/:id
- Tipo: Caixa Branca
- Nível: Integração

Pré-condição

Entrega cadastrada com status "Em Transporte".

Payload

{
    "status":"Teleportado"
}

Passos

1. Enviar PUT /entregas/1.
2. Informar status inválido.
3. Consultar o banco.

Resultado Esperado

- HTTP 400 Bad Request.
- Mensagem de status inválido.
- O banco não deve alterar o status da entrega.

---

Rastreabilidade

| Caso de Teste | Endpoint / Regra | Tipo | Nível |
|---------------|------------------|-------|--------|
| CT001 | POST /motoristas | Caixa Preta | Sistema |
| CT002 | POST /motoristas | Caixa Preta | Sistema |
| CT003 | POST /login | Caixa Preta | Sistema |
| CT004 | Service - calcularFrete() | Caixa Branca | Unitário |
| CT005 | Cadastro de Motorista | Caixa Branca | Integração |
| CT006 | PUT /entregas/:id | Caixa Branca | Integração |