export const initFileInput = () => {
  // VARS
  const fileInput = document.querySelector('[data-file-input]');
  if (!fileInput) return;

  // LISTENER
  fileInput.addEventListener('change', function() {
    const filename = this.files[0].name;
    const fileInputName = document.querySelector('[data-file-input-text]');

    fileInputName.textContent = filename;
  });
}

