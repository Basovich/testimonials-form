import {config} from "../utils/config";

export const initFileInput = () => {
  // VARS
  const fileInput = document.querySelector('[data-file-input]');
  if (!fileInput) return;
  const fileInputName = document.querySelector('[data-file-input-text]');
  const fileInputError = document.querySelector('[data-file-error]');

  // LISTENER
  fileInput.addEventListener('change', function() {
    const file = this.files[0];

    if (!file) {
      fileInputName.textContent = 'Прикріпити файл';
      hideErrorMessage();
      return;
    }

    if (!file.type.startsWith('image/')) {
      fileInputError.textContent = 'Дозволено завантажувати тільки зображення.';
      showErrorMessage();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      fileInputError.textContent = 'Розмір файлу повинен бути меншим, ніж 5 МБ.';
      showErrorMessage();
      return;
    }

    hideErrorMessage();
    fileInputName.textContent = file.name;
  });

  // FUNCTIONS
  function showErrorMessage() {
    fileInputError.classList.remove(config.hiddenClass);
  }

  function hideErrorMessage() {
    fileInputError.classList.add(config.hiddenClass);
  }
}

