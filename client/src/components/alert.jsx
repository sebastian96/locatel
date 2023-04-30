import Alert from "react-bootstrap/Alert";
import "../assets/styles/alerts.scss";

export const Alerts = ({ alertShow }) => {
  return (
    <Alert
      show={alertShow.show}
      variant={alertShow.variant}
      className={`bg-transparent text-${alertShow.variant} border-${alertShow.variant}`}
    >
      <Alert.Heading>{alertShow.message}</Alert.Heading>
    </Alert>
  );
};
