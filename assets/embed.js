/* assets/embed.js — injected into every internal page.
   Receives currency messages from the parent shell and wires them into
   the page's existing rate input + applyRate() pipeline. */
(function () {
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin) return;
    var msg = e.data;
    if (!msg || msg.type !== 'rate' || typeof msg.value !== 'number') return;
    var input = document.getElementById('rateInput');
    if (input) input.value = msg.value;
    if (typeof applyRate === 'function') applyRate();
  });
})();
