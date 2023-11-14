import {isValidMail} from "../utils/isValidMail";

export const initForm = (fileInput) => {
  // VARS
  const form = document.querySelector('[data-form]');
  if (!form) return;
  const emailInput = form.querySelector('[data-user-email]');
  const usernameInput = form.querySelector('[data-user-name]');
  const phoneInput = form.querySelector('[data-user-phone]');
  const textarea = form.querySelectorAll('[data-textarea-testimonials]');
  const stars = form.querySelectorAll('[data-star]');
  const checkboxTestimonials = form.querySelectorAll('[data-checkbox-testimonials]');
  let isValidForm = false;

  // LISTENERS
  form.addEventListener('submit', handleOnSubmit);

  [usernameInput, phoneInput, emailInput, ...textarea].forEach(input => {
    input.addEventListener('focus', function () {
      hideErrorMessage(input);
    });
  });

  [...stars].forEach(star => {
    star.addEventListener('change', function () {
      hideErrorMessage(star);
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

    [...checkboxTestimonials].forEach(checkbox => {
      if (checkbox.checked) {
        const wrap = checkbox.closest('[data-testimonials-form-wrap]');
        const stars = wrap.querySelectorAll('[data-star]');
        const textarea = wrap.querySelector('[data-textarea-testimonials]');
        let isChoseStar = false;

        if (!textarea.value.trim().length) {
          showErrorMessage(textarea, `Поле обов'язкове`);
        } else if (textarea.value.trim().length < 2) {
          showErrorMessage(textarea, `Введіть мінімум 10 символів`);
        }

        [...stars].forEach(star => {
          if (isChoseStar) return;

          if (star.checked) {
            isChoseStar = true;
          }
        });

        if (!isChoseStar) {
          showErrorMessage(stars[0], `Додайте свою оцінку`);
        }
      }
    });

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