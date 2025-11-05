// Função para buscar o endereço pelo CEP
async function buscarEndereco(cep) {
  const cepLimpo = cep.replace(/\D/g, "");
  if (cepLimpo.length !== 8) return; // Verifica se o CEP tem 8 dígitos

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) {
      alert("CEP não encontrado!");
      return;
    }

    // Preenche os campos
    document.getElementById("endereco").value = data.logradouro || "";
    document.getElementById("bairro").value = data.bairro || "";
    document.getElementById("cidade").value = data.localidade || "";
    document.getElementById("estado").value = data.uf || "";
  } catch (error) {
    console.error("Erro ao buscar o CEP:", error);
  }
}

// Evento: quando o campo CEP perde o foco
document.getElementById("cep").addEventListener("blur", function () {
  buscarEndereco(this.value);
});

