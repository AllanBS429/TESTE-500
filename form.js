// Função para remover todos os caracteres não numéricos (usada para CNPJ e CEP)
function onlyDigits(str) {
  return str.replace(/\D/g, '');
}

// Exibe ou oculta o indicador de carregamento/spinner e desabilita o botão de salvar
function showLoading(show = true) {
  document.getElementById('loading').style.display = show ? 'block' : 'none';
  document.getElementById('btnSalvar').disabled = show;
}

// Exibe mensagens de feedback para o usuário (erros ou sucesso)
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

// Consulta BrasilAPI por CNPJ e preenche os campos do formulário
async function preencherPorCNPJ(cnpj) {
  showLoading(true);
  showFeedback('');
  cnpj = onlyDigits(cnpj);
  if (cnpj.length !== 14) {
    showLoading(false);
    showFeedback('CNPJ inválido.');
    return;
  }
  try {
    const data = await fetchJSON(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    document.getElementById('razaoSocial').value = data.razao_social || '';
    document.getElementById('nomeFantasia').value = data.nome_fantasia || '';
    document.getElementById('cep').value = data.cep || '';
    document.getElementById('logradouro').value = data.descricao_tipo_de_logradouro + ' ' + (data.logradouro || '');
    document.getElementById('bairro').value = data.bairro || '';
    document.getElementById('municipio').value = data.municipio || '';
    document.getElementById('uf').value = data.uf || '';
    showFeedback('Dados preenchidos com sucesso!', false);
  } catch (err) {
    if (err.message === '404') {
      showFeedback('CNPJ não encontrado.');
    } else {
      showFeedback('Erro ao consultar CNPJ. Tente novamente.');
    }
  }
  showLoading(false);
}

// Consulta BrasilAPI por CEP e preenche os campos de endereço
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

// Eventos principais do formulário
window.addEventListener('DOMContentLoaded', function() {
  // Evento blur para CNPJ
  document.getElementById('cnpj').addEventListener('blur', function() {
    preencherPorCNPJ(this.value);
  });
  // Evento input e blur para CEP
  const cepInput = document.getElementById('cep');
  cepInput.addEventListener('blur', function() {
    preencherPorCEP(this.value);
  });
  cepInput.addEventListener('input', function() {
    if (onlyDigits(this.value).length === 8) {
      preencherPorCEP(this.value);
    }
  });
  // Evento submit do formulário
  document.getElementById('formFornecedor').addEventListener('submit', function(e) {
    e.preventDefault();
    const fornecedor = {
      cnpj: document.getElementById('cnpj').value,
      razaoSocial: document.getElementById('razaoSocial').value,
      nomeFantasia: document.getElementById('nomeFantasia').value,
      cep: document.getElementById('cep').value,
      logradouro: document.getElementById('logradouro').value,
      bairro: document.getElementById('bairro').value,
      municipio: document.getElementById('municipio').value,
      uf: document.getElementById('uf').value
    };
    salvarFornecedor(fornecedor);
    showFeedback('Cadastro salvo!', false);
    this.reset();
    exibirFornecedores();
  });
  // Exibe a lista ao carregar a página
  exibirFornecedores();
});

// Salva o fornecedor no localStorage, gerando um id único
function salvarFornecedor(fornecedor) {
  let fornecedores = JSON.parse(localStorage.getItem('fornecedores') || '[]');
  fornecedor.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  fornecedores.push(fornecedor);
  localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
}

// Exibe a lista de fornecedores salvos abaixo do formulário
function exibirFornecedores() {
  const fornecedores = JSON.parse(localStorage.getItem('fornecedores') || '[]');
  const ul = document.getElementById('clientesUl');
  ul.innerHTML = '';
  if (fornecedores.length === 0) {
    ul.innerHTML = '<li>Nenhum fornecedor cadastrado.</li>';
    return;
  }
  fornecedores.forEach((f, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${f.razaoSocial}</strong> (ID: ${f.id})<br>CNPJ: ${f.cnpj}<br> ${f.logradouro}, ${f.bairro}, ${f.municipio} - ${f.uf} | CEP: ${f.cep}`;
    ul.appendChild(li);
  });
}
