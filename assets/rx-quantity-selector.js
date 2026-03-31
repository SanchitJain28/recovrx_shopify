/* ==========================================================================
   RecovrX - Custom Quantity Selector JS
   ========================================================================== */

if (!customElements.get("rx-quantity-input")) {
  class RxQuantityInput extends HTMLElement {
    constructor() {
      super();
      this.input = this.querySelector(".rx-quantity__input");
      this.changeEvent = new Event("change", { bubbles: true });

      this.querySelectorAll(".rx-quantity__button").forEach((button) => {
        button.addEventListener("click", this.onButtonClick.bind(this));
      });

      // Optional: Prevent typing non-numbers
      this.input.addEventListener("input", this.validateInput.bind(this));
    }

    onButtonClick(event) {
      event.preventDefault();
      const previousValue = Number(this.input.value) || 1;
      const step = Number(this.input.getAttribute("step")) || 1;
      const min = Number(this.input.getAttribute("min")) || 1;
      const max = this.input.getAttribute("max")
        ? Number(this.input.getAttribute("max"))
        : Infinity;

      let newValue;

      if (event.currentTarget.name === "plus") {
        newValue = previousValue + step;
      } else {
        newValue = previousValue - step;
      }

      // Enforce min/max rules
      if (newValue < min) newValue = min;
      if (newValue > max) newValue = max;

      if (newValue !== previousValue) {
        this.input.value = newValue;
        this.input.dispatchEvent(this.changeEvent);
      }
    }

    validateInput() {
      // Prevents user from typing negative values manually
      if (this.input.value === "") return;

      const min = Number(this.input.getAttribute("min")) || 1;
      if (Number(this.input.value) < min) {
        this.input.value = min;
      }
    }
  }

  customElements.define("rx-quantity-input", RxQuantityInput);
}
