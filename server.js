const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); // Habilita CORS para todas as origens
app.use(express.json({ limit: '10mb' })); // Permite json grande (imagens base64)

const store = {};

app.post('/api/save', (req, res) => {
  const { nomes, data, mensagem, imagem } = req.body;

  if (!nomes || !data || !mensagem || !imagem) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  const id = Math.random().toString(36).substr(2, 9);
  store[id] = { nomes, data, mensagem, imagem };

  res.json({ url: `/page/${id}` });
});

app.get('/page/:id', (req, res) => {
  const id = req.params.id;
  const dados = store[id];

  if (!dados) {
    return res.status(404).send('Página não encontrada');
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Página do Casal</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; background: #fffafc; padding: 20px; }
        img { max-width: 100%; border-radius: 10px; margin-top: 20px; }
        .card { background: white; padding: 20px; border-radius: 15px; max-width: 600px; margin: 20px auto; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>💖 ${dados.nomes} 💖</h2>
        <p>Estão juntos há ${calcularDias(dados.data)} dias!</p>
        <img src="${dados.imagem}" alt="Foto do casal" />
        <p>${dados.mensagem}</p>
      </div>
      <script>
        function calcularDias(data) {
          const hoje = new Date();
          const inicio = new Date(data);
          const diff = hoje - inicio;
          return Math.floor(diff / (1000 * 60 * 60 * 24));
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
