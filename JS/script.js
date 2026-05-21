// ==================== SCRIPT.JS COMPLETO ATUALIZADO ====================

document.addEventListener('DOMContentLoaded', function () {
    // Atualiza o ano no footer
    document.getElementById('ano-atual').textContent = new Date().getFullYear();

    // Mapeamento de letras para validade
    const mapeamentoLetras = {
        linhas: {
            'S01': 'A', 'S03': 'B', 'S05': 'C', 'S08': 'D', 'S10': 'E',
            'S11': 'F', 'S12': 'G', 'S14': 'H', 'D11': 'K', 'D12': 'L',
            'A01': 'M', 'A02': 'T', 'A03': 'O', 'A04': 'P', 'A07': 'S',
            'A06': 'X', 'A08': 'Z'
        },
        meses: {
            1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F',
            7: 'G', 8: 'H', 9: 'I', 10: 'J', 11: 'K', 12: 'L'
        },
        anos: {
            2021: 'E', 2022: 'F', 2023: 'G', 2024: 'H', 2025: 'I',
            2026: 'J', 2027: 'K', 2028: 'L', 2029: 'M', 2030: 'N',
            2031: 'O', 2032: 'P', 2033: 'Q', 2034: 'R', 2035: 'S'
        }
    };

    // ==================== NAVEGAÇÃO ====================
    function setupNavigation() {
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

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });

        window.addEventListener('scroll', updateActiveMenu);
        updateActiveMenu();
    }
    setupNavigation();

    // ==================== FUNÇÕES AUXILIARES ====================
    function validarNumero(valor, nome) {
        if (isNaN(valor) || valor < 0) {
            throw new Error(`${nome} deve ser um número válido e não negativo.`);
        }
    }

    function formatarNumero(num) {
        return num.toFixed(2).replace('.', ',');
    }

    function mostrarAlerta(tipo, titulo, mensagem) {
        const alertaDiv = document.createElement('div');
        alertaDiv.className = `alert alert-${tipo} mt-3`;
        alertaDiv.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            <strong>${titulo}:</strong> ${mensagem}
        `;
        return alertaDiv;
    }

    function getDiasNoMes(ano, mes) {
        return new Date(ano, mes, 0).getDate();
    }

    // ==================== TARA (mantido igual) ====================
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

    const taraForm = document.getElementById('taraForm');
    if (taraForm) {
        taraForm.addEventListener('submit', function (e) {
            e.preventDefault();
            try {
                const use10Amostras = document.getElementById('10amostras').checked;
                const numAmostras = use10Amostras ? 10 : 5;
                const taraValues = [];

                for (let i = 1; i <= numAmostras; i++) {
                    const valor = parseFloat(document.getElementById(`tara${i}`).value);
                    validarNumero(valor, `Tara Amostra ${i}`);
                    taraValues.push(valor);
                }

                const somaTara = taraValues.reduce((a, b) => a + b, 0);
                const mediaTara = somaTara / numAmostras;
                const melhorTara = taraValues.reduce((prev, curr) =>
                    Math.abs(curr - mediaTara) < Math.abs(prev - mediaTara) ? curr : prev
                );
                const variancia = taraValues.reduce((acc, curr) => acc + Math.pow(curr - mediaTara, 2), 0) / numAmostras;
                const desvioPadrao = Math.sqrt(variancia);

                const resultadoDiv = document.getElementById('resultadoTara');
                const detailsDiv = document.getElementById('taraDetails');
                const recomendacaoDiv = document.getElementById('taraRecomendacao');

                detailsDiv.innerHTML = `
                    <div class="mb-3">
                        <strong>Número de Amostras:</strong> ${numAmostras}<br>
                        <strong>Desvio Padrão:</strong> ${formatarNumero(desvioPadrao)} kg
                    </div>
                    <table class="result-table">
                        <thead>
                            <tr>
                                <th>Amostra</th>
                                <th>Peso (kg)</th>
                                <th>Diferença da Média</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${taraValues.map((tara, index) => {
                    const diferenca = tara - mediaTara;
                    const isRecomendada = tara === melhorTara;
                    return `
                                    <tr ${isRecomendada ? 'class="table-success"' : ''}>
                                        <td>Tara ${index + 1}</td>
                                        <td>${formatarNumero(tara)}</td>
                                        <td>${diferenca >= 0 ? '+' : ''}${formatarNumero(diferenca)}</td>
                                        <td>${isRecomendada ? '<i class="fas fa-star text-warning"></i> Recomendada' : ''}</td>
                                    </tr>
                                `;
                }).join('')}
                            <tr class="table-active">
                                <td><strong>Total</strong></td>
                                <td><strong>${formatarNumero(somaTara)}</strong></td>
                                <td></td><td></td>
                            </tr>
                            <tr class="table-active">
                                <td><strong>Média</strong></td>
                                <td><strong>${formatarNumero(mediaTara)}</strong></td>
                                <td></td><td></td>
                            </tr>
                        </tbody>
                    </table>
                `;

                const indiceTara = taraValues.indexOf(melhorTara) + 1;
                const qualidadeAvaliacao = desvioPadrao < 0.01 ? 'Excelente' :
                    desvioPadrao < 0.03 ? 'Boa' : 'Precisa melhorar';

                recomendacaoDiv.innerHTML = `
                    <i class="fas fa-lightbulb me-2"></i>
                    <strong>Recomendação:</strong> Utilize a Tara ${indiceTara}
                    (${formatarNumero(melhorTara)} kg) como referência.<br>
                    <strong>Qualidade das amostras:</strong> ${qualidadeAvaliacao}
                    (Desvio: ${formatarNumero(desvioPadrao)} kg)
                `;

                resultadoDiv.classList.remove('d-none');
                resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            } catch (error) {
                alert(`Erro: ${error.message}`);
            }
        });
    }

    // ==================== PESO (mantido igual) ====================
    const pesoForm = document.getElementById('pesoForm');
    if (pesoForm) {
        pesoForm.addEventListener('submit', function (e) {
            e.preventDefault();
            try {
                const pesoValues = [];
                for (let i = 1; i <= 5; i++) {
                    const valor = parseFloat(document.getElementById(`peso${i}`).value);
                    validarNumero(valor, `Peso Amostra ${i}`);
                    pesoValues.push(valor);
                }

                const pesoPadrao = parseFloat(document.getElementById('pesoPadrao').value);
                validarNumero(pesoPadrao, 'Peso Padrão');

                const somaPeso = pesoValues.reduce((a, b) => a + b, 0);
                const mediaPeso = somaPeso / 5;
                const diferenca = mediaPeso - pesoPadrao;
                const margem = pesoPadrao * 0.01;
                const aprovado = Math.abs(diferenca) <= margem;
                const variancia = pesoValues.reduce((acc, curr) => acc + Math.pow(curr - mediaPeso, 2), 0) / 5;
                const desvioPadrao = Math.sqrt(variancia);

                const resultadoDiv = document.getElementById('resultadoPeso');
                const detailsDiv = document.getElementById('pesoDetails');
                const statusDiv = document.getElementById('pesoStatus');

                detailsDiv.innerHTML = `
                    <div class="mb-3">
                        <strong>Tolerância permitida:</strong> ±${formatarNumero(margem)} kg (1%)<br>
                        <strong>Desvio padrão das amostras:</strong> ${formatarNumero(desvioPadrao)} kg
                    </div>
                    <table class="result-table">
                        <thead>
                            <tr>
                                <th>Amostra</th>
                                <th>Peso (kg)</th>
                                <th>Diferença do Padrão</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pesoValues.map((peso, index) => {
                    const diff = peso - pesoPadrao;
                    const dentroMargem = Math.abs(diff) <= margem;
                    return `
                                    <tr class="${dentroMargem ? 'table-success' : 'table-warning'}">
                                        <td>Peso ${index + 1}</td>
                                        <td>${formatarNumero(peso)}</td>
                                        <td>${diff >= 0 ? '+' : ''}${formatarNumero(diff)}</td>
                                        <td>${dentroMargem ? '<i class="fas fa-check text-success"></i> OK' : '<i class="fas fa-exclamation-triangle text-warning"></i> Fora'}</td>
                                    </tr>
                                `;
                }).join('')}
                            <tr class="table-active">
                                <td><strong>Média das Amostras</strong></td>
                                <td><strong>${formatarNumero(mediaPeso)}</strong></td>
                                <td></td><td></td>
                            </tr>
                            <tr class="table-active">
                                <td><strong>Padrão Esperado</strong></td>
                                <td><strong>${formatarNumero(pesoPadrao)}</strong></td>
                                <td></td><td></td>
                            </tr>
                            <tr class="${diferenca > 0 ? 'table-warning' : diferenca < 0 ? 'table-info' : 'table-success'}">
                                <td><strong>Diferença Total</strong></td>
                                <td colspan="3">
                                    <strong>${diferenca >= 0 ? '+' : ''}${formatarNumero(diferenca)} kg</strong>
                                    ${aprovado ? ' (Dentro da tolerância)' : ' (Fora da tolerância)'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                `;

                if (aprovado) {
                    statusDiv.innerHTML = '<span class="text-success"><i class="fas fa-check-circle me-2"></i>PESO APROVADO</span>';
                } else {
                    statusDiv.innerHTML = '<span class="text-danger"><i class="fas fa-times-circle me-2"></i>PESO REPROVADO</span>';
                    const recomendacao = diferenca > 0 ? 'Reduzir o peso na máquina de envase' : 'Aumentar o peso na máquina de envase';
                    const alertDiv = mostrarAlerta('warning', 'ATENÇÃO - OPERADOR',
                        `Diferença de ${formatarNumero(Math.abs(diferenca))} kg. ${recomendacao}.`);
                    detailsDiv.appendChild(alertDiv);
                }

                resultadoDiv.classList.remove('d-none');
                resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            } catch (error) {
                alert(`Erro: ${error.message}`);
            }
        });
    }

    // ==================== VALIDADE - ATUALIZADA (NOVO FORMATO) ====================
    const validadeForm = document.getElementById('validadeForm');
    if (validadeForm) {
        validadeForm.addEventListener('submit', function (e) {
            e.preventDefault();
            try {
                const linha = document.getElementById('linhaProduto').value;
                const mes = parseInt(document.getElementById('mesValidade').value);
                const ano = parseInt(document.getElementById('anoValidade').value);
                const tempoValidade = parseInt(document.getElementById('tempoValidade').value);
                const hora = document.getElementById('horaProducao').value;

                if (!linha || !mes || !ano || !hora) throw new Error('Todos os campos são obrigatórios.');

                const hoje = new Date();
                const diaAtual = hoje.getDate();
                const diasNoMesSelecionado = getDiasNoMes(ano, mes);
                const diaProducao = Math.min(diaAtual, diasNoMesSelecionado);

                const dataProducao = new Date(ano, mes - 1, diaProducao);
                const dataValidade = new Date(dataProducao);
                dataValidade.setMonth(dataValidade.getMonth() + tempoValidade);

                if (dataProducao > hoje) throw new Error('A data de produção não pode ser futura.');

                const aprovado = dataValidade > hoje;
                const diasRestantes = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));

                const letraLinha = mapeamentoLetras.linhas[linha] || '?';
                const letraMes = mapeamentoLetras.meses[mes];
                const letraAno = mapeamentoLetras.anos[ano];
                const horaFormatada = hora.replace(':', '');

                const mesProdStr = mes.toString().padStart(2, '0');
                const mesValStr = (dataValidade.getMonth() + 1).toString().padStart(2, '0');
                const anoValStr = dataValidade.getFullYear().toString().slice(-2);

                let codigoTexto = '';
                let codigoHTML = '';

                // === LÓGICA POR TIPO DE LINHA ===
                if (['S01', 'S03', 'S05', 'S08', 'S11', 'S12', 'S14'].includes(linha)) {
                    codigoTexto = `L VHE ${diaProducao.toString().padStart(2, '0')} ${horaFormatada} ${letraAno}\nV ${mesValStr}/${anoValStr}`;
                    codigoHTML = `
                        <div><strong>Linha:</strong> <code>L VHE ${diaProducao.toString().padStart(2, '0')} ${horaFormatada} ${letraAno}</code></div>
                        <div><strong>Validade:</strong> <code>V ${mesValStr}/${anoValStr}</code></div>
                    `;

                } else if (linha === 'S10') {
                    codigoTexto = `V ${mesValStr}/${anoValStr} LVEE${diaProducao.toString().padStart(2, '0')}${horaFormatada} ${letraAno}`;
                    codigoHTML = `<strong>Código Completo:</strong><br><code class="fs-5">${codigoTexto}</code>`;

                } else if (['D11', 'D12'].includes(linha)) {
                    codigoTexto = `V ${mesValStr}/${anoValStr} L VHE ${diaProducao.toString().padStart(2, '0')} ${horaFormatada} ${letraAno}`;
                    codigoHTML = `
                        <div><strong>Validade:</strong> <code>V ${mesValStr}/${anoValStr}</code></div>
                        <div><strong>Linha:</strong> <code>L VHE ${diaProducao.toString().padStart(2, '0')} ${horaFormatada} ${letraAno}</code></div>
                    `;

                } else if (['A01', 'A02', 'A03', 'A04', 'A06', 'A07', 'A08'].includes(linha)) {
                    codigoTexto = `F: ${mesProdStr}/${ano.toString().slice(-2)} V: ${mesValStr}/${anoValStr}\nL: V${letraLinha}E ${diaProducao.toString().padStart(2, '0')} ${horaFormatada} ${letraAno}`;
                    codigoHTML = `
                        <div><strong>Fabricação:</strong> <code>F: ${mesProdStr}/${ano.toString().slice(-2)}</code></div>
                        <div><strong>Validade:</strong> <code>V: ${mesValStr}/${anoValStr}</code></div>
                        <div><strong>Linha:</strong> <code>L: V${letraLinha}E ${diaProducao.toString().padStart(2, '0')} ${horaFormatada} ${letraAno}</code></div>
                    `;
                }

                // ==================== EXIBIÇÃO ====================
                const resultadoDiv = document.getElementById('resultadoValidade');
                const detailsDiv = document.getElementById('validadeDetails');
                const statusDiv = document.getElementById('validadeStatus');
                const codigoDiv = document.getElementById('codigoValidade');

                let infoAjusteDias = '';
                if (diaProducao !== diaAtual) {
                    infoAjusteDias = `<div class="alert alert-info mt-2">Dia ajustado de ${diaAtual} para ${diaProducao}.</div>`;
                }

                detailsDiv.innerHTML = `
                    ${infoAjusteDias}
                    <div class="mt-3">${codigoHTML}</div>
                `;

                if (aprovado) {
                    const statusTexto = diasRestantes > 30 ? 'PRODUTO APROVADO' : 'PRODUTO APROVADO (Próximo ao vencimento)';
                    statusDiv.innerHTML = `<span class="text-success"><i class="fas fa-check-circle me-2"></i>${statusTexto}</span>`;
                } else {
                    statusDiv.innerHTML = '<span class="text-danger"><i class="fas fa-times-circle me-2"></i>PRODUTO REPROVADO (CRQS/PQS)</span>';
                }

                codigoDiv.innerHTML = `
                    <h6 class="mb-2"><i class="fas fa-barcode me-2"></i>Código de Validade:</h6>
                    <pre class="fs-5 p-3 bg-dark text-white rounded">${codigoTexto}</pre>
                    <button class="btn btn-sm btn-outline-primary mt-2" onclick="navigator.clipboard.writeText('${codigoTexto.replace(/\n/g, '\\n')}')">
                        <i class="fas fa-copy me-1"></i>Copiar Código
                    </button>
                `;

                resultadoDiv.classList.remove('d-none');
                resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            } catch (error) {
                alert(`Erro: ${error.message}`);
            }
        });
    }

    // ==================== LIMPAR ====================
    document.getElementById('limparTara')?.addEventListener('click', function () {
        if (confirm('Deseja limpar todos os campos de tara?')) {
            for (let i = 1; i <= 10; i++) document.getElementById(`tara${i}`).value = '';
            document.getElementById('5amostras').checked = true;
            document.getElementById('10amostrasFields').classList.add('d-none');
            document.getElementById('resultadoTara').classList.add('d-none');
        }
    });

    document.getElementById('limparPeso')?.addEventListener('click', function () {
        if (confirm('Deseja limpar todos os campos de peso?')) {
            for (let i = 1; i <= 5; i++) document.getElementById(`peso${i}`).value = '';
            document.getElementById('pesoPadrao').value = '';
            document.getElementById('resultadoPeso').classList.add('d-none');
        }
    });

    document.getElementById('limparValidade')?.addEventListener('click', function () {
        if (confirm('Deseja limpar todos os campos de validade?')) {
            document.getElementById('validadeForm').reset();
            document.getElementById('resultadoValidade').classList.add('d-none');
        }
    });

    console.log('✅ SmartQuality 4.0 atualizado com sucesso!');
});