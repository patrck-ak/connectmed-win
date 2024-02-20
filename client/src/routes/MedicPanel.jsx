/* eslint-disable react-hooks/exhaustive-deps */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaFileMedicalAlt, FaPencilAlt, FaTrash } from "react-icons/fa";
import { FaArrowRotateRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import Nav from "../components/Nav";
import Notification from "../components/Notification";
import Pop from "../components/Pop";

const MedicPanel = () => {
  const nav = useNavigate();
  const storage = sessionStorage.getItem("data");
  if (!storage) {
    nav("/");
  }
  const storagedata = JSON.parse(storage);

  // const urlBase = "http://localhost:5000";
  const urlBase = "https://api-connectmed.onrender.com";

  var [msg, setMsg] = useState(" ");
  var [type, setType] = useState(" ");
  var [state, setState] = useState(false);
  var [data, setData] = useState(undefined);
  var [pacientID, setPacientID] = useState();
  var [search, setSearch] = useState(undefined);

  function defNotif(msgres, type) {
    setMsg(msgres);
    setType(type);
    setTimeout(() => {
      setMsg(" ");
      setType(" ");
    }, 1200);
  }

  function deletePacient() {
    closeModal();
    axios
      .post(`${urlBase}/pacients/edit/delete`, {
        id: pacientID,
        medicid: storagedata.id,
        token: storagedata.token,
      })
      .then((response) => {
        let res = response.data;
        switch (res.status) {
          case 5:
            defNotif(res.msg, res.type);
            break;
          case 10:
            List();
            defNotif(res.msg, res.type);
            break;
          default:
            defNotif("Erro interno");
            break;
        }
      })
      .catch((err) => defNotif("Erro interno"));
  }

  //? função para fechar o modal
  function closeModal() {
    return setState(false);
  }

  //? abre modal de configuração
  function confirmDelete(name, id) {
    setState(true);
    setPacientID(id);
  }

  //? recupera todos os pacientes do banco
  function List(pacientName) {
    console.log(pacientName);
    axios
      .post(`${urlBase}/dashboard/listpacients`, {
        id: storagedata.id,
        token: storagedata.token,
        pacientName: pacientName,
      })
      .then(async (response) => {
        setData(response.data.pacients);
        switch (response.data.status) {
          case 5:
            defNotif(data.msg);
            break;
          case 10:
            defNotif("Pacientes atualizados.", "success");
            break;
          default:
            defNotif("Erro interno, contate o suporte.", "error");
        }
      })
      .catch((err) => defNotif("Erro ao enviar request.", "error"));
  }

  //? atualiza a lista a cada refresh da página
  useEffect(() => {
    List();
  }, []);

  return (
    <>
      <Nav />
      <Notification msg={msg} type={type} />
      <Pop
        show={state}
        defState={closeModal}
        pacientID={pacientID}
        deletePacient={deletePacient}
      />

      <div className="d-flex" style={{ marginTop: "5em" }}>
        <div
          className="input-group "
          style={{ width: "30%", position: "relative" }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por nome"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onBlur={() => List(search)}
          />
        </div>
        <button
          style={{ marginLeft: "10px" }}
          className="btn btn-success"
          title="Atualizar pacientes"
          onClick={() => List()}
        >
          <FaArrowRotateRight />
        </button>
      </div>

      <div
        className="bg-dark"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px",
          marginTop: "1em",
          borderRadius: "10px",
        }}
      >
        <ul
          className="list-group"
          style={{ width: "90%", position: "inherit" }}
        >
          {data === undefined ? (
            <li className="list-group-item bg-dark border-dark">
              <div className="input-group m-auto">
                <input
                  type="text"
                  readOnly
                  className="form-control text-center"
                  value="CARREGANDO..."
                />
              </div>
            </li>
          ) : (
            data.map((pacient) => (
              <li
                className="list-group-item bg-dark border-dark"
                key={pacient.name}
                onClick={() => console.log(pacient)}
              >
                <div className="input-group m-auto">
                  <input
                    type="text"
                    readOnly
                    title="Nome"
                    className="form-control"
                    value={pacient.name}
                  />
                  <input
                    type="text"
                    readOnly
                    title="CPF"
                    className="form-control"
                    value={pacient.cpf}
                  />
                  <input
                    type="text"
                    readOnly
                    title="Endereço"
                    className="form-control"
                    value={pacient.addr}
                  />
                  <input
                    type="text"
                    readOnly
                    title="E-Mail"
                    className="form-control"
                    value={pacient.email}
                  />
                  <input
                    type="text"
                    readOnly
                    title="Descrição"
                    className="form-control"
                    value={pacient.desc}
                  />
                  <button
                    title="Apagar paciente"
                    className="btn btn-danger"
                    onClick={() => {
                      confirmDelete(pacient.name, pacient._id);
                    }}
                  >
                    <FaTrash />
                  </button>
                  <button
                    title="Editar paciente"
                    className="btn btn-secondary "
                    onClick={() => {
                      nav(`/pacient/edit/${pacient._id}`);
                    }}
                  >
                    <FaPencilAlt />
                  </button>
                  <button title="Nova consulta" className="btn btn-primary">
                    <FaFileMedicalAlt />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default MedicPanel;
