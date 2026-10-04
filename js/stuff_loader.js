var meterInterval;
var clockInterval;
var checkingAnim;

function generalListAnim() {
  clockInterval = setInterval(() => {
    var now = new Date(Date.now());
    var formatted = now.toISOString();
    $("#current-time").html(formatted);
  }, 16);
  setTimeout(function () {
    $("#general-list").css("display", "block");
  }, 300);
  setTimeout(function () {
    $("#logged-in").html("maste_");
  }, 400);
  setTimeout(function () {
    $("#logged-in").html("tigerh");
  }, 630);
  setTimeout(function () {
    $("#logged-in").html("tigerh.");
  }, 1050);
  setTimeout(function () {
    $("#logged-in").html("matcha-menace");
  }, 1110);
  setTimeout(function () {
    $("#logged-in").html("masterhuhu");
  }, 1600);
}

// 1150
function checklistAnim() {
  var onMobile = window.matchMedia("(max-width: 1319px)").matches;

  setTimeout(function () {
    $("#checklist").css("display", "block");
  }, 650);
  setTimeout(function () {
    $("#on-mobile-li").css("display", "block");
  }, 950);
  setTimeout(function () {
    if (onMobile) {
      $("#on-mobile").html("<span style='color: #f23e3e'>Y.</span>");
    } else {
      $("#on-mobile").html("<span style='color: #31E863'>N.</span>");
    }
  }, 1100);

  // if not on mobile
  if (!onMobile) {
    $("#acsii-prop").css("display", "block");

    setTimeout(function () {
      $("#meter-li").css("display", "block");
    }, 1400);

    var initialStar = 42 * 4;
    meterInterval = setInterval(() => {
      $("#meter").html((initialStar *= 13));
    }, 50);

    setTimeout(function () {
      $("#cat-li").css("display", "block");
    }, 1800);
    setTimeout(function () {
      $("#get-li").css("display", "block");
    }, 2000);

    setTimeout(function () {
      $("#acsii-art").css("display", "block");
      $("#acsii-art").animate({ fontSize: ".75em" });
    }, 2000);

    setTimeout(showStuff, 2000);
  }

  // if on mobile
  else {
    $("#acsii-prop").css("display", "none");

    setTimeout(function () {
      $("#mobile-message").css("display", "block");
    }, 2000);
  }
}

function booting() {
  if (window.matchMedia("(max-width: 1319px)").matches) {
    $("#stuff-machine-loader").css({
      position: "absolute",
      left: "5%",
    });
  }

  generalListAnim();

  checkingAnim = setInterval(() => {
    $("#checking").animate({ letterSpacing: "+=15px" }, 300);
    $("#checking").animate({ letterSpacing: "-=15px" }, 300);
  }, 600);

  checklistAnim();
  ChangeStuffMachineCursor(localStorage.getItem("theme") || "default");
}

function showStuff() {
  $("#stuff-machine-loader").animate({ top: "40px" }, 750);
  setTimeout(function () {
    $("#stuff-machine-loader").css("display", "none");
    // loader is gone, stop its animations
    clearInterval(meterInterval);
    clearInterval(clockInterval);
    clearInterval(checkingAnim);
    $("#sm-load").empty();
    $("#sm-desktop").fadeIn(1000);
  }, 1100);
}

function ChangeStuffMachineCursor(changeTo) {
  switch (changeTo) {
    case "default":
      $("body").addClass("default-theme");
      $("html").addClass("default-theme");
      $("body").removeClass("light-theme");
      $("html").removeClass("light-theme");
      break;
    case "light":
      $("body").addClass("light-theme");
      $("html").addClass("light-theme");
      $("body").removeClass("default-theme");
      $("html").removeClass("default-theme");
      break;
  }
}
