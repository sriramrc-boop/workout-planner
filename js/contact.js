function handleSubmit() {
const fields = [
    document.getElementById('fname'),
    document.getElementById('lname'),
    document.getElementById('email'),
    document.getElementById('subject'),
    document.getElementById('message')
];

let valid = true;
let firstError = null;

fields.forEach(field => {
    const group = field.parentElement;
    group.classList.remove('has-error');

    const isEmpty = field.value.trim() === '';
    const isEmailInvalid = field.type === 'email' && field.value.trim() !== '' && !field.value.includes('@');

    if (isEmpty || isEmailInvalid) {
    group.classList.add('has-error');
    field.blur();
    if (!firstError) firstError = field;
    valid = false;
    }
});

if (!valid) return;

const form = document.getElementById('contact-form');
const success = document.getElementById('success-msg');
const btn = document.querySelector('.btn-submit');

btn.textContent = 'SENDING...';
btn.style.opacity = '0.7';
btn.disabled = true;

setTimeout(() => {
    form.style.opacity = '0';
    form.style.transform = 'translateY(20px)';
    form.style.transition = 'all 0.4s ease';
    setTimeout(() => {
    form.style.display = 'none';
    success.classList.add('visible');
    }, 400);
}, 800);
}

document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
field.addEventListener('input', () => {
    field.parentElement.classList.remove('has-error');
});
});