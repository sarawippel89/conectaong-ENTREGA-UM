/**
 * Aplica máscaras automáticas para campos de CPF, Telefone e CEP.
 * Funciona ao digitar e ao colar (paste).
 * 
 * Autor: Sara Wippel (ConectaONG)
 * Versão: 1.0
 */

/* ===== Funções de formatação ===== */
function formatCPF(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.replace(/(\d{3})(\d+)/, '$1.$2');
  if (digits.length <= 9) return digits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return digits.replace(/(\d{2})(\d+)/, '($1) $2');
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
  return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

function formatCEP(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return digits.replace(/(\d{5})(\d+)/, '$1-$2');
}

/* ===== Função genérica para aplicar máscaras ===== */
function applyMask(input, formatter) {
  input.addEventListener('input', () => {
    const start = input.selectionStart;
    const before = input.value.length;
    input.value = formatter(input.value);
    const after = input.value.length;
    const diff = after - before;
    try {
      input.setSelectionRange(start + diff, start + diff);
    } catch {}
  });

  input.addEventListener('paste', (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const digits = paste.replace(/\D/g, '');
    input.value = formatter(digits);
  });
}

/* ===== Inicialização automática ===== */
document.addEventListener('DOMContentLoaded', () => {
  const cpfInput = document.querySelector('#cpf');
  const phoneInput = document.querySelector('#telefone');
  const cepInput = document.querySelector('#cep');

  if (cpfInput) applyMask(cpfInput, formatCPF);
  if (phoneInput) applyMask(phoneInput, formatPhone);
  if (cepInput) applyMask(cepInput, formatCEP);
});

