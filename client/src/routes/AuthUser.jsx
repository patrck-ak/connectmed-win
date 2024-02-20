import { useState } from "react";
import axios from "axios";
import Style from "./css/AuthUser.module.css";
import Notification from "../components/Notification";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaLock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AuthUser() {
  var data;
  const navigate = useNavigate();
  const urlBase = "https://api-connectmed.onrender.com/auth/user";
  const storage = sessionStorage.getItem("data");
  if (!storage) {
    console.log("nenhum dado encontrado...");
  } else {
    data = JSON.parse(storage);
    if (data.status) {
      console.log("valido");
      navigate("/dashboard");
    }
  }

  var [msg, setMsg] = useState(" ");
  var [type, setType] = useState(" ");
  var [load, setLoad] = useState(true);
  const [nameInput, setName] = useState();
  const [passInput, setPass] = useState();
  var res;

  function loadBtn() {
    setLoad(false);
    setTimeout(() => {
      setLoad(true);
    }, 1200);
  }

  function defNotif(msgres, type) {
    setMsg(msgres);
    setType(type);
    setTimeout(() => {
      setMsg(" ");
      setType(" ");
    }, 1200);
  }

  const authUser = (e) => {
    e.preventDefault(); // cancela o envio padrão
    loadBtn();

    //* tenta enviar um post pelo axios
    try {
      axios
        .post(urlBase, { name: nameInput, pass: passInput })
        .then((response) => {
          res = response.data;

          //* verifica se foi logado
          switch (res.status) {
            case 5:
              defNotif(res.msg, res.type);
              break;

            case 10:
              //* recupera dados da api e salva no sessionStorage do navegador.
              const data = {
                token: res.token,
                id: res.id,
                name: res.name,
                status: res.auth,
              };

              const stg = JSON.stringify(data);
              sessionStorage.setItem("data", stg);

              console.log(data);
              console.log(stg);
              console.log(
                `usuário ${res.name} logado \n token: ${res.token} \nUserID: ${res.id}`
              );
              //* redireciona para home do app
              navigate("/dashboard");
              break;

            default:
              console.log("erro interno.");
          }
        })
        .catch((err) => {
          //! envia um post de log de erro
          console.log(err);
        });
    } catch (err) {
      console.log("erro " + err);
    }
  };

  return (
    <div>
      <Notification msg={msg} type={type} />

      <Link to={"/"}>
        <button
          className="btn btn-dark"
          style={{ position: "absolute", left: "20px", top: "20px" }}
        >
          <FaArrowLeft />
        </button>
      </Link>

      <div className={Style.wrapForm}>
        <form className={Style.formContainer}>
          <img
            src="https://i.imgur.com/OPml1m4.png"
            alt="logo"
            className={Style.logoImg}
          />
          <br />
          <div className="input-group m-auto mb-1 mt-4 w-75">
            <span className="input-group-text text-center" id="basic-addon1">
              <FaUser />
            </span>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              name="userID"
              placeholder="ID"
              id="userID"
            />
          </div>
          <br />

          <div className="input-group m-auto mb-2 w-75">
            <span className="input-group-text text-center" id="basic-addon1">
              <FaLock />
            </span>
            <input
              type="password"
              onChange={(e) => setPass(e.target.value)}
              className="form-control"
              name="pass"
              placeholder="Senha"
              id="pass"
            />
          </div>

          <br />

          <button onClick={authUser} className="btn btn-light" type="submit">
            <span
              className="spinner-border spinner-border-sm"
              style={{ marginRight: "5px" }}
              hidden={load}
            ></span>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthUser;
