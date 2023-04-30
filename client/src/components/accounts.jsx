import { useEffect, useState } from "react";
import { ModalAccount } from "./modalAccount";
import fetch_data from "../utils/service";
import "../assets/styles/accounts.scss";

export const Accounts = ({ accounts, updateAccounts, showAlert }) => {
  const [modalShow, setmodalShow] = useState(false);
  const [title, settitle] = useState("Cuentas Registradas");
  const curentAccounts = localStorage.getItem("accounts")
    ? JSON.parse(localStorage.getItem("accounts"))
    : [];

  const showModal = () => setmodalShow(true);
  const closeModal = async (form = null) => {
    if (form) {
      const response = await fetch_data("POST", "create_account", form);

      localStorage.setItem(
        "accounts",
        JSON.stringify([...curentAccounts, response.data])
      );
    }
    setmodalShow(false);
    showAlert();
    updateAccounts();
  };

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

    return formatter.format(parseFloat(amount));
  };

  useEffect(() => {
    if (accounts.length === 0) {
      settitle("Registra una cuenta");
    } else {
      settitle("Cuentas Registradas");
    }
  }, [accounts]);

  return (
    <section className="accounts-container">
      <h2>
        {title} <button onClick={showModal}>+</button>{" "}
      </h2>
      <div className={`accounts ${accounts.length > 2 ? "scroll" : ""}`}>
        {accounts.map((account) => (
          <div className="account" key={account.id}>
            <p>
              Nombre: <span>{account.user_name}</span>
            </p>
            <p>
              N de cuenta: <span>{account.account_number}</span>
            </p>
            <p>
              Saldo disponible:{" "}
              <span>{formatCurrency(account.total_amount)}</span>
            </p>
          </div>
        ))}
      </div>
      <ModalAccount modalShow={modalShow} modalClose={closeModal} />
    </section>
  );
};
