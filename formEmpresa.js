// Funções utilitárias para empresa
function onlyDigits(str) {
  return str.replace(/\D/g, '');
}
function showLoading(show = true) {
  document.getElementById('loading').style.display = show ? 'block' : 'none';
  document.getElementById('btnSalvar').disabled = show;
}
function showFeedback(msg, isError = true) {
  const feedback = document.getElementById('feedback');
  feedback.textContent = msg;
  feedback.style.color = isError ? '#d63031' : '#0984e3';
  if (msg) feedback.focus();
}
async function fetchJSON(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(resp.status);
    return await resp.json();
  } catch (err) {
    throw err;
  }
}
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
window.addEventListener('DOMContentLoaded', function() {
  document.getElementById('cnpj').addEventListener('blur', function() {
    preencherPorCNPJ(this.value);
  });
  const cepInput = document.getElementById('cep');
  cepInput.addEventListener('blur', function() {
    preencherPorCEP(this.value);
  });
  cepInput.addEventListener('input', function() {
    if (onlyDigits(this.value).length === 8) {
      preencherPorCEP(this.value);
    }
  });
  document.getElementById('formEmpresa').addEventListener('submit', function(e) {
    e.preventDefault();
    const empresa = {
      cnpj: document.getElementById('cnpj').value,
      razaoSocial: document.getElementById('razaoSocial').value,
      nomeFantasia: document.getElementById('nomeFantasia').value,
      cep: document.getElementById('cep').value,
      logradouro: document.getElementById('logradouro').value,
      bairro: document.getElementById('bairro').value,
      municipio: document.getElementById('municipio').value,
      uf: document.getElementById('uf').value
    };
    salvarEmpresa(empresa);
    showFeedback('Cadastro salvo!', false);
    this.reset();
    exibirEmpresas();
  });
  exibirEmpresas();
});
function salvarEmpresa(empresa) {
  let empresas = JSON.parse(localStorage.getItem('empresas') || '[]');
  empresa.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  empresas.push(empresa);
  localStorage.setItem('empresas', JSON.stringify(empresas));
}
function exibirEmpresas() {
  const empresas = JSON.parse(localStorage.getItem('empresas') || '[]');
  const ul = document.getElementById('empresasUl');
  ul.innerHTML = '';
  if (empresas.length === 0) {
    ul.innerHTML = '<li>Nenhuma empresa cadastrada.</li>';
    return;
  }
  empresas.forEach((e, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${e.razaoSocial}</strong> (ID: ${e.id})<br>CNPJ: ${e.cnpj}<br> ${e.logradouro}, ${e.bairro}, ${e.municipio} - ${e.uf} | CEP: ${e.cep}`;
    ul.appendChild(li);
  });
}
