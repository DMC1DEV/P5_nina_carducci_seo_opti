(function ($) {
  $.fn.mauGallery = function (options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function () {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function (index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };

  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };

  $.fn.mauGallery.listeners = function (options) {
    $(".gallery-item").on("click", function () {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };

  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (
        !element
          .children()
          .first()
          .hasClass("row")
      ) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        for (var size in columns) {
          columnClasses += ` col-${size}-${Math.ceil(12 / columns[size])}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    openLightBox(element, lightboxId) {
      $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },
    prevImage(lightboxId) {
      let activeImage = $(".lightboxImage").attr("src");
      let imagesCollection = $(".gallery-item").map(function () {
        return $(this).attr("src");
      }).get();

      let currentIndex = imagesCollection.indexOf(activeImage);
      let prevIndex = (currentIndex - 1 + imagesCollection.length) % imagesCollection.length;
      $(".lightboxImage").attr("src", imagesCollection[prevIndex]);
    },
    nextImage(lightboxId) {
      let activeImage = $(".lightboxImage").attr("src");
      let imagesCollection = $(".gallery-item").map(function () {
        return $(this).attr("src");
      }).get();

      let currentIndex = imagesCollection.indexOf(activeImage);
      let nextIndex = (currentIndex + 1) % imagesCollection.length;
      $(".lightboxImage").attr("src", imagesCollection[nextIndex]);
    },
    createLightBox(gallery, lightboxId, navigation) {
      var modalHtml = `<div class="modal fade" id="${lightboxId ? lightboxId : "galleryLightbox"
        }" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-body">
              ${navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:10px;z-index:1000;">&lt;</div>' : ''}
              <img class="lightboxImage img-fluid" />
              ${navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:10px;z-index:1000;">&gt;</div>' : ''}
            </div>
          </div>
        </div>
      </div>`;
      gallery.append(modalHtml);
    },
    showItemTags(gallery, position, tags) {
      var tagsRow = '<ul class="my-4 tags-bar nav nav-pills">';
      tagsRow += '<li class="nav-item"><span class="nav-link active-tag" data-images-toggle="all">Tous</span></li>';
      $.each(tags, function (index, tag) {
        tagsRow += `<li class="nav-item"><span class="nav-link" data-images-toggle="${tag}">${tag}</span></li>`;
      });
      tagsRow += '</ul>';
      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      }
    },
    filterByTag() {
      $(".nav-link").removeClass("active-tag");
      $(this).addClass("active-tag");

      var tag = $(this).data("images-toggle");
      $(".item-column").each(function () {
        $(this).toggle($(this).find('.gallery-item').data('gallery-tag') === tag || tag === "all");
      });
    }
  };
})
  (jQuery);
