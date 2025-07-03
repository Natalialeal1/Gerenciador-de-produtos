console.log("Servidor rodando a partir da pasta:", __dirname);
const conexao = require('./banco');  // Aqui você importa a conexão que já foi criada em 'banco.js'

const fs = require('fs');

// Importando o módulo express
const express = require('express');

// Importando módulo fileupload
const fileupload = require('express-fileupload');

// Importando o módulo express-handlebars
const { engine } = require('express-handlebars');

// Criando a aplicação Express
const app = express();

// Habilitando o upload de arquivos
app.use(fileupload());

// Adicionar bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

// Adicionar css
app.use('/css', express.static('./css'));

// Referenciar a pasta de imagens
app.use('/imagens', express.static('./imagens'));

// Configuração do express-handlebars
app.engine('handlebars', engine({
    helpers: {
        // Função auxiliar para verificar igualdade
        condicionalIgualdade: function (parametro1, parametro2, options) {
          return parametro1 === parametro2 ? options.fn(this) : options.inverse(this);
        }
      }
    }));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Manipulação de dados via rotas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Testando a conexão com o banco
conexao.connect(function (erro) {
    if (erro) {
        console.error('Erro ao conectar ao banco de dados:', erro.message);
        return;
    }
    console.log('Conexão efetuada com sucesso!');
});

// Rota principal
app.get('/', function (req, res) {
    let sql = 'SELECT * FROM produtos';

    conexao.query(sql, function (erro, retorno) {
        if (erro) {
            console.error('Erro ao buscar produtos:', erro.message);
            return res.status(500).send('Erro ao buscar produtos.');
        }

        res.render('formulario', { produtos: retorno });
    });
});

// Rota principal contendo a situação (correção aqui: caminho mais específico)
app.get('/mensagem/:situacao', function (req, res) {
    let sql = 'SELECT * FROM produtos';

    conexao.query(sql, function (erro, retorno) {
        if (erro) {
            console.error('Erro ao buscar produtos:', erro.message);
            return res.status(500).send('Erro ao buscar produtos.');
        }

        res.render('formulario', {
            produtos: retorno,
            situacao: req.params.situacao
        });
    });
});

// Rota de cadastro
app.post('/cadastrar', function (req, res) {
    try {
        let nome = req.body.nome;
        let valor = req.body.valor;
        let imagem = req.files.imagem.name;

        if (nome == '' || valor == '' || isNaN(valor)) {
            res.redirect('/mensagem/falhaCadastro');
        } else {
            let sql = `INSERT INTO produtos (nome, valor, imagem) VALUES ('${nome}', ${valor}, '${imagem}')`;

            conexao.query(sql, function (erro, retorno) {
                if (erro) throw erro;

                req.files.imagem.mv(__dirname + '/imagens/' + imagem, function (err) {
                    if (err) throw err;

                    console.log(retorno);
                    res.redirect('/mensagem/okCadastro'); // <-- redirecionamento correto
                });
            });
        }
    } catch (erro) {
        res.redirect('/mensagem/falhaCadastro');
    }
});

// Desabilitar cache para as views
app.set('view cache', false);

// rota para remover produtos
app.get('/remover/:codigo&:imagem', function (req, res) {
    try {
        let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;

        conexao.query(sql, function (erro, retorno) {
            if (erro) throw erro;

            fs.unlink(__dirname + '/imagens/' + req.params.imagem, (erro_imagem) => {
                if (erro_imagem) {
                    console.log('Falha ao remover a imagem:', erro_imagem.message);
                } else {
                    console.log('Imagem removida com sucesso.');
                }

                res.redirect('/mensagem/okRemover'); // redireciona só após tudo
            });
        });
    } catch (erro) {
        res.redirect('/mensagem/falhaRemover');
    }
});

// rota para redirecionar para o formulário de alteração/edição
app.get('/formularioEditar/:codigo', function (req, res) {
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;

    conexao.query(sql, function (erro, retorno) {
        if (erro) throw erro;

        res.render('formularioEditar', { produto: retorno[0] });
    });
});

// rota para editar produtos
app.post('/editar', function (req, res) {
    let nome = req.body.nome;
    let valor = req.body.valor;
    let codigo = req.body.codigo;
    let nomeImagem = req.body.nomeImagem;

    if (nome == '' || valor == '' || isNaN(valor)) {
        res.redirect('/mensagem/falhaEdicao');
    } else {
        try {
            let imagem = req.files.imagem;

            let sql = `UPDATE produtos SET nome='${nome}', valor=${valor}, imagem='${imagem.name}' WHERE codigo=${codigo}`;

            conexao.query(sql, function (erro, retorno) {
                if (erro) throw erro;

                fs.unlink(__dirname + '/imagens/' + nomeImagem, (erro_imagem) => {
                    if (erro_imagem) {
                        console.log('Falha ao remover a imagem.');
                    } else {
                        console.log('Imagem antiga removida com sucesso.');
                    }
                });

                imagem.mv(__dirname + '/imagens/' + imagem.name, function (err) {
                    if (err) {
                        console.error('Erro ao mover imagem nova:', err.message);
                    }
                    res.redirect('/'); // redirecionar após mover imagem
                });
            });
        } catch (erro) {
            let sql = `UPDATE produtos SET nome='${nome}', valor=${valor} WHERE codigo=${codigo}`;

            conexao.query(sql, function (erro, retorno) {
                if (erro) throw erro;
                res.redirect('/'); // redirecionar mesmo sem imagem nova
            });
        }
    }
});

// Iniciando o servidor na porta 3030
const PORT = 3030;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
