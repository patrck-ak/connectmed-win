/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Nav from "../components/Nav";
import axios from "axios";
import Style from "./css/EditUser.module.css";

function EditUser() {
  const urlBase = "https://api-connectmed.onrender.com/user/edit/";

  const storage = sessionStorage.getItem("data");
  const data = JSON.parse(storage);

  var res;

  const getUser = () => {
    axios
      .post(urlBase, {
        nam: data.name,
        id: data.id,
        token: data.token,
      })
      .then(async (response) => {
        res = response.data;
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Nav />
      <div className={Style.formContainer}></div>
      <form className={Style.form}>
        <p>{res}</p>
      </form>
    </>
  );
}

export default EditUser;
