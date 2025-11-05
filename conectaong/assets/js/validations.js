
// ======== Máscaras ========
function mascaraCPF(cpf) {
  cpf.value = cpf.value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function mascaraTelefone(tel) {
  tel.value = tel.value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function mascaraCEP(cep) {
  cep.value = cep.value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

// ======== Autopreenchimento de endereço (ViaCEP) ========
async function buscarEndereco(cep) {
  const cepLimpo = cep.replace(/\D/g, "");
  if (cepLimpo.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) {
      console.warn("CEP não encontrado.");
      return;
    }

    document.getElementById("endereco").value = data.logradouro || "";
    document.getElementById("bairro").value = data.bairro || "";
    document.getElementById("cidade").value = data.localidade || "";
    document.getElementById("estado").value = data.uf || "";
  } catch (error) {
    console.error("Erro ao buscar o CEP:", error);
  }
}

// ======== Validação de e-mail ========
function validarEmail(email) {
  const valor = email.value.trim();
  const arrobas = valor.split("@").length - 1;
  const temPontoDepois = valor.includes(".") && valor.indexOf("@") < valor.lastIndexOf(".");

  if (arrobas !== 1 || !temPontoDepois) {
    email.style.border = "2px solid red";
    return false;
  } else {
    email.style.border = "";
    return true;
  }
}

// ======== Validação e máscara para Data de Nascimento ========
function validarDataNascimento(input) {
  const valor = input.value.trim();
  if (!valor) return false;

  const data = new Date(valor);
  const ano = data.getFullYear();
  const anoAtual = new Date().getFullYear();

  if (isNaN(ano) || ano < 1900 || ano > anoAtual) {
    input.style.border = "2px solid red";
    return false;
  } else {
    input.style.border = "";
    return true;
  }
}

// Impedir mais de 4 dígitos no ano (campo date)
document.getElementById("data").addEventListener("input", function () {
  const valor = this.value;
  const partes = valor.split("-");
  if (partes[0] && partes[0].length > 4) {
    partes[0] = partes[0].slice(0, 4);
    this.value = partes.join("-");
  }
});

// ======== Envio do formulário ========
document.getElementById("formCadastro").addEventListener("submit", function (e) {
  e.preventDefault();

  let valido = true;
  const campos = this.querySelectorAll("input[required]");

  campos.forEach(campo => {
    if (!campo.value.trim()) {
      campo.style.border = "2px solid red";
      valido = false;
    } else {
      campo.style.border = "";
    }
  });

  // Valida e-mail
  const emailValido = validarEmail(document.getElementById("email"));
  if (!emailValido) valido = false;

  // Valida data de nascimento
  const dataValida = validarDataNascimento(document.getElementById("data"));
  if (!dataValida) valido = false;

  // Exibe mensagem final
  if (valido) {
    alert("✅ Cadastro realizado com sucesso!");
    this.reset();
    campos.forEach(campo => campo.style.border = "");
  }
});

// ======== Eventos de máscara ========
document.getElementById("cpf").addEventListener("input", function () {
  mascaraCPF(this);
});

document.getElementById("telefone").addEventListener("input", function () {
  mascaraTelefone(this);
});

document.getElementById("cep").addEventListener("input", function () {
  mascaraCEP(this);
});

document.getElementById("cep").addEventListener("blur", function () {
  buscarEndereco(this.value);
});
