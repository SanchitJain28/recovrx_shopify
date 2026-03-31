document.addEventListener("DOMContentLoaded", () => {
  const stickyBar = document.querySelector(".rx-sticky-atc");
  if (!stickyBar) return;

  const stickySectionId = stickyBar.dataset.sectionId;

  // Main product section id comes from the variant selects element
  const variantSelects = document.querySelector("rx-variant-selects");
  const mainForm = document.querySelector("form[data-type='add-to-cart-form']");

  if (!variantSelects || !mainForm) {
    console.warn("RecovrX Sticky ATC: Missing variantSelects or mainForm.");
    return;
  }

  const mainSectionId = variantSelects.dataset.section;
  const triggerEl = document.getElementById(`MainBuyButtons-${mainSectionId}`);

  if (!triggerEl) {
    console.warn(`RecovrX Sticky ATC: Missing MainBuyButtons-${mainSectionId}`);
    return;
  }

  const variantData = JSON.parse(
    variantSelects.querySelector("[data-variant-json]").textContent,
  );

  const updateStickyBarContent = () => {
    const currentVariantId = mainForm.querySelector('[name="id"]').value;
    const variant = variantData.find((v) => v.id == currentVariantId);
    if (!variant) return;

    // Title
    const titleEl = stickyBar.querySelector(".rx-sticky-atc__title");
    if (titleEl) {
      titleEl.textContent = variant.title.includes("/")
        ? document.querySelector(".product__title h1")?.textContent ||
          variant.title
        : variant.title;
    }

    // Image
    const imageEl = stickyBar.querySelector(".rx-sticky-atc__image");
    if (imageEl) {
      const img = variant.featured_image;
      if (img) {
        imageEl.src = img.src;
        imageEl.alt = img.alt || "";
      }
    }

    // Button state
    const buttonEl = stickyBar.querySelector(".rx-sticky-atc__btn");
    if (buttonEl) {
      const span = buttonEl.querySelector("span");
      if (variant.available) {
        buttonEl.removeAttribute("disabled");
        if (span) span.textContent = "Add to Cart";
      } else {
        buttonEl.setAttribute("disabled", "true");
        if (span) span.textContent = "Sold Out";
      }
      // Wire button to submit the main form
      buttonEl.onclick = () => mainForm.querySelector('[name="add"]')?.click();
    }

    // Price + payment terms via Section Rendering API
    fetch(
      `${window.location.pathname}?variant=${variant.id}&section_id=${stickySectionId}`,
    )
      .then((r) => r.text())
      .then((text) => {
        const html = new DOMParser().parseFromString(text, "text/html");

        const newPrice = html.getElementById(`StickyPrice-${stickySectionId}`);
        const oldPrice = document.getElementById(
          `StickyPrice-${stickySectionId}`,
        );
        if (newPrice && oldPrice) oldPrice.innerHTML = newPrice.innerHTML;

        const newTerms = html.getElementById(
          `product-form-installment-sticky-${stickySectionId}`,
        );
        const oldTerms = document.getElementById(
          `product-form-installment-sticky-${stickySectionId}`,
        );
        if (newTerms && oldTerms) oldTerms.innerHTML = newTerms.innerHTML;
      });
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        stickyBar.classList.add("is-visible");
        updateStickyBarContent();
      } else {
        stickyBar.classList.remove("is-visible");
      }
    },
    { threshold: 0, rootMargin: "0px" },
  );

  observer.observe(triggerEl);

  document.addEventListener("rx:variant:change", updateStickyBarContent);
});
