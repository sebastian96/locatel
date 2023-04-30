import { useState } from "react";
import fetch_data from "../utils/service";
import CurrencyInput from "react-currency-input-field";
import "../assets/styles/form.scss";

export const Form = ({ updateAccounts, showAlert }) => {
  const curentAccounts = localStorage.getItem("accounts")
    ? JSON.parse(localStorage.getItem("accounts"))
    : [];
  const [form, setform] = useState({
    account_id: null,
    amount: 0,
  });
  const [account, setAccount] = useState({});
  const [disableButton, setDisableButton] = useState(true);

  const getInputValue = (e, name = undefined) => {
    if (name) {
      setform({
        ...form,
        [name]: parseFloat(e),
      });
    } else {
      const account = curentAccounts.find(
        (account) => account.account_number === e.target.value
      );
      if (account) {
        setform({
          ...form,
          [e.target.name]: account.id,
        });
        setAccount(account);
      } else {
        showAlert("La Cuenta No Existe", "danger");
      }
    }

    if (form.account_id && form.amount > 0) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  };

  const sendAction = async (e) => {
    e.preventDefault();

    let endpoint = "account/";

    switch (e.target.textContent) {
      case "Retirar":
        endpoint = `${endpoint}withdraw`;
        break;
      case "Consignar":
        endpoint = `${endpoint}consign`;
        break;
    }

    const response = await fetch_data("PUT", endpoint, form);

    const updatedAccount = {
      id: account.id,
      user_name: account.user_name,
      account_number: account.account_number,
      total_amount: response.total_amount,
    };

    const accountIndex = curentAccounts.findIndex(
      (account) => account.id === updatedAccount.id
    );

    curentAccounts[accountIndex] = updatedAccount;

    localStorage.setItem("accounts", JSON.stringify(curentAccounts));

    showAlert();
    updateAccounts();
  };

  return (
    <>
      <h2>Realizar Movimientos</h2>
      <section className="form-container">
        <form action="">
          <input
            type="text"
            placeholder="Numero de cuenta"
            name="account_id"
            maxLength="6"
            onChange={getInputValue}
          />
          <CurrencyInput
            name="amount"
            className="form-control"
            placeholder="Valor"
            defaultValue={0}
            intlConfig={{ locale: "en-US", currency: "USD" }}
            onValueChange={(value, name) => getInputValue(value, name)}
          />
          <button type="submit" disabled={disableButton} onClick={sendAction}>
            Retirar
          </button>
          <button type="submit" disabled={disableButton} onClick={sendAction}>
            Consignar
          </button>
        </form>
      </section>
    </>
  );
};
