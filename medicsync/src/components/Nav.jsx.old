import Style from "./css/Nav.module.css";
import { Link } from "react-router-dom";
import { FaHome, FaUserCircle, FaUserCog, FaUserPlus } from "react-icons/fa";
import CheckAuth from "./CheckAuth";
import { useNavigate } from "react-router-dom";

function Nav() {
  CheckAuth();
  var nam;

  const nav = useNavigate();

  const storage = sessionStorage.getItem("data");
  if (storage === undefined || storage === null) {
    console.log("dados não encontrados.");
  } else {
    const data = JSON.parse(storage);
    if (data.name !== null) {
      nam = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    }
  }

  function LogOut() {
    sessionStorage.clear();
    nav("/");
  }

  return (
    <>
      <div className={Style.Wrap}>
        <ul className={Style.NavList}>
          <li className={Style.LinkCont}>
            <Link className={Style.Link} to="/dashboard">
              <FaHome className="mb-1" /> Dashboard
            </Link>
            <Link className={Style.Link} to="/pacient/new">
              <FaUserPlus className="mb-1" /> Novo Paciente
            </Link>
            <Link className={Style.Link} to="/user/register">
              <FaUserCog className="mb-1" /> Novo Usuário
            </Link>
          </li>

          <li className={Style.UserCont}>
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaUserCircle className="mb-1" /> {nam}
            </button>

            <ul
              className="dropdown-menu dropdown-menu-dark"
              aria-labelledby="dropdownMenuButton2"
            >
              <Link className="dropdown-item" to={"/user/edit/"}>
                Editar usuário
              </Link>
              <hr className="dropdown-divider" />
              <Link className="dropdown-item" to="#" onClick={LogOut}>
                Finaliza Sessão
              </Link>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Nav;
