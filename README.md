# 📦 Inspetor de Qualidade Unilever - Versão Atualizada

## 🆕 O que foi alterado?

### ✅ **Cálculo Automático de Validade com Dias Corretos**

A principal mudança foi no arquivo `JS/script.js`, na seção de **Verificação de Validade**.

#### 🎯 **Problema Resolvido:**

Antes, o sistema não considerava corretamente que cada mês tem uma quantidade diferente de dias:
- Janeiro: 31 dias
- Fevereiro: 28 dias (29 em anos bissextos)
- Março: 31 dias
- Abril: 30 dias
- E assim por diante...

#### 💡 **Solução Implementada:**

1. **Nova função `getDiasNoMes()`**: Calcula automaticamente quantos dias tem cada mês
2. **Ajuste inteligente de dias**: Se hoje é dia 31 e você selecionar um mês com 30 dias, o sistema ajusta automaticamente
3. **Suporte a anos bissextos**: Fevereiro tem 29 dias em anos bissextos automaticamente
4. **Informações visuais**: O sistema mostra alertas quando faz ajustes de dias

#### 📊 **Exemplo Prático:**

**Cenário:**
- Hoje: 31/01/2025 (31 de Janeiro)
- Usuário seleciona: Fevereiro/2025
- Validade: 18 meses

**Antes (problema):**
- Sistema tentava usar 31/02/2025 (data inválida!)
- Causava erros ou resultados incorretos

**Agora (solução):**
- Sistema detecta que fevereiro tem 28 dias
- Ajusta automaticamente para 28/02/2025
- Mostra alerta informando o ajuste
- Calcula validade corretamente: 28/08/2026

## 📁 Estrutura do Projeto

```
projeto-completo/
├── index.html          # Página principal
├── CSS/
│   └── style.css      # Estilos com tema claro/escuro
├── JS/
│   ├── script.js      # ✨ ATUALIZADO - Lógica com cálculo melhorado
│   └── theme.js       # Controle de tema
├── Img/               # Coloque suas imagens aqui
└── .vscode/
    └── settings.json  # Configurações do VSCode
```

## 🚀 Como Usar

1. **Copie todos os arquivos** para seu projeto
2. **Adicione suas imagens** na pasta `Img/`
3. **Abra o index.html** no navegador
4. **Teste a verificação de validade** com diferentes datas

## 🔍 Detalhes Técnicos

### Função `getDiasNoMes(ano, mes)`

```javascript
function getDiasNoMes(ano, mes) {
    // mes em JavaScript é 0-indexed (0 = Janeiro, 11 = Dezembro)
    // Criamos uma data no dia 0 do próximo mês, que retorna o último dia do mês atual
    return new Date(ano, mes, 0).getDate();
}
```

### Ajuste Automático de Dias

```javascript
// Verifica quantos dias tem o mês selecionado
const diasNoMesSelecionado = getDiasNoMes(ano, mes);

// Ajusta o dia se necessário
const diaProducao = Math.min(diaAtual, diasNoMesSelecionado);

// Exemplo: Se hoje é 31 e o mês tem 30 dias, usa 30
```

### Cálculo de Validade

```javascript
// Data de produção ajustada
const dataProducao = new Date(ano, mes - 1, diaProducao);

// JavaScript automaticamente ajusta a validade
dataValidade.setMonth(dataValidade.getMonth() + tempoValidade);

// Exemplo: 31/01 + 1 mês = 28/02 (automático!)
```

## 📱 Recursos Mantidos

- ✅ Verificação de Tara (5 ou 10 amostras)
- ✅ Verificação de Peso (com tolerância de 1%)
- ✅ Verificação de Validade (**MELHORADA**)
- ✅ Tema Claro/Escuro
- ✅ Design Responsivo
- ✅ Acessibilidade (VLibras)
- ✅ Animações suaves
- ✅ Impressão otimizada

## 🎨 Temas

- **Claro**: Tema padrão profissional
- **Escuro**: Modo escuro confortável
- **Atalho**: Ctrl/Cmd + Shift + T

## 📋 Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- JavaScript habilitado
- Conexão com internet (para carregar Bootstrap e Font Awesome)

## 👨‍💻 Créditos

- **Desenvolvido por**: Nelson Junior
- **Empresa**: Unilever
- **Data**: Janeiro 2025
- **Versão**: 2.0 (com cálculo melhorado de validade)

## 🐛 Testes Recomendados

### Teste 1: Dia 31 em mês com 30 dias
- Hoje: 31 de qualquer mês
- Selecione: Abril (30 dias)
- Resultado esperado: Ajusta para dia 30

### Teste 2: Dia 31 em Fevereiro
- Hoje: 31 de qualquer mês
- Selecione: Fevereiro
- Resultado esperado: Ajusta para dia 28 (ou 29 se bissexto)

### Teste 3: Validade que cruza meses diferentes
- Produção: 31/01/2025
- Validade: 18 meses
- Resultado esperado: 31/07/2026

### Teste 4: Ano bissexto
- Produção: 29/02/2024 (bissexto)
- Validade: 12 meses
- Resultado esperado: 28/02/2025 (não bissexto)

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o desenvolvedor.

---

**Desenvolvido com ❤️ para Unilever**
