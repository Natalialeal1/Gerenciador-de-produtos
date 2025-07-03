const mysql = require('mysql2');

const conexao = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'loja_croche',
  socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock'
});

  

conexao.connect((err) => {
  if (err) {
    console.error('Erro na conexão com o banco:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

module.exports = conexao;
