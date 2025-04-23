const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let codigoVerificacao = null;

function gerarCodigo() {
  return Math.floor(100000 + Math.random() * 900000); // Ex: 6 dígitos
}

app.post('/enviar-codigo', (req, res) => {
  const { email } = req.body;
  const codigo = gerarCodigo();
  codigoVerificacao = codigo;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'SEU_EMAIL@gmail.com',
      pass: 'SENHA_DE_APP'
    }
  });

  const mailOptions = {
    from: 'SEU_EMAIL@gmail.com',
    to: email,
    subject: 'Código de Verificação - SeuApp',
    text: `Seu código de verificação é: ${codigo}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ erro: 'Erro ao enviar e-mail' });
    } else {
      res.status(200).json({ mensagem: 'Código enviado!' });
    }
  });
});

app.post('/verificar-codigo', (req, res) => {
  const { codigoDigitado } = req.body;
  if (parseInt(codigoDigitado) === codigoVerificacao) {
    res.status(200).json({ sucesso: true, mensagem: 'Verificado com sucesso' });
  } else {
    res.status(401).json({ sucesso: false, mensagem: 'Código inválido' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
