document.addEventListener('DOMContentLoaded', function () {
    // Atualiza o ano no footer
    document.getElementById('ano-atual').textContent = new Date().getFullYear();

    // Mapeamento de letras para validade
    const mapeamentoLetras = {
        // Linhas de Produção
        linhas: {
            'S01': 'A', 'S03': 'B', 'S05': 'C', 'S08': 'D', 'S10': 'E',
            'S11': 'F', 'S12': 'G', 'S14': 'H', 'D11': 'K', 'D12': 'L',
            'A01': 'M', 'A02': 'T', 'A03': 'O', 'A04': 'P', 'A07': 'S',
            'A06': 'X', 'A08': 'Z'
        },

        // Meses
        meses: {
            1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F',
            7: 'G', 8: 'H', 9: 'I', 10: 'J', 11: 'K', 12: 'L'
        },

        // Anos
        anos: {
            2021: 'E', 2022: 'F', 2023: 'G', 2024: 'H', 2025: 'I',
            2026: 'J', 2027: 'K', 2028: 'L', 2029: 'M', 2030: 'N',
            2031: 'O', 2032: 'P', 2033: 'Q', 2034: 'R', 2035: 'S'
        }
    };

    // ==================== CONTROLE DE TEMA ====================
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.querySelector('.theme-label');
    const html = document.documentElement;

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeLabel.textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
    }

    // Verificar preferência de tema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    themeToggle.addEventListener('click', () => {
        const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // ==================== NAVEGAÇÃO ====================
    function setupNavigation() {
        // Atualiza menu ativo conforme scroll
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

        // Scroll suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    if (history.pushState) {
                        history.pushState(null, null, this.getAttribute('href'));
                    }
                }
            });
        });

        window.addEventListener('scroll', updateActiveMenu);
        updateActiveMenu();
    }
    setupNavigation();

    // ==================== TARA ====================
    // Controle de exibição dos campos
    document.querySelectorAll('input[name="qtdAmostras"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const show10Amostras = this.id === '10amostras';
            document.getElementById('10amostrasFields').classList.toggle('d-none', !show10Amostras);

            for (let i = 6; i <= 10; i++) {
                const input = document.getElementById(`tara${i}`);
                input.required = show10Amostras;
                if (!show10Amostras) input.value = '';
            }
        });
    });

    // Formulário de Tara
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

            // Encontrar melhor tara
            const melhorTara = taraValues.reduce((prev, curr) =>
                Math.abs(curr - mediaTara) < Math.abs(prev - mediaTara) ? curr : prev
            );

            // Exibir resultados
            const resultadoDiv = document.getElementById('resultadoTara');
            const detailsDiv = document.getElementById('taraDetails');
            const recomendacaoDiv = document.getElementById('taraRecomendacao');

            const formatNumber = num => num.toFixed(2).replace('.', ',');

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
                (${formatNumber(melhorTara)} kg) como referência.
            `;

            resultadoDiv.classList.remove('d-none');
            resultadoDiv.classList.add('fade-in');
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // ==================== PESO ====================
    // Formulário de Peso Atualizado
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

            // Validar
            if (pesoValues.some(isNaN) || isNaN(pesoPadrao)) {
                alert('Por favor, preencha todos os campos corretamente.');
                return;
            }

            // Calcular
            const somaPeso = pesoValues.reduce((a, b) => a + b, 0);
            const mediaPeso = somaPeso / 5;
            const diferenca = mediaPeso - pesoPadrao; // Diferença entre MÉDIA e Padrão
            const margem = pesoPadrao * 0.01;

            // Verificar aprovação
            const aprovado = Math.abs(diferenca) <= margem;
            const precisaAjuste = Math.abs(diferenca) > margem;

            // Exibir resultados
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
                        <th>Diferença</th>
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
                        <td><strong>Média</strong></td>
                        <td><strong>${formatNumber(mediaPeso)}</strong></td>
                        <td></td>
                    </tr>
                    <tr class="table-active">
                        <td><strong>Padrão Esperado</strong></td>
                        <td><strong>${formatNumber(pesoPadrao)}</strong></td>
                        <td></td>
                    </tr>
                    <tr class="${diferenca > 0 ? 'table-warning' : 'table-info'}">
                        <td><strong>Diferença (Média - Padrão)</strong></td>
                        <td colspan="2"><strong>${formatNumber(diferenca)} kg</strong></td>
                    </tr>
                </tbody>
            </table>
        `;

            if (aprovado) {
                statusDiv.innerHTML = '<span class="text-success"><i class="fas fa-check-circle me-2"></i>PESO APROVADO</span>';
                resultadoDiv.style.borderLeftColor = 'var(--success-color)';
            } else {
                statusDiv.innerHTML = '<span class="text-danger"><i class="fas fa-times-circle me-2"></i>PESO REPROVADO</span>';
                resultadoDiv.style.borderLeftColor = 'var(--danger-color)';
            }

            // Alerta para operador
            if (precisaAjuste) {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-warning mt-3';
                alertDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>ATENÇÃO OPERADOR:</strong> Diferença de ${formatNumber(diferenca)} kg.
                ${diferenca > 0 ? 'Reduzir peso na máquina' : 'Aumentar peso na máquina'}.
            `;
                detailsDiv.appendChild(alertDiv);
            }

            resultadoDiv.classList.remove('d-none');
            resultadoDiv.classList.add('fade-in');
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // ==================== VALIDADE ====================
    const validadeForm = document.getElementById('validadeForm');
    if (validadeForm) {
        validadeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const linha = document.getElementById('linhaProduto').value;
            const mes = parseInt(document.getElementById('mesValidade').value);
            const ano = parseInt(document.getElementById('anoValidade').value);
            const tempoValidade = parseInt(document.getElementById('tempoValidade').value);
            const hora = document.getElementById('horaProducao').value;

            // Validar
            if (!linha || !mes || !ano || !hora) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            // Calcular datas
            const hoje = new Date();
            const diaAtual = hoje.getDate();
            const dataProducao = new Date(ano, mes - 1, diaAtual);
            const dataValidade = new Date(dataProducao);
            dataValidade.setMonth(dataValidade.getMonth() + tempoValidade);

            // Verificar validade
            const aprovado = dataValidade > hoje;

            // Gerar código
            const letraLinha = mapeamentoLetras.linhas[linha];
            const letraMes = mapeamentoLetras.meses[mes];
            const letraAno = mapeamentoLetras.anos[ano];
            const horaFormatada = hora.replace(':', '');

            const codigoValidade = `V:${(dataValidade.getMonth() + 1).toString().padStart(2, '0')}/${dataValidade.getFullYear()} L:V${letraLinha}${letraMes}${diaAtual.toString().padStart(2, '0')}${horaFormatada}${letraAno}`;

            // Exibir resultados
            const resultadoDiv = document.getElementById('resultadoValidade');
            const detailsDiv = document.getElementById('validadeDetails');
            const statusDiv = document.getElementById('validadeStatus');
            const codigoDiv = document.getElementById('codigoValidade');

            const formatDate = (date) => {
                const mes = (date.getMonth() + 1).toString().padStart(2, '0');
                return `${mes}/${date.getFullYear()}`;
            };

            detailsDiv.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Data de Produção:</strong> ${formatDate(dataProducao)}</p>
                        <p><strong>Validade:</strong> ${tempoValidade} meses</p>
                        <p><strong>Data de Validade:</strong> ${formatDate(dataValidade)}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Linha:</strong> ${linha} (${letraLinha})</p>
                        <p><strong>Mês:</strong> ${mes} (${letraMes})</p>
                        <p><strong>Ano:</strong> ${ano} (${letraAno})</p>
                    </div>
                </div>
            `;

            if (aprovado) {
                statusDiv.innerHTML = '<span class="text-success"><i class="fas fa-check-circle me-2"></i>PRODUTO APROVADO</span>';
                resultadoDiv.style.borderLeftColor = 'var(--success-color)';
            } else {
                statusDiv.innerHTML = '<span class="text-danger"><i class="fas fa-times-circle me-2"></i>PRODUTO REPROVADO (CRQS/PQS)</span>';
                resultadoDiv.style.borderLeftColor = 'var(--danger-color)';
            }

            codigoDiv.textContent = codigoValidade;
            resultadoDiv.classList.remove('d-none');
            resultadoDiv.classList.add('fade-in');
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // ==================== FUNÇÕES LIMPAR ====================
    document.getElementById('limparTara').addEventListener('click', function () {
        for (let i = 1; i <= 10; i++) {
            document.getElementById(`tara${i}`).value = '';
        }
        document.getElementById('5amostras').checked = true;
        document.getElementById('10amostrasFields').classList.add('d-none');
        document.getElementById('resultadoTara').classList.add('d-none');
    });

    document.getElementById('limparPeso').addEventListener('click', function () {
        for (let i = 1; i <= 5; i++) {
            document.getElementById(`peso${i}`).value = '';
        }
        document.getElementById('pesoPadrao').value = '';
        document.getElementById('resultadoPeso').classList.add('d-none');
    });

    document.getElementById('limparValidade').addEventListener('click', function () {
        document.getElementById('validadeForm').reset();
        document.getElementById('resultadoValidade').classList.add('d-none');
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // ==================== CALCULADORA DE TANQUE ====================
    const calculadoraForm = document.getElementById('calculadoraForm');
    if (calculadoraForm) {
        calculadoraForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const massaTanque = parseFloat(document.getElementById('massaTanque').value);
            const pesoPadrao = parseFloat(document.getElementById('pesoPadrao').value);
            const tipoEmbalagem = document.getElementById('tipoEmbalagem').value;
            const quantidadeEmbalagem = parseInt(document.getElementById('quantidadeEmbalagem').value);

            if (isNaN(massaTanque) || isNaN(pesoPadrao) || isNaN(quantidadeEmbalagem) || pesoPadrao <= 0) {
                alert('Por favor, preencha todos os campos corretamente.');
                return;
            }

            // Cálculos
            const totalUnidades = Math.floor(massaTanque / pesoPadrao);
            const totalEmbalagens = Math.floor(totalUnidades / quantidadeEmbalagem);
            const unidadesRestantes = totalUnidades % quantidadeEmbalagem;

            // Nomes das embalagens
            const nomesEmbalagem = {
                'frasco': 'Frasco(s)',
                'tampa': 'Tampa(s)',
                'bandeja': 'Bandeja(s)',
                'caixa': 'Caixa(s)',
                'palete': 'Palete(s)'
            };

            const resultadoDiv = document.getElementById('resultadoCalculadora');
            const detailsDiv = document.getElementById('calculadoraDetails');

            const formatNumber = num => num.toFixed(0).replace('.', ',');

            detailsDiv.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Massa no Tanque:</strong> ${massaTanque.toFixed(3)} kg</p>
                        <p><strong>Peso Padrão:</strong> ${pesoPadrao.toFixed(3)} kg</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Total de Unidades:</strong> ${formatNumber(totalUnidades)}</p>
                        <p><strong>${nomesEmbalagem[tipoEmbalagem]}:</strong> ${formatNumber(totalEmbalagens)}</p>
                        ${unidadesRestantes > 0 ? `<p><strong>Unidades Restantes:</strong> ${formatNumber(unidadesRestantes)}</p>` : ''}
                    </div>
                </div>
                <div class="alert alert-success mt-3">
                    <i class="fas fa-boxes me-2"></i>
                    <strong>Produção:</strong> ${formatNumber(totalEmbalagens)} ${nomesEmbalagem[tipoEmbalagem]}
                    + ${formatNumber(unidadesRestantes)} unidades avulsas
                </div>
            `;

            resultadoDiv.classList.remove('d-none');
            resultadoDiv.classList.add('fade-in');
        });
    }

    // ==================== TROCA DE VARIANTE ====================
    const varianteForm = document.getElementById('varianteForm');
    if (varianteForm) {
        varianteForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const varianteAtual = document.getElementById('varianteAtual').value;
            const varianteNova = document.getElementById('varianteNova').value;
            const massaDisponivel = parseFloat(document.getElementById('massaDisponivel').value);
            const tempoTroca = parseInt(document.getElementById('tempoTroca').value);

            if (!varianteAtual || !varianteNova || isNaN(massaDisponivel) || isNaN(tempoTroca)) {
                alert('Por favor, preencha todos os campos corretamente.');
                return;
            }

            // Pesos padrão por variante (kg)
            const pesosVariantes = {
                '300ml': 0.175,
                '500ml': 0.285,
                '750ml': 0.425,
                '1L': 0.560
            };

            const pesoAtual = pesosVariantes[varianteAtual];
            const pesoNovo = pesosVariantes[varianteNova];

            const unidadesNovas = Math.floor(massaDisponivel / pesoNovo);
            const diferencaPeso = pesoNovo - pesoAtual;

            const resultadoDiv = document.getElementById('resultadoVariante');
            const detailsDiv = document.getElementById('varianteDetails');
            const tempoDiv = document.getElementById('varianteTempo');

            detailsDiv.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Variante Atual:</strong> ${varianteAtual}</p>
                        <p><strong>Peso Unitário:</strong> ${pesoAtual.toFixed(3)} kg</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Nova Variante:</strong> ${varianteNova}</p>
                        <p><strong>Peso Unitário:</strong> ${pesoNovo.toFixed(3)} kg</p>
                    </div>
                </div>
                <div class="alert ${diferencaPeso > 0 ? 'alert-warning' : 'alert-info'} mt-3">
                    <i class="fas ${diferencaPeso > 0 ? 'fa-arrow-up' : 'fa-arrow-down'} me-2"></i>
                    <strong>Diferença de Peso:</strong> ${Math.abs(diferencaPeso).toFixed(3)} kg
                    (${diferencaPeso > 0 ? 'aumento' : 'redução'})
                </div>
            `;

            tempoDiv.innerHTML = `
                <i class="fas fa-clock me-2"></i>
                <strong>Tempo de Troca:</strong> ${tempoTroca} minutos |
                <strong>Produção Nova:</strong> ${unidadesNovas} unidades
            `;

            resultadoDiv.classList.remove('d-none');
            resultadoDiv.classList.add('fade-in');
        });
    }

    // ==================== FUNÇÕES LIMPAR ====================
    document.getElementById('limparCalculadora')?.addEventListener('click', function () {
        document.getElementById('calculadoraForm').reset();
        document.getElementById('resultadoCalculadora').classList.add('d-none');
    });

    document.getElementById('limparVariante')?.addEventListener('click', function () {
        document.getElementById('varianteForm').reset();
        document.getElementById('resultadoVariante').classList.add('d-none');
    });
});