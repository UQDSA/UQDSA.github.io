// Custom Layout Mode for Isotope (Centered Masonry)
(function ($) {
	if ($.isFunction($.fn.isotope)) {
		$.Isotope.prototype.flush = function() {
			this.$allAtoms = $();
			this.$filteredAtoms = $();
			//this.element.children().remove();
			//this.reLayout();
		};
		$.Isotope.prototype._getCenteredMasonryColumns = function() {
			// Assign equal height to all elements to match fitRows effect
			var maxHeight = -1;
			$('.albumWrapper').each(function() {
				maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
			});
			$('.albumWrapper').each(function() {
				$(this).height(maxHeight);
			});

			/*this.width = this.element.width();
			var parentWidth = this.element.parent().width();
			// i.e. options.masonry && options.masonry.columnWidth
			var colW = this.options.masonry && this.options.masonry.columnWidth ||
			// or use the size of the first item
			this.$filteredAtoms.outerWidth(true) ||
			// if there's no items, use size of container
			parentWidth;
			var cols = Math.floor( parentWidth / colW );
			cols = Math.max( cols, 1 );
			// i.e. this.masonry.cols = ....
			this.masonry.cols = cols;
			// i.e. this.masonry.columnWidth = ...
			this.masonry.columnWidth = colW ;*/
			
			var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
			containerWidth = this.element.width();
			this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth || this.$filteredAtoms.outerWidth(true) || containerWidth;
			this.masonry.columnWidth += gutter;
			this.masonry.cols = Math.floor( ( containerWidth + gutter ) / this.masonry.columnWidth );
			this.masonry.cols = Math.max( this.masonry.cols, 1 );
		};
		$.Isotope.prototype._masonryReset = function() {
			// layout-specific props
			this.masonry = {};
			// FIXME shouldn't have to call this again
			this._getCenteredMasonryColumns();
			var i = this.masonry.cols;
			this.masonry.colYs = [];
			while (i--) {
				this.masonry.colYs.push( 0 );
			}
		};
		$.Isotope.prototype._masonryResizeChanged = function() {
			var prevColCount = this.masonry.cols;
			// get updated colCount
			this._getCenteredMasonryColumns();
			return ( this.masonry.cols !== prevColCount );
		};
		$.Isotope.prototype._masonryGetContainerSize = function() {
			var unusedCols = 0, i = this.masonry.cols;
			var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
			// count unused columns
			while ( --i ) {
				if ( this.masonry.colYs[i] !== 0 ) {
					break;
				}
				unusedCols++;
			}
			return {
				height : Math.max.apply( Math, this.masonry.colYs ),
				// fit container to columns that have been used;
				width : (this.masonry.cols - unusedCols) * this.masonry.columnWidth - gutter
			};
		};
	};
})( jQuery );