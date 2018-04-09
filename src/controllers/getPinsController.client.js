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
          <img src="${p.imgUrl}" />
          <div>${p.title}</div>
        </a>
      `
    });
    $("#c").append(div);
  })
}
