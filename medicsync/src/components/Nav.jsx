import React from "react";
import CheckAuth from "./CheckAuth";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaSearch, FaUserInjured, FaUserPlus } from "react-icons/fa";
import {} from "react-icons/fa6";
import {} from "react-icons/bs";
import "./css/nav.css";

function Nav() {
  CheckAuth();
  const nav = useNavigate();

  const st = sessionStorage.getItem("data");
  var data;
  if (!st) nav("/");
  else data = JSON.parse(st);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark"
        style={{ position: "absolute", top: 0, left: 0, width: "100vw" }}
      >
        <div className="navbar-brand" style={{ paddingLeft: "10px" }}>
          ConnectMed
        </div>
        <span className="navbar-text mt-1">Olá {data.name}</span>
        <ul
          className="navbar-nav position-absolute"
          style={{ right: 30, gap: 25 }}
        >
          <li className="nav-item underline">
            <Link to="/dashboard" className="link">
              <FaHome className="mb-1" /> Dashboard
            </Link>
          </li>
          <li className="nav-item underline">
            <Link to="/pacient/new/consult" className="link">
              <FaUserInjured className="mb-1" /> Nova Consulta
            </Link>
          </li>
          <li className="nav-item underline">
            <Link to="/pacient/new" className="link">
              <FaUserPlus className="mb-1" /> Novo Cadastro
            </Link>
          </li>
          <li className="nav-item underline">
            <Link to="/pacient/search" className="link">
              <FaSearch className="mb-1" /> Buscar paciente
            </Link>
          </li>
        </ul>
        {/* Saudação */}
      </nav>
    </>
  );
}

export default Nav;
