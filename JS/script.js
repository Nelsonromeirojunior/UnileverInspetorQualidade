document.addEventListener('DOMContentLoaded', function () {
    // Atualiza o ano no footer
    document.getElementById('ano-atual').textContent = new Date().getFullYear();

    // Configura o scroll suave e destaque do menu
    function setupNavigation() {
        // Atualiza o menu ativo conforme a rolagem
        function updateActiveMenu() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const scrollPosition = window.scrollY + 100;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        // Scroll suave para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Atualiza a URL sem recarregar a página
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    }
                }
            });
        });

        // Atualiza o menu ao rolar a página
        window.addEventListener('scroll', updateActiveMenu);
        updateActiveMenu(); // Chama inicialmente para definir o estado correto
    }

    setupNavigation();

    // Formulário de Tara
    // No seu script.js, adicione:
    // Controle de exibição dos campos de tara
    document.querySelectorAll('input[name="qtdAmostras"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const show10Amostras = this.id === '10amostras';
            document.getElementById('10amostrasFields').classList.toggle('d-none', !show10Amostras);

            // Tornar obrigatórios ou não os campos adicionais
            for (let i = 6; i <= 10; i++) {
                const input = document.getElementById(`tara${i}`);
                input.required = show10Amostras;
                if (!show10Amostras) input.value = ''; // Limpar se não for usar
            }
        });
    });

    // Formulário de Tara Atualizado
    const taraForm = document.getElementById('taraForm');
    if (taraForm) {
        taraForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const use10Amostras = document.getElementById('10amostras').checked;
            const numAmostras = use10Amostras ? 10 : 5;
            const taraValues = [];

            // Coletar valores
            for (let i = 1; i <= numAmostras; i++) {
                const value = parseFloat(document.getElementById(`tara${i}`).value);
                if (isNaN(value)) {
                    alert(`Por favor, preencha o valor da Tara Amostra ${i}.`);
                    return;
                }
                taraValues.push(value);
            }

            // Calcular média
            const somaTara = taraValues.reduce((a, b) => a + b, 0);
            const mediaTara = somaTara / numAmostras;

            // Encontrar a melhor tara (mais próxima da média)
            const melhorTara = taraValues.reduce((prev, curr) =>
                Math.abs(curr - mediaTara) < Math.abs(prev - mediaTara) ? curr : prev
            );

            // Exibir resultados
            const resultadoDiv = document.getElementById('resultadoTara');
            const detailsDiv = document.getElementById('taraDetails');
            const recomendacaoDiv = document.getElementById('taraRecomendacao');

            // Formatar números com 2 casas decimais
            const formatNumber = num => num.toFixed(2).replace('.', ',');

            // Gerar linhas da tabela dinamicamente
            const tableRows = taraValues.map((tara, index) => `
            <tr ${tara === melhorTara ? 'class="table-success"' : ''}>
                <td>Tara ${index + 1}</td>
                <td>${formatNumber(tara)}</td>
                <td>${formatNumber(tara - mediaTara)}</td>
            </tr>
        `).join('');

            detailsDiv.innerHTML = `
            <div class="mb-3">Número de Amostras: <strong>${numAmostras}</strong></div>
            <table class="result-table">
                <thead>
                    <tr>
                        <th>Amostra</th>
                        <th>Peso (kg)</th>
                        <th>Diferença da Média</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                    <tr class="table-active">
                        <td><strong>Total</strong></td>
                        <td><strong>${formatNumber(somaTara)}</strong></td>
                        <td></td>
                    </tr>
                    <tr class="table-active">
                        <td><strong>Média</strong></td>
                        <td><strong>${formatNumber(mediaTara)}</strong></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        `;

            recomendacaoDiv.innerHTML = `
            <i class="fas fa-lightbulb me-2"></i>
            <strong>Recomendação:</strong> Utilize a Tara ${taraValues.indexOf(melhorTara) + 1}
            (${formatNumber(melhorTara)} kg) como referência, pois é a mais próxima da média calculada.
        `;

            resultadoDiv.classList.remove('d-none');
            resultadoDiv.classList.add('fade-in');
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Função Limpar Tara Atualizada
    document.getElementById('limparTara').addEventListener('click', function () {
        // Limpa todos os campos de tara (1-10)
        for (let i = 1; i <= 10; i++) {
            document.getElementById(`tara${i}`).value = '';
        }
        // Volta para 5 amostras padrão
        document.getElementById('5amostras').checked = true;
        document.getElementById('10amostrasFields').classList.add('d-none');

        // Limpa resultados
        document.getElementById('resultadoTara').classList.add('d-none');
        document.getElementById('taraDetails').innerHTML = '';
        document.getElementById('taraRecomendacao').innerHTML = '';
    });

    // Formulário de Peso
    const pesoForm = document.getElementById('pesoForm');
    if (pesoForm) {
        pesoForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const pesoValues = [
                parseFloat(document.getElementById('peso1').value),
                parseFloat(document.getElementById('peso2').value),
                parseFloat(document.getElementById('peso3').value),
                parseFloat(document.getElementById('peso4').value),
                parseFloat(document.getElementById('peso5').value)
            ];
            const pesoPadrao = parseFloat(document.getElementById('pesoPadrao').value);

            const somaPeso = pesoValues.reduce((a, b) => a + b, 0);
            const mediaPeso = somaPeso / 5;
            const margem = pesoPadrao * 0.01;
            const aprovado = Math.abs(mediaPeso - pesoPadrao) <= margem;

            const resultadoDiv = document.getElementById('resultadoPeso');
            const detailsDiv = document.getElementById('pesoDetails');
            const statusDiv = document.getElementById('pesoStatus');

            const formatNumber = num => num.toFixed(2).replace('.', ',');

            detailsDiv.innerHTML = `
                <table class="result-table">
                    <thead>
                        <tr>
                            <th>Amostra</th>
                            <th>Peso (kg)</th>
                            <th>Diferença do Padrão</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pesoValues.map((peso, index) => `
                            <tr>
                                <td>Peso ${index + 1}</td>
                                <td>${formatNumber(peso)}</td>
                                <td>${formatNumber(peso - pesoPadrao)}</td>
                            </tr>
                        `).join('')}
                        <tr class="table-active">
                            <td><strong>Total</strong></td>
                            <td><strong>${formatNumber(somaPeso)}</strong></td>
                            <td></td>
                        </tr>
                        <tr class="table-active">
                            <td><strong>Média</strong></td>
                            <td><strong>${formatNumber(mediaPeso)}</strong></td>
                            <td></td>
                        </tr>
                        <tr class="table-active">
                            <td><strong>Padrão Esperado</strong></td>
                            <td><strong>${formatNumber(pesoPadrao)}</strong></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            `;

            if (aprovado) {
                statusDiv.innerHTML = `<span class="text-success"><i class="fas fa-check-circle me-2"></i>PESO APROVADO - Dentro do padrão esperado</span>`;
                resultadoDiv.style.borderLeftColor = 'var(--success-color)';
            } else {
                statusDiv.innerHTML = `<span class="text-danger"><i class="fas fa-times-circle me-2"></i>PESO REPROVADO - Fora do padrão esperado</span>`;
                resultadoDiv.style.borderLeftColor = 'var(--danger-color)';
            }

            resultadoDiv.classList.remove('d-none');
            resultadoDiv.classList.add('fade-in');
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Formulário de Validade
    const validadeForm = document.getElementById('validadeForm');
    if (validadeForm) {
        validadeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const dataProducao = new Date(document.getElementById('dataProducao').value);
            const mesesValidade = parseInt(document.getElementById('mesesValidade').value);
            const dataValidade = new Date(dataProducao);
            dataValidade.setMonth(dataValidade.getMonth() + mesesValidade);

            if (isNaN(dataProducao.getTime()) || isNaN(dataValidade.getTime())) {
                alert('Por favor, insira uma data válida.');
                return;
            }

            const resultadoDiv = document.getElementById('resultadoValidade');
            const detailsDiv = document.getElementById('validadeDetails');

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
            resultadoDiv.style.borderLeftColor = 'var(--primary-color)';
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Funções para limpar formulários
    function limparFormulario(formId, resultadoId, detalhesId = null, statusId = null) {
        document.getElementById(formId).reset();
        document.getElementById(resultadoId).classList.add('d-none');
        if (detalhesId) document.getElementById(detalhesId).innerHTML = '';
        if (statusId) document.getElementById(statusId).innerHTML = '';
    }

    document.getElementById('limparTara').addEventListener('click', function () {
        limparFormulario('taraForm', 'resultadoTara', 'taraDetails', 'taraRecomendacao');
    });

    document.getElementById('limparPeso').addEventListener('click', function () {
        limparFormulario('pesoForm', 'resultadoPeso', 'pesoDetails', 'pesoStatus');
    });

    document.getElementById('limparValidade').addEventListener('click', function () {
        limparFormulario('validadeForm', 'resultadoValidade', 'validadeDetails');
    });
});