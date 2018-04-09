'use strict'

$(document).ready(function () {
  getNewestPins()
})

function getNewestPins() {
  $.get("/api/pins/", function (d) {
    var div = "";
    d.forEach(function (p) {
      div += `
        <a href="${p.pageUrl}" target="_blank">
          <img id="i-u-${p._id}" src="${p.imgUrl}" onerror="imgError('${p._id}')"/>
          <div id="t-${p._id}">${p.title}</div>
        </a>
      `
    });
    $("#c").append(div);
  })
}

function imgError(id) {
  $(`#i-u-${id}`).attr("src", "https://picsum.photos/200/300");
  $(`#t-${id}`).prepend("(img broken) ");
}
