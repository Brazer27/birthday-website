// ===============================
// Birthday Website JS
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Modal ----------
   // ===============================
 // MODAL MESSAGE
 // ===============================

const msgBtn = document.getElementById("msgBtn");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");

function openModal() {
  if (modalOverlay) {
    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove("open");
    document.body.style.overflow = "auto";
  }
}

// Open modal
if (msgBtn) {
  msgBtn.addEventListener("click", openModal);
}

// Close button X
if (modalClose) {
  modalClose.addEventListener("click", function (e) {
    e.stopPropagation();
    closeModal();
  });
}

// Click outside modal box
if (modalOverlay) {
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

  // ---------- Candle blow effect ----------
  const candles = document.querySelectorAll(".candle");
  const blownMsg = document.getElementById("blownMsg");
  const blowHint = document.getElementById("blowHint");

  function allCandlesBlown() {
    return [...candles].every((candle) => candle.classList.contains("blown"));
  }

  function updateBirthdayState() {
    if (allCandlesBlown()) {
      if (blowHint) blowHint.style.display = "none";
      if (blownMsg) blownMsg.style.display = "block";
      launchConfetti(220);
    }
  }

  candles.forEach((candle) => {
    candle.addEventListener("click", () => {
      candle.classList.add("blown");
      launchConfetti(60);
      updateBirthdayState();
    });
  });

  // ---------- Lightbox ----------
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");

  window.openLightbox = function (item) {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;

    const img = item.querySelector("img");
    const caption = item.querySelector(".caption");

    if (!img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "Memory image";
    lightboxCaption.textContent = caption ? caption.textContent : "";

    lightbox.classList.add("open");
  };

  window.closeLightbox = function () {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    if (lightboxImg) lightboxImg.src = "";
  };

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) window.closeLightbox();
    });
  }

  // ---------- Keyboard shortcuts ----------
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      window.closeLightbox();
    }
  });

  // ---------- Simple confetti ----------
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let confettiPieces = [];
  let animationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function launchConfetti(count = 100) {
    const colors = ["#FF8FAB", "#74B9FF", "#5ECFBF", "#FFD166", "#FFFFFF"];

    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        size: 6 + Math.random() * 6,
        speedY: 2 + Math.random() * 4,
        speedX: -2 + Math.random() * 4,
        rotation: Math.random() * 360,
        rotationSpeed: -6 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 120 + Math.random() * 60
      });
    }

    if (!animationId) animateConfetti();
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      ctx.restore();

      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      p.life -= 1;
    });

    confettiPieces = confettiPieces.filter((p) => p.life > 0 && p.y < canvas.height + 30);

    if (confettiPieces.length > 0) {
      animationId = requestAnimationFrame(animateConfetti);
    } else {
      animationId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // expose for other handlers
  window.launchConfetti = launchConfetti;
});