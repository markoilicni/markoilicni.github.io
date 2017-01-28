  var support_video = function() {
      return !!document.createElement('video').canPlayType;
  };


  var storage = {
      id: 0,
      data: {
          lastWatched: 0,
          watched: [],
          bookmarks: []
      },
      _store: {},
      write: function() {
          this._store[this.id] = this.data;
          localStorage.pluralsight = JSON.stringify(this._store);
      },
      addWatched: function(order) {
          if (this.data.watched.indexOf(order) === -1) {
              this.data.watched.push(order);
          }
          this.write();
      },
      lastWatched: function(order) {
          this.data.lastWatched = order,
              this.write();
      },
      init: function(id) {
          var success = false;
          this.id = id;
          if (localStorage) {
              if (!localStorage.pluralsight) {
                  this.write();
                  success = true;
              } else {
                  this._store = JSON.parse(localStorage.pluralsight);
                  if (this._store[id]) {
                      this.data = this._store[id];
                      success = true;
                  } else {
                      this.write();
                      success = true;
                  }
              }
          }
          return success;
      }

  };

  var currentItem = 0;
  var haveStorage = storage.init(document.title);

  if (jQuery) {
      $(document).ready(function() {
          //console.log('ready');

          var items = $('div.modules li');
          var videoTitle = $('#vt-title');
          items.removeClass('watched');
          items.removeClass('selected');
          for (var i = 0; i < items.length; i++) {
              $(items[i]).attr('data-order', i);
          }
          if (haveStorage) {
              if (storage.data.lastWatched) {
                  currentItem = storage.data.lastWatched;
                  $(items[currentItem]).addClass('selected');
              }
              if (storage.data.watched.length) {
                  for (var w = 0; w <= storage.data.watched.length; w++) {
                      $(items[storage.data.watched[w]]).addClass('watched');
                  }
              }
          }

          videoTitle.text($(items[currentItem]).find('a').text());
          var rightPanel = $($('div.rightpanel')[0]);


          if (support_video()) {
              rightPanel.html('<div class="videocnt"><video id="videoplayer"></video></div>');
              videoPlayer = $('#videoplayer')[0];
              videoPlayer.autoplay = true;
              videoPlayer.controls = true;

              items.find('a').on('click', function(event) {
                  event.preventDefault();
              });
              items.on('click', function(event) {
                  event.preventDefault();
                  videoPlayer.src = $(this).find('a')[0].href;
                  document.title = $(this).find('a').text();
                  videoTitle.text(document.title);
                  currentItem = $(this).attr('data-order');
                  items.removeClass('selected');
                  $(this).addClass('selected');
              });
              $('#vt-prev').on('click', function() {
                  if (currentItem > 0) currentItem--;
                  $(items[currentItem]).click();
              });
              $('#vt-next').on('click', function() {
                  if (currentItem < items.length) currentItem++;
                  $(items[currentItem]).click();
              });
              $('#vt-play').on('click', function() {
                  $(items[currentItem]).click();
              });
              $(videoPlayer).on('play', function() {
                  storage.lastWatched(currentItem);
              })
              $(videoPlayer).on('ended', function() {
                  storage.addWatched(currentItem);
                  $(items[currentItem]).addClass('watched');
                  setTimeout(function() {
                      $('#vt-next').click();
                  }, 1500);
              });
          } else {
              rightPanel.html('Your browser don\'t support video, use Chrome or Firefox or Opera or Safari.');
          }
      });
  } else {

  }
