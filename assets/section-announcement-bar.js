document.addEventListener("DOMContentLoaded", () => {
  const announcementBars = document.querySelectorAll(".rx-announcement-bar");

  announcementBars.forEach((bar) => {
    const inner = bar.querySelector(".rx-announcement-bar__inner");
    const speed = parseInt(bar.getAttribute("data-speed")) || 18;

    // Ensure GSAP is loaded before executing
    if (inner && typeof gsap !== "undefined") {
      gsap.to(inner, {
        x: "-50%",
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    }
  });
});
