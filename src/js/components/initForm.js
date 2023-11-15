import {isValidMail} from "../utils/isValidMail";
import {config} from "../utils/config";

export const initForm = (fileInput) => {
  // VARS
  const form = document.querySelector('[data-form]');
  const successMessage = document.querySelector('[data-success-message]');
  if (!form || !successMessage) return;
  const emailInput = form.querySelector('[data-user-email]');
  const usernameInput = form.querySelector('[data-user-name]');
  const phoneInput = form.querySelector('[data-user-phone]');
  const textarea = form.querySelectorAll('[data-textarea-testimonials]');
  const stars = form.querySelectorAll('[data-star]');
  const checkboxTestimonials = form.querySelectorAll('[data-checkbox-testimonials]');
  const textInputs = form.querySelectorAll('[data-text-input]');
  const selects = form.querySelectorAll('[data-select]');
  const generalTextareas = form.querySelectorAll('[data-general-textarea-testimonials]');

  // LISTENERS
  form.addEventListener('submit', handleOnSubmit);

  [usernameInput, phoneInput, emailInput, ...textarea, ...textInputs, ...generalTextareas].forEach(input => {
    input.addEventListener('focus', function () {
      hideErrorMessage(input);
    });
  });

  [...stars, ...selects].forEach(star => {
    star.addEventListener('change', function () {
      hideErrorMessage(star);
    });
  });


  // HANDLERS
  function handleOnSubmit(event) {
    event.preventDefault();
    if (validateForm()) {
      const response = fetchForm(this);
    }
  }

  // FUNCTIONS
  function validateForm() {
    let isValidForm = true;

    // USERNAME
    if (!usernameInput.value.trim().length) {
      showErrorMessage(usernameInput, `Поле обов'язкове`);
      return false;
    } else if (usernameInput.value.trim().length < 2) {
      showErrorMessage(usernameInput, `Введіть ваше повне ім'я`);
      return false;
    }

    // USER PHONE
    if (!phoneInput.value.length) {
      showErrorMessage(phoneInput, `Поле обов'язкове`);
      return false;
    } else if (phoneInput.value.length !== phoneInput.getAttribute('placeholder').length) {
      showErrorMessage(phoneInput, `Введіть валідний номер телефону`);
      return false;
    }

    // USER EMAIL
    if (!emailInput.value.trim().length) {
      showErrorMessage(emailInput, `Поле обов'язкове`);
      return false;
    } else if (!isValidMail(emailInput.value.trim())) {
      showErrorMessage(emailInput, `Введіть валідний email`);
      return false;
    }

    [...checkboxTestimonials].forEach(checkbox => {
      if (checkbox.checked) {
        const wrap = checkbox.closest('[data-testimonials-form-wrap]');
        const accordionWrap = checkbox.closest('[data-accordion]');
        const stars = wrap.querySelectorAll('[data-star]');
        const textarea = wrap.querySelector('[data-textarea-testimonials]');
        const selects = accordionWrap.querySelectorAll('[data-select]');
        const textInputs = accordionWrap.querySelectorAll('[data-text-input]');
        const generalTextareas = accordionWrap.querySelectorAll('[data-general-textarea-testimonials]');
        let isChoseStar = false;

        // CHECKBOX FORM TEXTAREA
        if (!textarea.value.trim().length) {
          showErrorMessage(textarea, `Поле обов'язкове`);
          isValidForm = false;
        } else if (textarea.value.trim().length < 10) {
          showErrorMessage(textarea, `Введіть мінімум 10 символів`);
          isValidForm = false;
        }

        // CHECKBOX FORM RATING
        [...stars].forEach(star => {
          if (isChoseStar) return;

          if (star.checked) {
            isChoseStar = true;
          }
        });

        if (!isChoseStar) {
          showErrorMessage(stars[0], `Додайте свою оцінку`);
          isValidForm = false;
        }

        // SELECTS
        [...selects].forEach(select => {
          if (select.value === 'empty') {
            showErrorMessage(select, `Оберіть один із варіантів`);
            isValidForm = false;
          }
        });

        // TEXT INPUTS
        [...textInputs].forEach(textInput => {
          if (!textInput.value.trim().length) {
            showErrorMessage(textInput, `Поле обов'язкове`);
            isValidForm = false;
          } else if (textInput.value.trim().length < 2) {
            showErrorMessage(textInput, `Введіть мінімум 2 символів`);
            isValidForm = false;
          }
        });

        // TEXT INPUTS
        [...generalTextareas].forEach(generalTextarea => {
          if (!generalTextarea.value.trim().length) {
            showErrorMessage(generalTextarea, `Поле обов'язкове`);
            isValidForm = false;
          } else if (generalTextarea.value.trim().length < 10) {
            showErrorMessage(generalTextarea, `Введіть мінімум 10 символів`);
            isValidForm = false;
          }
        });

        // ACCORDION WRAP
        if (!accordionWrap.classList.contains('accordion--is-open') && !isValidForm) {
          accordionWrap.classList.add(config.errorClass);
        }
      }
    });

    return isValidForm;
  }

  async function fetchForm(form) {
    const formData = new FormData();
    const apiUrl = form.getAttribute('action');

    formData.append('user_name', usernameInput.value.trim());
    formData.append('user_phone', phoneInput.value.trim());
    formData.append('user_email', emailInput.value.trim());

    if (fileInput.file && fileInput.isValid) {
      const file = fileInput.files[0];
      formData.append('user_image', file, file.name);
    }

    [...checkboxTestimonials].forEach(checkbox => {
      if (checkbox.checked) {
        const wrap = checkbox.closest('[data-testimonials-form-wrap]');
        const accordionWrap = checkbox.closest('[data-accordion]');
        const stars = wrap.querySelectorAll('[data-star]');
        const textarea = wrap.querySelector('[data-textarea-testimonials]');
        const selects = accordionWrap.querySelectorAll('[data-select]');
        const textInputs = accordionWrap.querySelectorAll('[data-text-input]');
        const generalTextareas = accordionWrap.querySelectorAll('[data-general-textarea-testimonials]');

        formData.append(`checkbox_testimonials_${checkbox.name}`, checkbox.name);
        formData.append(`checkbox_textarea_${checkbox.name}`, textarea.value.trim());

        [...stars].forEach(star => {
          if (star.checked) {
            formData.append(`checkbox_rating_${checkbox.name}`, star.value.trim());
          }
        });

        [...selects].forEach(select => {
          formData.append(select.name, select.value.trim());
        });

        [...textInputs].forEach(textInput => {
          formData.append(textInput.name, textInput.value.trim());
        });

        [...generalTextareas].forEach(generalTextarea => {
          formData.append(generalTextarea.name, generalTextarea.value.trim());
        });
      }
    });

    lockForm();

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();

        if (data === 'success') {
          unlockForm();
          showSuccessMessage();
        }
      } else {
        unlockForm();
      }
    } catch (error) {
      console.error('Error:', error.message);
      unlockForm();
    }
  }

  function showErrorMessage(field, errorMessage) {
    const wrap = field.closest('[data-text-field]');
    const errorElem = wrap.querySelector('[data-text-field-error]');

    errorElem.textContent = errorMessage;
    wrap.classList.add(config.errorClass);
  }

  function hideErrorMessage(field) {
    const wrap = field.closest('[data-text-field]');
    wrap.classList.remove(config.errorClass);
  }

  function lockForm() {
    form.classList.add(config.disabledClass);
  }

  function unlockForm() {
    form.classList.remove(config.disabledClass);
  }

  function showSuccessMessage() {
    form.style.display = 'none';
    successMessage.classList.remove(config.hiddenClass);
  }
}