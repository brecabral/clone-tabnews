import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdateAT />
    </>
  );
}

function UpdateAT() {
  const { isLoading, data } = useSWR("api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";
  let postgresVersion = "0";
  let maxConnections = "0";
  let openedConnections = "0";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    postgresVersion = data.dependecies.database.version;
    maxConnections = data.dependecies.database.max_connections;
    openedConnections = data.dependecies.database.opened_connections;
  }

  return (
    <>
      <p>
        Última atuaçlização: {updatedAtText}
        <br />
        Versão do Postgres: {postgresVersion}
        <br />
        Conexões abertas: {openedConnections}/{maxConnections}
      </p>
    </>
  );
}
