if (!customElements.get("cart-rewards-block")) {
  class CartRewardsBlock extends HTMLElement {
    constructor() {
      super();
      this.milestones = [
        { threshold: 50000, label: "FREE SHIPPING", icon: "🚚" },
        { threshold: 100000, label: "FREE NORTHERN LIGHTS", icon: "🌌" },
        { threshold: 200000, label: "FREE TABLE LAMP", icon: "✨" },
      ];
    }

    connectedCallback() {
      const drawer = this.closest("cart-drawer");
      if (drawer) {
        drawer.classList.remove("is-empty");
        const drawerItems = drawer.querySelector("cart-drawer-items");
        if (drawerItems) drawerItems.classList.remove("is-empty");
      }

      // 2. Initialize Rewards
      this.updateProgress();
      this.setupEventListeners();
    }

    // Cleanup to prevent memory leaks when Dawn replaces the drawer HTML
    disconnectedCallback() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    setupEventListeners() {
      if (typeof subscribe !== "undefined") {
        this.unsubscribe = subscribe(PUB_SUB_EVENTS.cartUpdate, () => {
          setTimeout(() => this.updateProgress(), 100);
        });
      }
    }

    async getCartTotal() {
      try {
        const response = await fetch("/cart.js");
        const cart = await response.json();
        return cart.total_price;
      } catch (error) {
        console.error("Error fetching cart:", error);
        return 0;
      }
    }

    async updateProgress() {
      const total = await this.getCartTotal();

      // Use 'this.querySelector' instead of 'document.getElementById'
      // so it only searches inside this specific, newly injected element
      const progressBar = this.querySelector("#cart-rewards-progress");
      const messageEl = this.querySelector("#cart-rewards-message");
      const milestoneEls = this.querySelectorAll(".cart-rewards__milestone");

      const maxThreshold =
        this.milestones[this.milestones.length - 1].threshold;
      const progressPercent = Math.min((total / maxThreshold) * 100, 100);

      if (progressBar) {
        if (!progressBar.textContent) {
          progressBar.innerHTML = "&nbsp;";
        }

        // Reset width to trigger CSS transitions smoothly
        progressBar.style.width = "0%";
        void progressBar.offsetWidth; // Force a browser repaint

        setTimeout(() => {
          progressBar.style.width = `${progressPercent}%`;
        }, 50);
      }

      let currentMilestone = null;
      let nextMilestone = null;

      for (let i = 0; i < this.milestones.length; i++) {
        const milestone = this.milestones[i];
        const milestoneEl = milestoneEls[i];

        if (!milestoneEl) continue;

        if (total >= milestone.threshold) {
          milestoneEl.classList.add("completed");
          milestoneEl.classList.remove("active");
          currentMilestone = milestone;
        } else {
          milestoneEl.classList.remove("completed");
          if (!nextMilestone) {
            nextMilestone = milestone;
            milestoneEl.classList.add("active");
          } else {
            milestoneEl.classList.remove("active");
          }
        }
      }

      if (messageEl) {
        if (total >= maxThreshold) {
          messageEl.innerHTML =
            '<span class="cart-rewards__gift-badge">FREE GIFT 🎁</span>';
        } else if (nextMilestone) {
          const remaining = nextMilestone.threshold - total;
          const formattedRemaining = this.formatPrice(remaining);
          messageEl.textContent = `Only ${formattedRemaining} left to get ${nextMilestone.label.toLowerCase()}!`;
        } else {
          messageEl.textContent = "";
        }
      }

      const nextRewardContainer = this.querySelector(
        "#cart-rewards-next-reward",
      );
      const nextRewardIcon = this.querySelector("#next-reward-icon");
      const nextRewardLabel = this.querySelector("#next-reward-label");
      const nextRewardProgress = this.querySelector("#next-reward-progress");

      if (nextMilestone && nextRewardContainer) {
        const remaining = nextMilestone.threshold - total;
        nextRewardIcon.textContent = nextMilestone.icon;
        nextRewardLabel.textContent = `Next: ${nextMilestone.label}`;
        nextRewardProgress.textContent = `${this.formatPrice(remaining)} away`;
        nextRewardContainer.style.display = "flex";
      } else if (nextRewardContainer) {
        nextRewardContainer.style.display = "none";
      }
    }

    formatPrice(cents) {
      const rupees = cents / 100;
      return `$${rupees.toFixed(2)}`;
    }
  }

  customElements.define("cart-rewards-block", CartRewardsBlock);
}
