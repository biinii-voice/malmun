/* 말문 — 공통 스크립트: 스크롤 등장 효과 */
(function () {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      setTimeout(function () { el.classList.add("in"); }, i * 70);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  items.forEach(function (el) { io.observe(el); });
})();
