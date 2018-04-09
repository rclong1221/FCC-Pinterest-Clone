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
        <a href="${p.pageUrl}" target="_blank">
          <img id="i-u-${p._id}" src="${p.imgUrl}" onerror="imgError('${p._id}')"/>
          <div id="t-${p._id}">${p.title}</div>
          <a id="u-${p._id}" href="/user/${p.user.twitter.id}">${p.user.twitter.displayName}</a>
        </a>
      `
    });
    $("#c").append(div);
  })
}

function imgError(id) {
  $(`#i-u-${id}`).attr("src", "https://picsum.photos/240/400/?random");
  $(`#t-${id}`).prepend("(img broken) ");
}
