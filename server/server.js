//* importação do .env
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const User = require("./models/User");
const Pacient = require("./models/Pacient");
var cors = require("cors");

const secret = process.env.SECRET;

const app = express();
const port = 5000;
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,

  optionsSuccessStatus: 204,
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

//? config express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

//? validação de usuário via token
app.post("/validation", async (req, res) => {
  const { tk, id } = req.body;
  var tokenValid = false;
  try {
    // log de tentavida de token inválido.
    tokenValid = jwt.verify(tk, secret);
  } catch (error) {}
  const userExists = User.findOne({ _id: id });
  if (tokenValid && userExists) {
    res.json({ stts: true });
  } else {
    res.json({ stts: false });
  }
});

//? logar usuário
app.post("/auth/user", async (req, res) => {
  const { name, pass } = req.body;
  var level;

  if (!name) {
    return res.json({
      msg: "ID em branco ou inválida.",
      type: "error",
      status: 5,
    });
  }
  if (!pass) {
    return res.json({
      msg: "Senha em branco ou inválida.",
      type: "error",
      status: 5,
    });
  }

  // busca o usuario no banco
  const user = await User.findOne({ name: name });
  if (!user) {
    return res.json({
      msg: "Usuário não encontrado.",
      type: "error",
      status: 5,
    });
  }

  // compara o input de senha com o hash do banco
  const checkPassword = await bcrypt.compare(pass, user.password);

  if (!checkPassword) {
    return res.json({ msg: "Senha incorreta.", type: "error", status: 5 });
  } else {
    const secret = process.env.SECRET;
    const token = jwt.sign({ id: user._id }, secret);
    switch (user.level) {
      case 0:
        level = 3121; // nivel 0 nenhum
      case 1:
        level = 2431; // nivel de leitura
      case 2:
        level = 1261; // nivel de leitura, escrita e remoção
    }
    return res.json({
      msg: "Sessão validada.",
      type: "success",
      auth: true,
      name: user.name,
      status: 10,
      id: user.id,
      token: token,
      level: level,
    });
  }
});

//? cadastrar médico
app.post("/user/new/admin", async (req, res) => {
  // recupera todos os inputs
  const { name, pass, email, level, adminLevel } = req.body;
  if (adminLevel !== "1261") {
    return res.json({
      msg: "Seu usuário não tem permissão.",
      type: "error",
      status: 5,
    });
  }
  if (!name) {
    return res.json({
      msg: "ID em branco ou inválido.",
      type: "error",
      status: 5,
    });
  }
  if (!email) {
    return res.json({
      msg: "E-mail em branco ou inválido.",
      type: "error",
      status: 5,
    });
  }
  if (!pass) {
    return res.json({
      msg: "Senha em branco ou inválido.",
      type: "error",
      status: 5,
    });
  }
  if (!level) {
    return res.json({
      msg: "Nivel de permissão em branco ou inválido.",
      status: 5,
    });
  }

  // verifica se usuario já existe
  const userExists = await User.findOne({ name: name });
  const mailExists = await User.findOne({ email: email });

  if (userExists) {
    return res.json({ msg: "Usuário já cadastrado", type: "error", status: 5 });
  }
  if (mailExists) {
    return res.json({ msg: "E-mail já cadastrado", type: "error", status: 5 });
  }

  // criptar senha
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(pass, salt);

  // salvar usuário na tabela
  const user = new User({
    name,
    email,
    password: passwordHash,
    level,
  });

  // envia o usuário
  try {
    await user.save();
    res.status(201).json({
      msg: "Usuario criado com sucesso.",
      type: "success",
      status: 10,
    });
  } catch (error) {
    // retorna erro caso tenha algum
    console.log(error);
  }
});

//? editar usuário admin
app.post("/user/edit", async (req, res) => {
  const { name, id, token, auth } = req.body;
  const user = await User.findOne({ _id: id });
  return res.json({ user: user });
});

//? criação de novo paciente
app.post("/pacients/create", async (req, res) => {
  // desestrutura todos os inputs da requisição
  const { nam, email, address, desc, cpf, pass, admin, idadmin } = req.body;
  if (!nam) {
    return res.json({
      msg: "Nome do paciente inválido.",
      type: "error",
      status: 5,
    });
  }
  if (!email) {
    return res.json({
      msg: "E-Mail de paciente inválido.",
      type: "error",
      status: 5,
    });
  }
  if (!cpf) {
    return res.json({
      msg: "CPF do paciente inválido.",
      type: "error",
      status: 5,
    });
  }
  if (!address) {
    return res.json({
      msg: "Endereço do paciente inválido.",
      type: "error",
      status: 5,
    });
  }
  if (!desc) {
    return res.json({
      msg: "Descrição do paciente não pode estar em branco.",
      type: "error",
      status: 5,
    });
  }

  const adm = await User.findOne({ name: admin });
  var hash = adm.password;

  // inicializa a lista de pacientes
  var atend = [];

  if (await bcrypt.compare(pass, hash)) {
    try {
      const pacient = new Pacient({
        name: nam,
        email,
        cpf,
        addr: address,
        desc,
        atend,
      });

      pacient.save();
      return res.json({
        msg: "Paciente criado com sucesso.",
        type: "success",
        status: 10,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        msg: "Erro interno, por favor contate o Suporte.",
        type: "error",
        status: 5,
      });
    }
  } else {
    return res.json({ msg: "Senha inválida.", type: "error", status: 5 });
  }
});

//? sistema de log
app.post("/log/medic", async (req, res) => {
  const { msg, err, id, date } = req.body;
  console.log(msg, err, id, date);
});

//? busca de registros de consultas
app.post("/checkcpf", async (req, res) => {
  const { cpf } = req.body;
  const p = await Pacient.findOne({ cpf: cpf });
  if (!p) {
    return res.json({ msg: "CPF não encontrado.", type: "error", status: 5 });
  } else {
    return res.json({
      msg: "Usuário encontrado.",
      type: "success",
      status: 10,
    });
  }
});

//? listar todos pacientes cadastrados
app.post("/dashboard/listpacients", async (req, res) => {
  const { token, id, pacientName } = req.body;
  var tokenValid = false;

  // verifica se o id do médico é valido
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.json({
      msg: "ID do médico não existe.",
      type: "error",
      status: 5,
    });
  }

  // validação de token
  try {
    tokenValid = jwt.verify(token, secret);
  } catch (error) {
    return res.json({ msg: "Erro interno.", type: "error", status: 5 });
  }

  try {
    if (pacientName === undefined || pacientName === "") {
      const pacients = await Pacient.find();
      return res.json({ pacients, status: 10 });
    } else {
      const pacients = await Pacient.find({
        name: { $regex: `${pacientName}`, $options: "i" },
      });
      return res.json({ pacients, status: 10 });
    }
  } catch (error) {}
});

//? apagando paciente
app.post("/pacients/edit/delete", async (req, res) => {
  const { token, id, idmedic } = req.body;

  const secret = process.env.SECRET;
  try {
    const isValidToken = jwt.verify(token, secret);
    if (isValidToken) {
      const pacient = await Pacient.findOneAndDelete({ _id: id });
      if (!pacient) {
        return res.json({
          msg: `Este id [${id}] não existe no banco, tente reiniciar a página!`,
          type: "error",
          status: 5,
        });
      }
      return res.json({
        msg: `Usuário [${id}] apagado com sucesso!`,
        type: "success",
        status: 10,
      });
    }
  } catch (error) {
    return res.json({
      msg: "Erro interno da aplicação.",
      type: "error",
      status: 5,
    });
  }
});

//? dados de paciente especifico
app.post("/getpacient", async (req, res) => {
  const { id } = req.body;
  try {
    const pacient = await Pacient.findOne({ _id: id });
    if (!pacient || pacient === undefined) {
      console.log("erro" + pacient);
      return res.json({ msg: "Paciente não encontrado.", status: 5 });
    } else {
      return res.json({ pacient, status: 10 });
    }
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Paciente não encontrado.", status: 5 });
  }
});

app.patch("/update/pacient", async (req, res) => {
  const { name, cpf, desc, id, email, addr, medicid, medictoken } = req.body;
  const update = {
    id: id,
    email: email,
    name: name,
    cpf: cpf,
    desc: desc,
    addr: addr,
  };

  console.log(update);
  try {
    const p = await Pacient.findOneAndUpdate({ _id: id }, update);
    console.log(p);
    return res.json({ msg: "ok", status: 10 });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "error", status: 5 });
  }
});

//! .ENV
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

//? Conexão a DB (dados no .env)
mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.zausybw.mongodb.net/`)
  .then(
    app.listen(port, () => {
      console.log("rodando...");
    })
  )
  .catch((err) => {
    console.log(err);
  });
