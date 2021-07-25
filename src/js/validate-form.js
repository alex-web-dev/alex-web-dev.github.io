if ('NodeList' in window && !NodeList.prototype.forEach) {
  console.info('polyfill for IE11');
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

const callbackForm = document.querySelector('.cb-form');
const fields = callbackForm.querySelectorAll('.cb-form__field');
const fieldName = callbackForm.querySelector('.cb-form__field_name');

fieldName.addEventListener('input', function (e) {
  const symbol = e.data;
  if(!/^[а-яА-ЯёЁa-zA-Z]+$/.test(symbol))
    this.value = this.value.slice(0, -1);
});

fields.forEach(function(field) {
  field.addEventListener('focus', function() {
    this.classList.remove('cb-form__field_error');
    this.classList.remove('cb-form__field_success');
  });

  field.addEventListener('blur', function() {
    const fieldValue = this.value;
    let isError = false;
    if (this.classList.contains('cb-form__field_name')) {
      if (!validateName(fieldValue)) {
        isError = true;
      }
    } else if (this.classList.contains('cb-form__field_email')) {
      if (!validateEmail(fieldValue)) {
        isError = true;
      }
    }
    
    if(isError)
      this.classList.add('cb-form__field_error');
    else
      this.classList.add('cb-form__field_success');    
  });
});

fieldName.addEventListener('blur', function() {
  const nameValue = this.value;
  if (!validateName(nameValue))
    this.classList.add('cb-form__field_error');
  else
    this.classList.add('cb-form__field_success');
});

callbackForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const fields = this.querySelectorAll('.cb-form__field');
  const name = this.querySelector('.cb-form__field_name');
  const email = this.querySelector('.cb-form__field_email');
  const message = this.querySelector('.cb-form__message');
  let isError = false;
  message.innerHTML = '';

  if (!validateName(name.value)) {
    name.classList.add('cb-form__field_error');
    isError = true;
  }

  if (!validateEmail(email.value)) {
    email.classList.add('cb-form__field_error');
    isError = true;
  }
  
  if (isError) {
    message.innerHTML = 'Одно или несколько полей содержат ошибочные данные.';
    message.classList.add('cb-form__message_error');
    return;
  }

  showLoad();
  setTimeout(function() {
    removeLoad();

    clearFields(fields);
    message.classList.add('cb-form__message_success')
    message.innerHTML = 'Ваша заявка успешно отправлена. Вся необходимая информация выслана Вам на почту.';
  }, 3000);
});

function clearFields(fields) {
  fields.forEach(function(field) {
    field.classList.remove('cb-form__field_error');
    field.classList.remove('cb-form__field_success');
    field.value = '';
  });
}

function showLoad() {
  const load = document.createElement('div');
  load.className = 'cssload-dots';
  load.innerHTML = `
    <div class="cssload-dot"></div>
    <div class="cssload-dot"></div>
    <div class="cssload-dot"></div>
    <div class="cssload-dot"></div>
    <div class="cssload-dot"></div>
  `;

  const loadSvg = document.createElement('svg');
  loadSvg.className = 'cssload-svg';
  loadSvg.setAttribute('version', '1.1');
  loadSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  loadSvg.innerHTML = `
    <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="12" ></feGaussianBlur>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0	0 1 0 0 0	0 0 1 0 0	0 0 0 18 -7" result="goo" ></feColorMatrix>
      <!--<feBlend in2="goo" in="SourceGraphic" result="mix" ></feBlend>-->
    </filter>
  </defs>
  `;

  document.body.appendChild(load);
  document.body.appendChild(loadSvg);

}

function removeLoad() {
  const load = document.querySelector('.cssload-dots');
  const loadSvg = document.querySelector('.cssload-svg');
  document.body.removeChild(load);
  document.body.removeChild(loadSvg);
}

function validateName(name) {
  if (name.length <= 1 || !/^[а-яА-ЯёЁa-zA-Z]+$/.test(name))
    return false;

  return true;
}

function validateEmail(email) {
  if (email.length <= 6 || !/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/.test(email))
    return false;
  
  return true;
}