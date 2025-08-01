document.addEventListener('DOMContentLoaded', function() {
    // Atualiza o ano no footer
    document.getElementById('ano-atual').textContent = new Date().getFullYear();

    // Formulário de Tara
    const taraForm = document.getElementById('taraForm');
    if (taraForm) {
        taraForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Obter valores das taras
            const tara1 = parseFloat(document.getElementById('tara1').value);
            const tara2 = parseFloat(document.getElementById('tara2').value);
            const tara3 = parseFloat(document.getElementById('tara3').value);
            const tara4 = parseFloat(document.getElementById('tara4').value);
            const tara5 = parseFloat(document.getElementById('tara5').value);
            const taraPadrao = parseFloat(document.getElementById('taraPadrao').value);

            // Calcular média
            const somaTara = tara1 + tara2 + tara3 + tara4 + tara5;
            const mediaTara = somaTara / 5;

            // Verificar se está dentro do padrão (com margem de 1%)
            const margem = taraPadrao * 0.01;
            const aprovado = Math.abs(mediaTara - taraPadrao) <= margem;

            // Exibir resultados
            const resultadoDiv = document.getElementById('resultadoTara');
            const detailsDiv = document.getElementById('taraDetails');
            const statusDiv = document.getElementById('taraStatus');

            // Formatar números com 2 casas decimais
            const formatNumber = num => num.toFixed(2).replace('.', ',');

            detailsDiv.innerHTML = `
                <table class="result-table">
                    <thead>
                        <tr>
                            <th>Amostra</th>
                            <th>Peso (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Tara 01</td>
                            <td>${formatNumber(tara1)}</td>
                        </tr>
                        <tr>
                            <td>Tara 02</td>
                            <td>${formatNumber(tara2)}</td>
                        </tr>
                        <tr>
                            <td>Tara 03</td>
                            <td>${formatNumber(tara3)}</td>
                        </tr>
                        <tr>
                            <td>Tara 04</td>
                            <td>${formatNumber(tara4)}</td>
                        </tr>
                        <tr>
                            <td>Tara 05</td>
                            <td>${formatNumber(tara5)}</td>
                        </tr>
                        <tr class="table-active">
                            <td><strong>Total</strong></td>
                            <td><strong>${formatNumber(somaTara)}</strong></td>
                        </tr>
                        <tr class="table-active">
                            <td><strong>Média</strong></td>
                            <td><strong>${formatNumber(mediaTara)}</strong></td>
                        </tr>
                        <tr class="table-active">
                            <td><strong>Padrão Esperado</strong></td>
                            <td><strong>${formatNumber(taraPadrao)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            `;

            if (aprovado) {
                statusDiv.innerHTML = `<span class="resultado-aprovado"><i class="fas fa-check-circle me-2"></i>TARA APROVADA - Dentro do padrão esperado</span>`;
                resultadoDiv.style.borderLeftColor = getComputedStyle(document.documentElement).getPropertyValue('--success-color');
            } else {
                statusDiv.innerHTML = `<span class="resultado-reprovado"><i class="fas fa-times-circle me-2"></i>TARA REPROVADA - Fora do padrão esperado</span>`;
                resultadoDiv.style.borderLeftColor = getComputedStyle(document.documentElement).getPropertyValue('--danger-color');
            }

            resultadoDiv.classList.remove('d-none');
            resultadoDiv.classList.add('fade-in');

            // Rolagem suave para o resultado
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Formulário de Peso
    const pesoForm = document.getElementById('pesoForm');
    if (pesoForm) {
        pesoForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Obter valores dos pesos
            const peso1 = parseFloat(document.getElementById('peso1').value);
            const peso2 = parseFloat(document.getElementById('peso2').value);
            const peso3 = parseFloat(document.getElementById('peso3').value);
            const peso4 = parseFloat(document.getElementById('peso4').value);
            const peso5 = parseFloat(document.getElementById('peso5').value);
            const pesoPadrao = parseFloat(document.getElementById('pesoPadrao').value);

            // Calcular média
            const somaPeso = peso1 + peso2 + peso3 + peso4 + peso5;
            const mediaPeso = somaPeso / 5;

            // Verificar se está dentro do padrão (com margem de 1%)
            const margem = pesoPadrao * 0.01;
            const aprovado = Math.abs(mediaPeso - pesoPadrao) <= margem;

            // Exibir resultados
            const resultadoDiv = document.getElementById('resultadoPeso');
            const detailsDiv = document.getElementById('pesoDetails');
            const statusDiv = document.getElementById('pesoStatus');

            // Formatar números com 2 casas decimais
            const formatNumber = num => num.toFixed(2).replace('.', ',');

            detailsDiv.innerHTML = `
                <table class="result-table">
                    <thead>
                        <tr>
                            <th>Amostra</th>
                            <th>Peso (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Peso 01</td>
                            <td>${formatNumber(peso1)}</td>
                        </tr>
                        <tr>
                            <td>Peso 02</td>
                            <td>${formatNumber(peso2)}</td>
                        </tr>
                        <tr>
                            <td>Peso 03</td>
                            <td>${formatNumber(peso3)}</td>
                        </tr>
                        <tr>
                            <td>Peso 04</td>
                            <td>${formatNumber(peso4)}</td>
                        </tr>
                        <tr>
                            <td>Peso 05</td>
                            <td>${formatNumber(peso5)}</td>
                        </tr>
                        <tr class="table-active">
                            <td><strong>Total</strong></td>
                            <td><strong>${formatNumber(somaPeso)}</strong></td>
                        </tr>
                        <tr class="table-active">
                            <td><strong>Média</strong></td>
                            <td><strong>${formatNumber(mediaPeso)}</strong></td>
                        </tr>
                        <tr class="table-active">
                            <td><strong>Padrão Esperado</strong></td>
                            <td><strong>${formatNumber(pesoPadrao)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            `;

            if (aprovado) {
                statusDiv.innerHTML = `<span class="resultado-aprovado"><i class="fas fa-check-circle me-2"></i>PESO APROVADO - Dentro do padrão esperado</span>`;
                resultadoDiv.style.borderLeftColor = getComputedStyle(document.documentElement).getPropertyValue('--success-color');
            } else {
                statusDiv.innerHTML = `<span class="resultado-reprovado"><i class="fas fa-times-circle me-2"></i>PESO REPROVADO - Fora do padrão esperado</span>`;
                resultadoDiv.style.borderLeftColor = getComputedStyle(document.documentElement).getPropertyValue('--danger-color');
            }

            resultadoDiv.classList.remove('d-none');
            resultadoDiv.classList.add('fade-in');

            // Rolagem suave para o resultado
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Formulário de Validade
    const validadeForm = document.getElementById('validadeForm');
    if (validadeForm) {
        validadeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const dataProducao = new Date(document.getElementById('dataProducao').value);
            const mesesValidade = parseInt(document.getElementById('mesesValidade').value);

            // Calcular data de validade
            const dataValidade = new Date(dataProducao);
            dataValidade.setMonth(dataValidade.getMonth() + mesesValidade);

            // Verificar se a data de validade é válida
            if (isNaN(dataProducao.getTime()) || isNaN(dataValidade.getTime())) {
                alert('Por favor, insira uma data válida.');
                return;
            }

            // Exibir resultados
            const resultadoDiv = document.getElementById('resultadoValidade');
            const detailsDiv = document.getElementById('validadeDetails');

            // Formatar datas para o padrão brasileiro
            const formatDate = date => {
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            };

            detailsDiv.innerHTML = `
                <div class="mb-2"><strong>Data de Produção:</strong> ${formatDate(dataProducao)}</div>
                <div class="mb-2"><strong>Validade:</strong> ${mesesValidade} meses</div>
                <div class="mb-3"><strong>Data de Validade Calculada:</strong> ${formatDate(dataValidade)}</div>

                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    O produto estará válido até <strong>${formatDate(dataValidade)}</strong>
                </div>
            `;

            resultadoDiv.classList.remove('d-none');
            resultadoDiv.classList.add('fade-in');
            resultadoDiv.style.borderLeftColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');

            // Rolagem suave para o resultado
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Scroll suave para as seções
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    insetBlockStart: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Focar no primeiro campo ao carregar a seção
    const sections = ['tara-section', 'peso-section', 'validade-section'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    const firstInput = element.querySelector('input, select');
                    if (firstInput) firstInput.focus();
                }
            }, { threshold: 0.5 });

            observer.observe(element);
        }
    });
});