import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Pop({ show, defState, pacientID, deletePacient }) {
  return (
    <>
      <Modal style={{ paddingTop: "15vh" }} show={show} onHide={defState}>
        <Modal.Header>
          <Modal.Title>Apagando dados do paciente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirmando irá apagar todos os dados deste paciente.{" "}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={defState}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deletePacient}>
            Apagar paciente [{pacientID}]
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Pop;
