// STUFF MACHINE
// by evetshuu 2022

$(function () {
  // ✨VERSION NUMBER
  const vNo = "0.9.16";
  const vDate = "01.05.25";
  const vMsg =
    "clean up<br />removed titanpoint<br />added archived ritual night tracks";
  $(".sm-version-no").html(vNo);
  $("#sm-loading-date").html(vDate);

  // initialize
  let fullscreened = false;

  const minResizeW = $(window).width() / 4;
  const minResizeH = $(window).height() / 3;

  let onStartMenu = false;

  // !!!!!!![[[[[[[[[UPDATE]]]]]]]]!!!!!!!
  let update = setInterval(() => {
    // full screen check
    if (!fullscreened) {
      $(".window").draggable({
        disabled: false,
        containment: "#window-boundries",
        scroll: false,
        stack: ".window",
        handle: ".window-controls",
      });

      $(".window-content").resizable({
        disabled: false,
        maxHeight: $(window).height() - 68, // vh - (task bar + 29)
        maxWidth: $(window).width() - 100,
        minHeight: $(window).height() / 3,
        minWidth: $(window).width() / 4,
      });
    } else {
      $(".window").draggable("disable");
      $(".window-content").resizable("disable");
    }

    // check start menu hover
    if ($("#start-menu:hover").length != 0) {
      onStartMenu = true;
    } else {
      onStartMenu = false;
    }

    // check if document fullscreen, color fullscreen button
    if (
      (document.fullScreenElement && document.fullScreenElement !== null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)
    ) {
      $("#desktop-fullscreen-button path").css("fill", "var(--color-w-sm)");
    } else {
      $("#desktop-fullscreen-button path").css("fill", "var(--color-y-sm)");
    }

    // venera pdf show
    if (
      $("#venera-window").length != 0 &&
      $("#venera-window").width() > $(window).width() * 0.9
    ) {
      $("#venerapdf").fadeIn();
      $("#venera-words").fadeOut(300);
      showVenera();
    } else {
      $("#venerapdf").fadeOut();
      $("#venera-words").fadeIn(300);
    }
  }, 10);

  $("body").mousedown(function (event) {
    // WINDOW SELECTION
    if (
      $(event.target).closest(".window").hasClass("window") &&
      $(event.target).attr("class") != "window-close-button"
    ) {
      selectWindow($(event.target).closest(".window"));
    } else {
      deselectWindow();
    }

    // START MENU TOGGLE
    if (event.target.id == "#start-menu-button") {
      return;
    } else if ($(event.target).closest("#start-menu-button").length) {
      return;
    } else if (!onStartMenu) {
      startMenuClose();
    }
  });

  // [[[[[[[[[LOAD WINDOW CONTROLS]]]]]]]]
  // with fullscreen
  $(".fs").load("/stuff_machine/window_controls_fs.html", function () {
    // using toggle button
    $(this)
      .find(".window-toggle-button")
      .click(function () {
        toggleFullscreen(this);
      });

    // using double click controls panel
    $(this).dblclick(function () {
      toggleFullscreen(this);
    });

    $(this)
      .find(".window-close-button")
      .click(function () {
        if (fullscreened) {
          toggleFullscreen(this);
        }
        $(this).closest(".window").hide();
      });
  });
  // no fullscreen
  $(".no-fs").load("/stuff_machine/window_controls_nofs.html", function () {
    $(this).off("dblclick"); // disable double click fullscreen
    $(this)
      .find(".window-close-button")
      .click(function () {
        $(this).closest(".window").hide();
        $(this).closest(".window").find("iframe").attr("src", "");
      });
  });

  // ==========================================FULLSCREENING=========================
  // save position before fullscreening
  var saveTempT;
  var saveTempL;
  var saveTempW;
  var saveTempH;
  // toggle fullscreen
  function toggleFullscreen(thing) {
    if (!fullscreened) {
      $(thing).closest(".window").addClass("active-fullscreen");
      saveTempT = $(thing).closest(".window").css("top");
      saveTempL = $(thing).closest(".window").css("left");
      saveTempW = $(thing).closest(".window").css("width");
      saveTempH = $(thing)
        .closest(".window")
        .find(".window-content")
        .css("height");

      $(thing).closest(".window").css({
        position: "absolute",
      });
      $(thing)
        .closest(".window")
        .css({
          top: $(window).scrollTop(), // + 79 (if header)
          left: "0",
          width: "100%",
        });

      $(thing)
        .closest(".window")
        .find(".window-content")
        .css({
          top: -1,
          left: 0,
          width: "100%",
          height: $(window).height() - 69,
        });

      // set icon to subtract
      $(thing)
        .closest(".window")
        .find(".window-toggle-button")
        .html(
          "<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='var(--color-w-sm)' viewBox='0 0 16 16'><path d='M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z' /></svg>",
        );
      // other window's buttons disable
      $(".window-toggle-button")
        .not($(thing).closest(".window").find(".window-toggle-button"))
        .attr("disabled", true);
      fullscreened = true;
    } else {
      $(thing).closest(".window").removeClass("active-fullscreen");
      $(thing).closest(".window").css({
        position: "absolute",
      });
      $(thing).closest(".window").css({
        top: saveTempT,
        left: saveTempL,
        width: saveTempW,
      });
      $(thing).closest(".window").find(".window-content").css({
        top: 0,
        left: 0,
        width: saveTempW,
        height: saveTempH,
      });

      setTimeout(function () {
        $(thing)
          .closest(".window")
          .attr(
            "style",
            $(thing)
              .closest(".window")
              .attr("style")
              .replace(
                "width: " + $(thing).closest(".window").width() + "px",
                "width: max-content",
              ),
          );
      }, 1);

      // set icon to square
      $(thing)
        .closest(".window")
        .find(".window-toggle-button")
        .html(
          "<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='var(--color-w-sm)' viewBox='0 0 16 16'><path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z'/></svg>",
        );
      // button enable
      $(".window-toggle-button")
        .not($(thing).closest(".window").find(".window-toggle-button"))
        .attr("disabled", false);
      fullscreened = false;
    }
  }
  // ==========================================FULLSCREENING=========================

  // ==========================================START MENU=========================
  var startMenuOpened = false;
  function startMenuOpen() {
    var newHeight = $(window).height() - 340;
    $("#start-menu").animate({ top: newHeight }, 350, "easeOutQuad");
    startMenuOpened = true;
  }
  function startMenuClose() {
    ($("#start-menu").animate({ top: "100vh" }, 350), "easeOutQuad");
    startMenuOpened = false;
  }

  // click button to open / close
  $("#start-menu-button").click(function () {
    if (startMenuOpened) {
      startMenuClose();
    } else {
      startMenuOpen();
    }
  });
  $(window).resize(function () {
    // startMenuClose();
    if (fullscreened) {
      toggleFullscreen($(".active-fullscreen").find(".window-toggle-button"));
    }
  });

  // >>>>start menu buttons
  $("#shut-down").click(function () {
    $("#start-menu").css("z-index", "-1"); // menu make unclickable
    $("#header-pullout").fadeOut(300); // hide pull out button
    $(".apps").animate({ opacity: "0" }, 100); // hide apps
    $("#sm-desktop").animate(
      {
        height: "102%",
        width: "98%",
        top: "-=1%",
        left: "+=1%",
      },
      150,
    ); // animate full desktop - shrink
    $("#sm-desktop").animate(
      {
        height: "0%",
        top: "+=51%",
      },
      900,
    ); // animate full desktop - collapse
    $("#task-bar").animate({ backgroundColor: "#f23e3e" }, 600); // change task bar color
    $("#stuff-space").animate({ backgroundColor: "#f23e3e" }, 600); // change stuff space color
    $("#sm-desktop").hide(150); // hide full desktop
    setTimeout(function () {
      $("#sm-restart").fadeIn(1500);
    }, 1100); // display restart button
  });
  $("#sm-restart img").mouseover(function () {
    var randomAngle = Math.floor(Math.random() * 355) + 5;
    $(this).rotate({
      animateTo: randomAngle,
    });
  });
  $("#sm-restart img").click(function () {
    window.location.reload(true);
  });
  $("#reboot").click(function () {
    window.location.reload(true);
  });
  // ==========================================START MENU END=====================

  // ==========================================TASK BAR=========================
  // >>>> task bar time
  var taskBarTime = setInterval(() => {
    $("#tb-time").html(
      ("0" + new Date(Date.now()).getHours()).slice(-2) +
        ":" +
        ("0" + new Date(Date.now()).getMinutes()).slice(-2) +
        ":" +
        ("0" + new Date(Date.now()).getSeconds()).slice(-2),
    );
    if (
      new Date(Date.now()).getHours() < 5 ||
      new Date(Date.now()).getHours() >= 19
    ) {
      $("#time-of-day-icon").html(
        "<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='var(--color-w-sm)' class='bi bi-moon-stars-fill' viewBox='0 0 16 16'><path d='M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z'/><path d='M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z'/></svg>",
      );
    } else if (
      new Date(Date.now()).getHours() >= 5 &&
      new Date(Date.now()).getHours() < 7
    ) {
      $("#time-of-day-icon").html(
        "<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='var(--color-w-sm)' class='bi bi-sunrise-fill' viewBox='0 0 16 16'><path d='M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708l1.5-1.5zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z'/></svg>",
      );
    } else if (
      new Date(Date.now()).getHours() >= 17 &&
      new Date(Date.now()).getHours() < 19
    ) {
      $("#time-of-day-icon").html(
        "<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='var(--color-w-sm)' class='bi bi-sunset-fill' viewBox='0 0 16 16'><path d='M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z'/></svg>",
      );
    } else {
      $("#time-of-day-icon").html(
        "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='var(--color-w-sm)' class='bi bi-sun-fill' viewBox='0 0 16 16'><path d='M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z'/></svg>",
      );
    }
  }, 1000);

  // >>>> task bar icons
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]',
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
  );
  $("#desktop-fullscreen-button").click(function () {
    if (
      (document.fullScreenElement && document.fullScreenElement !== null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)
    ) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(
          Element.ALLOW_KEYBOARD_INPUT,
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  });
  $("#close-all-window-button").click(function () {
    $(".window").hide();
  });
  // ==========================================TASK BAR END=====================

  // [[[[[[[[[APPS]]]]]]]]
  // random window location
  function randomWindowLocation(w) {
    var randomLeft = Math.random() * $(window).width();
    var randomTop = Math.random() * $(window).height();
    if (
      randomLeft > $(window).width() / 2 ||
      randomTop > $(window).height() / 2
    ) {
      randomLeft /= 3;
      randomTop /= 3;
    }
    $(w).css({
      left: randomLeft,
      top: randomTop,
    });
  }
  // select window
  function selectWindow(windowToSelect) {
    $(windowToSelect).addClass("active-window");
    $(".window").not(windowToSelect).removeClass("active-window");
    setTimeout(function () {
      $(windowToSelect)
        .find(".window-controls")
        .css("box-shadow", "0px 5px 30px var(--color-y-sm) inset");
    }, 50);
    $(".window")
      .not(windowToSelect)
      .find(".window-controls")
      .css("box-shadow", "none");
  }
  function deselectWindow() {
    $(".window").removeClass("active-window");
    $(".window").find(".window-controls").css("box-shadow", "none");
  }
  // >>>>
  //app open
  function appOpen(
    type,
    windowId,
    windowWidth,
    windowHeight,
    windowContent,
    clickedApp,
    windowName,
  ) {
    $(windowId).fadeIn(100);

    randomWindowLocation(windowId);

    $(windowId).find(".window-content").css({
      width: windowWidth,
      height: windowHeight,
    });

    selectWindow(windowId);

    if (windowName == null) {
      $(windowId)
        .find(".window-header-text")
        .html(clickedApp.find("p").text().replace(/\s/g, ""));
    } else {
      $(windowId).find(".window-header-text").html(windowName);
    }

    setTimeout(function () {
      $(windowId).attr(
        "style",
        $(windowId)
          .closest(".window")
          .attr("style")
          .replace("width: " + windowWidth, "width: max-content !important"),
      );
    }, 100 + 1);

    // window type: TEXT
    if (type == ".window-content-text") {
      $(windowId)
        .find(".window-content-text")
        .load(windowContent, function () {
          $(".sm-version-no").html(vNo);
          $(".sm-update-date").html(vDate);
          $(".sm-update-message").html(vMsg);
        });
    }
    // window type: FOLDER
    if (type == ".window-content-folder") {
      $(windowId)
        .find(".window-content-folder")
        .load(windowContent, function () {
          if (windowId == "#audio-folder") {
            audioFolderActivate();
          }
          if (windowId == "#visual-folder") {
            visualFolderActivate();
          }

          $(windowId)
            .find(".window-content-folder")
            .append(
              "<script>" +
                selectWindow +
                mediaOpen +
                randomWindowLocation +
                "</script>",
            );
        });
    }
  }
  // >>>>
  // media open
  function mediaOpen(type, clipToPlay) {
    var part = clipToPlay.split("/").pop();
    var newID = part.substring(0, part.indexOf("."));
    var newIDSelector = "#" + newID;

    if ($(newIDSelector).length) {
      $(newIDSelector).fadeIn(100);
      selectWindow(newIDSelector);
    } else {
      $("#media-viewer-holder").append(
        "<div class='window media-viewer' id='" +
          newID +
          "'>" +
          "<div class='window-controls no-fs d-flex justify-content-end'> <p class='window-header-text'>" +
          "</p> <button class='window-close-button d-flex align-items-center justify-content-center' > <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='var(--color-w-sm)' viewBox='0 0 16 16' > <path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z' /> </svg> </button> </div>" +
          "<div class='window-content-fixed'> <div class='viewer-loader'><div class='loader'><div class='loader-sub'></div></div></div> <div class='viewer-content'></div> </div></div>",
      );

      $(newIDSelector)
        .find(".window-close-button")
        .click(function () {
          $(newIDSelector).find("audio").trigger("pause");
          $(newIDSelector).find("audio").prop("currentTime", 0);
          $(newIDSelector).find("video").trigger("pause");
          $(newIDSelector).find("video").prop("currentTime", 0);
          $(this).closest(".media-viewer").hide();
        });

      randomWindowLocation(newIDSelector);

      $(newIDSelector)
        .find(".window-header-text")
        .html(clipToPlay.split("/").pop());

      $(newIDSelector).find(".viewer-loader").css("display", "block");
      $(newIDSelector).find(".viewer-content").css("display", "none");
      setTimeout(function () {
        $(newIDSelector).find(".viewer-loader").css("display", "none");
        $(newIDSelector).find(".viewer-content").css("display", "block");
      }, 1000);

      if (type == "audio") {
        $(newIDSelector)
          .find(".viewer-content")
          .load("/stuff_machine/viewers/audio_viewer.html", function () {
            $(this).find("audio").attr("src", clipToPlay);
          });
      }
      if (type == "video") {
        $(newIDSelector)
          .find(".viewer-content")
          .load("/stuff_machine/viewers/video_viewer.html", function () {
            $(this).find("video").attr("src", clipToPlay);
          });
      }
      if (type == "image") {
        $(newIDSelector)
          .find(".viewer-content")
          .load("/stuff_machine/viewers/image_viewer.html", function () {
            $(this).find(".image-clip").attr("src", clipToPlay);
          });
      }

      $(newIDSelector).fadeIn(100);
      selectWindow(newIDSelector);
    }
  }
  // >>>>
  // folder open
  var backSvg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='var(--color-w-sm)' viewBox='0 0 16 16'><path d='M4.854 1.146a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L4 2.707V12.5A2.5 2.5 0 0 0 6.5 15h8a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 12.5V2.707l3.146 3.147a.5.5 0 1 0 .708-.708l-4-4z'/></svg>";
  // depth 2
  function folderOpenL2(
    thisId,
    parentId,
    lastLvlId,
    nextLvlId,
    parentName,
    lastLvlName,
    nextLvlName,
  ) {
    $(thisId).closest(".folder-lvl-1").hide();
    $(thisId).closest(".folder-lvl-2").hide();
    $(nextLvlId).show();

    // path
    if (lastLvlId == parentId) {
      $(nextLvlId)
        .closest(".window")
        .find(".folder-path")
        .html(
          "<inline class='folder-back-button'>" +
            backSvg +
            lastLvlName +
            "</inline>/" +
            nextLvlName,
        );
    } else {
      $(nextLvlId)
        .closest(".window")
        .find(".folder-path")
        .html(
          "<inline class='folder-back-button'>" +
            backSvg +
            parentName +
            "</inline>/" +
            "<inline class='folder-back-button-lvl2'>" +
            lastLvlName +
            "</inline>/" +
            nextLvlName,
        );

      $(".folder-back-button-lvl2").click(function () {
        folderBack(false, parentId, nextLvlId, lastLvlId, nextLvlName);
      });
    }

    $(".folder-back-button").click(function () {
      folderBack(true, parentId, nextLvlId, parentId);
    });
  }
  function folderBack(
    isBackToParent,
    parentId,
    currentId,
    backToId,
    currentName,
  ) {
    $(currentId).hide();

    if (isBackToParent) {
      $(currentId).closest(".window").find(".folder-path").html("");
      $(parentId).show();
    } else {
      // get current path
      var current = $(currentId).closest(".window").find(".folder-path").html();
      // chang path
      $(currentId)
        .closest(".window")
        .find(".folder-path")
        .html(current.replace("/" + currentName, ""));
      // reset first back button
      $(".folder-back-button").click(function () {
        folderBack(true, parentId, backToId, parentId);
      });
      $(backToId).show();
    }
  }

  //
  var disFromCenterX = 0,
    disFromCenterY = 0;
  window.onmousemove = function (e) {
    disFromCenterX = Math.abs(window.innerWidth / 2 - e.pageX);
    $("#notes-background").css({
      filter: " hue-rotate(" + disFromCenterX * 0.15 + "deg)",
    });
  };

  // apps individual
  $("#app-about").click(function () {
    appOpen(
      ".window-content-text",
      "#about-window",
      minResizeW,
      minResizeH,
      "/stuff_machine/start_menu_windows/about_window.html",
      $(this),
      "About Stuff Machine",
    );
    startMenuClose();
  });
  $("#app-legal").click(function () {
    appOpen(
      ".window-content-text",
      "#legal-window",
      minResizeW,
      minResizeH,
      "/stuff_machine/start_menu_windows/legal_window.html",
      $(this),
      "Terms & Conditions",
    );
    startMenuClose();
  });
  $("#app-bug").click(function () {
    appOpen(
      ".window-content-text",
      "#bug-window",
      minResizeW,
      minResizeH,
      "/stuff_machine/start_menu_windows/bug_window.html",
      $(this),
      "Report a Bug...",
    );
    startMenuClose();
  });

  $("#app-venera").dblclick(function () {
    appOpen(
      ".window-content-text",
      "#venera-window",
      minResizeW,
      minResizeH,
      "/stuff_machine/venera_window.html",
      $(this),
    );
  });
  function showVenera() {
    setTimeout(function () {
      $("#venerapdf .loader").css("display", "none");
      $("#venerapdf iframe").css("display", "block");
    }, 2000);
  }
  $("#app-photo").dblclick(function () {
    appOpen(
      "",
      "#photo-window",
      $(window).width() / 2,
      $(window).height() / 2,
      "",
      $(this),
    );
    $("#photo-window")
      .find("iframe")
      .attr("src", "../stuff_machine/photos.html");
  });
  $("#app-audio").dblclick(function () {
    appOpen(
      ".window-content-folder",
      "#audio-folder",
      minResizeW,
      minResizeH,
      "/stuff_machine/folder_windows/audio_window.html",
      $(this),
    );
  });
  $("#app-visual").dblclick(function () {
    appOpen(
      ".window-content-folder",
      "#visual-folder",
      minResizeW,
      minResizeH,
      "/stuff_machine/folder_windows/visual_window.html",
      $(this),
    );
  });
  $("#app-titanpoint").dblclick(function () {
    appOpen("", "#titanpoint-window", minResizeW, minResizeH, "", $(this));
    $("#titanpoint-window")
      .find("iframe")
      .attr(
        "src",
        "https://evetshuu.com/stuff_machine/webgl/u_titanpoint/index.html",
      );
  });

  $("#app-notes").dblclick(function () {
    appOpen(
      ".window-content-text",
      "#notes-window",
      minResizeW,
      minResizeH,
      "/stuff_machine/notes_window.html",
      $(this),
      "notes",
    );
  });

  var audioFolderActivate = function () {
    // level 1
    $("#audio-songs").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-parent",
        "#audio-songs-content",
        "audio",
        "audio",
        "songs",
      );
      // TESTopener();
    });
    $("#audio-games").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-parent",
        "#audio-games-content",
        "audio",
        "audio",
        "from-games",
      );
    });
    $("#audio-other").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-parent",
        "#audio-other-content",
        "audio",
        "audio",
        "other",
      );
    });
    // level 2 - games
    $("#games-ritual").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-games-content",
        "#games-ritual-content",
        "audio",
        "from-games",
        "rn-unused",
      );
    });
    $("#games-anamnesis").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-games-content",
        "#games-anamnesis-content",
        "audio",
        "from-games",
        "anamnesis",
      );
    });
    $("#games-space").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-games-content",
        "#games-space-content",
        "audio",
        "from-games",
        "space-game",
      );
    });
    $("#games-sanctum").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-games-content",
        "#games-sanctum-content",
        "audio",
        "from-games",
        "sanctum",
      );
    });
  };
  var visualFolderActivate = function () {
    // level 1
    $("#visual-gifs").dblclick(function () {
      folderOpenL2(
        this,
        "#visual-parent",
        "#visual-parent",
        "#visual-gifs-content",
        "visual",
        "visual",
        "gifs",
      );
    });
    $("#visual-notgifs").dblclick(function () {
      folderOpenL2(
        this,
        "#visual-parent",
        "#visual-parent",
        "#visual-notgifs-content",
        "visual",
        "visual",
        "not-gifs",
      );
    });
  };

  // startup open
  setTimeout(() => {
    appOpen(
      ".window-content-text",
      "#about-window",
      minResizeW,
      minResizeH,
      "/stuff_machine/start_menu_windows/about_window.html",
      $("#app-about"),
      "About Stuff Machine",
    );
  }, 500);
});
