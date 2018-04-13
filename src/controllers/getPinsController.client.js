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
      if (p.userLike) likedClass = (p.userLike.status) ? " btn-primary" : " btn-outline-primary";
      div += `
        <div class="grid-item border main-border-color rounded px-1 py-1">
          <a href="${p.pageUrl}" target="_blank">
            <img id="i-u-${p._id}" src="${p.imgUrl}" onerror="imgError('${p._id}')"/>
          </a>
          <div class="row mt-1">
            <div class="col-12 col-sm-12 col-md-8 px-0">
              <div class="col-12" id="t-${p._id}">${p.title}</div>
              <div class="col-12">
                <a class="username-text" id="u-${p._id}" href="/user/${p.user.twitter.id}">
                  ${p.user.twitter.displayName}
                </a>
              </div>
            </div>
            <div class="col-12 col-sm-12 col-md-4 px-0">
              <div class="col-12">
                <button class="btn mt-1 float-right like-btn${likedClass}" id="l-${p._id}" onclick="likePin('${p._id}')"><i class="fas fa-thumbs-up"></i> Like</button>
              </div>
            </div>
          </div>
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
        if ($(`#l-${id}`).hasClass("btn-primary")) {
          $(`#l-${id}`).removeClass("btn-primary");
          $(`#l-${id}`).addClass("btn-outline-primary");
        }
        else {
          $(`#l-${id}`).addClass("btn-primary");
          $(`#l-${id}`).removeClass("btn-outline-primary");
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
