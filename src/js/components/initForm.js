import {isValidMail} from "../utils/isValidMail";
import {config} from "../utils/config";
import {scrollToElem} from "../utils/scrollToElem";
import {closeForm} from "./initToggleTestimonialsForm";
import {closeAccordion} from "./initAccordion";
import {FileInput} from "./FileInput";

export const initForm = () => {
  // VARS
  const form = document.querySelector('[data-form]');
  const successMessage = document.querySelector('[data-success-message]');
  const showFormBtn = successMessage.querySelector('[data-show-form]');
  if (!form || !successMessage || !showFormBtn) return;
  const emailInput = form.querySelector('[data-user-email]');
  const usernameInput = form.querySelector('[data-user-name]');
  const phoneInput = form.querySelector('[data-user-phone]');
  const textarea = form.querySelectorAll('[data-textarea-testimonials]');
  const stars = form.querySelectorAll('[data-star]');
  const checkboxTestimonials = form.querySelectorAll('[data-checkbox-testimonials]');
  const textInputs = form.querySelectorAll('[data-text-input]');
  const selects = form.querySelectorAll('[data-select]');
  const radioButtons = form.querySelectorAll('[data-radio-button]');
  const generalTextareas = form.querySelectorAll('[data-general-textarea-testimonials]');
  let isValidForm = true;
  let fileInput = new FileInput();

  // LISTENERS
  form.addEventListener('submit', handleOnSubmit);

  [usernameInput, phoneInput, emailInput, ...textarea, ...textInputs, ...generalTextareas, ...radioButtons].forEach(input => {
    input.addEventListener('focus', function () {
      hideErrorMessage(input);
    });
  });

  [...checkboxTestimonials].forEach(checkboxTestimonial => {
    checkboxTestimonial.addEventListener('change', function () {
      hideErrorMessage(document.querySelector('[data-text-field="no-review"]'));
    })
  });

  [...stars, ...selects].forEach(star => {
    star.addEventListener('change', function () {
      hideErrorMessage(star);
    });
  });

  showFormBtn.addEventListener('click', hideSuccessMessage);

  // HANDLERS
  function handleOnSubmit(event) {
    event.preventDefault();

    if (validateForm()) {
      const response = fetchForm(this);
    } else {
      scrollToError();
      isValidForm = true;
    }
  }

  // FUNCTIONS
  function validateForm() {
    let isNoOneChecked = true;

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
        isNoOneChecked = false;
        const wrap = checkbox.closest('[data-testimonials-form-wrap]');
        const accordionWrap = checkbox.closest('[data-accordion]');
        const stars = wrap.querySelectorAll('[data-star]');
        const textarea = wrap.querySelector('[data-textarea-testimonials]');
        const selects = accordionWrap.querySelectorAll('[data-select]');
        const textInputs = accordionWrap.querySelectorAll('[data-text-input]');
        const radioButtons = accordionWrap.querySelectorAll('[data-radio-button]');
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

        // RADIO BUTTONS
        [...radioButtons].forEach(radio => {
          const radios = document.querySelectorAll(`[name="${radio.name}"]`);
          let isOneChecked = false;

          [...radios].forEach(radio => {
            if (radio.checked) {
              isOneChecked = true;
            }
          });

          if (!isOneChecked) {
            showErrorMessage(radio, `Оберіть один із варіантів відповідей`);
            isValidForm = false;
          }
        });

        // ACCORDION WRAP
        if (!accordionWrap.classList.contains('accordion--is-open') && !isValidForm) {
          accordionWrap.classList.add(config.errorClass);
        }
      }
    });

    if (isNoOneChecked) {
      showErrorMessage(
        document.querySelector('[data-text-field="no-review"]'),
        `Ви не залишили жодного відгуку, виберіть одну з тем і залиште свій відгук`
      );
      isValidForm = false;
    }

    return isValidForm;
  }

  async function fetchForm(form) {
    const formData = new FormData();
    const apiUrl = form.getAttribute('action');

    formData.append('user_name', usernameInput.value.trim());
    formData.append('user_phone', phoneInput.value.trim());
    formData.append('user_email', emailInput.value.trim());

    if (fileInput.file && fileInput.isValid) {
      formData.append('user_image', fileInput.file, fileInput.file.name);
    }

    [...checkboxTestimonials].forEach(checkbox => {
      if (checkbox.checked) {
        const wrap = checkbox.closest('[data-testimonials-form-wrap]');
        const accordionWrap = checkbox.closest('[data-accordion]');
        const stars = wrap.querySelectorAll('[data-star]');
        const textarea = wrap.querySelector('[data-textarea-testimonials]');
        const radioButtons = accordionWrap.querySelectorAll('[data-radio-button]');
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

        [...radioButtons].forEach(radioButton => {
          if (radioButton.checked) {
            formData.append(`${radioButton.name}`, radioButton.value.trim());
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
          const accordions = document.querySelectorAll('[data-accordion]');
          unlockForm();
          showSuccessMessage();
          form.reset();
          fileInput.reset();
          fileInput = new FileInput();

          [...checkboxTestimonials].forEach(checkbox => {
            const wrap = checkbox.closest('[data-testimonials-form-wrap]');
            const form = wrap.querySelector('[data-testimonials-form]');
            closeForm(form);
          });

          [...accordions].forEach(accordion => {
            closeAccordion(accordion);
          });
        }
      } else {
        unlockForm();
        console.error('Error:', response.statusText);
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
    document.body.style.backgroundColor = '#000';
  }

  function hideSuccessMessage() {
    form.style.display = '';
    successMessage.classList.add(config.hiddenClass);
    document.body.style.backgroundColor = '';
  }

  function scrollToError() {
    const field = document.querySelector(`.${config.errorClass}[data-text-field]`);
    const accordion = field.closest('[data-accordion]');
    if (!accordion) return;

    if (!accordion.classList.contains('accordion--is-open')) {
      scrollToElem(accordion, -10);
    } else {
      scrollToElem(field, -10);
    }
  }
}