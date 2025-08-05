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
    const taraForm = document.getElementById('taraForm');
    if (taraForm) {
        taraForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const taraValues = [
                parseFloat(document.getElementById('tara1').value),
                parseFloat(document.getElementById('tara2').value),
                parseFloat(document.getElementById('tara3').value),
                parseFloat(document.getElementById('tara4').value),
                parseFloat(document.getElementById('tara5').value)
            ];

            const somaTara = taraValues.reduce((a, b) => a + b, 0);
            const mediaTara = somaTara / 5;
            const melhorTara = taraValues.reduce((prev, curr) =>
                Math.abs(curr - mediaTara) < Math.abs(prev - mediaTara) ? curr : prev
            );

            const resultadoDiv = document.getElementById('resultadoTara');
            const detailsDiv = document.getElementById('taraDetails');
            const recomendacaoDiv = document.getElementById('taraRecomendacao');

            const formatNumber = num => num.toFixed(2).replace('.', ',');

            detailsDiv.innerHTML = `
                <table class="result-table">
                    <thead>
                        <tr>
                            <th>Amostra</th>
                            <th>Peso (kg)</th>
                            <th>Diferença da Média</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${taraValues.map((tara, index) => `
                            <tr ${tara === melhorTara ? 'class="table-success"' : ''}>
                                <td>Tara ${index + 1}</td>
                                <td>${formatNumber(tara)}</td>
                                <td>${formatNumber(tara - mediaTara)}</td>
                            </tr>
                        `).join('')}
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
    // Mapeamento de letras
    const mapeamentoLetras = {
        // Linhas de produção
        linhas: {
            Hair: {
                "S01": "A", "S03": "B", "S05": "C", "S08": "D",
                "S10": "E", "S11": "F", "S12": "G", "S14": "H"
            },
            Deo: {
                "D11": "K", "D12": "L"
            },
            HC: {
                "A01": "M", "A02": "T", "A03": "O", "A04": "P",
                "A07": "S", "A06": "X", "A08": "Z"
            }
        },

        // Meses
        meses: {
            1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F",
            7: "G", 8: "H", 9: "I", 10: "J", 11: "K", 12: "L"
        },

        // Anos
        anos: {
            2021: "E", 2022: "F", 2023: "G", 2024: "H", 2025: "I",
            2026: "J", 2027: "K", 2028: "L", 2029: "M", 2030: "N",
            2031: "O", 2032: "P", 2033: "Q", 2034: "R", 2035: "S"
        }
    };

    // Carregar linhas de produção conforme tipo selecionado
    document.getElementById('tipoProduto').addEventListener('change', function () {
        const tipo = this.value;
        const linhaSelect = document.getElementById('linhaProducao');

        linhaSelect.innerHTML = '<option value="" selected disabled>Selecione</option>';
        linhaSelect.disabled = !tipo;

        if (tipo) {
            const linhas = mapeamentoLetras.linhas[tipo];
            for (const [codigo, letra] of Object.entries(linhas)) {
                const option = document.createElement('option');
                option.value = codigo;
                option.textContent = `${codigo} (${letra})`;
                linhaSelect.appendChild(option);
            }
        }
    });

    // Formulário de Validade Atualizado
    const validadeForm = document.getElementById('validadeForm');
    if (validadeForm) {
        validadeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Obter valores
            const tipoProduto = document.getElementById('tipoProduto').value;
            const linhaProducao = document.getElementById('linhaProducao').value;
            const mesProducao = parseInt(document.getElementById('mesProducao').value);
            const anoProducao = parseInt(document.getElementById('anoProducao').value);
            const validadeMeses = parseInt(document.getElementById('validadeMeses').value);

            // Validar dados
            if (!tipoProduto || !linhaProducao || isNaN(mesProducao) || isNaN(anoProducao) || isNaN(validadeMeses)) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            // Calcular data de validade
            const dataProducao = new Date(anoProducao, mesProducao - 1);
            const dataValidade = new Date(dataProducao);
            dataValidade.setMonth(dataValidade.getMonth() + validadeMeses);

            // Verificar se a validade já expirou
            const hoje = new Date();
            const expirado = dataValidade < hoje;

            // Obter letras do código
            const letraLinha = mapeamentoLetras.linhas[tipoProduto][linhaProducao];
            const letraMes = mapeamentoLetras.meses[mesProducao];
            const letraAno = mapeamentoLetras.anos[anoProducao];
            const codigoValidade = `${letraLinha}${letraMes}${letraAno}`;

            // Exibir resultados
            const resultadoDiv = document.getElementById('resultadoValidade');
            const detailsDiv = document.getElementById('validadeDetails');
            const statusDiv = document.getElementById('validadeStatus');
            const codigoDiv = document.getElementById('codigoValidade');

            // Formatar datas
            const formatDate = (date) => {
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                return `${month.toString().padStart(2, '0')}/${year}`;
            };

            detailsDiv.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Tipo de Produto:</strong> ${tipoProduto}</p>
                    <p><strong>Linha de Produção:</strong> ${linhaProducao} (${letraLinha})</p>
                    <p><strong>Mês/Ano Produção:</strong> ${formatDate(dataProducao)}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Validade:</strong> ${validadeMeses} meses</p>
                    <p><strong>Data Validade:</strong> ${formatDate(dataValidade)}</p>
                    <p><strong>Status:</strong> ${expirado ? 'Expirado' : 'Válido'}</p>
                </div>
            </div>
        `;

            codigoDiv.innerHTML = `
            <h6>Código de Validade</h6>
            <div class="display-4 fw-bold">${codigoValidade}</div>
            <small>${letraLinha} (Linha) + ${letraMes} (Mês) + ${letraAno} (Ano)</small>
        `;

            if (expirado) {
                statusDiv.innerHTML = `
                <div class="alert alert-danger d-flex align-items-center">
                    <i class="fas fa-exclamation-triangle me-3 fs-4"></i>
                    <div>
                        <h5 class="alert-heading mb-1">REPROVADO - CRQS/PQS</h5>
                        <p class="mb-0">Produto com validade expirada. Bloquear lote.</p>
                    </div>
                </div>
            `;
                codigoDiv.classList.add('bg-danger', 'text-white');
                codigoDiv.classList.remove('bg-light');
            } else {
                statusDiv.innerHTML = `
                <div class="alert alert-success d-flex align-items-center">
                    <i class="fas fa-check-circle me-3 fs-4"></i>
                    <div>
                        <h5 class="alert-heading mb-1">APROVADO</h5>
                        <p class="mb-0">Produto dentro do prazo de validade.</p>
                    </div>
                </div>
            `;
                codigoDiv.classList.add('bg-success', 'text-white');
                codigoDiv.classList.remove('bg-light');
            }

            resultadoDiv.classList.remove('d-none');
            resultadoDiv.classList.add('fade-in');
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Função Limpar Validade
    document.getElementById('limparValidade').addEventListener('click', function () {
        document.getElementById('validadeForm').reset();
        document.getElementById('linhaProducao').disabled = true;
        document.getElementById('linhaProducao').innerHTML = '<option value="" selected disabled>Selecione o tipo primeiro</option>';

        const resultadoDiv = document.getElementById('resultadoValidade');
        resultadoDiv.classList.add('d-none');
        resultadoDiv.querySelector('#validadeDetails').innerHTML = '';
        resultadoDiv.querySelector('#validadeStatus').innerHTML = '';
        resultadoDiv.querySelector('#codigoValidade').innerHTML = '';
        resultadoDiv.querySelector('#codigoValidade').classList.remove('bg-danger', 'bg-success', 'text-white');
        resultadoDiv.querySelector('#codigoValidade').classList.add('bg-light');
    });
});