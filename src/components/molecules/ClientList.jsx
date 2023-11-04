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
      "https://prismanager-back-end-byz07xv4n-pateiharas-projects.vercel.app/listclients/clients"
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
          // Aplicar máscara de CPF aqui
          const clientsWithMaskedCPF = data.map((client) => ({
            ...client,
            CPF: maskLast3DigitsOfCPF(client.CPF),
          }));
          setClients(clientsWithMaskedCPF);
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="listaContatos">
            {clients.map((client) => (
              <tr key={client._id}>
                <td>{client._id}</td>
                <td>{client.name}</td>
                <td>{client.CPF}</td> {/* Agora, o CPF deve estar mascarado */}
                <td>LINK DO CLIENTID</td>
              </tr>
            ))}
          </tbody>{" "}
        </table>
      </div>
    </main>
  );
}

function maskLast3DigitsOfCPF(cpf) {
  // Remove caracteres não numéricos do CPF
  cpf = cpf.replace(/\D/g, "");

  // Mantém apenas os 3 últimos dígitos e aplica a máscara "###.###.###-##"
  cpf = cpf.slice(-3).replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3-");

  return cpf;
}
