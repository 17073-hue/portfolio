document.addEventListener('DOMContentLoaded', function () {

  // ----- mobile nav toggle -----
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.navlinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // ----- scroll reveal for cards / timeline items / grids -----
  var revealTargets = document.querySelectorAll(
    '.card, .link-card, .work-card, .timeline li, .page-header'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    // no IO support, or user prefers reduced motion: just show everything
    revealTargets.forEach(function (el) { el.classList.add('in-view'); });
  }

  // ----- link-card glow follows the cursor -----
  if (!reduceMotion) {
    document.querySelectorAll('.link-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
      });
    });
  }
});
