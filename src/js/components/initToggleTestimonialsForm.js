import anime from "animejs";

export const initToggleTestimonialsForm = () => {
  // VARS
  const checkboxes = document.querySelectorAll('[data-checkbox-testimonials]');
  let duration = 300;

  // LISTENERS
  [...checkboxes].forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const wrap = this.closest('[data-testimonials-form-wrap]');
      const form = wrap.querySelector('[data-testimonials-form]');

      if (this.checked === true) {
        openForm(form);
      } else {
        closeForm(form);
      }
    });
  });

  // FUNCTIONS
  function openForm(form) {
    const height = form.scrollHeight;

    anime({
      targets: form,
      height: [0, height],
      easing: 'linear',
      duration: duration,
      complete: function () {
        form.style.height = 'auto';
      },
    });
  }
}

export function closeForm(form) {
  const height = form.scrollHeight;
  let duration = 300;

  form.style.height = `${height}px`;

  anime({
    targets: form,
    height: 0,
    easing: 'linear',
    duration: duration,
  });
}