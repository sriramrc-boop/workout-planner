function handleSubmit(){

  const fields = [
    document.getElementById('fname'),
    document.getElementById('lname'),
    document.getElementById('email'),
    document.getElementById('subject'),
    document.getElementById('message')
  ];

  const emailElement = document.getElementById('email');
  const emailValue = emailElement.value.trim();
  const emailGroup = emailElement.parentElement;

  let valid = true;

  fields.forEach(field => {
    field.parentElement.classList.remove('has-error');
  });

  fields.forEach(field => {
    if (field.value.trim() === '') {
      field.parentElement.classList.add('has-error');
      valid = false;
    }
  });

  if (!emailValue.includes('@') || !emailValue.includes('.')) {
    emailGroup.classList.add('has-error');
    valid = false;
  }

  if (!valid) return;

  const form = document.getElementById('contact-form');
  const success = document.getElementById('success-msg');
  const btn = document.querySelector('.btn-submit');

  btn.innerHTML = 'SENDING...';
  btn.disabled = true;
  btn.style.opacity = '.7';

  setTimeout(() => {
    form.style.display = 'none';
    success.classList.add('visible');
  }, 800);
}