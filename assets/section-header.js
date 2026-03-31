/* section-header.js — RecovrX Header
   No jQuery. Vanilla JS only.
*/

(function () {
  const header = document.querySelector(".js-rx-header");
  const hamburger = document.querySelector(".js-rx-menu-open");
  const closeBtn = document.querySelector(".js-rx-menu-close");
  const drawer = document.querySelector(".js-rx-drawer");
  const overlay = document.querySelector(".js-rx-overlay");
  const searchOpen = document.querySelector(".js-rx-search-open");
  const searchClose = document.querySelector(".js-rx-search-close");
  const searchOvl = document.querySelector(".js-rx-search-overlay");

  /* ── Scroll solidify ── */
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile drawer ── */
  function openDrawer() {
    drawer?.setAttribute("aria-hidden", "false");
    overlay?.setAttribute("aria-hidden", "false");
    hamburger?.setAttribute("aria-expanded", "true");
    hamburger?.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer?.setAttribute("aria-hidden", "true");
    overlay?.setAttribute("aria-hidden", "true");
    hamburger?.setAttribute("aria-expanded", "false");
    hamburger?.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  hamburger?.addEventListener("click", openDrawer);
  closeBtn?.addEventListener("click", closeDrawer);
  overlay?.addEventListener("click", closeDrawer);

  /* Close on Escape */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      closeSearch();
    }
  });

  /* ── Search overlay ── */
  function openSearch() {
    searchOvl?.setAttribute("aria-hidden", "false");
    searchOpen?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    setTimeout(
      () => searchOvl?.querySelector(".rx-search-overlay__input")?.focus(),
      80,
    );
  }

  function closeSearch() {
    searchOvl?.setAttribute("aria-hidden", "true");
    searchOpen?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    // Reset predictive search on close
    if (window.rxPredictiveSearchInstance) {
      window.rxPredictiveSearchInstance.input.value = "";
      window.rxPredictiveSearchInstance.close();
    }
  }

  searchOpen?.addEventListener("click", openSearch);
  searchClose?.addEventListener("click", closeSearch);

  /* Close search on backdrop click */
  searchOvl?.addEventListener("click", (e) => {
    if (e.target === searchOvl) closeSearch();
  });

  /* ── Predictive Search Class ── */
  class RxPredictiveSearch {
    constructor() {
      this.input = document.querySelector(".js-predictive-input");
      this.resultsContainer = document.querySelector(".js-predictive-results");
      this.form = document.querySelector(".js-predictive-form");

      if (!this.input || !this.resultsContainer) return;
      this.setupEventListeners();
    }

    setupEventListeners() {
      const debouncedOnChange = this.debounce(
        (event) => this.onChange(event),
        300,
      );
      this.input.addEventListener("input", debouncedOnChange.bind(this));

      document.addEventListener("click", (event) => {
        if (
          !this.form.contains(event.target) &&
          !this.resultsContainer.contains(event.target)
        ) {
          this.close();
        }
      });

      this.input.addEventListener("focus", () => {
        if (this.input.value.trim().length > 0) this.open();
      });
    }

    debounce(fn, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
      };
    }

    onChange(event) {
      const searchTerm = event.target.value.trim();
      if (!searchTerm.length) {
        this.close();
        return;
      }
      this.getSearchResults(searchTerm);
    }

    async getSearchResults(searchTerm) {
      try {
        const rootUrl = window.Shopify?.routes?.root || "/";
        const response = await fetch(
          `${rootUrl}search/suggest.json?q=${encodeURIComponent(
            searchTerm,
          )}&resources[type]=product,collection&resources[limit]=5&resources[limit_scope]=each`,
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        this.renderResults(json.resources.results);
      } catch (error) {
        console.error("Predictive Search Error:", error);
        this.close();
      }
    }

    renderResults(results) {
      this.resultsContainer.innerHTML = "";
      const products = results.products || [];
      const collections = results.collections || [];

      if (products.length === 0 && collections.length === 0) {
        this.resultsContainer.innerHTML = `<div class="rx-predictive__no-results">No results for "${this.input.value}"</div>`;
        this.open();
        return;
      }

      const fragment = document.createDocumentFragment();

      if (collections.length > 0) {
        const section = document.createElement("div");
        section.className = "rx-predictive__section";
        section.innerHTML = `
          <h3 class="rx-predictive__heading">Collections</h3>
          <ul class="rx-predictive__collection-list">
            ${collections.map((c) => `<li><a href="${c.url}">${c.title}</a></li>`).join("")}
          </ul>`;
        fragment.appendChild(section);
      }

      if (products.length > 0) {
        const section = document.createElement("div");
        section.className = "rx-predictive__section";
        section.innerHTML = `
          <h3 class="rx-predictive__heading">Products</h3>
          <ul class="rx-predictive__product-list">
            ${products
              .map(
                (p) => `
              <li>
                <a href="${p.url}" class="rx-predictive__product-item">
                  <div class="rx-predictive__product-img">
                    <img src="${p.image}" alt="${p.title.replace(/"/g, "&quot;")}"/>
                  </div>
                  <div class="rx-predictive__product-info">
                    <p class="rx-predictive__product-title">${p.title}</p>
                    <p class="rx-predictive__product-price">${p.price}</p>
                  </div>
                </a>
              </li>`,
              )
              .join("")}
          </ul>`;
        fragment.appendChild(section);
      }

      this.resultsContainer.appendChild(fragment);
      this.open();
    }

    open() {
      this.resultsContainer.classList.add("is-open");
    }

    close() {
      this.resultsContainer.classList.remove("is-open");
    }
  }

  // Instantiate the class and attach to window for easier access
  window.rxPredictiveSearchInstance = new RxPredictiveSearch();
})();
