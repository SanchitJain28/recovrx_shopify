document.addEventListener("DOMContentLoaded", () => {
  console.log("[USP Stats] DOMContentLoaded fired");

  const statsSection = document.querySelector(".rx-stats");
  console.log("[USP Stats] Section found:", statsSection);

  if (!statsSection) {
    console.warn("[USP Stats] .rx-stats not found — aborting");
    return;
  }

  if (typeof gsap === "undefined") {
    console.warn("[USP Stats] GSAP is not loaded");
    return;
  }

  console.log("[USP Stats] GSAP is available, setting up IntersectionObserver");

  const items = statsSection.querySelectorAll(".rx-stats__item");
  const numbers = statsSection.querySelectorAll(".rx-stats__number");

  console.log("[USP Stats] Items found:", items.length);
  console.log("[USP Stats] Number elements found:", numbers.length);

  // Define the animation sequence
  const playAnimations = () => {
    console.log("[USP Stats] Observer triggered: playing animations");

    if (items.length > 0) {
      // Using fromTo prevents any flashing before the animation starts
      gsap.fromTo(
        items,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
      );
    }

    numbers.forEach((el, i) => {
      const raw = el.getAttribute("data-target");
      const target = parseFloat(raw) || 0;
      const isFloat = target % 1 !== 0;

      console.log(
        `[USP Stats] Number[${i}] raw="${raw}" parsed=${target} isFloat=${isFloat}`,
      );

      const proxy = { val: 0 };

      gsap.to(proxy, {
        val: target,
        duration: 1.5,
        ease: "power2.out",
        onStart() {
          console.log(
            `[USP Stats] Number[${i}] tween started, target=${target}`,
          );
        },
        onUpdate() {
          const display = isFloat
            ? proxy.val.toFixed(1)
            : Math.round(proxy.val).toLocaleString();
          el.textContent = display;
        },
        onComplete() {
          console.log(
            `[USP Stats] Number[${i}] tween complete, final=${el.textContent}`,
          );
        },
      });
    });
  };

  // Set initial hidden state so elements don't show before scrolling down
  if (items.length > 0) {
    gsap.set(items, { opacity: 0, y: 30 });
  }

  // Set up the native Intersection Observer
  // rootMargin "-15% 0px" equals ScrollTrigger's "top 85%"
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playAnimations();

          // Unobserve to play only once (mimics toggleActions: "play none none none")
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -15% 0px",
      threshold: 0,
    },
  );

  observer.observe(statsSection);
});
