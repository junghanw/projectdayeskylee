$(document).ready(function() {
  // build marker infoWindow contents
  var buildHoverContent = function (name, address, tags){
    var $container = $('<div class="marker-hover-content"></div>');
    var $name = $('<div class="marker-hover-name">'+name+'</div>');
    var $address = $('<div class="marker-hover-address">'+address+'</div>');
    var $tags = $('<ul class="marker-hover-hashtags"></ul>');
    tags.map(function(t) {
      $tags.append($('<li><i class="fa fa-hashtag"></i>'+t+'</li>'));
    });
    var $close = $('<div class="marker-hover-close"><i class="fa fa-close"></i></div>');
    $container.append($name, $address, $tags, $close);
    return $container[0];
  };

  // custom marker infoWindow CSS
  var customInfoWindowStyle = function () {
    var iwOuter = $('.gm-style-iw');
    iwOuter.prev().remove();
    iwOuter.next().remove();
    iwOuter.css('left',iwOuter.width()/2+50+30);
  };

  var initMap = function() {
    var map, infoWindow, markers, infoWindow;
    var bounds = new google.maps.LatLngBounds();

    var options = {
    };
    map = new google.maps.Map($('#google-map')[0], options);

    infoWindow = new google.maps.InfoWindow({
      pixelOffset: new google.maps.Size(0,150)
    });

    $.getJSON('/static/json/marker.json', function(data) {
      var props, place, position, marker, image, contents, icon;

      var $overlay = $('#overlay');
      var $img_container = $('#slick-wrapper');

      for (props in data) {
        place = data[props];
        position = new google.maps.LatLng(place.lat, place.lng);
        bounds.extend(position);
        icon = {
          url: '/static/imgs/'+props+'/marker.png',
          size: new google.maps.Size(100,135)
        };
        marker = new google.maps.Marker({
          position: position,
          map: map,
          title: props,
          icon: icon,
          zIndex: 100,
          data: {
            address: place.address,
            hashtags: place.hashtags,
            images: place.imgs
          }
        });
        // create marker hover element - infoWindow
        google.maps.event.addListener(marker, 'mouseover',
          (function(marker) {
            return function() {
              contents = buildHoverContent(marker.title,
                marker.data.address, marker.data.hashtags);
              infoWindow.setContent(contents);
              infoWindow.open(map, marker);
              $('.marker-hover-close').click(function() {
                infoWindow.close();
              });
              customInfoWindowStyle();
            }
        })(marker));

        // create marker click element - image carousel
        google.maps.event.addListener(marker, 'click',
          (function(marker, images) {
            return function() {
              $overlay.addClass('open');

              infoWindow.close();
              // get images
              root_src = '/static/imgs/'+marker.title+'/';
              images.map(function(src) {
                image = $('<img src="' + root_src + src + '"></img');
                $img_container.append(image);
              });
              // var hashtags = document.createElement('ul')

              // init image slide
              $('#slick-wrapper').slick({
                 centerMode: true,
                 slidesToShow: 1,
                 centerPadding: '100px',
                 variableWidth: true,
                 arrows: true,
                 dots: true,
                 initialSlide: 3,
                 focusOnSelect: true
              });
              $('#slick-wrapper').find('.slick-list').focus();
              var title = $('<div>'+marker.title+'</div>'),
                  address = $('<div>'+marker.data.address+'</div>'),
                  tags = $('<ul></ul');

              marker.data.hashtags.map(function(t) {
                tags.append($('<li><i class="fa fa-hashtag"></i>'+t+'</li>'));
              });
              $('#info-wrapper').append(title, address, tags);
              $('#image-slide-container').addClass('show');
              // set hashtag divs

              //
            }
          })(marker, place.imgs));
      }

      map.fitBounds(bounds);

    });
  };

  initMap();

  $('#sidebar-toggle').click(function() {
    var status = $(this).data('toggle');
    if (status) {
      //close
      $('.navigation').removeClass('open');
      $('#sidebar-toggle').removeClass('open').data('toggle', false);
    } else {
      //open
      $('.navigation').addClass('open');
      $('#sidebar-toggle').data('toggle', true).addClass('open');
    }
  });
  $('.close-overlay').click(function() {
    $('#overlay').removeClass('open');
    $('#slick-wrapper').slick('unslick').html('');
    $('#info-wrapper').html('');
    $('#image-slide-container').removeClass('show');
  });

  // main page
  $('#about-link').click(function(event) {
    event.preventDefault();
    $('#google-map').addClass('hide');
    $('#about-container').addClass('show');
    $('.navigation').removeClass('open');
    $('#sidebar-toggle').removeClass('open').data('toggle', false);
  });



});
