(function() {
  var link = document.getElementById('font-css');
  if (link) {
    link.onload = function() { this.media = 'all'; };
  }
})();
