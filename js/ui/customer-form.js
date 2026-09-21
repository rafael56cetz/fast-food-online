
'use strict';
// Adaptador de interfaz: errores visibles únicamente al intentar enviar.
const CustomerForm = Object.freeze({
  bind(form, onValid) {
    const fields = ['name', 'phone', 'address', 'reference', 'notes'].map(name => form.elements[name]);
    form.noValidate = true;
    fields.forEach(field => {
      field.removeAttribute('title');
      field.maxLength = CustomerValidation.rules[field.name]?.max || 10;
      const filter = () => {
        const original = field.value;
        const cursor = field.selectionStart ?? original.length;
        const clean = CustomerValidation.normalizeField(field.name, original);
        if (clean !== original) {
          const next = CustomerValidation.normalizeField(field.name, original.slice(0, cursor)).length;
          field.value = clean;
          field.setSelectionRange(next, next);
        }
        field.setCustomValidity('');
      };
      field.addEventListener('input', event => { if (!event.isComposing) filter(); });
      field.addEventListener('compositionend', filter);
    });
    form.addEventListener('reset', () => fields.forEach(field => field.setCustomValidity('')));
    form.addEventListener('submit', event => {
      event.preventDefault();
      fields.forEach(field => {
        field.setCustomValidity('');
        if (field.disabled) return;
        field.value = field.value.normalize('NFC').trim().replace(/ +/g, ' ');
        field.setCustomValidity(field.name === 'phone'
          ? (CustomerValidation.isValidPhone(field.value) ? '' : 'Completa tu teléfono con 10 dígitos.')
          : CustomerValidation.fieldError(field.name, field.value, field.required));
      });
      if (form.reportValidity()) onValid(Object.fromEntries(new FormData(form)));
    });
  }
});
