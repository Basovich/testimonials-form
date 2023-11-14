import {config} from "../utils/config";

export function FileInput() {
  // VARS
  const $this = this;
  const fileInput = document.querySelector('[data-file-input]');
  if (!fileInput) return;
  const fileInputName = document.querySelector('[data-file-input-text]');
  const fileInputError = document.querySelector('[data-file-error]');
  $this.isValid = false;
  $this.file = undefined;

  // LISTENER
  fileInput.addEventListener('change', function() {
    $this.file = this.files[0];

    if (!$this.file) {
      fileInputName.textContent = 'Прикріпити файл';
      $this.hideErrorMessage();
      $this.isValid = false;
      return;
    }

    if (!$this.file.type.startsWith('image/')) {
      fileInputError.textContent = 'Дозволено завантажувати тільки зображення.';
      $this.showErrorMessage();
      $this.isValid = false;
      return;
    }

    if ($this.file.size > 5 * 1024 * 1024) {
      fileInputError.textContent = 'Розмір файлу повинен бути меншим, ніж 5 МБ.';
      $this.showErrorMessage();
      $this.isValid = false;
      return;
    }

    $this.isValid = true;
    $this.hideErrorMessage();
    fileInputName.textContent = $this.file.name;
  });

  // FUNCTIONS
  $this.showErrorMessage = function() {
    fileInputError.classList.remove(config.hiddenClass);
  }

  $this.hideErrorMessage = function() {
    fileInputError.classList.add(config.hiddenClass);
  }
}

