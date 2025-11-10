document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Mostra mensagem imediatamente
        messageDiv.textContent = 'Processando login...';
        messageDiv.className = 'message';

        try {
            
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });


            const data = await response.json();

            if (data.success) {
                messageDiv.textContent = 'Login realizado com sucesso! Redirecionando...';
                messageDiv.className = 'message success';

                // Redirecionar
                if (data.user.tipo === 'gerente') {
                    window.location.href = 'html/gerente.html';
                } else if (data.user.tipo === 'funcionario') {
                    window.location.href = 'html/func.html';
                }

            } else {
                messageDiv.textContent = data.error || 'Credenciais inválidas!';
                messageDiv.className = 'message error';
            }
        } catch (error) {
            messageDiv.textContent = 'Erro ao conectar com o servidor!';
            messageDiv.className = 'message error';
        }
    });

});
