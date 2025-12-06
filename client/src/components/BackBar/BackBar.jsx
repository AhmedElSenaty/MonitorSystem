import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const BackBar = ({ onBack }) => (
  <button
    type="button"
    className="btn btn-outline-primary mb-3"
    onClick={onBack}
  >
    <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
    رجوع
  </button>
);

export default BackBar;
