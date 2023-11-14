import {initAccordion} from "../components/initAccordion";
import {initToggleTestimonialsForm} from "../components/initToggleTestimonialsForm";
import {FileInput} from "../components/FileInput";
import {initPhoneMask} from "../components/initPhoneMask";
import {initForm} from "../components/initForm";

window.addEventListener('DOMContentLoaded', function () {
  const fileInput = new FileInput();
  initAccordion();
  initToggleTestimonialsForm();
  initPhoneMask();
  initForm(fileInput);
});