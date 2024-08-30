const { exec } = require("child_process");

// Capturar os comandos passados como argumentos
const mainCommand = process.argv[2];
const cleanupCommand = process.argv[3];

if (!mainCommand) {
  console.error("Nenhum comando principal foi fornecido.");
  process.exit(1);
}

if (!cleanupCommand) {
  console.error("Nenhum comando de limpeza foi fornecido.");
  process.exit(1);
}

console.log(`Executando comando principal: ${mainCommand}`);

// Executar o comando principal
const mainProcess = exec(mainCommand);

mainProcess.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

mainProcess.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

mainProcess.on("close", (code) => {
  console.log(`Processo principal terminou com código ${code}`);
});

// Capturar SIGINT (Ctrl+C) e executar o comando de limpeza
process.on("SIGINT", () => {
  console.log(
    "Sinal de interrupção capturado, executando comando de limpeza...",
  );
  const cleanupProcess = exec(cleanupCommand);

  cleanupProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  cleanupProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  cleanupProcess.on("close", () => {
    process.exit();
  });
});
