'use strict'

$(document).ready(function () {
  getNewestPins()
})

function getNewestPins() {
  var x = window.location.pathname.split("/");
  x = x[x.length - 1];
  $.get(`/api/user/${x}/pins/`, function (d) {
    var div = "";
    d.forEach(function (p) {
      div += `
      <div class="grid-item border main-border-color rounded px-1 py-1">
      <a href="${p.pageUrl}" target="_blank">
        <img id="i-u-${p._id}" src="${p.imgUrl}" onerror="imgError('${p._id}')"/>
        <div id="t-${p._id}">${p.title}</div>
        <a id="u-${p._id}" href="/user/${p.user.twitter.id}">${p.user.twitter.displayName}</a>
      </a>
      </div>
      `
    });
    $("#c").append(div);
    // init Masonry
    var $grid = $('.grid').masonry({
      columnWidth: 80,
      gutter: 1,
      itemSelector: '.grid-item',
      // percentPosition: true,
      horizontalOrder: true,
      fitWidth: true,
      transitionDuration: '0.8s'
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress( function() {
      $grid.masonry('layout');
    });
  })
}

function imgError(id) {
  $(`#i-u-${id}`).attr("src", "https://picsum.photos/768/1366/?random");
  $(`#t-${id}`).prepend("(img broken) ");
}
