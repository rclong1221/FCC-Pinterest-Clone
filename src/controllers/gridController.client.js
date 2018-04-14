function initMasonry() {
  // init Masonry
  var $grid = $('.grid').masonry({
    columnWidth: '.grid-sizer',
    gutter: 5,
    itemSelector: '.grid-item',
    percentPosition: true,
    horizontalOrder: true,
    fitWidth: true,
    transitionDuration: '0.5s'
  });
  // layout Masonry after each image loads
  $grid.imagesLoaded().progress( function() {
    $grid.masonry('layout');
  });
}
