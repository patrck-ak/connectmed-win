import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

function Notification({ msg, type }) {
  return (
    <>
      {msg === " " ? (
        <></>
      ) : (
        <>
          <Snackbar open={true}>
            <Alert severity={type}>{msg}</Alert>
          </Snackbar>
        </>
      )}
    </>
  );
}

export default Notification;
