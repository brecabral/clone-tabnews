function status(request, response) {
  response.status(200).json({ chave: "opa bão" });
}

export default status;
