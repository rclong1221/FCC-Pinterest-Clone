function initMasonry() {
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
}
