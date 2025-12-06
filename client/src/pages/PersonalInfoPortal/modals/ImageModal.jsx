import React from "react";
import { Modal } from "react-bootstrap";

const ImageModal = ({ show, src, onClose }) => (
  <Modal show={show} onHide={onClose} dialogClassName="modal-lg text-end">
    <Modal.Header closeButton className="flex-row-reverse " />
    <Modal.Body className="d-flex justify-content-center align-items-center">
      {src ? (
        <img
          src={src}
          alt="zoomed"
          className="img-fluid"
          style={{ maxHeight: "100%", maxWidth: "100%" }}
        />
      ) : null}
    </Modal.Body>
  </Modal>
);

export default ImageModal;
