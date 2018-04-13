'use strict'

$(document).ready(function () {
  getNewestPins()
})

function getNewestPins() {
  $.get("/api/my-pins/", function (d) {
    var div = "";
    d.forEach(function (p) {
      div += `
      <div class="grid-item border main-border-color rounded px-1 py-1">
        <a href="${p.pageUrl}" target="_blank">
          <img id="i-u-${p._id}" src="${p.imgUrl}" onerror="imgError('${p._id}')"/>
        </a>
        <div class="row mt-1">
          <div class="col-12 col-sm-12 col-md-8 px-0">
            <div class="col-12" id="t-${p._id}">${p.title}</div>
          </div>
          <div class="col-12 col-sm-12 col-md-4 px-0">
            <div class="col-12">
              <button class="btn btn-danger float-right" type="button" onclick="deletePin('${p._id}')">Delete</button>
            </div>
          </div>
        </div>
      </div>
      `
    });
    $("#c").append(div);
    initMasonry();
  })
}

function deletePin(_id) {
  $.ajax({
    type: "DELETE",
    url: "/api/pins/",
    data: {_id: _id},
    dataType: "json",
    success: function (d) {
      if (d.redirect) window.location.href = d.redirect;
    },
    error: function (e) {
      console.log(e);
    }
  })
}

function imgError(id) {
  $(`#i-u-${id}`).attr("src", "https://picsum.photos/768/1366/?random");
  $(`#t-${id}`).prepend("(img broken) ");
}
