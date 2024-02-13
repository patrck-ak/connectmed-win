import React from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

function Nav() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <FaUser />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Nav;
