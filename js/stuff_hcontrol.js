// displaying header
function smShowHeader(time) {
  $("#header-pullout").fadeOut(100);
  setTimeout(function () {
    $("header").animate({ top: "0" }, time);
    $("nav").fadeIn(time);
  }, 100);
}
function smHideHeader(time) {
  $("header").animate({ top: "-80px" }, time);
  $("nav").fadeOut(time);
  setTimeout(function () {
    $("#header-pullout").fadeIn(300);
  }, time);
}

$(function () {
  var onHeader = false;
  var displayHeader = false;
  // check if hovering above header (header is loaded in later, so delegate)
  $(document)
    .on("mouseenter", "header", function () {
      onHeader = true;
    })
    .on("mouseleave", "header", function () {
      onHeader = false;
    });

  var onMobile = window.matchMedia("(max-width: 1319px)").matches;

  // load header
  PageSetup(false, "#nav-link-stuff", true);
  // run if not on mobile
  if (!onMobile) {
    setTimeout(function () {
      smHideHeader(500);
    }, 500);

    var pullOutTimer = 0;
    setInterval(() => {
      if (!onHeader && displayHeader) {
        pullOutTimer++;
        if (pullOutTimer > 150) {
          smHideHeader(500);
          displayHeader = false;
        }
      } else {
        pullOutTimer = 0;
      }
    }, 10);

    $("#header-pullout").click(function () {
      smShowHeader(500);
      displayHeader = true;
    });
  }
});
