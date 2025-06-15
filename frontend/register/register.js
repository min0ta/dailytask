document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const registerBtn = document.getElementById('registerBtn');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordStrength = document.querySelector('.password-strength');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

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

    // Проверка сложности пароля
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // Длина пароля
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Содержит цифры
        if (/\d/.test(password)) strength++;
        
        // Содержит спецсимволы
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        
        // Содержит буквы разного регистра
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        
        // Обновляем индикатор
        updateStrengthIndicator(strength);
    });

    function updateStrengthIndicator(strength) {
        passwordStrength.className = 'password-strength';
        
        if (strength <= 2) {
            passwordStrength.classList.add('weak');
            strengthText.textContent = 'Weak';
        } else if (strength <= 4) {
            passwordStrength.classList.add('medium');
            strengthText.textContent = 'Medium';
        } else {
            passwordStrength.classList.add('strong');
            strengthText.textContent = 'Strong';
        }
    }

    // Обработка формы
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const terms = document.getElementById('terms').checked;
        
        // Валидация
        if (!email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (!terms) {
            pop('You must agree to the terms');
            return;
        }
        
        if (password.length < 8) {
            pop('Password must be at least 8 characters long');
            return;
        }
        
        // Отправка формы
        try {
            setLoading(true);
            
            const userData = {
                email,
                password
            };
            const response = await api.register(email, password);
            if (response.error) {
                pop('Этот аккаунт уже существует!')
            }
            console.log(response)
            // В реальном приложении здесь было бы перенаправление
            window.location.href = '../main/main.html';
            
        } catch (error) {
            pop(`Неизвестная ошибка:${error.message}`);
        } finally {
            setLoading(false);
        }
    });

    // Вспомогательные функции
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function setLoading(isLoading) {
        const loadingIcon = registerBtn.querySelector('.loading-icon');
        const btnText = registerBtn.querySelector('.btn-text');
        
        if (isLoading) {
            registerBtn.disabled = true;
            loadingIcon.style.display = 'block';
            btnText.style.opacity = '0';
            loadingIcon.style.opacity = '1';
        } else {
            loadingIcon.style.opacity = '0';
            btnText.style.opacity = '1';
            setTimeout(() => {
                loadingIcon.style.display = 'none';
                registerBtn.disabled = false;
            }, 300);
        }
    }
});