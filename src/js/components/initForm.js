import {isValidMail} from "../utils/isValidMail";

export const initForm = (fileInput) => {
  // VARS
  const form = document.querySelector('[data-form]');
  if (!form) return;
  const emailInput = form.querySelector('[data-user-email]');
  const usernameInput = form.querySelector('[data-user-name]');
  const phoneInput = form.querySelector('[data-user-phone]');
  let isValidForm = false;

  // LISTENERS
  form.addEventListener('submit', handleOnSubmit);

  [usernameInput, phoneInput, emailInput].forEach(input => {
    input.addEventListener('focus', function () {
      hideErrorMessage(input)
    });
  });


  // HANDLERS
  function handleOnSubmit(event) {
    event.preventDefault();
    validateForm();
  }

  // FUNCTIONS
  function validateForm() {
    // USERNAME
    if (!usernameInput.value.trim().length) {
      showErrorMessage(usernameInput, `Поле обов'язкове`);
      return;
    } else if (usernameInput.value.trim().length < 2) {
      showErrorMessage(usernameInput, `Введіть ваше повне ім'я`);
      return;
    }

    // USER PHONE
    if (!phoneInput.value.length) {
      showErrorMessage(phoneInput, `Поле обов'язкове`);
      return;
    } else if (phoneInput.value.length !== phoneInput.getAttribute('placeholder').length) {
      showErrorMessage(phoneInput, `Введіть валідний номер телефону`);
      return;
    }

    // USER EMAIL
    if (!emailInput.value.trim().length) {
      showErrorMessage(emailInput, `Поле обов'язкове`);
      return;
    } else if (!isValidMail(emailInput.value.trim())) {
      showErrorMessage(emailInput, `Введіть валідний email`);
      return;
    }

    if (fileInput.file && fileInput.isValid) {
      // add to FormData
    }
  }

  function showErrorMessage(field, errorMessage) {
    const wrap = field.closest('[data-text-field]');
    const errorElem = wrap.querySelector('[data-text-field-error]');

    errorElem.textContent = errorMessage;
    wrap.classList.add('error');
  }

  function hideErrorMessage(field) {
    const wrap = field.closest('[data-text-field]');
    wrap.classList.remove('error');
  }
}