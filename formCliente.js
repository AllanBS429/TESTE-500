// Funções utilitárias para cliente
// Remove todos os caracteres não numéricos (usado para CPF e CEP)
function onlyDigits(str) {
  return str.replace(/\D/g, '');
}

// Exibe ou oculta o spinner de carregamento e desabilita o botão de salvar
function showLoading(show = true) {
  document.getElementById('loading').style.display = show ? 'block' : 'none';
  document.getElementById('btnSalvar').disabled = show;
}

// Exibe mensagens de feedback para o usuário (erro ou sucesso)
function showFeedback(msg, isError = true) {
  const feedback = document.getElementById('feedback');
  feedback.textContent = msg;
  feedback.style.color = isError ? '#d63031' : '#0984e3';
  if (msg) feedback.focus();
}

// Realiza requisições Fetch e retorna o JSON (com tratamento de erro)
async function fetchJSON(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(resp.status);
    return await resp.json();
  } catch (err) {
    throw err;
  }
}

// Preenche os campos de endereço automaticamente ao digitar o CEP
async function preencherPorCEP(cep) {
  showLoading(true);
  showFeedback('');
  cep = onlyDigits(cep);
  if (cep.length !== 8) {
    showLoading(false);
    showFeedback('CEP inválido.');
    return;
  }
  try {
    const data = await fetchJSON(`https://brasilapi.com.br/api/cep/v1/${cep}`);
    document.getElementById('logradouro').value = data.street || '';
    document.getElementById('bairro').value = data.neighborhood || '';
    document.getElementById('municipio').value = data.city || '';
    document.getElementById('uf').value = data.state || '';
    showFeedback('Endereço preenchido!', false);
  } catch (err) {
    if (err.message === '404') {
      showFeedback('CEP não encontrado.');
    } else {
      showFeedback('Erro ao consultar CEP. Tente novamente.');
    }
  }
  showLoading(false);
}

// Eventos principais do formulário de cliente
window.addEventListener('DOMContentLoaded', function() {
  // Preenche endereço ao digitar ou sair do campo CEP
  const cepInput = document.getElementById('cep');
  cepInput.addEventListener('blur', function() {
    preencherPorCEP(this.value);
  });
  cepInput.addEventListener('input', function() {
    if (onlyDigits(this.value).length === 8) {
      preencherPorCEP(this.value);
    }
  });
  // Ao enviar o formulário, salva o cliente e atualiza a lista
  document.getElementById('formCliente').addEventListener('submit', function(e) {
    e.preventDefault();
    const cliente = {
      cpf: document.getElementById('cpf').value,
      nomeCompleto: document.getElementById('nomeCompleto').value,
      cep: document.getElementById('cep').value,
      logradouro: document.getElementById('logradouro').value,
      bairro: document.getElementById('bairro').value,
      municipio: document.getElementById('municipio').value,
      uf: document.getElementById('uf').value
    };
    salvarCliente(cliente);
    showFeedback('Cadastro salvo!', false);
    this.reset();
    exibirClientes();
  });
  // Exibe a lista de clientes ao carregar a página
  exibirClientes();
});

// Salva o cliente no localStorage, gerando um id único
function salvarCliente(cliente) {
  let clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  cliente.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  clientes.push(cliente);
  localStorage.setItem('clientes', JSON.stringify(clientes));
}

// Exibe a lista de clientes salvos abaixo do formulário
function exibirClientes() {
  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  const ul = document.getElementById('clientesUl');
  ul.innerHTML = '';
  if (clientes.length === 0) {
    ul.innerHTML = '<li>Nenhum cliente cadastrado.</li>';
    return;
  }
  clientes.forEach((c, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${c.nomeCompleto}</strong> (ID: ${c.id})<br>CPF: ${c.cpf}<br> ${c.logradouro}, ${c.bairro}, ${c.municipio} - ${c.uf} | CEP: ${c.cep}`;
    ul.appendChild(li);
  });
}
