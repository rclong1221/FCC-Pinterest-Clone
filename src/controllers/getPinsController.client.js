'use strict'
var isLoggedIn = false;

$(document).ready(function () {
  $.get("/api/user/:id", function (d, s) {
    if (d.id) isLoggedIn = true;
  })
  getNewestPins()
})

function getNewestPins() {
  var url;
  if (window.location.pathname === "/") {
    url = "/api/pins/";
  }
  else {
    var x = window.location.pathname.split("/");
    x = x[x.length - 1];
    url = `/api/user/${x}/pins/`;
  }
  $.get(url, function (d) {
    var div = "";
    d.forEach(function (p) {
      var likedClass = ""
      if (p.userLike) likedClass = (p.userLike.status) ? " liked" : "";
      div += `
        <div class="grid-item border main-border-color rounded px-1 py-1">
        <a href="${p.pageUrl}" target="_blank">
          <img id="i-u-${p._id}" src="${p.imgUrl}" onerror="imgError('${p._id}')"/>
          <div id="t-${p._id}">${p.title}</div>
          <a class="username-text" id="u-${p._id}" href="/user/${p.user.twitter.id}">${p.user.twitter.displayName}</a>
          <button class="btn btn-primary${likedClass}" id="l-${p._id}" onclick="likePin('${p._id}')">Like</button>
        </a>
        </div>
      `
    });
    // <button class="btn btn-secondary" id="s-${p._id}" onclick="sharePin('${p._id}')">Share</button>
    $("#c").append(div);

    initMasonry();
  })
}

function imgError(id) {
  $(`#i-u-${id}`).attr("src", "https://picsum.photos/768/1366/?random");
  $(`#t-${id}`).prepend("(img broken) ");
}

function likePin(id) {
  if (isLoggedIn) {
    $(`#l-${id}`).attr("disabled", "disabled");
    $.ajax({
      type: "POST",
      url: "/api/likes/",
      data: {pid: id},
      dataType: "json",
      success: function (d) {
        if ($(`#l-${id}`).hasClass("liked")) {
          $(`#l-${id}`).removeClass("liked");
        }
        else {
          $(`#l-${id}`).addClass("liked");
        }
        $(`#l-${id}`).removeAttr("disabled");
      },
      failure: function (e) {
        console.log(e);
        $(`l-${id}`).removeAttr("disabled");
      }
    })
  }
}
