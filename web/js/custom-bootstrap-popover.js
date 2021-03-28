export default function CustomPopover($) {
  // jshint ;_;

  /* CUSTOM POPOVER PUBLIC CLASS DEFINITION
   * =============================== */

  const CustomPopover = function(element, options) {
    this.init('popover', element, options);
  };

  /* NOTE: CUSTOM POPOVER EXTENDS BOOTSTRAP-POPOVER.js
    ========================================== */

  CustomPopover.prototype = $.extend({}, $.fn.popover.Constructor.prototype, {
    constructor: CustomPopover,

    setContent: function() {
      const $tip = this.tip();
      $tip.removeClass('fade top bottom left right in');
    },

    hasContent: function() {
      return true;
    },

    getContent: function() {},

    tip: function() {
      if (!this.$tip) {
        this.$tip = $(this.options.target);
      }
      return this.$tip;
    },

    // Temporary fix per https://github.com/twitter/bootstrap/pull/6176
    toggle: function(e) {
      const self = e
        ? $(e.currentTarget)
            [this.type](this._options)
            .data(this.type)
        : this;
      if (self.tip().hasClass('in')) {
        self.hide();
      } else {
        self.show();
      }
    },
  });

  /* POPOVER PLUGIN DEFINITION
   * ======================= */

  const old = $.fn.customPopover;

  $.fn.customPopover = function(option) {
    return this.each(function() {
      const $this = $(this);
      let data = $this.data('popover');
      const options = typeof option === 'object' && option;
      if (!data) {
        $this.data('popover', (data = new CustomPopover(this, options)));
      }
      if (typeof option === 'string') data[option]();
    });
  };

  $.fn.customPopover.Constructor = CustomPopover;

  $.fn.customPopover.defaults = $.fn.popover.defaults;

  /* CUSTOM POPOVER NO CONFLICT
   * =================== */

  $.fn.customPopover.noConflict = function() {
    $.fn.customPopover = old;
    return this;
  };

  // http://stackoverflow.com/a/19804807/309011
  const oldHide = $.fn.popover.Constructor.prototype.hide;
  $.fn.customPopover.Constructor.prototype.hide = function(...args) {
    if (
      this.options.trigger === 'hover' &&
      (this.tip().is(':hover') || this.$element.is(':hover'))
    ) {
      const that = this;
      // try again after what would have been the delay
      setTimeout(() => {
        return that.hide.call(that, args);
      }, that.options.delay.hide);
      return;
    }
    oldHide.call(this, args);
  };
}
