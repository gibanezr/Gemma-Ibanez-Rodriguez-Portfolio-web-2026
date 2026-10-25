const b = document.getElementById("burger");
const m = document.getElementById("menu");
const themeToggles = document.querySelectorAll(".theme-toggle");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

const copyEmailButton = document.querySelector("[data-copy-email]");
const copyEmailStatus = document.getElementById("copy-email-status");

if (copyEmailButton) {
  copyEmailButton.addEventListener("click", async () => {
    const email = document.querySelector("footer .mail")?.href.replace(/^mailto:/, "").split("?")[0];

    if (!email) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = email;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.append(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand("copy");
        temporaryInput.remove();
        if (!copied) throw new Error("No se pudo copiar el correo.");
      }

      copyEmailButton.textContent = "¡Copiado!";
      copyEmailButton.classList.add("copied");
      copyEmailStatus.textContent = "Correo copiado al portapapeles.";
      window.clearTimeout(copyEmailButton.feedbackTimer);
      copyEmailButton.feedbackTimer = window.setTimeout(() => {
        copyEmailButton.textContent = "Copiar correo";
        copyEmailButton.classList.remove("copied");
        copyEmailStatus.textContent = "";
      }, 1800);
    } catch {
      copyEmailStatus.textContent = "No se pudo copiar. Puedes seleccionar el correo y copiarlo manualmente.";
    }
  });
}

function updateThemeToggle() {
  const manualTheme = document.documentElement.dataset.theme;
  const isDark = manualTheme ? manualTheme === "dark" : systemTheme.matches;

  themeToggles.forEach((toggle) => {
    toggle.dataset.mode = isDark ? "dark" : "light";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.title = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
  });
}

updateThemeToggle();
themeToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const nextTheme = toggle.dataset.mode === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    updateThemeToggle();

    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch {}

    if (m.classList.contains("open")) {
      m.classList.remove("open");
      b.setAttribute("aria-expanded", "false");
      b.focus();
    }
  });
});

systemTheme.addEventListener("change", () => {
  if (!document.documentElement.dataset.theme) {
    updateThemeToggle();
  }
});

const mobileProjectCopy = window.matchMedia("(max-width: 600px)");
const projectMoreDetails = [];

document.querySelectorAll(".project .info").forEach((info) => {
  const copyNodes = [...info.children].filter((child) => child.tagName !== "H3");

  if (copyNodes.length < 2) return;

  const firstParagraph = copyNodes.shift();
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const extraCopy = document.createElement("div");

  details.className = "project-more";
  summary.textContent = "Leer más";
  extraCopy.className = "project-more-content";

  copyNodes.forEach((node) => extraCopy.append(node));
  details.append(summary, extraCopy);
  info.append(details);
  details.open = !mobileProjectCopy.matches;

  details.addEventListener("toggle", () => {
    summary.textContent = details.open ? "Leer menos" : "Leer más";
  });

  projectMoreDetails.push(details);
});

mobileProjectCopy.addEventListener("change", (event) => {
  projectMoreDetails.forEach((details) => {
    details.open = !event.matches;
  });
});

b.addEventListener("click", () => {
  const o = m.classList.toggle("open");
  b.setAttribute("aria-expanded", o);
});

m.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    m.classList.remove("open");
    b.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && m.classList.contains("open")) {
    m.classList.remove("open");
    b.setAttribute("aria-expanded", "false");
    b.focus();
  }
});

document.querySelectorAll(".v video").forEach((v) => {
  const f = () => {
    const d = document.createElement("div");
    d.className = "ph";
    d.textContent =
      "Vídeo pendiente: " +
      v.closest("figure").querySelector("figcaption").textContent;
    v.replaceWith(d);
  };

  v.addEventListener("error", f);

  if (v.error) {
    f();
  }
});

const lb = document.getElementById("lb");
const li = lb.querySelector("img");
const ct = lb.querySelector(".ct");

let grp = [];
let cur = 0;
let last = null;
let sx = 0;

let lightboxZoomClone = null;
let lightboxZoomAnimation = null;

function clearLightboxZoom() {
  if (lightboxZoomAnimation) {
    lightboxZoomAnimation.cancel();
    lightboxZoomAnimation = null;
  }

  if (lightboxZoomClone) {
    lightboxZoomClone.remove();
    lightboxZoomClone = null;
  }

  li.classList.remove("lb-image-hidden");
}

function animateLightboxFrom(sourceImage) {
  if (reduceMotion || typeof li.animate !== "function") {
    return;
  }

  li.classList.add("lb-image-hidden");

  const startAnimation = () => {
    if (!lb.classList.contains("open")) {
      clearLightboxZoom();
      return;
    }

    const start = sourceImage.getBoundingClientRect();
    const end = li.getBoundingClientRect();

    if (!start.width || !start.height || !end.width || !end.height) {
      clearLightboxZoom();
      return;
    }

    const clone = document.createElement("img");
    clone.className = "lb-zoom-clone";
    clone.src = li.currentSrc || li.src;
    clone.alt = "";
    clone.setAttribute("aria-hidden", "true");
    clone.style.objectFit = getComputedStyle(sourceImage).objectFit;
    clone.style.left = `${start.left}px`;
    clone.style.top = `${start.top}px`;
    clone.style.width = `${start.width}px`;
    clone.style.height = `${start.height}px`;
    lb.append(clone);
    lightboxZoomClone = clone;

    lightboxZoomAnimation = clone.animate(
      [
        { left: `${start.left}px`, top: `${start.top}px`, width: `${start.width}px`, height: `${start.height}px` },
        { left: `${end.left}px`, top: `${end.top}px`, width: `${end.width}px`, height: `${end.height}px` },
      ],
      { duration: 480, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", fill: "both" },
    );

    lightboxZoomAnimation.addEventListener(
      "finish",
      () => {
        if (lightboxZoomClone === clone) {
          clearLightboxZoom();
        }
      },
      { once: true },
    );
  };

  if (li.complete && li.naturalWidth) {
    requestAnimationFrame(startAnimation);
  } else {
    li.addEventListener("load", () => requestAnimationFrame(startAnimation), { once: true });
    li.addEventListener("error", clearLightboxZoom, { once: true });
  }
}

function show(i) {
  clearLightboxZoom();
  cur = (i + grp.length) % grp.length;

  const im = grp[cur].querySelector("img");
  li.src = im.currentSrc || im.src;
  li.alt = im.alt;
  ct.textContent = cur + 1 + " / " + grp.length;
}

function closeLb() {
  clearLightboxZoom();
  lb.classList.remove("open");
  document.body.style.overflow = "";

  if (last) {
    last.focus();
  }
}

document.addEventListener("click", (e) => {
  const t = e.target.closest(".th");

  if (t) {
    grp = [
      ...document.querySelectorAll('.th[data-g="' + t.dataset.g + '"]'),
    ];
    last = t;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    show(grp.indexOf(t));
    const sourceImage = t.querySelector("img");

    if (sourceImage) {
      animateLightboxFrom(sourceImage);
    }

    lb.querySelector(".x").focus();
    return;
  }

  if (!lb.classList.contains("open")) {
    return;
  }

  if (e.target.closest(".x") || e.target === lb) {
    closeLb();
  } else if (e.target.closest(".pv")) {
    show(cur - 1);
  } else if (e.target.closest(".nx")) {
    show(cur + 1);
  }
});

document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) {
    return;
  }

  if (e.key === "Escape") {
    closeLb();
  }

  if (e.key === "ArrowLeft") {
    show(cur - 1);
  }

  if (e.key === "ArrowRight") {
    show(cur + 1);
  }
});

lb.addEventListener(
  "touchstart",
  (e) => {
    sx = e.touches[0].clientX;
  },
  { passive: true },
);

lb.addEventListener("touchend", (e) => {
  const d = e.changedTouches[0].clientX - sx;

  if (Math.abs(d) > 50) {
    show(cur + (d < 0 ? 1 : -1));
  }
});

// Apariciones suaves de proyectos y galerías al desplazarse.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealItems = [...document.querySelectorAll(".project, .gal .th")];

  revealItems.forEach((item) => {
    item.classList.add("reveal-on-scroll");
  });

  document.querySelectorAll(".gal").forEach((gallery) => {
    gallery.querySelectorAll(".th").forEach((item, index) => {
      const delay = Math.min(index, 5) * 80;
      item.style.setProperty("--reveal-delay", `${delay}ms`);
    });
  });

  document.documentElement.classList.add("scroll-reveal-ready");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.08,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// Indicador de sección actual y progreso de lectura.
const scrollProgress = document.querySelector(".scroll-progress span");
const sectionLinks = [...m.querySelectorAll("a[href^=\"#\"]")]
  .map((link) => ({
    link,
    section: document.getElementById(link.getAttribute("href").slice(1)),
  }))
  .filter((item) => item.section)
  .sort((a, b) => {
    if (a.section === b.section) return 0;
    return a.section.compareDocumentPosition(b.section) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });

if (scrollProgress && sectionLinks.length) {
  let scrollStatusPending = false;

  const updateScrollStatus = () => {
    const documentElement = document.documentElement;
    const maxScroll = documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;

    const activationPoint = window.scrollY + window.innerHeight * 0.32;
    let currentSection = null;

    sectionLinks.forEach((item) => {
      const sectionTop = item.section.getBoundingClientRect().top + window.scrollY;
      if (sectionTop <= activationPoint) currentSection = item;
    });

    if (window.scrollY + window.innerHeight >= documentElement.scrollHeight - 2) {
      currentSection = sectionLinks[sectionLinks.length - 1];
    }

    sectionLinks.forEach(({ link }) => {
      const isCurrent = currentSection?.link === link;
      link.classList.toggle("active", isCurrent);

      if (isCurrent) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const scheduleScrollStatusUpdate = () => {
    if (scrollStatusPending) return;
    scrollStatusPending = true;

    window.requestAnimationFrame(() => {
      updateScrollStatus();
      scrollStatusPending = false;
    });
  };

  window.addEventListener("scroll", scheduleScrollStatusUpdate, { passive: true });
  window.addEventListener("resize", scheduleScrollStatusUpdate);
  window.addEventListener("load", updateScrollStatus, { once: true });
  updateScrollStatus();
}

// Desplazamiento suave con Lenis, manteniendo los enlaces de ancla.
if (window.Lenis) {
  new window.Lenis({
    autoRaf: true,
    anchors: true,
    lerp: 0.08,
  });
}
