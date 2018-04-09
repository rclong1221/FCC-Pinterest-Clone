'use strict'

$(document).ready(function () {

})

function submitData() {
  var body = {
    imgUrl: $("#i-url-i").val(),
    title: $("#t-i").val(),
    pageUrl: $("#p-l-i").val()
  };
  $.ajax({
    type: "POST",
    url: "/api/pins/",
    data: body,
    dataType: "json",
    success: function (d) {
      if (d.redirect) window.location.href = d.redirect;
    },
    error: function (e) {
      console.log(e);
    }
  })
}
