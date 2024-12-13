class FormSubmit {
  constructor(settings) {
    this.settings = settings;
    this.form = document.querySelector(settings.form);
    this.formButton = document.querySelector(settings.button);
    if (this.form) {
      this.url = this.form.getAttribute("action");
    }
    this.sendForm = this.sendForm.bind(this);
  }

  displaySuccess() {
    this.form.innerHTML = this.settings.success;
  }

  displayError() {
    this.form.innerHTML = this.settings.error;
  }

  getFormObject() {
    const formObject = {};
    const fields = this.form.querySelectorAll("[name]");
    fields.forEach((field) => {
      formObject[field.getAttribute("name")] = field.value;
    });
    return formObject;
  }

  validateForm() {
    if (this.form.checkValidity()) {
      return true;
    } else {
      this.form.reportValidity();
      return false;
    }
  }

  async sendForm(event) {
    event.preventDefault();
    if (this.validateForm()) {
      this.formButton.disabled = true;
      this.formButton.innerText = "Enviando...";
      try {
        await fetch(this.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(this.getFormObject())
        });
        this.displaySuccess();
      } catch (error) {
        this.displayError();
        throw new Error(error);
      } finally {
        this.formButton.disabled = false;
        this.formButton.innerText = "Enviar";
      }
    }
  }

  init() {
    if (this.form) this.formButton.addEventListener("click", this.sendForm);
    return this;
  }
}

const formSubmit = new FormSubmit({
  form: "[data-form]",
  button: "[data-button]",
  success: "<h1 class='success'>Mensagem enviada!</h1>",
  error: "<h1 class='error'>Não foi possível enviar sua mensagem.</h1>"
});
formSubmit.init();
