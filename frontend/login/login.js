document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const togglePassword = document.querySelector('.toggle-password');
    
    // Показать/скрыть пароль
    togglePassword.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
    
    // Обработка формы
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Валидация
        if (!email || !password) {
            showError(emailInput, 'Please fill in all fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError(emailInput, 'Please enter a valid email');
            return;
        }
        
        // Сброс ошибок
        resetErrors();
        
        // Отправка формы
        try {
            setLoading(true);
            
            const a = await api.login(email, password);
            if (a.error) {
                pop('Непраивльный логин или пароль!')
            } else
            window.location.href = '../main/main.html';
            
        } catch (error) {
            showError(emailInput, '');
            showError(passwordInput, error.message);
        } finally {
            setLoading(false);
        }
    });
    
    // Вспомогательные функции
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('has-error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    function resetErrors() {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('has-error');
            const errorElement = group.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    }
    
    function setLoading(isLoading) {
        const loadingIcon = loginBtn.querySelector('.loading-icon');
        const btnText = loginBtn.querySelector('.btn-text');

        if (isLoading) {
            loginBtn.disabled = true;
            loadingIcon.style.display = 'block';
            setTimeout(() => {
                btnText.style.opacity = '0';
                loadingIcon.style.opacity = '1';
            }, 10);
        } else {
            loadingIcon.style.opacity = '0';
            btnText.style.opacity = '1';
            setTimeout(() => {
                loadingIcon.style.display = 'none';
                loginBtn.disabled = false;
            }, 300);
        }
    }
});