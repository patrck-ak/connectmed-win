import { React } from "react";
import { useNavigate } from "react-router-dom";

function ErrorHandler() {
  const navigate = useNavigate();

  function back() {
    return navigate("/dashboard");
  }
  return (
    <>
      <div style={{ paddingTop: "30vh" }}>
        <h4 style={{ textAlign: "center" }}>OPS...</h4>
        <p style={{ textAlign: "center" }}>
          Página ainda em desenvolvimento ou não existente.
        </p>
        <span className="d-flex justify-content-center">
          <button className="btn btn-dark w-25" onClick={back}>
            Voltar
          </button>
        </span>
      </div>
    </>
  );
}

export default ErrorHandler;
