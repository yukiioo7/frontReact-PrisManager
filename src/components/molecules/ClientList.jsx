import React, { useState, useEffect } from "react";
import { MDBBtn, MDBModal } from "mdb-react-ui-kit";

import "../../css/login.css";

import AppLoading from "../organisms/AppLoading";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function ClientList() {
  const [basicModal, setBasicModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    setIsLoading(true);

    // Fetch data from your API when the component mounts
    fetch(
      "https://prismanager-back-end-api-pateiharas-projects.vercel.app/listClients/"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha na solicitação à API");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Dados da API:", data); // Para depuração

        if (Array.isArray(data) && data.length > 0) {
          // Mapeie todos os clientes da resposta
          const allClients = data.map((item) => item.client);

          // Certifique-se de que 'allClients' contenha todos os clientes
          if (allClients.length > 0) {
            setClients(allClients);
          } else {
            console.error("Nenhum cliente encontrado na resposta da API.");
          }
        } else {
          console.error("A resposta da API não possui dados válidos.");
        }

        setIsLoading(false);
      })

      .catch((error) => {
        console.error("Erro na solicitação à API:", error); // Adicione esta linha para depuração
      });
  }, []); // O array vazio [] garante que este efeito seja executado apenas uma vez na montagem

  const toggleShow = () => setBasicModal(!basicModal);

  return isLoading ? (
    <AppLoading />
  ) : (
    <main className="main-container">
      <div className="card">
        <div className="card-inner">
          <MDBBtn onClick={toggleShow}>adicionar cliente</MDBBtn>
          <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
            {/* Resto do seu código do modal */}
          </MDBModal>{" "}
        </div>
        <table className="clientTable">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="listaContatos">
            {clients.map((client) => (
              <tr key={client._id}>
                <td>{client._id}</td>
                <td>{client.client && client.client.name}</td>
                <td>{client.client && client.client.CPF}</td>
                <td>{client.state && client.state.status}</td>
              </tr>
            ))}
            ;
          </tbody>{" "}
        </table>
      </div>
    </main>
  );
}
