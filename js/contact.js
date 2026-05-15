function handleSubmit(){

  const fields = [
    document.getElementById('fname'),
    document.getElementById('lname'),
    document.getElementById('email'),
    document.getElementById('subject'),
    document.getElementById('message')
  ];

  let valid = true;

  fields.forEach(field => {

    const group = field.parentElement;

    group.classList.remove('has-error');

    if(field.value.trim() === ''){

      group.classList.add('has-error');

      valid = false;
    }

  });

  if(!valid) return;

  const form = document.getElementById('contact-form');
  const success = document.getElementById('success-msg');

  const btn = document.querySelector('.btn-submit');

  btn.innerHTML = 'SENDING...';

  btn.disabled = true;

  btn.style.opacity = '.7';

  setTimeout(() => {

    form.style.display = 'none';

    success.classList.add('visible');

  },800);

}

document.querySelectorAll('.form-group input,.form-group textarea')
.forEach(field => {

  field.addEventListener('input', () => {

    field.parentElement.classList.remove('has-error');

  });

});