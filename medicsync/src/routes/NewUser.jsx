import axios from "axios";
import React, { useState } from "react";
import Style from "./css/NewUser.module.css";
import { FaLock, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Nav from "../components/Nav";
import Notification from "../components/Notification";

function NewUser() {
  const storage = sessionStorage.getItem("data");
  const data = JSON.parse(storage);

  var [load, setLoad] = useState(true);
  function loadIco() {
    setLoad(false);
    setTimeout(() => {
      setLoad(true);
    }, 2000);
  }

  function defNotif(msgres, type) {
    setMsg(msgres);
    setType(type);
    setTimeout(() => {
      setMsg(" ");
      setType(" ");
    }, 1200);
  }

  // variavel de notificação
  var [msg, setMsg] = useState(" ");
  var [type, setType] = useState(" ");
  var res;

  var [level, setLevel] = useState(0);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const [confirm, setConfirm] = useState();

  const urlBase = "https://api-connectmed.onrender.com/user/new/admin";

  const regUser = (e) => {
    e.preventDefault();
    loadIco();
    if (pass === confirm) {
      axios
        .post(urlBase, {
          name: name,
          email: email,
          pass: pass,
          level: level,
          adminLevel: data.level,
        })
        .then((response) => {
          res = response.data;
          console.log(res.status);
          switch (res.status) {
            case 5:
              defNotif(res.msg, res.type);
              break;
            case 10:
              defNotif(res.msg, res.type);
              break;
            default:
              defNotif("Erro interno, tente mais tarde.", "ERRO");
              break;
          }
        }) //! finalizar sistema de envio de log
        .catch((err) => {
          console.log(err);
        });
    } else {
      //* printa erro de senha não são identicas
    }
  };

  return (
    <>
      <Nav />
      <Notification msg={msg} type={type} />
      <div className={Style.wrap}>
        <form className="m-auto">
          <h4 className="text-light text-center">Registrar novo usuário</h4>

          <div className="input-group mb-2 mt-4">
            <span className="input-group-text" id="basic-addon1">
              <FaUser />
            </span>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="ID do médico"
            />
          </div>

          <div className="input-group mb-2">
            <span className="input-group-text" id="basic-addon1">
              <MdEmail />
            </span>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="E-mail válido"
              required
            />
          </div>

          <div className="input-group mb-2">
            <span className="input-group-text" id="basic-addon1">
              <FaLock />
            </span>
            <input
              type="password"
              onChange={(e) => setPass(e.target.value)}
              className="form-control"
              placeholder="Senha"
            />
          </div>

          <div className="input-group mb-2">
            <span className="input-group-text" id="basic-addon1">
              <FaLock />
            </span>
            <input
              type="password"
              onChange={(e) => setConfirm(e.target.value)}
              className="form-control"
              placeholder="Confirmação da Senha"
            />
          </div>

          <hr className="mb-2 mt-4" />

          <div className="input-group mb-2  text-light">
            <label htmlFor="">Nível de permissão - {level}</label>
            <input
              type="range"
              min={0}
              max={2}
              step={1}
              defaultValue={0}
              onChange={(e) => setLevel(e.target.value)}
              className="form-range"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success"
            onClick={(e) => regUser(e)}
          >
            <span
              className="spinner-border spinner-border-sm"
              hidden={load}
            ></span>{" "}
            Cadastrar
          </button>
        </form>
      </div>
    </>
  );
}

export default NewUser;
