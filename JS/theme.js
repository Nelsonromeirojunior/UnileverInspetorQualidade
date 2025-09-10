document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.querySelector('.theme-label');
    const html = document.documentElement;

    // Função para aplicar tema
    function applyTheme(theme) {
        // Aplicar o tema ao HTML
        html.setAttribute('data-theme', theme);

        // Salvar preferência no localStorage
        localStorage.setItem('theme', theme);

        // Atualizar texto do botão
        if (themeLabel) {
            themeLabel.textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
        }

        // Atualizar ícones
        const lightIcon = document.querySelector('.light-icon');
        const darkIcon = document.querySelector('.dark-icon');

        if (lightIcon && darkIcon) {
            if (theme === 'dark') {
                lightIcon.style.display = 'none';
                darkIcon.style.display = 'inline-block';
            } else {
                lightIcon.style.display = 'inline-block';
                darkIcon.style.display = 'none';
            }
        }

        // Adicionar classe de transição suave
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

        // Disparar evento customizado para outros scripts
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme }
        }));

        console.log(`Tema alterado para: ${theme}`);
    }

    // Verificar se existe preferência salva
    const savedTheme = localStorage.getItem('theme');

    // Verificar preferência do sistema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Definir tema inicial
    let initialTheme;
    if (savedTheme) {
        // Usar tema salvo pelo usuário
        initialTheme = savedTheme;
    } else if (prefersDarkScheme.matches) {
        // Usar preferência do sistema
        initialTheme = 'dark';
    } else {
        // Padrão claro
        initialTheme = 'light';
    }

    // Aplicar tema inicial
    applyTheme(initialTheme);

    // Adicionar listener para o botão de alternância
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });

        // Adicionar tecla de atalho (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                themeToggle.click();
            }
        });
    }

    // Observar mudanças na preferência do sistema (apenas se não houver preferência salva)
    prefersDarkScheme.addEventListener('change', function (e) {
        // Só aplicar mudança automática se o usuário não tiver definido preferência manual
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Função para resetar para preferência do sistema
    window.resetThemeToSystem = function () {
        localStorage.removeItem('theme');
        const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
        applyTheme(systemTheme);
    };

    // Função para forçar tema específico
    window.setTheme = function (theme) {
        if (theme === 'light' || theme === 'dark') {
            applyTheme(theme);
        } else {
            console.error('Tema inválido. Use "light" ou "dark".');
        }
    };

    // Adicionar suporte para mudança programática
    window.addEventListener('storage', function (e) {
        if (e.key === 'theme' && e.newValue) {
            applyTheme(e.newValue);
        }
    });

    // Debug: Adicionar informações no console
    if (process && process.env && process.env.NODE_ENV === 'development') {
        console.log('🎨 Theme System carregado');
        console.log('📱 Preferência do sistema:', prefersDarkScheme.matches ? 'dark' : 'light');
        console.log('💾 Tema salvo:', savedTheme || 'nenhum');
        console.log('🔧 Tema atual:', initialTheme);
        console.log('⌨️  Atalho: Ctrl/Cmd + Shift + T para alternar tema');
    }
});