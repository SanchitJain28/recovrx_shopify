/* ==========================================================================
   RecovrX - Custom Variant Selector
   ========================================================================== */
if (!customElements.get("rx-variant-selects")) {
  class RxVariantSelects extends HTMLElement {
    constructor() {
      super();
      this.addEventListener("change", this.onVariantChange);
      this.productForm = document.querySelector("rx-product-form");
    }

    onVariantChange(event) {
      this.updateOptions();
      this.updateMasterId();
      this.updateSelectedLabel(event.target);
      this.updateURL();
      this.updateDOM(); // Triggers Section Rendering API to update Price/Badges
    }

    updateOptions() {
      this.options = Array.from(
        this.querySelectorAll('input[type="radio"]:checked'),
      ).map((input) => input.value);
    }

    updateSelectedLabel(input) {
      const group = input.closest(".rx-variant-group");
      const labelValue = group.querySelector(".rx-variant-group__value");
      if (labelValue) labelValue.textContent = input.value;
    }

    updateMasterId() {
      const jsonElement = this.querySelector("[data-variant-json]");
      if (!jsonElement) return;

      const variants = JSON.parse(jsonElement.textContent);
      this.currentVariant = variants.find((variant) => {
        return !variant.options
          .map((option, index) => {
            return this.options[index] === option;
          })
          .includes(false);
      });

      if (this.currentVariant && this.productForm) {
        const input = this.productForm.querySelector('input[name="id"]');
        if (input) {
          input.value = this.currentVariant.id;
          // Dispatch event so gallery can listen to it
          input.dispatchEvent(new Event("change", { bubbles: true }));
          document.dispatchEvent(
            new CustomEvent("rx:variant:change", {
              detail: { variant: this.currentVariant },
            }),
          );
        }
      }
    }

    updateURL() {
      if (!this.currentVariant) return;
      window.history.replaceState(
        {},
        "",
        `${this.dataset.url}?variant=${this.currentVariant.id}`,
      );
    }

    updateDOM() {
      if (!this.currentVariant) return;

      const sectionId = this.dataset.section;
      const url = `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${sectionId}`;

      fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(
            responseText,
            "text/html",
          );

          // Update Price Component
          const destinationPrice = document.getElementById(
            `price-${sectionId}`,
          );
          const sourcePrice = html.getElementById(`price-${sectionId}`);
          if (sourcePrice && destinationPrice)
            destinationPrice.innerHTML = sourcePrice.innerHTML;

          // Update ATC Button State
          if (this.productForm) {
            const btn = this.productForm.querySelector('button[type="submit"]');
            const btnText = btn.querySelector("span");

            if (this.currentVariant.available) {
              btn.removeAttribute("disabled");
              btnText.textContent = "Add to Cart";
            } else {
              btn.setAttribute("disabled", "disabled");
              btnText.textContent = "Sold Out";
            }
          }
        });
    }
  }
  customElements.define("rx-variant-selects", RxVariantSelects);
}

/* ==========================================================================
   RecovrX - Custom Product Form (AJAX ATC)
   ========================================================================== */
if (!customElements.get("rx-product-form")) {
  class RxProductForm extends HTMLElement {
    constructor() {
      super();
      this.form = this.querySelector("form");
      this.submitBtn = this.form.querySelector('button[type="submit"]');
      this.submitBtnText = this.submitBtn.querySelector("span");
      this.cartDrawer = document.querySelector("cart-drawer");

      this.form.addEventListener("submit", this.onSubmit.bind(this));
    }

    onSubmit(event) {
      event.preventDefault();

      // Prevent double clicks
      if (this.submitBtn.getAttribute("aria-disabled") === "true") return;

      this.submitBtn.setAttribute("aria-disabled", true);
      const originalText = this.submitBtnText.textContent;
      this.submitBtnText.textContent = "Adding..."; // Loading State

      const formData = new FormData(this.form);
      const form = document.querySelector("rx-product-form form");
      const formId = form.id;
      const fd = new FormData(form);

      console.log("=== Inside form ===");
      for (let [k, v] of fd.entries()) console.log(k, v);

      console.log("=== External inputs with form attr ===");
      document.querySelectorAll(`[form="${formId}"]`).forEach((el) => {
        console.log(
          el.tagName,
          el.name,
          el.value,
          "already in fd:",
          fd.has(el.name),
        );
      });
      const config = {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/javascript",
        },
        body: formData,
      };

      // If Dawn's Cart Drawer exists, tell Shopify to send updated section HTML back
      if (this.cartDrawer) {
        formData.append(
          "sections",
          this.cartDrawer.getSectionsToRender().map((s) => s.id),
        );
        formData.append("sections_url", window.location.pathname);
      }

      fetch(window.Shopify.routes.root + "cart/add.js", config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            // Error handling (e.g. inventory issues)
            console.error(response.description);
            this.submitBtnText.textContent = "Error";
            setTimeout(() => {
              this.submitBtnText.textContent = originalText;
            }, 2000);
            return;
          }

          // Success - Trigger Dawn's Cart Drawer natively
          if (this.cartDrawer) {
            this.cartDrawer.renderContents(response);
          } else {
            // Fallback if no drawer
            window.location.href = "/cart";
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.submitBtn.removeAttribute("aria-disabled");
          this.submitBtnText.textContent = originalText;
        });
    }
  }
  customElements.define("rx-product-form", RxProductForm);
}
