import { useEffect, useState } from "react";
import { Accounts } from "./components/accounts";
import { Form } from "./components/form";
import { Alerts } from "./components/alert";
import fetch_data from "./utils/service.js";

function App() {
  const [accounts, setaccounts] = useState([]);
  const [alertShow, setAlertShow] = useState({
    show: false,
  });

  const updateAccounts = () => {
    const curentAccounts = localStorage.getItem("accounts")
      ? JSON.parse(localStorage.getItem("accounts"))
      : [];

    setaccounts(curentAccounts);
  };

  const showAlert = (message = "Completado Con Exito", variant = "success") => {
    setAlertShow({
      show: true,
      message,
      variant,
    });
    hideAlert();
  };

  const hideAlert = () => {
    setTimeout(() => {
      setAlertShow({
        show: false,
      });
    }, 2000);
  };

  useEffect(() => {
    const get_accounts = async () => {
      const response = await fetch_data("GET", "accounts");

      setaccounts(response.accounts);
    };
    get_accounts();
  }, []);

  localStorage.setItem("accounts", JSON.stringify(accounts));

  return (
    <div className="container">
      <Accounts
        accounts={accounts}
        updateAccounts={updateAccounts}
        showAlert={showAlert}
        hideAlert={hideAlert}
      />
      {accounts.length > 0 && (
        <Form
          updateAccounts={updateAccounts}
          showAlert={showAlert}
          hideAlert={hideAlert}
        />
      )}
      <Alerts alertShow={alertShow} />
    </div>
  );
}

export default App;
