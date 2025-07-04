# Gerenciador de Produtos da minha loja de crochê

Aplicação web desenvolvida com Node.js, Express e MySQL para cadastro, edição, listagem e remoção de produtos com imagens.

## Demonstração

<img width="720" alt="Captura de Tela 2025-07-03 às 11 23 27" src="https://github.com/user-attachments/assets/5828ef35-e1c0-4af4-aca9-5bec5fd7604a" />
<img width="720" alt="Captura de Tela 2025-07-03 às 11 24 24" src="https://github.com/user-attachments/assets/cdfeac91-f54c-4803-8080-46b7dce532c3" />


## Funcionalidades

- Cadastrar novos produtos (nome, valor e imagem).
- Listar produtos cadastrados com imagens.
- Editar produtos existentes (inclusive substituindo a imagem).
- Remover produtos do sistema.
- Exibição de mensagens de sucesso ou erro após cada operação.

## Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Express-Handlebars](https://www.npmjs.com/package/express-handlebars)
- [Express FileUpload](https://www.npmjs.com/package/express-fileupload)
- [HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
- [CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
- [Bootstrap](https://getbootstrap.com/)


## Estrutura de pastas


projeto/
├── app.js
├── banco.js
├── css/
│ └── estilo.css
├── imagens/
├── node_modules/
├── package.json
├── views/
│ ├── formulario.handlebars
│ ├── formularioEditar.handlebars
│ ├── mensagens.handlebars
│ └── layouts/
│ └── main.handlebars



## Como executar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [MySQL](https://www.mysql.com/) rodando localmente
- Criar um banco de dados com a tabela `produtos`

### Criação da tabela no MySQL

```sql
CREATE DATABASE nome_do_banco;

USE nome_do_banco;

CREATE TABLE produtos (
  codigo INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100),
  valor DECIMAL(10,2),
  imagem VARCHAR(100)
);

Configuração do banco
No seu projeto, crie um arquivo chamado banco.js com a conexão ao MySQL:

const mysql = require('mysql');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'seu_usuario',
    password: 'sua_senha',
    database: 'nome_do_banco'
});

module.exports = conexao;

Rodando o projeto
Instale as dependências:

npm install

Inicie o servidor:

node app.js

Acesse no navegador:

http://localhost:3030

Uploads de Imagem
As imagens dos produtos são salvas na pasta imagens/ na raiz do projeto.

Licença
Este projeto é de uso educacional e pode ser usado livremente para fins de aprendizado.

Feito por Natália Leal com ❤️






