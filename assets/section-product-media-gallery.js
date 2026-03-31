document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".rx-media-gallery");
  if (!gallery) return;

  const thumbnailItems = gallery.querySelectorAll(".rx-thumbnail-list__item");

  // Reusable function to switch slides using GSAP
  const switchSlide = (targetId, currentBtn) => {
    const newTarget = document.getElementById(targetId);
    const oldTarget = gallery.querySelector(".rx-main-list__item.is-active");

    // Skip if clicking the same image
    if (newTarget === oldTarget) return;

    // 1. Reset and set active thumbnails
    gallery
      .querySelectorAll(".rx-thumbnail-btn.is-active")
      .forEach((t) => t.classList.remove("is-active"));
    if (currentBtn) currentBtn.classList.add("is-active");

    // 2. Hide old image
    if (oldTarget) {
      oldTarget.classList.remove("is-active");
    }

    // 3. Show and animate new image with GSAP
    if (newTarget) {
      newTarget.classList.add("is-active");

      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          newTarget,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        );
      }
    }
  };

  // Thumbnail Click Handling
  thumbnailItems.forEach((item) => {
    const btn = item.querySelector(".rx-thumbnail-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      switchSlide(targetId, btn);
    });
  });

  // Variant change integration
  // Listens to standard inputs/selects on Dawn's product form to swap image automatically
  const variantSelectors = document.querySelectorAll(
    "variant-selects select, variant-radios input",
  );

  variantSelectors.forEach((selector) => {
    selector.addEventListener("change", () => {
      // Small timeout to allow Shopify's variant URL to update the form's variant-id
      setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const variantId = urlParams.get("variant");
        if (!variantId) return;

        // Fetch variant info from either Dawn's product JSON script or the variant select component
        const productJsonEl = document.querySelector(
          '[type="application/json"][data-product-json], variant-selects [data-selected-variant]',
        );

        if (productJsonEl) {
          try {
            const parsedData = JSON.parse(productJsonEl.textContent);
            let activeVariant;

            // Handle different possible JSON structures natively found in Dawn
            if (parsedData.variants) {
              activeVariant = parsedData.variants.find(
                (v) => v.id == variantId,
              );
            } else if (parsedData.id) {
              activeVariant = parsedData;
            }

            if (activeVariant && activeVariant.featured_media) {
              const mediaId = activeVariant.featured_media.id;
              const sectionId = gallery.id.split("-")[1];
              const targetBtn = gallery.querySelector(
                `.rx-thumbnail-btn[data-target="RxSlide-${sectionId}-${mediaId}"]`,
              );

              if (targetBtn) {
                const targetId = targetBtn.getAttribute("data-target");
                switchSlide(targetId, targetBtn);
              }
            }
          } catch (e) {
            console.warn(
              "RecovrX: Could not parse product JSON for variant image switching.",
              e,
            );
          }
        }
      }, 50);
    });
  });
});
