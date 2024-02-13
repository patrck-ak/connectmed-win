import React from "react";
import { FaRegIdBadge, FaSearch, FaUser } from "react-icons/fa";
import Nav from "../components/Nav";
import { InputMask } from "@react-input/mask";

function NewConsult() {
  return (
    <>
      <Nav />
      <form
        className="text-center"
        style={{ paddingTop: "5em", width: "40%", margin: "auto" }}
      >
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaRegIdBadge />
          </span>
          <InputMask
            mask="___.___.___-__"
            replacement="_"
            type="text"
            className="form-control"
            placeholder="CPF"
            style={{ marginRight: "10px", borderRadius: "0 5px 5px 0" }}
          />

          <span className="form-text m-auto text-center"> OU </span>

          <span
            className="input-group-text"
            style={{ borderRadius: "5px 0 0 5px", marginLeft: "10px" }}
          >
            <FaUser />
          </span>
          <input type="text" className="form-control" placeholder="Nome" />
        </div>
        <div>
          <button className="btn btn-success" title="Buscar paciente">
            <FaSearch /> Buscar Paciente
          </button>
        </div>
      </form>
    </>
  );
}

export default NewConsult;
