(window.slate = window.slate || {}),
  (window.theme = window.theme || {}),
  (slate.a11y = {
    pageLinkFocus: function (t) {
      var e = "js-focus-hidden";
      t.first()
        .attr("tabIndex", "-1")
        .focus()
        .addClass(e)
        .one("blur", function () {
          t.first().removeClass(e).removeAttr("tabindex");
        });
    },
    focusHash: function () {
      var t = window.location.hash;
      t && document.getElementById(t.slice(1)) && this.pageLinkFocus($(t));
    },
    bindInPageLinks: function () {
      $("a[href*=#]").on(
        "click",
        function (t) {
          this.pageLinkFocus($(t.currentTarget.hash));
        }.bind(this)
      );
    },
    trapFocus: function (t) {
      var e = t.namespace ? "focusin." + t.namespace : "focusin";
      t.$elementToFocus || (t.$elementToFocus = t.$container),
        t.$container.attr("tabindex", "-1"),
        t.$elementToFocus.focus(),
        $(document).on(e, function (e) {
          t.$container[0] === e.target || t.$container.has(e.target).length || t.$container.focus();
        });
    },
    removeTrapFocus: function (t) {
      var e = t.namespace ? "focusin." + t.namespace : "focusin";
      t.$container && t.$container.length && t.$container.removeAttr("tabindex"),
        $(document).off(e);
    },
  }),
  (slate.cart = {
    cookiesEnabled: function () {
      var t = navigator.cookieEnabled;
      return (
        t || ((document.cookie = "testcookie"), (t = -1 !== document.cookie.indexOf("testcookie"))),
        t
      );
    },
  }),
  (slate.utils = {
    findInstance: function (t, e, i) {
      for (var n = 0; n < t.length; n++) if (t[n][e] === i) return t[n];
    },
    removeInstance: function (t, e, i) {
      for (var n = t.length; n--; )
        if (t[n][e] === i) {
          t.splice(n, 1);
          break;
        }
      return t;
    },
    compact: function (t) {
      for (var e = -1, i = null == t ? 0 : t.length, n = 0, o = []; ++e < i; ) {
        var r = t[e];
        r && (o[n++] = r);
      }
      return o;
    },
    defaultTo: function (t, e) {
      return null == t || t != t ? e : t;
    },
  }),
  (slate.rte = {
    wrapTable: function (t) {
      var e = void 0 === t.tableWrapperClass ? "" : t.tableWrapperClass;
      t.$tables.wrap('<div class="' + e + '"></div>');
    },
    wrapIframe: function (t) {
      var e = void 0 === t.iframeWrapperClass ? "" : t.iframeWrapperClass;
      t.$iframes.each(function () {
        $(this).wrap('<div class="' + e + '"></div>'), (this.src = this.src);
      });
    },
  }),
  (slate.Sections = function () {
    (this.constructors = {}),
      (this.instances = []),
      $(document)
        .on("shopify:section:load", this._onSectionLoad.bind(this))
        .on("shopify:section:unload", this._onSectionUnload.bind(this))
        .on("shopify:section:select", this._onSelect.bind(this))
        .on("shopify:section:deselect", this._onDeselect.bind(this))
        .on("shopify:section:reorder", this._onReorder.bind(this))
        .on("shopify:block:select", this._onBlockSelect.bind(this))
        .on("shopify:block:deselect", this._onBlockDeselect.bind(this));
  }),
  (slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
    _createInstance: function (t, e) {
      var i = $(t),
        n = i.attr("data-section-id"),
        o = i.attr("data-section-type");
      if (void 0 !== (e = e || this.constructors[o])) {
        var r = $.extend(new e(t), { id: n, type: o, container: t });
        this.instances.push(r);
      }
    },
    _onSectionLoad: function (t) {
      var e = $("[data-section-id]", t.target)[0];
      e && this._createInstance(e);
    },
    _onSectionUnload: function (t) {
      var e = slate.utils.findInstance(this.instances, "id", t.detail.sectionId);
      e &&
        ("function" == typeof e.onUnload && e.onUnload(t),
        (this.instances = slate.utils.removeInstance(this.instances, "id", t.detail.sectionId)));
    },
    _onSelect: function (t) {
      var e = slate.utils.findInstance(this.instances, "id", t.detail.sectionId);
      e && "function" == typeof e.onSelect && e.onSelect(t);
    },
    _onDeselect: function (t) {
      var e = slate.utils.findInstance(this.instances, "id", t.detail.sectionId);
      e && "function" == typeof e.onDeselect && e.onDeselect(t);
    },
    _onReorder: function (t) {
      var e = slate.utils.findInstance(this.instances, "id", t.detail.sectionId);
      e && "function" == typeof e.onReorder && e.onReorder(t);
    },
    _onBlockSelect: function (t) {
      var e = slate.utils.findInstance(this.instances, "id", t.detail.sectionId);
      e && "function" == typeof e.onBlockSelect && e.onBlockSelect(t);
    },
    _onBlockDeselect: function (t) {
      var e = slate.utils.findInstance(this.instances, "id", t.detail.sectionId);
      e && "function" == typeof e.onBlockDeselect && e.onBlockDeselect(t);
    },
    register: function (t, e) {
      (this.constructors[t] = e),
        $("[data-section-type=" + t + "]").each(
          function (t, i) {
            this._createInstance(i, e);
          }.bind(this)
        );
    },
  })),
  (slate.Currency = (function () {
    var t = "${{amount}}";
    return {
      formatMoney: function (e, i) {
        "string" == typeof e && (e = e.replace(".", ""));
        var n = "",
          o = /\{\{\s*(\w+)\s*\}\}/,
          r = i || t;
        function a(t, e, i, n) {
          if (
            ((e = slate.utils.defaultTo(e, 2)),
            (i = slate.utils.defaultTo(i, ",")),
            (n = slate.utils.defaultTo(n, ".")),
            isNaN(t) || null == t)
          )
            return 0;
          var o = (t = (t / 100).toFixed(e)).split(".");
          return o[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + i) + (o[1] ? n + o[1] : "");
        }
        switch (r.match(o)[1]) {
          case "amount":
            n = a(e, 2);
            break;
          case "amount_no_decimals":
            n = a(e, 0);
            break;
          case "amount_with_space_separator":
            n = a(e, 2, " ", ".");
            break;
          case "amount_no_decimals_with_comma_separator":
            n = a(e, 0, ",", ".");
            break;
          case "amount_no_decimals_with_space_separator":
            n = a(e, 0, " ");
        }
        return r.replace(o, n);
      },
    };
  })()),
  (slate.Image = (function () {
    return {
      preload: function (t, e) {
        "string" == typeof t && (t = [t]);
        for (var i = 0; i < t.length; i++) {
          var n = t[i];
          this.loadImage(this.getSizedImageUrl(n, e));
        }
      },
      loadImage: function (t) {
        new Image().src = t;
      },
      imageSize: function (t) {
        var e = t.match(
          /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/
        );
        return e ? e[1] : null;
      },
      getSizedImageUrl: function (t, e) {
        if (null === e) return t;
        if ("master" === e) return this.removeProtocol(t);
        var i = t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
        if (i) {
          var n = t.split(i[0]),
            o = i[0];
          return this.removeProtocol(n[0] + "_" + e + o);
        }
        return null;
      },
      removeProtocol: function (t) {
        return t.replace(/http(s)?:/, "");
      },
    };
  })()),
  (slate.Variants = (function () {
    function t(t) {
      (this.$container = t.$container),
        (this.product = t.product),
        (this.singleOptionSelector = t.singleOptionSelector),
        (this.originalSelectorId = t.originalSelectorId),
        (this.enableHistoryState = t.enableHistoryState),
        (this.currentVariant = this._getVariantFromOptions()),
        $(this.singleOptionSelector, this.$container).on("change", this._onSelectChange.bind(this));
    }
    return (
      (t.prototype = $.extend({}, t.prototype, {
        _getCurrentOptions: function () {
          var t = $.map($(this.singleOptionSelector, this.$container), function (t) {
            var e = $(t),
              i = e.attr("type"),
              n = {};
            return "radio" === i || "checkbox" === i
              ? !!e[0].checked && ((n.value = e.val()), (n.index = e.data("index")), n)
              : ((n.value = e.val()), (n.index = e.data("index")), n);
          });
          return (t = slate.utils.compact(t));
        },
        _getVariantFromOptions: function () {
          var t = this._getCurrentOptions(),
            e = !1;

          this.product.variants.forEach(function (i) {
            var n = !0;
            t.forEach(function (t) {
              n && (n = t.value === i[t.index]);
            }),
              n && (e = i);
          });

          // If option is not available
          if (!e) {
            this.product.variants.forEach(function (i) {
              var isSelected = false;
              if (t.length > 1 && !isSelected) {
                if (t[1].value === i[t[1].index]) {
                  isSelected = true;
                  e = i;
                }
              }
            });
          }

          return e || null;
        },
        _onSelectChange: function (e) {
          var t = this._getVariantFromOptions();
          this.$container.trigger({
            type: "updateVariantOptions",
            productData: this,
            currentSelectedVariant: t,
            targetSelector: e.target,
          }),
            this.$container.trigger({ type: "variantChange", variant: t }),
            t &&
              (this._updateMasterSelect(t),
              this._updateImages(t),
              this._updatePrice(t),
              (this.currentVariant = t),
              this.enableHistoryState && this._updateHistoryState(t));
        },
        _updateImages: function (t) {
          var e = t.featured_image || {},
            i = this.currentVariant.featured_image || {};
          t.featured_image &&
            e.src !== i.src &&
            this.$container.trigger({ type: "variantImageChange", variant: t });
        },
        _updatePrice: function (t) {
          this.$container.trigger({ type: "variantPriceChange", variant: t });
        },
        _updateHistoryState: function (t) {
          if (history.replaceState && t) {
            var e =
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?variant=" +
              t.id;
            window.history.replaceState({ path: e }, "", e);
          }
        },
        _updateMasterSelect: function (t) {
          $(this.originalSelectorId, this.$container)[0].value = t.id;
        },
      })),
      t
    );
  })()),
  (function (t, e, i, n) {
    var o, r, a, s, d;
    function c(t, e) {
      "function" != typeof t && (t = function () {}),
        s.find(".loader").removeClass("d-flex-hide"),
        i.getJSON("/cart", function (n) {
          i(".js-cart-item-count").attr("data-item-count", n.item_count || 0),
            s.find(".inum").off(".inum"),
            "object" == typeof sellify && sellify.ucd && sellify.ucd.isActive() && e
              ? sellify.ucd.helpers.ajaxCart.buildCart(n)
              : i.get("/cart?view=simple", function (e) {
                  s.find(".loader").addClass("d-flex-hide"),
                    s.find(".content").html(e),
                    s.find(".inum").inum(),
                    t();
                });
        });
    }
    (i.fn.inum = function () {
      this.each(function () {
        var t = i(this),
          e = t.find('input[type="number"]'),
          n = t.find(".inum-inc"),
          o = t.find(".inum-dec"),
          r = e.attr("min") || 1,
          a = e.attr("max") || 1e3,
          s = parseFloat(e.val(), 10);
        n.on("click.inum", function () {
          var t = parseFloat(e.val(), 10),
            i = t >= a ? t : t + 1;
          e.val(i).trigger("change"),
            i == a && n.addClass("disabled"),
            i > r && o.removeClass("disabled");
        }),
          o.on("click.inum", function () {
            var t = parseFloat(e.val(), 10),
              i = t <= r ? t : t - 1;
            e.val(i).trigger("change"),
              i == r && o.addClass("disabled"),
              i < a && n.removeClass("disabled");
          }),
          e.on("setmax.inum", function (t, i) {
            var s = parseFloat(e.val(), 10);
            (a = i),
              e.val(1).trigger("change"),
              s >= a ? n.addClass("disabled") : n.removeClass("disabled"),
              1 == r && o.addClass("disabled");
          }),
          s == r && o.addClass("disabled"),
          s == a && n.addClass("disabled");
      });
    }),
      i(e).ready(function () {
        (o = i(e)),
          (r = i("body")),
          (a = i("#site-header")),
          (s = i("#site-drawer")),
          (d = i("#shop-modal")),
          ($mobile_nav = i("#mobile-nav")),
          i('[data-toggle="tooltip"]').tooltip();
        var t = i(".tech-link"),
          n = i(".tech-content");
        t.length &&
          t.on("click", function (e) {
            e.preventDefault();
            var o = i(this).data("tech"),
              r = n.filter('[data-tech="' + o + '"]');
            t.removeClass("selected"),
              i(this).addClass("selected"),
              n.addClass("hide"),
              r.removeClass("hide");
          }),
          s.on("click", ".remove", function (t) {
            var e = { id: i(this).parents(".item").data("id"), quantity: 0 };
            return (
              s.find(".loader").removeClass("d-flex-hide"),
              i.post(
                "/cart/change.js",
                e,
                function (t) {
                  c(function () {}, 1);
                },
                "json"
              ),
              t.preventDefault(),
              !1
            );
          }),
          s.on("change", 'input[type="number"]', function (t) {
            var e = !1,
              n = i("#drawer-cart-update"),
              o = i("#drawer-cart-checkout");
            s.find('input[type="number"]').each(function () {
              if (i(this).val() != i(this).data("default-value")) return (e = !0), !1;
            }),
              n[e ? "removeClass" : "addClass"]("hide"),
              o[e ? "addClass" : "removeClass"]("hide");
          }),
          s.on("click", "#drawer-cart-update", function (t) {
            if (!i(this).hasClass("disabled")) {
              i(this);
              var e = {};
              return (
                s.find(".item").each(function () {
                  var t = i(this).data("id"),
                    n = i(this).find('input[type="number"]'),
                    o = n.data("default-value");
                  (current_qty = n.val()), current_qty != o && (e[t] = current_qty);
                }),
                s.find(".loader").removeClass("d-flex-hide"),
                i.post(
                  "/cart/update.js",
                  { updates: e },
                  function (t) {
                    c(function () {}, 1);
                  },
                  "json"
                ),
                t.preventDefault(),
                !1
              );
            }
          }),
          a.hasClass("transparent") &&
            (o
              .on("scroll", function () {
                var t;
                (t = o.scrollTop()), a[0 == t ? "addClass" : "removeClass"]("transparent");
              })
              .scroll(),
            a.on({
              mouseenter: function () {
                a.hasClass("transparent") && a.removeClass("transparent");
              },
              mouseleave: function () {
                0 == o.scrollTop() && a.addClass("transparent");
              },
            })),
          a.on("click", ".shop", function (t) {
            a.hasClass("js-shop-modal-open") ||
              (a.addClass("js-active js-shop-modal-open"), t.stopPropagation());
          }),
          a.on("click", ".mobile-nav-btn", function (t) {
            a.hasClass("js-mobile-nav-open") ||
              (a.addClass("js-active js-mobile-nav-open"), t.stopPropagation());
          }),
          d.on("click", function (t) {
            t.stopPropagation();
          }),
          $mobile_nav.on("click", function (t) {
            t.stopPropagation();
          }),
          a.on("click", ".search", function (t) {
            a.hasClass("js-search-open") ||
              (a.addClass("js-active js-search-open"),
              a.find(".nav-right-search input").focus(),
              t.stopPropagation());
          }),
          a.on("click", ".search-cancel", function (t) {
            o.trigger("click");
          }),
          a.on("click", ".nav-right-search", function (t) {
            t.stopPropagation();
          }),
          a.on("click", ".cart", function (t) {
            if (
              "object" == typeof sellify &&
              "object" == typeof sellify.ucd &&
              sellify.ucd.isActive()
            )
              return sellify.ucd.helpers.ajaxCart.show(), void t.stopPropagation();
            r.hasClass("js-drawer-open") ||
              (r.addClass("js-drawer-open no-scroll"), t.stopPropagation());
          }),
          s.on("click", ".dismiss", function (t) {
            r.removeClass("js-drawer-open no-scroll");
          }),
          s.on("click", function (t) {
            t.stopPropagation();
          }),
          o.on("click", function (t) {
            a.removeClass("js-active js-shop-modal-open js-mobile-nav-open js-search-open"),
              r.removeClass("js-drawer-open js-modal-open no-scroll");
          }),
          c();
      }),
      (t.updateCart = c),
      (t.checkMediaQuery = function () {
        var t = i("#mq-detector"),
          e = {
            xs: t.find(".visible-xs"),
            sm: t.find(".visible-sm"),
            md: t.find(".visible-md"),
            lg: t.find(".visible-lg"),
            xl: t.find(".visible-xl"),
          };
        for (var n in e) if (e[n].is(":visible")) return n;
      }),
      (t.setCookie = function (t, i, n) {
        var o = "";
        if (n) {
          var r = new Date();
          r.setTime(r.getTime() + 24 * n * 60 * 60 * 1e3), (o = "; expires=" + r.toUTCString());
        }
        e.cookie = t + "=" + (i || "") + o + "; path=/";
      }),
      (t.getCookie = function (t) {
        for (var i = t + "=", n = e.cookie.split(";"), o = 0; o < n.length; o++) {
          for (var r = n[o]; " " == r.charAt(0); ) r = r.substring(1, r.length);
          if (0 == r.indexOf(i)) return r.substring(i.length, r.length);
        }
        return null;
      });
  })(window, document, jQuery),
  (theme.index = (function () {
    var t = ".home-hero",
      e = $("#NewsletterBox");
    if ($(t).length) {
      e.on("click", ".dismiss", function () {
        e.remove();
      }),
        $("#home-slider").bcSwipe({ threshold: 50 });
      var i = { "#guarantee-carousel": !1 },
        n = $.extend({}, i);
      $(window)
        .on("resize.storelli", function () {
          var t, e;
          !(function () {
            var t,
              e,
              o,
              r = "xs" == checkMediaQuery();
            for (var a in i)
              (t = $(a)).length &&
                ((e = t.find(".carousel-item")),
                r &&
                  !i[a] &&
                  ((o = t.data("interval") || 4e3),
                  t.addClass("enabled"),
                  e.removeClass("active"),
                  e.eq(0).addClass("active"),
                  (i[a] = t.carousel({ interval: o })),
                  n[a] || (t.bcSwipe({ threshold: 50 }), (n[a] = !0))),
                !r &&
                  i[a] &&
                  (t.removeClass("enabled"),
                  e.addClass("active"),
                  t.carousel("dispose"),
                  (i[a] = !1)));
          })(),
            (t = checkMediaQuery()),
            (e = "xs" == t || "sm" == t),
            $("#home-slider .carousel-item").each(function () {
              var t = $(this),
                i = $(this).attr("src-default") || !1,
                n = $(this).attr("src-mobile") || !1,
                o = e && n ? n : i;
              o && t.css("background-image", "url(" + o + ")");
            });
        })
        .resize(),
        $("#insta-feed").bind("DOMSubtreeModified", function () {
          $(this)
            .find("img")
            .each(function () {
              ($(this)[0].onload = function () {
                this.clientWidth > this.clientHeight &&
                  $(this).parents(".container").addClass("wide");
              }),
                $(this)[0].complete &&
                  this.clientWidth > this.clientHeight &&
                  $(this).parents(".container").addClass("wide");
            });
        }),
        getCookie("newsletterSignedUp") || e.removeClass("hide"),
        $(".newsletter-signed-up").length && setCookie("newsletterSignedUp", "true", 365);
    }
  })()),
  (theme.index = (function () {
    var t = $("#cartList");
    t.length &&
      (t.find(".inum").inum(),
      t.on("change", 'input[type="number"]', function (t) {
        var e = !1,
          i = $(this).val(),
          n = $(this).data("default-value"),
          o = $(this).parents("tr").find(".update");
        i != n && (e = !0),
          o[e ? "removeClass" : "addClass"]("disabled"),
          o[e ? "addClass" : "removeClass"]("font-weight-bold");
      }),
      t.on("click", ".update", function (t) {
        if (!$(this).hasClass("disabled")) {
          var e = $(this).parents("tr"),
            i = e.data("id"),
            n = e.find('input[type="number"]').val();
          window.location.href = "/cart/change?id=" + i + "&amp;quantity=" + n;
        }
      }));
  })()),
  (theme.collection = (function () {
    var t = ".filter-btn",
      e = ".filter-list",
      i = $(".collection-items .row"),
      n = $(t),
      o = $(e);
    if (i.length) {
      var r = !1;
      i.on("click", ".load-more-products", function (t) {
        if (r) return !1;
        var e = $(this),
          n = e.attr("href");
        (r = !0),
          e.text("Loading...").addClass("loading"),
          $.get(n, function (t) {
            (r = !1), i.append(t), e.parents(".load-more-parent").remove();
          }),
          t.preventDefault();
      }),
        n.on("click", function (t) {
          n.toggleClass("show"), o.toggleClass("show");
        });
    }
  })()),
  (theme.blog = (function () {
    var t = $(".article-list");
    if (t.length) {
      var e = !1;
      t.on("click", ".load-more-articles", function (i) {
        if (e) return !1;
        var n = $(this),
          o = n.attr("href");
        (e = !0),
          n.text("Loading...").addClass("loading"),
          $.get(o, function (i) {
            (e = !1), t.append(i), n.parents(".load-more-parent").remove();
          }),
          i.preventDefault();
      });
    }
  })()),
  (theme.article = (function () {
    var t = $(".article-body");
    if (t.length) {
      var e = function (t, e) {
        var i = e.height(),
          n = t.height();
        e.css("top", (n - i) / 2);
      };
      t.find("img").each(function () {
        $(this).parents("blockquote").length || $(this).wrap('<div class="image"></div>');
      }),
        t.find('iframe:not([src*="instagram"])').each(function () {
          $(this).wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
        }),
        $(".embed-responsive").wrap('<div class="embed-responsive-offset"></div>'),
        t
          .find("blockquote.instagram-media")
          .add(t.find('iframe[src*="instagram"]'))
          .each(function () {
            $(this).wrap('<div class="st-instagram-embed"></div>');
          }),
        t.find("blockquote:not(.instagram-media) img").each(function () {
          var t = $(this),
            i = t.parents("blockquote"),
            n = i.find("p").first();
          (right = i.find("p[style*=right]").length),
            i.addClass(right ? "bk-right" : "bk-left"),
            t.detach().appendTo(i),
            (t[0].onload = function () {
              e(t, n);
            }),
            t[0].complete && e(t, n);
        });
    }
  })()),
  (theme.page_about = (function () {
    var t = $(".page-about");
    t.length &&
      t.find("img").each(function () {
        $(this).wrap('<div class="image"></div>');
      });
  })()),
  (theme.customerAddresses = (function () {
    var t = $("#AddressNewForm");
    t.length &&
      (Shopify &&
        new Shopify.CountryProvinceSelector("AddressCountryNew", "AddressProvinceNew", {
          hideElement: "AddressProvinceContainerNew",
        }),
      $(".address-country-option").each(function () {
        var t = $(this).data("form-id"),
          e = "AddressCountry_" + t,
          i = "AddressProvince_" + t,
          n = "AddressProvinceContainer_" + t;
        new Shopify.CountryProvinceSelector(e, i, { hideElement: n });
      }),
      $(".address-new-toggle").on("click", function () {
        t.toggleClass("hide");
      }),
      $(".address-edit-toggle").on("click", function () {
        var t = $(this).data("form-id");
        $("#EditAddress_" + t).toggleClass("hide");
      }),
      $(".address-delete").on("click", function () {
        var t = $(this),
          e = t.data("form-id"),
          i = t.data("confirm-message");
        confirm(i || "Are you sure you wish to delete this address?") &&
          Shopify.postLink("/account/addresses/" + e, { parameters: { _method: "delete" } });
      }));
  })()),
  (theme.customerLogin = (function () {
    var t = "#RecoverPasswordForm",
      e = "#ShowRecoverPasswordLink",
      i = "#HideRecoverPasswordLink",
      n = $("#LoginForm"),
      o = $(t),
      r = $(e),
      a = $(i);
    function s(t) {
      t.preventDefault(), d();
    }
    function d() {
      o.toggleClass("hide"), n.toggleClass("hide");
    }
    n.length &&
      ("#recover" === window.location.hash && d(),
      (function () {
        if (!$(".reset-password-success").length) return;
        $("#ResetSuccess").removeClass("hide");
      })(),
      r.on("click", s),
      a.on("click", s));
  })()),
  (theme.Product = (function () {
    var t = {
      addToCart: "[data-add-to-cart]",
      addToCartText: "[data-add-to-cart-text]",
      comparePrice: "[data-compare-price]",
      comparePriceText: "[data-compare-text]",
      originalSelectorId: "[data-product-select]",
      priceWrapper: "[data-price-wrapper]",
      productFeaturedImage: "[data-product-featured-image]",
      productJson: "[data-product-json]",
      productPrice: "[data-product-price]",
      productThumbs: "[data-product-single-thumbnail]",
      singleOptionSelector: "[data-single-option-selector]",
    };
    function e(e) {
      if (((this.$container = $(e)), $(t.productJson, this.$container).html())) {
        this.$container.attr("data-section-id");
        this.productSingleObject = JSON.parse($(t.productJson, this.$container).html());
        var i = {
          $container: this.$container,
          enableHistoryState: this.$container.data("enable-history-state") || !1,
          singleOptionSelector: t.singleOptionSelector,
          originalSelectorId: t.originalSelectorId,
          product: this.productSingleObject,
        };
        (this.settings = {}),
          (this.namespace = ".product"),
          (this.variants = new slate.Variants(i)),
          (this.$featuredImage = $(t.productFeaturedImage, this.$container)),
          this.$container.on(
            "variantChange" + this.namespace,
            this.updateAddToCartState.bind(this)
          ),
          this.$container.on(
            "variantPriceChange" + this.namespace,
            this.updateProductPrices.bind(this)
          ),
          this.$container.on(
            "updateVariantOptions" + this.namespace,
            this.updateVariantOptions.bind(this)
          ),
          this.$featuredImage.length > 0 &&
            ((this.settings.imageSize = slate.Image.imageSize(this.$featuredImage.attr("src"))),
            slate.Image.preload(this.productSingleObject.images, this.settings.imageSize)),
          $(".add-form .inum").inum(),
          $(".thumbnails").each(function () {
            var t,
              e,
              i,
              n,
              o = $(this),
              r = o.find(".carousel"),
              a = 100,
              s = r.find("a").length,
              d = $(".viewer"),
              c = d.find("img:not(.astm)"),
              l = d.find(".astm-badge"),
              u = !1,
              p = !1;
            r.on("mouseover", "a", function (t) {
              var e = $(this).data("id");
              c.addClass("hide"),
                c.filter('[data-id="' + e + '"]').removeClass("hide"),
                l.length && (1 == $(this).data("ix") ? l.removeClass("hide") : l.addClass("hide")),
                t.preventDefault();
            }),
              $(window)
                .on("resize.storelli", function () {
                  var d;
                  u && u.off(".storelli"),
                    p && p.off(".storelli"),
                    (d = checkMediaQuery()),
                    (u = (t = "xl" != d) ? o.find(".carousel-h-prev") : o.find(".carousel-v-prev")),
                    (p = t ? o.find(".carousel-h-next") : o.find(".carousel-v-next")),
                    (e = t ? r.width() : r.height()),
                    t ? r[0].scrollWidth : r[0].scrollHeight,
                    0,
                    (a = "xs" == d ? 70 : 100),
                    (i = 0),
                    (n = t ? Math.floor(e / a) : 4),
                    (r[0].scrollTop = 0),
                    (r[0].scrollLeft = 0),
                    u.removeClass("active"),
                    s > n && p.addClass("active"),
                    p.on("click.storelli", function (e) {
                      p.hasClass("active") &&
                        ((i += n),
                        t
                          ? r.animate({ scrollLeft: i * a }, 200)
                          : r.animate({ scrollTop: i * a }, 200),
                        u.addClass("active"),
                        i + n >= s && p.removeClass("active"));
                    }),
                    u.on("click.storelli", function (e) {
                      u.hasClass("active") &&
                        ((i -= n),
                        t
                          ? r.animate({ scrollLeft: i * a }, 200)
                          : r.animate({ scrollTop: i * a }, 200),
                        p.addClass("active"),
                        0 == i && u.removeClass("active"));
                    });
                })
                .resize();
          }),
          $("img[data-zoom]").each(function () {
            var t = $(this),
              e = t.data("zoom");
            t.wrap('<span class="zoom-wrapper"></span>').parent().zoom({ url: e });
          }),
          $(".add-form").on("submit", function (t) {
            if (this.submitting) return !1;
            var e = this,
              i = $(this).find('button[type="submit"]'),
              n = $(this).find(".add-error"),
              o = $(this).serialize();
            return (
              (e.submitting = !0),
              i.addClass("disabled").text(window.theme.strings.addingToCart + "..."),
              n.addClass("hide").text(""),
              $.ajax({
                type: "POST",
                url: "/cart/add.js",
                data: o,
                dataType: "json",
                success: function (t) {
                  console.log("DONE"),
                    updateCart(function () {
                      (e.submitting = !1),
                        i.removeClass("disabled").text(window.theme.strings.addToCart),
                        $("body").hasClass("js-drawer-open") ||
                          $("body").addClass("js-drawer-open no-scroll");
                    }, 1);
                },
                error: function (t, o, r) {
                  console.log("FAIL");
                  var a = JSON.parse(t.responseText);
                  return (
                    (e.submitting = !1),
                    i.removeClass("disabled").text(window.theme.strings.addToCart),
                    422 == a.status
                      ? n.addClass("hide").text(a.description).removeClass("hide")
                      : n
                          .addClass("hide")
                          .text("An unknown error has happened. Please, try again later.")
                          .removeClass("hide"),
                    !1
                  );
                },
              }),
              !1
            );
          }),
          $(".fit-guide").on("click", function (t) {
            $("body").addClass("js-modal-open no-scroll"), t.stopPropagation();
          }),
          $(document).on("click", 'a[href="#reviews"]', function (t) {
            var e = $("#reviews-anchor").position();
            $("html, body").animate({ scrollTop: e.top - 100 }, 300), t.preventDefault();
          }),
          this.$container.trigger({ type: "variantChange", variant: this.variants.currentVariant }),
          this.$container.trigger({
            type: "variantPriceChange",
            variant: this.variants.currentVariant,
          });
      }
    }
    return (
      (e.prototype = $.extend({}, e.prototype, {
        updateAddToCartState: function (e) {
          var i = e.variant;
          if (!i)
            return (
              $(t.addToCart, this.$container).prop("disabled", !0),
              $(t.addToCartText, this.$container).html(theme.strings.unavailable),
              void $(t.priceWrapper, this.$container).addClass("hide")
            );
          $(t.priceWrapper, this.$container).removeClass("hide"),
            i.available
              ? ($(t.addToCart, this.$container).prop("disabled", !1),
                $(t.addToCartText, this.$container).html(theme.strings.addToCart))
              : ($(t.addToCart, this.$container).prop("disabled", !0),
                $(t.addToCartText, this.$container).html(theme.strings.soldOut));
        },
        updateProductPrices: function (e) {
          var i = e.variant,
            n = $(t.comparePrice, this.$container),
            o = n.add(t.comparePriceText, this.$container),
            r = $(t.priceWrapper, this.$container).find(".stock-alert"),
            a = $(t.originalSelectorId, this.$container)
              .find("option[value=" + i.id + "]")
              .data("q");
          $(t.productPrice, this.$container).html(
            slate.Currency.formatMoney(i.price, theme.moneyFormat)
          ),
            r.text("").addClass("hide"),
            i.available
              ? a < 5 && r.text("Only " + a + " left").removeClass("hide")
              : r.text("Sold out").removeClass("hide"),
            $("#Quantity").trigger("setmax", [a]),
            i.compare_at_price > i.price
              ? (n.html(slate.Currency.formatMoney(i.compare_at_price, theme.moneyFormat)),
                o.removeClass("hide"))
              : (n.html(""), o.addClass("hide"));
        },
        updateProductImage: function (t) {
          var e = t.variant,
            i = slate.Image.getSizedImageUrl(e.featured_image.src, this.settings.imageSize);
          this.$featuredImage.attr("src", i);
        },
        buildVariantOptions: function (productData, currentSelectedVariant) {
          var html = "";

          // If current variant option2 not available
          var currentVariant = currentSelectedVariant;
          if (!currentVariant?.option2) return html;

          // Filter variant based on second variant
          var variantList = productData.product.variants.filter(function (variant) {
            return variant.option2 == currentVariant.option2;
          });

          // Is current variant option1 available
          var currentVariantOtp1 = false;
          if (currentVariant?.option1) {
            currentVariantOtp1 = true;
          }

          // Update new HTML
          variantList.forEach(function (variant, i) {
            var isAvailable = variant.available;

            // is current variant
            var isCurrentVariant = false;
            if (currentVariantOtp1) {
              isCurrentVariant = currentVariant.option1 == variant.option1;
            } else {
              if (i == 0) {
                isCurrentVariant = true;
              }
            }

            html += `
            <option value="${variant.option1}" ${
              isAvailable == false && !isCurrentVariant ? "disabled" : ""
            } ${isCurrentVariant ? "selected" : ""}>
                ${variant.option1} 
                ${
                  isAvailable == false
                    ? ' <span class="stock__msg" style="color: red;">(Out of stock)</span>'
                    : ""
                }
            </option>`;
          });

          return html;
        },
        updateVariantOptions: function (resp) {
          var targetElm = resp.targetSelector;
          if (targetElm && $(targetElm).data("index") == "option2") {
            var optionHtml = this.buildVariantOptions(
              resp.productData,
              resp.currentSelectedVariant
            );

            // Variant switch options
            var variantOptions = $(this.$container).find(`${t.singleOptionSelector}`);
            variantOptions.each(function (i, item) {
              if ($(item).data("index") != "option2") {
                $(item).html(optionHtml);
              }
            });
          }
        },
        onUnload: function () {
          this.$container.off(this.namespace);
        },
      })),
      e
    );
  })()),
  (function () {
    var t;
    $("#shopify-section-store-locator").length &&
      ((t = [
        {
          link: "http://google.com",
          title: "Ewing Sports",
          address: "816 Silvia Street",
          id: 1,
          city: "West Trenton",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "08628",
          phone: "(609)497-2323",
          state: { state: "NJ", state_id: 31 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Intnl Soccer and Rugby",
          address: "3683 Post Road ",
          id: 2,
          city: "Southport",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "06890",
          phone: "-",
          state: { state: "CT", state_id: 7 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Intnl Soccer and Rugby",
          address: "15 Ethan Allen Highway",
          id: 3,
          city: "Ridgefield",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "06877",
          phone: "-",
          state: { state: "CT", state_id: 7 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Intnl Soccer and Rugby",
          address: "42 W Putnam Ave",
          id: 4,
          city: "Greenwich",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "06830",
          phone: "-",
          state: { state: "CT", state_id: 7 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Intnl Soccer and Rugby",
          address: "154 Samson Rock Dr",
          id: 5,
          city: "Madison",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "06433",
          phone: "-",
          state: { state: "CT", state_id: 7 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Corner",
          address: "1820 Coit Rd",
          id: 6,
          city: "Plano",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "75075",
          phone: "(972)519-0222",
          state: { state: "TX", state_id: 44 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Corner",
          address: "961 W. I 20",
          id: 7,
          city: "Arlington",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "76017",
          phone: "(817)417-0000",
          state: { state: "TX", state_id: 44 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Corner",
          address: "6100 Long Prairie Rd",
          id: 8,
          city: "Flower Mound",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "75028",
          phone: "(972)355-8200",
          state: { state: "TX", state_id: 44 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Corner",
          address: "100 N. Kimball Ave",
          id: 9,
          city: "Southlake",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "76092",
          phone: "(817)748-0555",
          state: { state: "TX", state_id: 44 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Locker Miami",
          address: "9601 S. Dixie Highway",
          id: 10,
          city: "Miami",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "33156",
          phone: "(305)670-9100",
          state: { state: "FL", state_id: 10 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Locker Orlando",
          address: "460 N. Orlando Avenue Suite 110",
          id: 11,
          city: "Winter Park",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "32789",
          phone: "(407)629-0009",
          state: { state: "FL", state_id: 10 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Master",
          address: "14188 Manchester Road",
          id: 12,
          city: "Manchester",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "63011",
          phone: "-",
          state: { state: "MO", state_id: 26 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Master",
          address: "3790 Green Mount Crossing Dr",
          id: 13,
          city: "Shiloh",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "62269",
          phone: "(618)624-5089",
          state: { state: "IL", state_id: 14 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Master",
          address: "94 Crossings Shopping Center",
          id: 14,
          city: "St. Peters",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "63304",
          phone: "(636)447-5337",
          state: { state: "MO", state_id: 26 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Master",
          address: "5833 So. Lindbergh Blvd.",
          id: 15,
          city: "St. Louis",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "63123",
          phone: "(314)487-2422",
          state: { state: "MO", state_id: 26 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Master",
          address: "Quivira & West 135th Street",
          id: 16,
          city: "Overland Park",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "66221",
          phone: "(913)648-1994",
          state: { state: "KS", state_id: 17 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Master",
          address: "20120 E. Jackson Suite #20",
          id: 17,
          city: "Independence",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "64057",
          phone: "(816)795-7708",
          state: { state: "MO", state_id: 26 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Max",
          address: "12140 West Sunrise Blvd",
          id: 18,
          city: "Plantation",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "33323",
          phone: "(954)382-0040",
          state: { state: "FL", state_id: 10 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Pro",
          address: "1338 Saratoga Ave",
          id: 19,
          city: "San Jose",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "95129",
          phone: "(408)551-0413",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Pro",
          address: "6635 Dublin Blvd.",
          id: 20,
          city: "Dublin",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "94568",
          phone: "(925)803-4435",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Pro",
          address: "565-C Contra Costa Blvd",
          id: 21,
          city: "Pleasant Hill",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "94523",
          phone: "(925)685-0440",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Pro",
          address: "11726 Fair Oaks Blvd",
          id: 22,
          city: "Fair Oaks",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "95628",
          phone: "(916)962-0880",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Pro",
          address: "1235 Veterans Blvd",
          id: 23,
          city: "Redwood City",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "94063",
          phone: "(650)599-9900",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer West",
          address: "3333 184th Street Southwest, Suite T",
          id: 24,
          city: "Lynnwood",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "98037",
          phone: "(425)744-2718",
          state: { state: "WA", state_id: 48 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer West",
          address: "31883 Gateway Center Blvd S.",
          id: 25,
          city: "Federal Way",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "98003",
          phone: "(253)529-0570",
          state: { state: "WA", state_id: 48 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer West",
          address: "3700 Factoria Boulevard SE, Suite A",
          id: 26,
          city: "Bellevue",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "98006",
          phone: "(425)644-5312",
          state: { state: "WA", state_id: 48 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer West",
          address: "15932 Redmond Way, Suite 102",
          id: 27,
          city: "Redmond",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "98052",
          phone: "(425)898-2166",
          state: { state: "WA", state_id: 48 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer West",
          address: "14800 Starfire Way",
          id: 28,
          city: "Tukwila",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "98188",
          phone: "(206)267-7627",
          state: { state: "WA", state_id: 48 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer4all",
          address: "1306 FM 1092, Suite 101",
          id: 29,
          city: "Missouri City",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "77459",
          phone: "(281)499-6665",
          state: { state: "TX", state_id: 44 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer4all",
          address: "1500 Research Forest Dr., Ste 140",
          id: 30,
          city: "The Woodlands",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "77381",
          phone: "(281)465-0424",
          state: { state: "TX", state_id: 44 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer4all",
          address: "6700C Louetta Rd.",
          id: 31,
          city: "Spring",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "77379",
          phone: "(281)376-7890",
          state: { state: "TX", state_id: 44 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer4all",
          address: "16550 El Camino Real",
          id: 32,
          city: "Clear Lake",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "77062",
          phone: "-",
          state: { state: "TX", state_id: 44 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer4all",
          address: "2425 Rice Blvd.",
          id: 33,
          city: "Houston",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "77005",
          phone: "(713)522-0441",
          state: { state: "TX", state_id: 44 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer4all",
          address: "4003F Rustic Woods Dr.",
          id: 34,
          city: "Kingwood",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "77339",
          phone: "(281)361-4434",
          state: { state: "TX", state_id: 44 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer4all",
          address: "16211 Clay Road",
          id: 35,
          city: "Houston",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "77084",
          phone: "(281)861-7744",
          state: { state: "TX", state_id: 44 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Stefans Soccer",
          address: "19555 W Bluemound Rd",
          id: 36,
          city: "Brookfield",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "53045",
          phone: "(262)789-7800",
          state: { state: "WI", state_id: 50 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Stefans Soccer",
          address: "6620 Odana Road",
          id: 37,
          city: "Madison",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "53719",
          phone: "(608)826-4222",
          state: { state: "WI", state_id: 50 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Stefans Soccer",
          address: "8681 N Port Washington Rd",
          id: 38,
          city: "Fox Point",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "53217",
          phone: "(262) 240-9955",
          state: { state: "WI", state_id: 50 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Stefans Soccer",
          address: "1125 W Lincoln Avenue",
          id: 39,
          city: "Milwaukee",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "53215",
          phone: "(414)384-1415",
          state: { state: "WI", state_id: 50 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "http://www.soccerstop.com",
          title: "The Soccer Stop",
          address: "15055 East Hinsdale Dr ",
          id: 40,
          city: "Centennial",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "80112",
          phone: "(720)956-6999",
          state: { state: "CO", state_id: 6 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "http://www.soccerstop.com",
          title: "The Soccer Stop",
          address: "8130 S. University Blvd.",
          id: 41,
          city: "Centennial",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "80112",
          phone: "(303)740-9300",
          state: { state: "CO", state_id: 6 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "http://www.soccerstop.com",
          title: "The Soccer Stop",
          address: "8555 W. Belleview Ave.",
          id: 42,
          city: "Denver",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "80123",
          phone: "(303)932-6213",
          state: { state: "CO", state_id: 6 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "http://www.soccerstop.com",
          title: "The Soccer Stop",
          address: "11265 Decatur St",
          id: 43,
          city: "Denver",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "80234",
          phone: "(303)439-2635",
          state: { state: "CO", state_id: 6 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "http://www.soccerstop.com",
          title: "The Soccer Stop",
          address: "4032 south college avenue, unit A3",
          id: 44,
          city: "Fort Collins",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "80525",
          phone: "(970)223-8800",
          state: { state: "CO", state_id: 6 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "We Got Soccer",
          address: "99 Washington St",
          id: 45,
          city: "Foxboro",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "02035",
          phone: "(508)822-1700",
          state: { state: "MA", state_id: 22 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Willy Sport",
          address: "Serravalle Scrivia",
          id: 46,
          city: "Piemonte",
          region: [{ region: "Piemonte", region_id: 4 }],
          zip: "AL",
          phone: "0143 65762",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Fuorigioco",
          address: "Biella",
          id: 47,
          city: "Piemonte",
          region: [{ region: "Piemonte", region_id: 4 }],
          zip: "BI",
          phone: "015 8409365",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Fa Sport",
          address: "Novara",
          id: 48,
          city: "Piemonte",
          region: [{ region: "Piemonte", region_id: 4 }],
          zip: "NO",
          phone: "0321 392259",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Team Sport",
          address: "Rivoli",
          id: 49,
          city: "Piemonte",
          region: [{ region: "Piemonte", region_id: 4 }],
          zip: "TO",
          phone: "011 9564743",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Futsal Mania",
          address: "Settimo Torinese",
          id: 50,
          city: "Piemonte",
          region: [{ region: "Piemonte", region_id: 4 }],
          zip: "TO",
          phone: "011 8968954",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Cometax",
          address: "Bergamo",
          id: 51,
          city: "Lombardia",
          region: [{ region: "Lombardia", region_id: 3 }],
          zip: "BG",
          phone: "035 363831",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Onis Sportswear",
          address: "Spirano",
          id: 52,
          city: "Lombardia",
          region: [{ region: "Lombardia", region_id: 3 }],
          zip: "BG",
          phone: "035 4878067",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Balboni Arti Grafiche",
          address: "Brescia",
          id: 53,
          city: "Lombardia",
          region: [{ region: "Lombardia", region_id: 3 }],
          zip: "BS",
          phone: "030 5240068",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Bricosport",
          address: "Seregno",
          id: 54,
          city: "Lombardia",
          region: [{ region: "Lombardia", region_id: 3 }],
          zip: "BS",
          phone: "0362 265780",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Freetime M.G.",
          address: "Barzago",
          id: 55,
          city: "Lombardia",
          region: [{ region: "Lombardia", region_id: 3 }],
          zip: "LC",
          phone: "031 861444",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Teamsport Idendity",
          address: "San Martino in Strada",
          id: 56,
          city: "Lombardia",
          region: [{ region: "Lombardia", region_id: 3 }],
          zip: "LO",
          phone: "0371 476136",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Jan Sport",
          address: "Monza",
          id: 57,
          city: "Lombardia",
          region: [{ region: "Lombardia", region_id: 3 }],
          zip: "MB",
          phone: "039 2915572",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Marchio Sport",
          address: "Monza",
          id: 58,
          city: "Lombardia",
          region: [{ region: "Lombardia", region_id: 3 }],
          zip: "MB",
          phone: "039 2003041",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Bricosport",
          address: "Cesano Maderno",
          id: 59,
          city: "Lombardia",
          region: [{ region: "Lombardia", region_id: 3 }],
          zip: "MI",
          phone: "0362 265780",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "D.G. Sport",
          address: "Rozzano",
          id: 60,
          city: "Lombardia",
          region: [{ region: "Lombardia", region_id: 3 }],
          zip: "MI",
          phone: "02 57506108",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Check Point",
          address: "Asola",
          id: 61,
          city: "Lombardia",
          region: [{ region: "Lombardia", region_id: 3 }],
          zip: "MN",
          phone: "0376 1816248",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Palleggiando",
          address: "Pavia",
          id: 62,
          city: "Lombardia",
          region: [{ region: "Lombardia", region_id: 3 }],
          zip: "PV",
          phone: "0382 060448",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Fox Sport",
          address: "Vigevano",
          id: 63,
          city: "Lombardia",
          region: [{ region: "Lombardia", region_id: 3 }],
          zip: "PV",
          phone: "0381 329809",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Fontana Sport",
          address: "Caldogno",
          id: 64,
          city: "Veneto",
          region: [{ region: "Veneto", region_id: 5 }],
          zip: "VI",
          phone: "0444 557179",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Sport Center",
          address: "Pievesestina di Cesena",
          id: 65,
          city: "Emilia-Romagna",
          region: [{ region: "Emilia-Romagna", region_id: 1 }],
          zip: "FC",
          phone: "0547 415015",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Football",
          address: "Ferrara",
          id: 66,
          city: "Emilia-Romagna",
          region: [{ region: "Emilia-Romagna", region_id: 1 }],
          zip: "FE",
          phone: "0532 1862394",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "A Tutto Campo",
          address: "Carpi",
          id: 67,
          city: "Emilia-Romagna",
          region: [{ region: "Emilia-Romagna", region_id: 1 }],
          zip: "MO",
          phone: "059 6229547",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Planet 5",
          address: "Cisterna di Latina",
          id: 68,
          city: "Lazio",
          region: [{ region: "Lazio", region_id: 2 }],
          zip: "LT",
          phone: "340 7365990",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Omnia Sport",
          address: "Latina",
          id: 69,
          city: "Lazio",
          region: [{ region: "Lazio", region_id: 2 }],
          zip: "LT",
          phone: "0773 631277",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Di Fonsi",
          address: "Terracina",
          id: 70,
          city: "Lazio",
          region: [{ region: "Lazio", region_id: 2 }],
          zip: "LT",
          phone: "0773 705196",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Alema 03",
          address: "Roma",
          id: 71,
          city: "Lazio",
          region: [{ region: "Lazio", region_id: 2 }],
          zip: "RM",
          phone: "06 52246304",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Mister Calcio",
          address: "Roma",
          id: 72,
          city: "Lazio",
          region: [{ region: "Lazio", region_id: 2 }],
          zip: "RM",
          phone: "06 64000608",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "http://www.portierecalcio.it/",
          title: "Sport Uno",
          address: "Roma",
          id: 73,
          city: "Lazio",
          region: [{ region: "Lazio", region_id: 2 }],
          zip: "RM",
          phone: "06 5562001",
          state: { state: "", state_id: 1 },
          country: { country: "IT", country_id: 2 },
        },
        {
          link: "#",
          title: "LastLine Sports",
          address: "info@lastline.com.au",
          id: 75,
          city: "",
          region: [{ region: "", region_id: 1 }],
          zip: "",
          phone: "0408 202 240",
          state: { state: "", state_id: 1 },
          country: { country: "AU", country_id: 3 },
        },
        {
          link: "#",
          title: "Spank it Sports",
          address: "735 Cloverdale Avenue",
          id: 76,
          city: "Victoria British Colombia",
          region: [{ region: "", region_id: 1 }],
          zip: "V8X 2S6",
          phone: "(250)380-1980",
          state: { state: "", state_id: 1 },
          country: { country: "CA", country_id: 4 },
        },
        {
          link: "#",
          title: "JMT Metrosports",
          address: "777 Warden Ave, Store #9",
          id: 77,
          city: "Scarborough Ontario",
          region: [{ region: "", region_id: 1 }],
          zip: "M1L4C3",
          phone: "(416)901-9944",
          state: { state: "", state_id: 1 },
          country: { country: "CA", country_id: 4 },
        },
        {
          link: "#",
          title: "Square One Shopping Centre",
          address: "777 Warden Ave, Store #9",
          id: 78,
          city: "Mississauga Ontario",
          region: [{ region: "", region_id: 1 }],
          zip: "L5B 2C9",
          phone: "(905)896-BALL",
          state: { state: "", state_id: 1 },
          country: { country: "CA", country_id: 4 },
        },
        {
          link: "#",
          title: "Pasion Soccer Boutique",
          address: "5148 Rue Jarry E",
          id: 79,
          city: "St. Leonard Quebec",
          region: [{ region: "", region_id: 1 }],
          zip: "H1R 1Y4",
          phone: "(514)326-4444",
          state: { state: "", state_id: 1 },
          country: { country: "CA", country_id: 4 },
        },
        {
          link: "#",
          title: "Mundo Olimpico  & Servideportes",
          address: "Calle 17 No. 6-15.",
          id: 80,
          city: "Bogota",
          region: [{ region: "", region_id: 1 }],
          zip: "",
          phone: "314-2734882",
          state: { state: "", state_id: 1 },
          country: { country: "CO", country_id: 5 },
        },
        {
          link: "#",
          title: "100% Futbol",
          address: "Plaza Imperial",
          id: 81,
          city: "Bogota",
          region: [{ region: "", region_id: 1 }],
          zip: "",
          phone: "6872931",
          state: { state: "", state_id: 1 },
          country: { country: "CO", country_id: 5 },
        },
        {
          link: "#",
          title: "100% Futbol",
          address: "Centro Mayor",
          id: 82,
          city: "Bogota",
          region: [{ region: "", region_id: 1 }],
          zip: "",
          phone: "7342127",
          state: { state: "", state_id: 1 },
          country: { country: "CO", country_id: 5 },
        },
        {
          link: "#",
          title: "Upper 90 Soccer",
          address: "697 Amsterdam Ave",
          id: 83,
          city: "New York",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "10025",
          phone: "(646)863-7076",
          state: { state: "NY", state_id: 33 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Upper 90 Soccer",
          address: "359 Atlantic Ave",
          id: 84,
          city: "Brooklyn",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "11217",
          phone: "(646)863-7076",
          state: { state: "NY", state_id: 33 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Upper 90 Soccer",
          address: "183 South Broadway",
          id: 85,
          city: "Hicksville",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "11801",
          phone: "(646)863-7076",
          state: { state: "NY", state_id: 33 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Madness",
          address: "364 W. Half Day Road",
          id: 86,
          city: "Buffalo Grove",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "60004",
          phone: "(847)947-2060",
          state: { state: "IL", state_id: 14 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer And Sports",
          address: "3774 Santa Rosa Ave",
          id: 87,
          city: "Santa Rosa",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "95407",
          phone: "(707)523-0991",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Kapp Soccer",
          address: "168 East Boston Post Rd",
          id: 88,
          city: "Mamaroneck",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "10543",
          phone: "(914)698-7705",
          state: { state: "NY", state_id: 33 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "All Season Soccer",
          address: "869 Grant Avenue",
          id: 88,
          city: "Novato",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "94945",
          phone: "(888)608-4625",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Strictly Soccer",
          address: "1811 Huguenot rd #104",
          id: 89,
          city: "Midlothian",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "23113",
          phone: "(804)794-4468",
          state: { state: "VA", state_id: 47 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "All Star Soccer",
          address: "954 E. El Camino Real",
          id: 90,
          city: "Sunnyvale",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "94087",
          phone: "(408)245-7827",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Kicks & Sticks",
          address: "940 Grace Dr",
          id: 91,
          city: "Lawrenceville",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "30043",
          phone: "(678)714-4924",
          state: { state: "GA", state_id: 11 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Pro Soccer",
          address: "82 N Los Robles Avenue",
          id: 92,
          city: "Pasadena",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "91101",
          phone: "(626)403-9921",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Junction",
          address: "1245 Mills Ave Suite 4-A",
          id: 93,
          city: "Chino",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "91710",
          phone: "(909)590-5111",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Plus",
          address: "34 Westerview Drive",
          id: 94,
          city: "Westerville",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "43081",
          phone: "(614)882-0909",
          state: { state: "OH", state_id: 36 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Post & Tennis",
          address: "800 Denow Rd. ",
          id: 95,
          city: "Pennington",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "08534",
          phone: "(609)303-0647",
          state: { state: "NJ", state_id: 31 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Post Tennesse",
          address: "7838 Kingston Pike",
          id: 96,
          city: "Knoxville",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "37919",
          phone: "(865)247-4672",
          state: { state: "TN", state_id: 43 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Village Soccer Shop",
          address: "40 Main Street",
          id: 97,
          city: "Tarrytown",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "10591",
          phone: "(914)231-7577",
          state: { state: "NY", state_id: 33 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Almacen de Bicicletas G.L",
          address: "Calle 68 # 28-30",
          id: 98,
          city: "MedellÃ­n",
          region: [{ region: "", region_id: 1 }],
          zip: "",
          phone: "(1) 630 7409",
          state: { state: "", state_id: 1 },
          country: { country: "CO", country_id: 5 },
        },
        {
          link: "http://www.total-rugby.com/",
          title: "Total Rugby",
          address: "",
          id: 99,
          city: "MedellÃ­n",
          region: [{ region: "", region_id: 1 }],
          zip: "",
          phone: "",
          state: { state: "", state_id: 1 },
          country: { country: "CO", country_id: 5 },
        },
        {
          link: "#",
          title: "SPORTS PERFORMANCE PROTECTION S.A.S.",
          address: "Calle 62 # 4-24 of 101",
          id: 100,
          city: "",
          region: [{ region: "", region_id: 1 }],
          zip: "",
          phone: "311-5774411",
          state: { state: "", state_id: 1 },
          country: { country: "CO", country_id: 5 },
        },
        {
          link: "#",
          title: "Soccer Central - Hawaiian Gardens",
          address: "12130 E. Carson St. Unit D",
          id: 101,
          city: "Hawaiian Gardens",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "90716",
          phone: "(562)421-2292",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Central - Placentia",
          address: "1876 N. Placentia Ave",
          id: 102,
          city: "Placentia",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "92870",
          phone: "(714)223-1490",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Central - Torrance",
          address: "19019 Hawthorne Blvd. Suite 200-C",
          id: 103,
          city: "Torrance",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "90503",
          phone: "(310)921-3609",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Niky's Sports #3",
          address: "11954 Wilshire Blvd",
          id: 104,
          city: "Los Angeles",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "90025",
          phone: "(310)442-1980",
          state: { state: "CA", state_id: 5 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer Evolution",
          address: "500 Rt. 10 West",
          id: 105,
          city: "Randolph",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "07869",
          phone: "(973)366-9550",
          state: { state: "NJ", state_id: 31 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer World",
          address: "521 North Service Rd E",
          id: 106,
          city: "Oakville",
          region: [{ region: "", region_id: 1 }],
          zip: "L6H 5R2",
          phone: "(905)815-8939",
          state: { state: "", state_id: 1 },
          country: { country: "CA", country_id: 4 },
        },
        {
          link: "#",
          title: "Absolute Soccer",
          address: "4130 Fairview Street",
          id: 107,
          city: "Burlington",
          region: [{ region: "", region_id: 1 }],
          zip: "L7L 4Y8",
          phone: "(905)639-9866",
          state: { state: "", state_id: 1 },
          country: { country: "CA", country_id: 4 },
        },
        {
          link: "http://www.soccerworldonline.com",
          title: "Soccer World INC - Rochester",
          address: "1900 S Rochester Rd",
          id: 108,
          city: "Rochester Hills",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "48307",
          phone: "(248)608-6000",
          state: { state: "MI", state_id: 23 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "http://www.soccerworldonline.com",
          title: "Soccer World INC - Canton",
          address: "43771 Ford Rd",
          id: 109,
          city: "Canton",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "480187",
          phone: "(734)207-0088",
          state: { state: "MI", state_id: 23 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "http://www.soccerworldonline.com",
          title: "Soccer World INC - Brighton",
          address: "9864 E. Grand River",
          id: 110,
          city: "Brighton",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "48116",
          phone: "(810)225-4400",
          state: { state: "MI", state_id: 23 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer USA - Brentwood",
          address: "1701 Mallory Lane, Suite 300",
          id: 111,
          city: "Brentwood",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "37027",
          phone: "(615)661-9094",
          state: { state: "TN", state_id: 43 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer USA - Collierville",
          address: "4670 Merchants Park Circle, Suite 610",
          id: 112,
          city: "Collierville",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "38017",
          phone: "(901)854-9644",
          state: { state: "TN", state_id: 43 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer USA - Knoxville",
          address: "8025 Kingston Pike Suite #1",
          id: 113,
          city: "Knoxville",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "37919",
          phone: "(865)777-1847",
          state: { state: "TN", state_id: 43 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer USA - Kennesaw",
          address: "501 Robert Court Suite #11",
          id: 114,
          city: "Kennesaw",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "30144",
          phone: "(770)792-9095",
          state: { state: "GA", state_id: 11 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer USA - Chattanooga",
          address: "5953 Brainerd Road",
          id: 115,
          city: "Chattanooga",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "37421",
          phone: "(423)296-9904",
          state: { state: "TN", state_id: 43 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer USA - Murfreesboro",
          address: "1583 West College Street",
          id: 116,
          city: "Murfreesboro",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "37129",
          phone: "(615)410-7061",
          state: { state: "TN", state_id: 43 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "Soccer USA - Huntsville",
          address: "8408 Whitesburg DR S",
          id: 117,
          city: "Huntsville",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "35802",
          phone: "(256)881-3924",
          state: { state: "AL", state_id: 1 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "http://www.storelli.fi",
          title: "Storelli Finland",
          address: "http://www.storelli.fi",
          id: 118,
          city: "",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "",
          phone: "",
          state: { state: "", state_id: 1 },
          country: { country: "FI", country_id: 7 },
        },
        {
          link: "www.storelli.co.kr",
          title: "Storelli South Korea",
          address: "www.storelli.co.kr",
          id: 119,
          city: "",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "",
          phone: "",
          state: { state: "", state_id: 1 },
          country: { country: "KR", country_id: 6 },
        },
        {
          link: "#",
          title: "Soccer Post - Bedford Hills",
          address: "532 Bedford Rd",
          id: 120,
          city: "Bedford Hills",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "10507",
          phone: "(914)242-9800",
          state: { state: "NY", state_id: 33 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "GKUnion Soccer Equipment and Training Center",
          address: "207 Chesterfield Mall, Space 504",
          id: 121,
          city: "Chesterfield",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "63017",
          phone: "",
          state: { state: "MO", state_id: 26 },
          country: { country: "US", country_id: 1 },
        },
        {
          link: "#",
          title: "United Sports Apparel",
          address: "207 Chesterfield Mall, Space 618",
          id: 122,
          city: "Chesterfield",
          region: [{ region: "xxx", region_id: 1 }],
          zip: "63017",
          phone: "",
          state: { state: "MO", state_id: 26 },
          country: { country: "US", country_id: 1 },
        },
      ]),
      $(document).ready(function () {
        $("#country");
        var e = $("#state"),
          i = $("#region"),
          n = $(".locator_state"),
          o = $(".locator_region");
        $("#country").change(function () {
          "1-1" == $("#country").val()
            ? (e.prop("disabled", !1), n.removeClass("hide"), i.val("1-5"), o.addClass("hide"))
            : "2-2" == $("#country").val()
            ? (i.prop("disabled", !1), o.removeClass("hide"), e.val("1-51"), n.addClass("hide"))
            : (i.val("1-5").prop("disabled", !0),
              o.addClass("hide"),
              e.val("1-51").prop("disabled", !0),
              n.addClass("hide"));
        }),
          (function () {
            var e;
            $("#template").html();
            return (
              (e = Mustache.compile($("#template").html())),
              FilterJS(
                t,
                "#store-list",
                function (t) {
                  return e(t);
                },
                {
                  filter_criteria: {
                    country: ["#country.TYPE.range", "country.country_id"],
                    state: ["#state.TYPE.range", "state.state_id"],
                    region: ["#region.TYPE.range", "region.ARRAY.region_id"],
                  },
                  search: { input: "#search_box" },
                  and_filter_on: !1,
                }
              )
            );
          })();
      }));
  })(),
  $(document).ready(function () {
    new slate.Sections().register("product", theme.Product),
      slate.a11y.pageLinkFocus($(window.location.hash));
    slate.rte.wrapTable({ $tables: $(".rte table"), tableWrapperClass: "rte__table-wrapper" });
  });
