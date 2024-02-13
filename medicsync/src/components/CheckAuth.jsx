/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect } from "react";

const CheckAuth = async () => {
  var baseUrl = "https://api-connectmed.onrender.com/validation";
  var data;

  const storage = sessionStorage.getItem("data");
  if (!storage) {
    console.log("dados não encontrados.");
  } else {
    data = JSON.parse(storage);
  }

  useEffect(() => {
    axios
      .post(baseUrl, { tk: data.token, id: data.id })
      .then((res) => {
        var x = res.data;
        if (x.stts === false) {
          return (
            console.error("token não validado"),
            (window.location.href = "/"),
            sessionStorage.clear()
          );
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
};

export default CheckAuth;
