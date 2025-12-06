import React from "react";
import { Modal, Button } from "react-bootstrap";

const NotesModal = ({ show, noteText, setNoteText, onClose, onSave }) => (
  <Modal
    show={show}
    onHide={onClose}
    dialogClassName="modal-lg text-end"
    dir="rtl"
  >
    <Modal.Header className="flex-row-reverse ">
      <button
        type="button"
        className="btn-close"
        aria-label="إغلاق"
        onClick={onClose}
      ></button>
      <Modal.Title style={{ marginLeft: "68%" }}>
        إضافة / تعديل ملاحظة
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <textarea
        className="form-control"
        rows={5}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        dir="rtl"
      />
    </Modal.Body>
    <Modal.Footer className="flex-row-reverse">
      <Button variant="danger" onClick={onClose}>
        إلغاء
      </Button>
      <Button variant="success" onClick={onSave}>
        حفظ التغييرات
      </Button>
    </Modal.Footer>
  </Modal>
);

export default NotesModal;
