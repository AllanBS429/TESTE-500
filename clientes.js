// Exibe a lista de clientes salvos, filtrando pelo termo pesquisado
function exibirClientes(filtro = '') {
  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  const ul = document.getElementById('clientesUl');
  ul.innerHTML = '';
  // Normaliza o termo de pesquisa para minúsculas
  const termo = filtro.trim().toLowerCase();
  // Filtra clientes por nome, CPF ou município
  const filtrados = clientes.filter(c =>
    c.nomeCompleto && c.nomeCompleto.toLowerCase().includes(termo) ||
    c.cpf && c.cpf.toLowerCase().includes(termo) ||
    c.municipio && c.municipio.toLowerCase().includes(termo)
  );
  if (filtrados.length === 0) {
    ul.innerHTML = '<li>Nenhum cliente encontrado.</li>';
    return;
  }
  // Exibe cada cliente filtrado na lista
  filtrados.forEach((c, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class='id-destaque'>ID: ${c.id}</span><br><strong>${c.nomeCompleto}</strong><br>CPF: ${c.cpf}<br> ${c.logradouro}, ${c.bairro}, ${c.municipio} - ${c.uf} | CEP: ${c.cep}`;
    ul.appendChild(li);
  });
}

// Inicializa eventos ao carregar a página
window.addEventListener('DOMContentLoaded', function() {
  const pesquisa = document.getElementById('pesquisaCliente');
  // Atualiza a lista conforme o usuário digita na pesquisa
  pesquisa.addEventListener('input', function() {
    exibirClientes(this.value);
  });
  // Exibe todos os clientes ao abrir a página
  exibirClientes();
});
// Exibe a lista de clientes salvos, filtrando pelo termo pesquisado
function exibirClientes(filtro = '') {
  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  const ul = document.getElementById('clientesUl');
  ul.innerHTML = '';
  // Normaliza o termo de pesquisa para minúsculas
  const termo = filtro.trim().toLowerCase();
  // Filtra clientes por nome, CNPJ ou município
  const filtrados = clientes.filter(c =>
    c.razaoSocial.toLowerCase().includes(termo) ||
    c.cnpj.toLowerCase().includes(termo) ||
    c.municipio.toLowerCase().includes(termo)
  );
  if (filtrados.length === 0) {
    ul.innerHTML = '<li>Nenhum cliente encontrado.</li>';
    return;
  }
  // Exibe cada cliente filtrado na lista
  filtrados.forEach((c, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class='id-destaque'>ID: ${c.id}</span><br><strong>${c.razaoSocial}</strong><br>CNPJ: ${c.cnpj}<br> ${c.logradouro}, ${c.bairro}, ${c.municipio} - ${c.uf} | CEP: ${c.cep}`;
    ul.appendChild(li);
  });
}

// Inicializa eventos ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
  const pesquisa = document.getElementById('pesquisaCliente');
  // Atualiza a lista conforme o usuário digita na pesquisa
  pesquisa.addEventListener('input', function() {
    exibirClientes(this.value);
  });
  // Exibe todos os clientes ao abrir a página
  exibirClientes();
});
