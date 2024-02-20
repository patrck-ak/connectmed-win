/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import Nav from "../components/Nav";

function EditPacient() {
  var { id } = useParams();

  const nav = useNavigate();
  const storage = sessionStorage.getItem("data");
  if (!storage) {
    nav("/");
  }
  const dataStorage = JSON.parse(storage);

  const urlBase = "https://api-connectmed.onrender.com";
  const notFound = { data: { name: "Usuário não existe" } };

  async function updateReq(e) {
    e.preventDefault();
    axios
      .patch(`${urlBase}/update/pacient`, {
        name: uName,
        desc: uDesc,
        email: uMail,
        cpf: uCpf,
        addr: uAddr,
        medicid: dataStorage.id,
        medictoken: dataStorage.token,
        id: data._id,
      })
      .then((response) => {
        switch (response.data.status) {
          case 5:
            console.log("err");
            break;
          case 10:
            console.log("suc");
            break;
          default:
            console.log("err int");
        }
      });
  }

  var [data, setData] = useState([]);
  var [uName, setuName] = useState(data.name);
  var [uMail, setuMail] = useState(data.email);
  var [uDesc, setuDesc] = useState(data.desc);
  var [uCpf, setuCpf] = useState(data.cpf);
  var [uAddr, setuAddr] = useState(data.addr);

  // lista os dados do paciente
  async function getPacient() {
    axios
      .post(`${urlBase}/getpacient`, {
        id: id,
        medicid: dataStorage.id,
        medictoken: dataStorage.token,
      })
      .then((res) => {
        switch (res.data.status) {
          case 5:
            setData(notFound);
            break;
          case 10:
            setData(res.data.pacient);
            break;
          default:
            setData(notFound);
        }
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getPacient();
  }, []);

  return (
    <>
      <Nav />
      <form
        style={{
          padding: "2em",
          borderRadius: "15px",
          width: "70%",
          marginInline: "auto",
          position: "relative",
          top: "5em",
        }}
        className="bg-dark"
      >
        <h3 className="text-bg-dark pb-3" style={{ fontWeight: "bold" }}>
          - {data.name} -
        </h3>
        <div className="input-group mb-2 ">
          <span className="input-group-text" id="basic-addon1">
            <FaUser />
          </span>
          <input
            type="text"
            defaultValue={data.name}
            className="form-control"
            onChange={(e) => setuName(e.target.value)}
          />
        </div>
        <div className="input-group mb-2 ">
          <span className="input-group-text" id="basic-addon1">
            <FaUser />
          </span>
          <input
            type="text"
            defaultValue={data.email}
            className="form-control"
            onChange={(e) => setuMail(e.target.value)}
          />
        </div>
        <div className="input-group mb-2 ">
          <span className="input-group-text" id="basic-addon1">
            <FaUser />
          </span>
          <input
            defaultValue={data.cpf}
            type="text"
            className="form-control"
            onChange={(e) => setuCpf(e.target.value)}
          />
        </div>
        <div className="input-group mb-2 ">
          <span className="input-group-text" id="basic-addon1">
            <FaUser />
          </span>
          <input
            type="text"
            defaultValue={data.addr}
            className="form-control"
            onChange={(e) => setuAddr(e.target.value)}
          />
        </div>
        <div className="input-group mb-2 ">
          <span className="input-group-text" id="basic-addon1">
            <FaUser />
          </span>
          <textarea
            rows={3}
            defaultValue={data.desc}
            className="form-control"
            onChange={(e) => setuDesc(e.target.value)}
          />
        </div>
        <div className="button-group">
          <Link to="/dashboard">
            <button className="btn btn-primary" style={{ marginRight: "10px" }}>
              <FaArrowLeft />
            </button>
          </Link>
          <button className="btn btn-success" onClick={(e) => updateReq(e)}>
            Atualizar cadastro
          </button>
        </div>
      </form>
    </>
  );
}

export default EditPacient;
