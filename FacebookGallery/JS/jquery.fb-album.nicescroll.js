
/**
 * jQuery Facebook Album Plugin
 * @name jquery.fb-album.js
 * @version 1.3
 * @category jQuery Plugin
 */

// Custom Layout Mode for Isotope (Centered Masonry)
$.Isotope.prototype._getCenteredMasonryColumns = function() {
	// Assign equal height to all elements to match fitRows effect
	var maxHeight = -1;
	$('.albumWrapper').each(function() {
		maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
	});
	$('.albumWrapper').each(function() {
		$(this).height(maxHeight);
	});
	var columnOffset = this.options.masonry && this.options.masonry.columnOffset || 0;
	this.width = this.element.width();
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
	this.masonry.columnWidth = colW ;
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
		width : (this.masonry.cols - unusedCols) * this.masonry.columnWidth
	};
};

(function($) {
	$.fn.FB_Album = function(opts) {
		opts = $.extend({
			// General Script Settings
			// -----------------------
			facebookID: 				null,								// Your Facebook ID
			excludeAlbums: 				[],									// ID's of albums that are to be exclude from showing
			excludeImages: 				[],									// ID's of images that are to be exclude from showing
			maxNumberGalleries:			9,									// Define how many galleries should be pulled from Facebook (0 = all albums)
			maxNumberImages:			50,									// Define how many images per gallery should be pulled from Facebook
			innerImageScaler:			false,								// If set to true, the script will use an internal php function to scale images to size, otherwise a cloud based service (http://src.sencha.io) will be used
				PathInternalPHP:		'PHP/TimThumb.php',					// Define path and name to internal PHP Image Scaler
			responsiveGallery:			true,								// Define if gallery is supposed to be responsive to window size changes
				responsiveWidth:		90,									// Set percent of window width the responsive frameID container should have; only enter number but no '%' behind number
				fixedWidth:				800,								// Set window width in px for a fixed size frameID container; only enter number but no 'px' behind number

			// Settings for Tooltips
			// ---------------------
			tooltipTipAnchor:			'alt',								// Define what anchor or data-key should be used to store tooltips (i.e. "alt", "title", etc.)
			tooltipUseInternal:			true,								// Define if the internal tooltip script (qTip2) should be utilized
				tooltipDesign:			'ui-tooltip-jtools',				// Define which design to choose from for the qTip2 Plugin
			createTooltipsAlbums:		true,								// Add Tooltip class "TipGallery" to Album Thumbnails
			createTooltipsPhotos:		true,								// Add Tooltip class "TipPhoto" to Photo Thumbnails
			createTooltipsLightbox:		true,								// Add Tooltip class "TipLightbox" to Description Text in Lightbox

			// Settings for Sorting Feature
			// ----------------------------
			albumSortControls:			true,								// Allow for Isotope Plugin Sorting Feature (Album Thumbnails)
				AllowSortName:			true,								// Allow for Sorting by Album Name
				AllowSortItems:			true,								// Allow for Sorting by Number of Images per Album
				AllowSortCreated:		true,								// Allow for Sorting by Date Album has been created
				AllowSortUpdate:		true,								// Allow for Sorting by Date Album has last been updated

			// Settings for Text Items in Sorting Controls
			// -------------------------------------------
			SortNameText:				'Album Name',						// Define Text for Sorting Button (Sort by Album Name)
			SortItemsText:				'Number Images',					// Define Text for Sorting Button (Sort by Number Items)
			SortCreatedText:			'Date Created',						// Define Text for Sorting Button (Sort by Date Created)
			SortUpdatedText:			'Last Update',						// Define Text for Sorting Button (Sort by Date Updated)
			SortASCText:				'Sort Ascending',					// Define Text for Sort Ascending Button
			SortDESCText:				'Sort Descending',					// Define Text for Sort Descending Button

			// Settings for Text Items in Album Preview
			// ----------------------------------------
			AlbumContentPreText:		'Content:',							// Adjust width of CSS classes .albumCount, .albumCreate, .albumUpdate, .albumNumber if necessary
			AlbumCreatedPreText:		'Created:',							// Adjust width of CSS classes .albumCount, .albumCreate, .albumUpdate, .albumNumber if necessary
			AlbumUpdatedPreText:		'Updated:',							// Adjust width of CSS classes .albumCount, .albumCreate, .albumUpdate, .albumNumber if necessary
			AlbumShareMePreText:		'Share Album:',						// Define text shown before "Share Album" Links
			AlbumNumericIDPreText:		'Album ID:',						// Adjust width of CSS classes .albumCount, .albumCreate, .albumUpdate, .albumNumber if necessary
			OutOfTotalImagesPreText:	'out of',							// Define pre text when there are more images in album that the script is allowed to pull
			SingleImageWord:			'Image',							// Define word for a single Image
			MultiImagesWord:			'Images',							// Define word for multiple Images

			// Settings for Text Items in Photo Preview
			// ----------------------------------------
			AlbumBackButtonText:		'Back',								// Define text for back button in album preview
			AlbumTitlePreText:			'Album Name:',						// Define text shown before album name
			AlbumNoDescription:			'No Album Description available.',	// Define text to be shown if there is no album description available
			ImageLocationPreText:		'Picture(s) taken at',				// Define text shown before image location text (actual loaction pulled from Facebook; if available)
			ImageNumberPreText:			'Image ID:',						// Define text shown before Image ID Number
			ImageShareMePreText:		'Share Image:',						// Define text shown before "Share Image" Links
			colorBoxNoDescription:		'No Image Description available.',	// Define text to be shown in colorBox if no image description available

			// Settings for Album Thumbnails
			// -----------------------------
			albumNameTitle:				true,								// Add Name / Title of Album below Album Thumbnail
			albumImageCount:			true,								// Add Image Count per Album Below Album Thumbnail
			albumDateCreate:			false,								// Add Date Created below Album Thumbnail
			albumDateUpdate:			false,								// Add Date Last Updated below Album Thumbnail
			albumFacebookID:			false,								// Add Album ID below Album Thumbnail; ID can be used to exclude album from showing
			albumWrapperWidth:			290,								// Define width for each Album Wrapper (should equal albumThumWidth + 2x albumFrameOffset!)
			albumThumbWidth: 			280,								// Define width for each Album Thumbnail (deduct at least 2x albumFrameOffset from albumWrapperWidth to allow for frame offset)
			albumThumbHeight: 			200,								// Define Height for each Album Thumbnail
			albumFrameOffset:			5,									// Define offset for 2nd Album Thumbnail border to create stacked effect
			albumWrapperMargin:			10,									// Define margin for each Album Wrapper
			albumShadowOffset:			12,									// Define additional offset (top) for album shadow to fine-tune shadow position
			albumInfoOffset:			0,									// Define additional offset (top) for album information section (name, content, dates)
			albumThumbOverlay:			true,								// Add Magnifier Overlay to Thumbnail
			albumThumbRotate:			true,								// Add Hover Rotate / Rumble Effect to Album Thumbnail (rotate does not work in IE 8 or less; rumble effect compensates)
				albumRumbleX:			3,									// Define Rumble Movement on X-Scale for Album Thumbnails
				albumRumbleY:			3,									// Define Rumble Movement on Y-Scale for Album Thumbnails
				albumRotate:			3,									// Define Rotation Angle on X+Y-Scale for Album Thumbnails
				albumRumbleSpeed:		150,								// Define Speed for Rumble / Rotate Effect for Album Thumbnails
			albumShowPaperClipL:		true,								// PaperClip on the left
			albumShowPaperClipR:		false,								// PaperClip on the Right
			albumShowPushPin:			false,								// Centered Pushin
			albumShowShadow:			true,								// Show Shadow below Album Thumbnail (use only one shadow type below)
				albumShadowA:			true,								// Show Shadow Type 1 (default if none selected)
				albumShadowB:			false,								// Show Shadow Type 2
				albumShadowC:			false,								// Show Shadow Type 3
			albumShowSocialShare:		true,								// Add Section to share album via Facebook, Twitter and Google

			// Settings for Photo Thumbnails
			// -----------------------------
			photoThumbWidth: 			210,								// Define Width for each Photo Thumbnail
			photoThumbHeight: 			155,								// Define Height for each Photo Thumbnail
			photoThumbMargin: 			10,									// Define Margin (top-left-bottom-right) for each Photo Thumbnail
			photoThumbOverlay:			true,								// Add Magnifier Overlay to Photo Thumbnail
			photoThumbRotate:			true,								// Add Hover Rotate / Rumble Effect to Photo Thumbnail (rotate does not work in IE 8 or less; rumble effect compensates)
				photoRumbleX:			5,									// Define Rumble Movement on X-Scale for Photo Thumbnails
				photoRumbleY:			5,									// Define Rumble Movement on Y-Scale for Photo Thumbnails
				photoRotate:			5,									// Define Rotation Angle on X+Y-Scale for Photo Thumbnails
				photoRumbleSpeed:		150,								// Define Speed for Rumble / Rotate Effect for Photo Thumbnails
			photoShowClearTape:			true,								// Add Clear Tape on Top of Photo Thumbnail
			photoShowYellowTape:		false,								// Add Yellow Tape on Top of Photo Thumbnail
			photoShowPushPin:			false,								// Add Centered Pushin on Top of Photo Thumbnail
			photoShowFBLink:			true,								// Add Link to original Facebook Gallery
			photoShowNumber:			false,								// Add Facebook Image ID Number below Thumbnail
			photoShowSocialShare:		true,								// Add Section to share photo via Facebook, Twitter and Google

			// Settings for Optional Lightbox (Colorbox)
			// -----------------------------------------
			fancyBoxAllow:				true,								// Add fancyBox (Lightbox) to Photo Thumbnails; if not, images will open up in new tab / window
			fancyBoxOptions: 			{},									// Options for fancyBox Lightbox Plugin (currently not active yet; preparation for future update!)
			colorBoxAllow:				false,								// Add colorBox (Lightbox) to Photo Thumbnails; if not, images will open up in new tab / window
			colorBoxOptions: 			{},									// Options for colorBox Lightbox Plugin (currently not active yet; preparation for future update!)

			
			niceScrollAllow:			false,								// Add niceScroll to Photo Thumbnails; 
			niceScrollOptions: 			{},									// Options for niceScroll Plugin 

			// Debug Settings (Experimental)
			// -----------------------------
			outputCountAlbumID:			false,								// Shows popup with album counter and album ID for each album found and not excluded while looping
			
			// Don't change any ID's unless you are also updating the corresponding CSS file
			// -----------------------------------------------------------------------------
			frameID: 					$(this).attr("id"),					// ID of element in which overall gallery script is to be shown
			loaderID: 					'FB_Album_Loader',					// ID of element in which gallery loader animation is to be shown ... ensure ID matches the one used in CSS settings!
			controlsID:					'FB_Album_Options',					// Define ID for Sorting Controls Section ... ensure ID matches the one used in CSS settings!
			galleryID: 					'FB_Album_Display'					// ID of element in which gallery thumbnails are to be shown ... ensure ID matches the one used in CSS settings!
		}, opts);

		var counterA = 					0;
		var counterB = 					0;
		var images = 					0;
		var offset = 					0;
		var photoOffset = 				0;
		var albumId = 					"";
		var headerArray = 				new Array();

		if (opts.innerImageScaler) {
			if (opts.PathInternalPHP.length == 0) {
				opts.innerImageScaler = false;
			} else {
				var dir = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
				dir = window.location.host + dir + "/" + opts.PathInternalPHP;
				// Will be used in future script update
			}
		}

		if ((opts.colorBoxAllow) && (opts.fancyBoxAllow)) {
			opts.colorBoxAllow = false;
		}

		function loadAlbums() {
			$('#fb-album-header').html("");
			if ($('#fb-albums-all').length != 0) {
				if (opts.albumSortControls && ((opts.AllowSortName) || (opts.AllowSortItems) || (opts.AllowSortCreated) || (opts.AllowSortUpdate))) {
					$('#' + opts.controlsID).fadeIn(500);
				}
				$('#fb-albums-all').fadeIn(500);
				var $container = $('#fb-albums-all');
				$container.isotope('reLayout', function(){});
			} else {
				$("<div>", {
					id : "fb-albums-all"
				}).appendTo("#fb-album-content");
				albumCall();
			}
		}

		function albumCall() {
			FB.api(opts.facebookID + '/albums', {
				limit : 20,
				offset : offset * 20
			}, function(response) {
				for(var i in response.data) {
					var album = response.data[i];
						if (opts.outputCountAlbumID) {
							alert(i + ": " + album.id + " / " + album.count);
						}
					if (typeof(album.count) != "undefined") {
						if ($.inArray(album.id, opts.excludeAlbums) == -1) {
							counterA = counterA + 1;
							if ((counterA <= opts.maxNumberGalleries) || (opts.maxNumberGalleries === 0)) {
								if (album.count > opts.maxNumberImages) {
									var countTxt = opts.maxNumberImages + " ";
								} else {
									var countTxt = album.count + " ";
								}
								// Convert ISO-8601 Dates into readable Format
								if (opts.albumDateCreate) {
									var timeStampA = new XDate(album.created_time);
									var timeStampA_Zone = Math.abs(timeStampA.clone().toString("z"));
									timeStampA = timeStampA.clone().addHours(timeStampA_Zone).toString("MM/dd/yyyy - hh:mm TT");
								}
								if (opts.albumDateUpdate) {
									var timeStampB = new XDate(album.updated_time);
									var timeStampB_Zone = Math.abs(timeStampB.clone().toString("z"));
									timeStampB = timeStampB.clone().addHours(timeStampB_Zone).toString("MM/dd/yyyy - hh:mm TT");
								}
								if(album.count > 1) {
									countTxt += opts.MultiImagesWord;
								} else {
									countTxt += opts.SingleImageWord;
								}
								if (album.count > opts.maxNumberImages) {
									countTxt += " (" + opts.OutOfTotalImagesPreText + " " + album.count + " " + opts.MultiImagesWord + ")";
								}
								var clear = 'width: ' + (opts.albumWrapperWidth + opts.albumFrameOffset * 2) + 'px; margin: ' + opts.albumWrapperMargin + 'px';
								if (opts.createTooltipsAlbums) {
									var tooltips = " TipGallery";
								} else {
									var tooltips = "";
								};
								var html = '<div id="' + album.id + '" class="albumThumb fbLink' + tooltips +'" ' + opts.tooltipTipAnchor + '="' + album.name + '" data-link="' + album.link + '" style="width:' + opts.albumThumbWidth + 'px; height:' + opts.albumThumbHeight + 'px; padding: ' + opts.albumFrameOffset + 'px;" data-href="#album-' + album.id + '">';
									if (opts.albumShowPaperClipL) {
										html += '<span class="PaperClipLeft"></span>';
									}
									if (opts.albumShowPaperClipR) {
										html += '<span class="PaperClipRight" style="left: ' + (opts.albumWrapperWidth - 30) + 'px;"></span>';
									}
									if (opts.albumShowPushPin) {
										html += '<span class="PushPin" style="left: ' + (Math.ceil(opts.albumWrapperWidth / 2)) + 'px;"></span>';
									}
									if (opts.albumShowShadow) {
										if ((!opts.albumShadowA) && (!opts.albumShadowB) && (!opts.albumShadowC)) {
											html += '<div class="fb-album-shadow1" style="top: ' + (opts.albumThumbHeight + opts.albumShadowOffset) + 'px;"></div>';
										} else if (opts.albumShadowA){
											html += '<div class="fb-album-shadow1" style="top: ' + (opts.albumThumbHeight + opts.albumShadowOffset) + 'px;"></div>';
										} else if (opts.albumShadowB){
											html += '<div class="fb-album-shadow2" style="top: ' + (opts.albumThumbHeight + opts.albumShadowOffset) + 'px;"></div>';
										} else if (opts.albumShadowC){
											html += '<div class="fb-album-shadow3" style="top: ' + (opts.albumThumbHeight + opts.albumShadowOffset) + 'px;"></div>';
										}
									}
									html += '<span id="Wrap_' + album.id + '" class="albumThumbWrap" style="padding: ' + opts.albumFrameOffset + 'px; left: ' + opts.albumFrameOffset + 'px; top: ' + opts.albumFrameOffset + 'px;">';
										html += '<i class="fb-album-thumb" id="fb-album-thumb-' + album.cover_photo + '" style="width:' + opts.albumThumbWidth + 'px; height:' + opts.albumThumbHeight + 'px;"></i>';
										html += '<i class="fb-album-overlay" id="fb-album-overlay-' + album.cover_photo + '" style="width:' + opts.albumThumbWidth + 'px; height:' + opts.albumThumbHeight + 'px; padding: ' + opts.albumFrameOffset + 'px;"></i>';
									html += '</span>';
								html += '</div>';
	
								html += '<div class="albumDetails" ' + opts.tooltipTipAnchor + '="' + album.id + '" style="width:' + opts.albumWrapperWidth + 'px; padding-top: ' + ((opts.albumShowShadow == true ? opts.albumShadowOffset : 0) + opts.albumInfoOffset) + 'px;">';
									if (opts.albumShowSocialShare) {
										html += '<div class="albumShare clearfix" style="width: ' + (opts.albumWrapperWidth + opts.albumFrameOffset) + 'px;">';
											html += '<span class="albumSocial">' + opts.AlbumShareMePreText + '</span>';
											html += '<ul style="float: right;" class="socialcount" data-url="' + album.link + '" data-share-text="Share this Album ..." data-counts="true">';
												html += '<li class="googleplus"><a class="TipGallery" target="_blank" href="https://plus.google.com/share?url=' + album.link + '" ' + opts.tooltipTipAnchor + '="Share Album ' + album.name + ' on Google Plus"><span class="social-icon icon-googleplus"></span></a></li>';
												html += '<li class="twitter"><a class="TipGallery" target="_blank" href="https://twitter.com/intent/tweet?text=' + album.link + '" ' + opts.tooltipTipAnchor + '="Share Album ' + album.name + ' on Twitter"><span class="social-icon icon-twitter"></span></a></li>';
												html += '<li class="facebook"><a class="TipGallery" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + album.link + '" ' + opts.tooltipTipAnchor + '="Share Album ' + album.name + ' on Facebook"><span class="social-icon icon-facebook"></span></a></li>';
											html += '</ul>';
										html += '</div>';
									}
									html += '<div class="albumText">';
										if (opts.albumNameTitle) {
											html += '<div class="fbLink" style="width: ' + opts.albumWrapperWidth + 'px;" href="#album-' + album.id + '"><span class="albumName" data-albumid="' + album.id + '" ' + opts.tooltipTipAnchor + '="' + album.name + '">' + album.name + '</span></div>';
										}
										if (opts.albumImageCount) {
											html += '<div class="clearfix" style="width: ' + opts.albumWrapperWidth + 'px; display: block;"><div class="albumCount">' + opts.AlbumContentPreText + '</div><div class="albumInfo clearfix">' + countTxt + '</div></div>';
										}
										if (opts.albumDateCreate) {
											html += '<div class="clearfix" style="width: ' + opts.albumWrapperWidth + 'px; display: block;"><div class="albumCreate">' + opts.AlbumCreatedPreText + '</div><div class="albumInfo clearfix">' + timeStampA + '</div></div>';
										}
										if (opts.albumDateUpdate) {
											html += '<div class="clearfix" style="width: ' + opts.albumWrapperWidth + 'px; display: block;"><div class="albumUpdate">' + opts.AlbumUpdatedPreText + '</div><div class="albumInfo clearfix">' + timeStampB + '</div></div>';
										}
										if (opts.albumFacebookID) {
											html += '<div class="clearfix" style="width: ' + opts.albumWrapperWidth + 'px; display: block;"><div class="albumUpdate">' + opts.AlbumNumericIDPreText + '</div><div class="albumInfo clearfix">' + album.id + '</div></div>';
										}
									html += '</div>';
								html += '</div>';
	
								if (((counterA <= response.data.length) && (counterA <= opts.maxNumberGalleries)) || ((response.data.length > 0) && (opts.maxNumberGalleries === 0))) {
									$("<div>", {
										"class": 		"albumWrapper",
										"data-title":	album.name,
										"data-create":	album.created_time,
										"data-update":	album.updated_time,
										"data-count":	album.count,
										"data-number":	album.id,
										style: 			clear,
										html : 			html
									}).appendTo("#fb-albums-all").fadeIn(500, function(){});
									$('#' + album.id).live('click', function(e){
										checkAnchor($(this).attr('data-href'));
									});
									FB.api(album.cover_photo, function(response) {
										if (opts.innerImageScaler) {
											var imgcover = '' + opts.PathInternalPHP + '?src=' + (response.source) + '&w=' + (opts.albumThumbWidth) + '&zc=1';
										} else {
											var imgcover = 'http://src.sencha.io/' + (opts.albumThumbWidth) + '/' + (response.source);
										}
										$("#fb-album-thumb-" + response.id).css("background-image", "url(" + (imgcover) + ")");
									});
								}
							}
						}
					}
				}
				if (((response.data.length > 0) && (counterA <= opts.maxNumberGalleries)) || ((response.data.length > 0) && (opts.maxNumberGalleries === 0))) {
					offset++;
					albumCall();
				} else if ((response.data.length == 0) || (counterA > opts.maxNumberGalleries)) {
					// Initialize Isotope Plugin for Album Thumbnails
					var $container = $('#fb-albums-all');
					setTimeout(function(){
						$container.isotope({
							itemSelector: 				'.albumWrapper',
							animationEngine:			'best-available',
							itemPositionDataEnabled: 	false,
							transformsEnabled:			true,
							resizesContainer: 			true,
							sortAscending: 				true,
							getSortData : {
								albumTitle: function( $elem ){
									return $elem.attr('data-title');
								},
								createDate: function( $elem ){
									return $elem.attr('data-create');
								},
								updateDate: function( $elem ){
									return $elem.attr('data-update');
								},
								numberItems: function( $elem ){
									return parseInt($elem.attr('data-count'), 10);
								},
								albumID: function( $elem ){
									return $elem.attr('data-number');
								}
							},
							sortBy: 					'albumTitle',
							masonry: {
								columnOffset: 			0
							},
							layoutMode: 				'masonry', //fitRows
							filter:						'*',
							onLayout: function( $elems, instance ) {
								// Determine Number of Albums in 1st Row
								/*var itemsPerRow = 0;
								$container.find('.albumWrapper').each(function(){
									var position = $(this).data('isotope-item-position');
									if (position.y == 0) {
										itemsPerRow = itemsPerRow + 1;
									}
								});*/
							}
						}, function($elems){});
					}, 0);
					// Initialize Controls for Isotope Sorting Feature
					if (opts.albumSortControls) {
						$("#" + opts.controlsID).css("display", "block");
						opts.AllowSortName == true ? $("#" + opts.controlsID + " ul li#albumTitle").css("display", "block") : $("#" + opts.controlsID + " ul li#albumTitle").css("display", "none");
						opts.AllowSortItems == true ? $("#" + opts.controlsID + " ul li#numberItems").css("display", "block") : $("#" + opts.controlsID + " ul li#numberItems").css("display", "none");
						opts.AllowSortCreated == true ? $("#" + opts.controlsID + " ul li#createDate").css("display", "block") : $("#" + opts.controlsID + " ul li#createDate").css("display", "none");
						opts.AllowSortUpdate == true ? $("#" + opts.controlsID + " ul li#updateDate").css("display", "block") : $("#" + opts.controlsID + " ul li#updateDate").css("display", "none");
						if ((opts.AllowSortName) || (opts.AllowSortItems) || (opts.AllowSortCreated) || (opts.AllowSortUpdate)) {
							$("#" + opts.controlsID + " ul#sort-direction").css("display", "block");
							var $optionSets = $("#" + opts.controlsID + " .option-set"), $optionLinks = $optionSets.find('a');
							$optionLinks.click(function(){
								var $this = $(this);
								if ( $this.hasClass('selected') ) {
									return false;
								}
								var $optionSet = $this.parents('.option-set');
								$optionSet.find('.selected').removeClass('selected');
								$this.addClass('selected');
								var options = {},
									key = $optionSet.attr('data-option-key'),
									value = $this.attr('data-option-value');
								// parse 'false' as false boolean
								value = value === 'false' ? false : value;
								options[ key ] = value;
								// Apply new options
								var $container = $('#fb-albums-all');
								$container.isotope( options );
								return false;
							});
						} else {
							$("#" + opts.controlsID).css("display", "none");
						}
					} else {
						$("#" + opts.controlsID).css("display", "none");
					}
					// Add Rotate Effect to Album Thumbnails
					if (opts.albumThumbRotate) {
						$('.albumThumb').jrumble({
							x: 				opts.albumRumbleX,
							y: 				opts.albumRumbleY,
							rotation: 		opts.albumRotate,
							speed: 			opts.albumRumbleSpeed,
							opacity:		false,
							opacityMin:		0.6
						});
						$('.albumThumb').hover(function(){
							$(this).trigger('startRumble');
						}, function(){
							$(this).trigger('stopRumble');
						});
						if (opts.albumNameTitle) {
							$('.albumName').hover(function(){
								$('#' + $(this).attr("data-albumid")).trigger('startRumble');
							}, function(){
								$('#' + $(this).attr("data-albumid")).trigger('stopRumble');
							});
						}
					}
					// Add Overlay Effect for Album Thumbnails
					if (opts.albumThumbOverlay) {
						$(".fb-album-overlay").css("opacity", "0");
						$(".fb-album-overlay").hover(function () {
							$(this).stop().animate({opacity: .5}, "slow");
						}, function () {
							$(this).stop().animate({opacity: 0}, "slow");
						});
					} else {
						$(".fb-album-overlay").css("display", "none");
					}
					// Remove Loader Animation and Show Album Thumbnails
					$("#" + opts.loaderID).hide();
					$("#FB_Album_Display").show();
					$container.isotope('reLayout');
				}
				if(opts.niceScrollAllow) {
					$('#fb-album-content').niceScroll(opts.niceScrollOptions);
				}
			});
		}

		function showAlbum() {
			if ($('#fb-album-' + albumId).length != 0) {
				$('#fb-album-' + albumId).fadeIn(500, function() {
					if(opts.niceScrollAllow) {
						$("#fb-album-content").niceScroll(opts.niceScrollOptions);
					}
				});
				$('#fb-album-header').html(headerArray[albumId]);
				$('#Back-' + albumId).unbind("click").bind('click',function(e){
					checkAnchor($(this).attr('href'));
				});
			} else {
				$("#" + opts.loaderID).show();
				counterB = 0;
				FB.api(albumId, function(response) {
					var albname = response.name;
					var desc = "";
					if(response.description){
						desc += response.description;
					}
					if(response.location){
						if(desc != ""){
							desc += ' ';
						}
						desc += '[' + opts.ImageLocationPreText + ' ' + response.location + ']';
					}
					if ((desc!='') && (desc!=' ')){
						desc = '<p>' + desc + '</p>';
					} else {
						desc='<p>' + opts.AlbumNoDescription + '</p>';
					}
					header = 	'<span data-href="#" id="Back-' + albumId + '" class="BackButton fbLink clearfix">' + opts.AlbumBackButtonText + '</span>';
					header += 	'<div class="albumTitle clearfix">' + opts.AlbumTitlePreText + ' ' + albname + '</div>';
					header += 	'<div class="albumDesc clearfix">' + desc + '</div>';
					if (opts.photoShowFBLink) {
						header +=	'<a href="' + response.link + '" target="_blank" style="text-decoration: none; border: 0px;"><div class="albumLink TipGallery" ' + opts.tooltipTipAnchor + '="Click here to view the full Ablum on Facebook!"></div></a>';
					}
					header +=	'<div class="seperator clearfix" style="width: ' + $("#fb-album-content").width() + 'px;"></div>';
					headerArray[albumId] = header;
					$('#fb-album-header').html(header).hide();
					$("<div>", {
						id: 		'fb-album-' + albumId,
						"class": 	'album'
					}).appendTo("#fb-album-content").hide();
					photoOffset = 0;
					photoCall();
					$('#Back-' + albumId).live('click',function(e){
						checkAnchor($(this).attr('data-href'));
					});

					if(opts.niceScrollAllow) {
						$("#fb-album-content").niceScroll(opts.niceScrollOptions);
					}
				});
			}
		}

		function photoCall() {
			FB.api(albumId + '/photos', {
				limit : 25,
				offset : photoOffset * 25
			}, function(response) {
				for (var i in response.data) {
					var photo = response.data[i];
					if($.inArray(photo.id, opts.excludeImages) == -1) {
						counterB = counterB + 1;
						if (counterB <= opts.maxNumberImages) {
							var img = "";
							for(var j in photo.images) {
								image = photo.images[j];
								if(image.height > 100 && image.width > 150) {
									img = image.source;
								} else {
									break;
								}
							}
							var name = "";
							if(photo.name) {
								name = photo.name;
							}
							if (opts.createTooltipsPhotos) {
								var tooltips = " TipPhoto";
							} else {
								var tooltips = "";
							};
							var html = '<a class="photoThumb ' + albumId + tooltips + '" rel="' + albumId + '" style="width:' + opts.photoThumbWidth + 'px; height:' + opts.photoThumbHeight + 'px; margin:' + opts.photoThumbMargin + 'px;" ' + opts.tooltipTipAnchor + '="' + name + '" href="' + photo.source + '" target="_blank">';
								if (opts.photoShowClearTape) {
									html += '<span class="ClearTape" style="left: ' + (Math.ceil((opts.photoThumbWidth + opts.photoThumbMargin - 77) / 2)) + 'px;"></span>';
								}
								if (opts.photoShowYellowTape) {
									html += '<span class="YellowTape" style="left: ' + (Math.ceil((opts.photoThumbWidth + opts.photoThumbMargin - 115) / 2)) + 'px;"></span>';
								}
								if (opts.photoShowPushPin) {
									html += '<span class="PushPin" style="left: ' + (Math.ceil((opts.photoThumbWidth + opts.photoThumbMargin) / 2)) + 'px;"></span>';
								}
							html += '<span class="photoThumbWrap">';
							if (opts.innerImageScaler) {
								var imgthumb = '' + opts.PathInternalPHP + '?src=' + (photo.source) + '&w=' + opts.photoThumbWidth + '&zc=1';
							} else {
								var imgthumb = 'http://src.sencha.io/' + opts.photoThumbWidth + '/' + (photo.source);
							}
							html += '<i style="width:' + opts.photoThumbWidth + 'px; height:' + opts.photoThumbHeight + 'px; background-image:url(' + (imgthumb) + ')"></i>';
							html += '<i class="fb-photo-overlay" id="fb-photo-overlay-' + photo.id + '" style="width:' + opts.photoThumbWidth + 'px; height:' + opts.photoThumbHeight + 'px;"></i>';
							html += '</span>';
							html += '</a>';
							if (opts.photoShowSocialShare) {
								html += '<div class="photoShare clearfix" style="width: ' + (opts.photoThumbWidth + opts.photoThumbMargin) + 'px; margin-left:' + opts.photoThumbMargin + 'px;">';
									html += '<span class="photoSocial">' + opts.ImageShareMePreText + '</span>';
									html += '<ul style="float: right;" class="socialcount" data-url="' + photo.source + '" data-share-text="Share this Album ...">'
										html += '<li class="googleplus"><a class="TipGallery" target="_blank" href="https://plus.google.com/share?url=' + photo.source + '" ' + opts.tooltipTipAnchor + '="Share Image ' + photo.id + ' on Google Plus"><span class="social-icon icon-googleplus"></span></a></li>';
										html += '<li class="twitter"><a class="TipGallery" target="_blank" href="https://twitter.com/intent/tweet?text=' + photo.source + '" ' + opts.tooltipTipAnchor + '="Share Image ' + photo.id + ' on Twitter"><span class="social-icon icon-twitter"></span></a></li>';
										html += '<li class="facebook"><a class="TipGallery" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + photo.source + '" ' + opts.tooltipTipAnchor + '="Share Image ' + photo.id + ' on Facebook"><span class="social-icon icon-facebook"></span></a></li>';
									html += '</ul>';
								html += '</div>';
							}
							if (opts.photoShowNumber) {
								html += '<div class="photoID" style="width:' + opts.photoThumbWidth + 'px; margin:' + opts.photoThumbMargin + 'px;">' + opts.ImageNumberPreText + ' ' + photo.id + '</div>';
							}
							if ((counterB <= response.data.length) && (counterB <= opts.maxNumberImages)) {
								$("<div>", {
									id: 				'fb-photo-' + photo.id,
									"class": 			"photoWrapper",
									"data-create":		photo.created_time,
									"data-update":		photo.updated_time,
									"data-height":		photo.height,
									"data-width":		photo.width,
									html: 				html
								}).appendTo('#fb-album-' + albumId).fadeIn(500);
							}
						}
					}
				}
				if ((response.data.length > 0) && (counterB <= opts.maxNumberImages)) {
					photoOffset++;
					photoCall();
				} else if ((response.data.length == 0) || (counterB > opts.maxNumberImages)) {
					if ($('#fb-album-' + albumId + ' > .photoWrapper').length == 0) {
						$("<div>", {
							id: 				'no-fb-photos',
							html: 				"Sorry, there are either no images in that album or all of the images have been exluded from being shown ... Please check your settings!"
						}).appendTo('#fb-album-' + albumId).fadeIn(500);
						// Remove Loader Animation and Show Album Content
						$("#" + opts.loaderID).hide();
						$('#fb-album-header').show();
						$('#fb-album-' + albumId).show();
					} else {
						// Initialize Isotope Plugin for Photo Thumbnails
						var $albumContainer = $('#fb-album-' + albumId);
						setTimeout(function(){
							$albumContainer.isotope({
								itemSelector: 				'.photoWrapper',
								animationEngine:			'best-available',
								itemPositionDataEnabled: 	false,
								transformsEnabled:			true,
								resizesContainer: 			true,
								sortAscending: 				true,
								getSortData : {
									photoWidth: function( $elem ){
										return parseInt($elem.attr('data-width'), 10);
									},
									photoHeight: function( $elem ){
										return parseInt($elem.attr('data-height'), 10);
									},
									createDate: function( $elem ){
										return $elem.attr('data-create');
									},
									updateDate: function( $elem ){
										return $elem.attr('data-update');
									}
								},
								sortBy: 					'createDate',
								layoutMode: 				'masonry',
								filter:						'*',
								onLayout: function( $elems, instance ) {}
							});
						}, 0);
						// Initialize colorBox Plugin for Photo Thumbnails
						if (opts.colorBoxAllow) {
							$('a.' + albumId).colorbox({
								rel: 			albumId,
								scalePhotos: 	true,
								returnFocus:	false,
								current: 		'Image {current} of {total}',
								title: function(){
									var imageText = $(this).attr(opts.tooltipTipAnchor);
									var imageLink = $(this).attr('href');
									var imageInfo = "";
									if (imageText.length != 0) {
										if (opts.createTooltipsLightbox) {
											imageInfo = '<span class="TipLightbox" style="cursor: pointer;" ' + opts.tooltipTipAnchor + '="' + imageText + '">' + imageText + '</span>';
											return imageInfo;
										} else {
											imageInfo = '<span>' + imageText + '</span>';
											return imageInfo;
										}
									} else {
										imageInfo = '<span>' + opts.colorBoxNoDescription + '</span>';
										return imageInfo;
									}
								},
								slideshow:		true,
								slideshowSpeed:	6000,
								slideshowAuto:	false,
								slideshowStart:	'<span id="cboxPlay"></span>',
								slideshowStop:	'<span id="cboxStop"></span>'
							});
						}
						// Initialize fancyBox Plugin for Photo Thumbnails
						if (opts.fancyBoxAllow) {
							$('a.' + albumId).fancybox({
								padding: 			15,
								scrolling: 			'auto',
								autosize: 			true,
								fitToView: 			true,
								openEffect: 		'elastic',
								openEasing: 		'easeInBack',
								openSpeed: 			500,
								//closeBtn:			false,
								closeEffect: 		'elastic',
								closeEasing: 		'easeOutBack',
								closeSpeed : 		500,
								closeClick: 		true,
								arrows: 			true,
								nextClick: 			false,
								playSpeed:			8000,
								afterLoad: function(){
									this.title = $(this.element).attr(opts.tooltipTipAnchor);
								},
								beforeShow: function(){
									this.title = $(this.element).attr(opts.tooltipTipAnchor);
								},
								afterShow: function(){
									this.title = $(this.element).attr(opts.tooltipTipAnchor);
								},
								onUpdate: function(){
									this.title = $(this.element).attr(opts.tooltipTipAnchor);
								},
								helpers:  {
									overlay : {
										speedIn  : 		300,
										speedOut : 		300,
										opacity  : 		0.8,
										css      : {
											cursor : 	'pointer'
										},
										closeClick: 	true
									},
									title : {
											type : 		'inside'
									},
									buttons	: {
										position: 		'top'
									},
									thumbs	: {
										width	: 		50,
										height	: 		50
									}
								}
							});
						}
						// Add Overlay Effect for Photo Thumbnails
						if (opts.photoThumbOverlay) {
							$(".fb-photo-overlay").css("opacity", "0");
							$(".fb-photo-overlay").hover(function () {
								$(this).stop().animate({opacity: .5}, "slow");
							}, function () {
								$(this).stop().animate({opacity: 0}, "slow");
							});
						} else {
							$(".fb-photo-overlay").css("display", "none");
						}
						// Add Rotate Effect to Photo Thumbnails
						if (opts.photoThumbRotate) {
							$('.photoThumb').jrumble({
								x: 				opts.photoRumbleX,
								y: 				opts.photoRumbleY,
								rotation: 		opts.photoRotate,
								speed: 			opts.photoRumbleSpeed,
								opacity:		false,
								opacityMin:		0.6
							});
							$('.photoThumb').hover(function(){
								$(this).trigger('startRumble');
							}, function(){
								$(this).trigger('stopRumble');
							});
						}
						// Remove Loader Animation and Show Album Content
						$("#" + opts.loaderID).hide();
						$('#fb-album-header').show();
						$('#fb-album-' + albumId).show();
						$albumContainer.isotope("reLayout");
					}
				}
			});
		}

		function checkAnchor(href) {
			if (href.length != 0) {
				var anchor = href.split('-');
				if(anchor[0] == '#album') {
					if($('#fb-albums-all').length != 0) {
						$("#" + opts.controlsID).hide();
						$('#fb-albums-all').hide();
					}
					if(albumId != anchor[1]){
						albumId = anchor[1];
						showAlbum();
					} else {
						$('#fb-album-' + albumId).fadeIn(500);
						$('#fb-album-header').html(headerArray[albumId]);
						$('#Back-' + albumId).unbind("click").bind('click',function(e){
							checkAnchor($(this).attr('data-href'));
						});
					}
				} else {
					$('.album').hide();
					loadAlbums();
				}
			}
		}

		// Create Necessary HTML Markup for Gallery
		$("#" + opts.frameID).append("<div id='" + opts.loaderID + "' class='clearfix'></div>");
		$("#" + opts.frameID).append("<div id='" + opts.controlsID + "' class='clearfix'></div>");
		$("#" + opts.frameID).append("<div id='" + opts.galleryID + "' class='clearfix'></div>");

		if (opts.responsiveGallery) {
			$("#" + opts.frameID).css("width", opts.responsiveWidth + "%")
		} else {
			$("#" + opts.frameID).css("width", opts.fixedWidth + "px")
		}

		$("#" + opts.controlsID).append("<ul id='sort-direction' class='option-set' data-option-key='sortAscending'>")
		$("#" + opts.controlsID).append("<ul id='sort-by' class='option-set' data-option-key='sortBy'>")

		$("ul#sort-direction").append("<li><a class='selected' data-option-value='true' href='#sortAscending=true'>" + opts.SortASCText + "</a></li>");
		$("ul#sort-direction").append("<li><a class='' data-option-value='false' href='#sortAscending=false'>" + opts.SortDESCText + "</a></li>");

		$("ul#sort-by").append("<li id='albumTitle'><a class='selected' data-option-value='albumTitle' href='#sortBy=Name'>" + opts.SortNameText + "</a></li>");
		$("ul#sort-by").append("<li id='numberItems'><a class='' data-option-value='numberItems' href='#sortBy=Images'>" + opts.SortItemsText + "</a></li>");
		$("ul#sort-by").append("<li id='createDate'><a class='' data-option-value='createDate' href='#sortBy=Created'>" + opts.SortCreatedText + "</a></li>");
		$("ul#sort-by").append("<li id='updateDate'><a class='' data-option-value='updateDate' href='#sortBy=Update'>" + opts.SortUpdatedText + "</a></li>");

		$("<div>", {id : "fb-album-header"}).appendTo("#" + opts.galleryID);
		$("<div>", {id : "fb-album-content"}).appendTo("#" + opts.galleryID);

		$('.album').hide();

		if (opts.tooltipUseInternal) {
			// Initialize qTip2 Tooltips as live mouseover event
			var qTipShared = {
				prerender: 			false,
				overwrite: 			true,
				hide: {
					target: 		false,
					event: 			'mouseleave mousedown unfocus click',
					effect: 		true,
					delay: 			0,
					fixed: 			true,
					inactive: 		5000,
					leave: 			"window"
				},
				events: {
					render: 		null,
					move: 			null,
					show: 			null,
					hide: 			null,
					toggle: 		null,
					focus: 			null,
					blur: 			null
				},
				show: {
					target: 		false,
					event: 			'mouseenter',
					effect: 		true,
					delay: 			90,
					solo: 			false,
					ready: 			false,
					modal: 			false
				}
			};
			// Initialize Tooltips for Album Thumbnail Section
			$(".TipGallery").live('mouseover', function() {
				// Make sure to only apply one tooltip per element!
				if( typeof( $(this).data('qtip') ) == 'object' ) {
					return;
				}
				$(this).qtip( $.extend({}, qTipShared, {
					style: {
						classes: 		opts.tooltipDesign,
						def: 			true,
						widget: 		false,
						width: 			220,
						tip: {
							corner: 	false,
							mimic: 		false,
							width: 		8,
							height: 	8,
							border: 	true,
							offset: 	0
						}
					},
					content: {
						text: 			true,
						attr: 			opts.tooltipTipAnchor,
						title: {
							text: 		false,
							button: 	false
						}
					},
					position: {
						my: 			'top center',
						at: 			'bottom center',
						target: 		'mouse',
						container: 		false,
						viewport: 		$(window),
						adjust: {
							x: 			0,
							y: 			30,
							mouse: 		true,
							resize: 	true,
							method: 	'shift none'
						},
						effect: 		true
					}
				}));
				$(this).qtip('show');
			});
			// Initialize Tooltips for Photo Thumbnail Section
			$(".TipPhoto").live('mouseover', function() {
				// Make sure to only apply one tooltip per element!
				if( typeof( $(this).data('qtip') ) == 'object' ) {
					return;
				}
				$(this).qtip( $.extend({}, qTipShared, {
					style: {
						classes: 		opts.tooltipDesign,
						def: 			true,
						widget: 		false,
						width: 			400,
						tip: {
							corner: 	false,
							mimic: 		false,
							width: 		8,
							height: 	8,
							border: 	true,
							offset: 	0
						}
					},
					content: {
						text: 			true,
						attr: 			opts.tooltipTipAnchor,
						title: {
							text: 		false,
							button: 	false
						}
					},
					position: {
						my: 			'bottom center',
						at: 			'top center',
						target: 		'mouse',
						container: 		false,
						viewport: 		$(window),
						adjust: {
							x: 			0,
							y: 			-30,
							mouse: 		true,
							resize: 	true,
							method: 	'shift none'
						},
						effect: 		true
					}
				}));
				$(this).qtip('show');
			});
			// Initialize Tooltips for Lightbox Section
			$(".TipLightbox").live('mouseover', function() {
				// Make sure to only apply one tooltip per element!
				if( typeof( $(this).data('qtip') ) == 'object' ) {
					return;
				}
				$(this).qtip( $.extend({}, qTipShared, {
					style: {
						classes: 		opts.tooltipDesign,
						def: 			true,
						widget: 		false,
						width: 			400,
						tip: {
							corner: 	false,
							mimic: 		false,
							width: 		8,
							height: 	8,
							border: 	true,
							offset: 	0
						}
					},
					content: {
						text: 			true,
						attr: 			opts.tooltipTipAnchor,
						title: {
							text: 		false,
							button: 	false
						}
					},
					position: {
						my: 			'bottom center',
						at: 			'top center',
						target: 		'mouse',
						container: 		false,
						viewport: 		$(window),
						adjust: {
							x: 			0,
							y: 			-30,
							mouse: 		true,
							resize: 	true,
							method: 	'shift none'
						},
						effect: 		true
					}
				}));
				$(this).qtip('show');
			});
		}

		loadAlbums();
	}
})(jQuery);

/* XDate v0.7 (Docs & Licensing: http://arshaw.com/xdate/) */
var XDate = function (g, m, A, p) {
    function f() {
        var a = this instanceof f ? this : new f,
            c = arguments,
            b = c.length,
            d;
        typeof c[b - 1] == "boolean" && (d = c[--b], c = q(c, 0, b));
        if (b) if (b == 1) if (b = c[0], b instanceof g || typeof b == "number") a[0] = new g(+b);
        else if (b instanceof f) {
            var c = a,
                h = new g(+b[0]);
            if (l(b)) h.toString = w;
            c[0] = h
        } else {
            if (typeof b == "string") {
                a[0] = new g(0);
                a: {
                    for (var c = b, b = d || !1, h = f.parsers, r = 0, e; r < h.length; r++) if (e = h[r](c, b, a)) {
                        a = e;
                        break a
                    }
                    a[0] = new g(c)
                }
            }
        } else a[0] = new g(n.apply(g, c)), d || (a[0] = s(a[0]));
        else a[0] = new g;
        typeof d == "boolean" && B(a, d);
        return a
    }
    function l(a) {
        return a[0].toString === w
    }
    function B(a, c, b) {
        if (c) {
            if (!l(a)) b && (a[0] = new g(n(a[0].getFullYear(), a[0].getMonth(), a[0].getDate(), a[0].getHours(), a[0].getMinutes(), a[0].getSeconds(), a[0].getMilliseconds()))), a[0].toString = w
        } else l(a) && (a[0] = b ? s(a[0]) : new g(+a[0]));
        return a
    }
    function C(a, c, b, d, h) {
        var e = k(j, a[0], h),
            a = k(D, a[0], h),
            h = c == 1 ? b % 12 : e(1),
            f = !1;
        d.length == 2 && typeof d[1] == "boolean" && (f = d[1], d = [b]);
        a(c, d);
        f && e(1) != h && (a(1, [e(1) - 1]), a(2, [E(e(0), e(1))]))
    }

    function F(a, c, b, d) {
        var b = Number(b),
            h = m.floor(b);
        a["set" + o[c]](a["get" + o[c]]() + h, d || !1);
        h != b && c < 6 && F(a, c + 1, (b - h) * G[c], d)
    }
    function H(a, c, b) {
        var a = a.clone().setUTCMode(!0, !0),
            c = f(c).setUTCMode(!0, !0),
            d = 0;
        if (b == 0 || b == 1) {
            for (var h = 6; h >= b; h--) d /= G[h], d += j(c, !1, h) - j(a, !1, h);
            b == 1 && (d += (c.getFullYear() - a.getFullYear()) * 12)
        } else b == 2 ? (b = a.toDate().setUTCHours(0, 0, 0, 0), d = c.toDate().setUTCHours(0, 0, 0, 0), d = m.round((d - b) / 864E5) + (c - d - (a - b)) / 864E5) : d = (c - a) / [36E5, 6E4, 1E3, 1][b - 3];
        return d
    }
    function t(a) {
        var c = a(0),
            b = a(1),
            a = a(2),
            b = new g(n(c, b, a)),
            d = u(c),
            a = d;
        b < d ? a = u(c - 1) : (c = u(c + 1), b >= c && (a = c));
        return m.floor(m.round((b - a) / 864E5) / 7) + 1
    }
    function u(a) {
        a = new g(n(a, 0, 4));
        a.setUTCDate(a.getUTCDate() - (a.getUTCDay() + 6) % 7);
        return a
    }
    function I(a, c, b, d) {
        var h = k(j, a, d),
            e = k(D, a, d),
            b = u(b === p ? h(0) : b);
        d || (b = s(b));
        a.setTime(+b);
        e(2, [h(2) + (c - 1) * 7])
    }
    function J(a, c, b, d, e) {
        var r = f.locales,
            g = r[f.defaultLocale] || {}, i = k(j, a, e),
            b = (typeof b == "string" ? r[b] : b) || {};
        return x(a, c, function (a) {
            if (d) for (var b = (a == 7 ? 2 : a) - 1; b >= 0; b--) d.push(i(b));
            return i(a)
        }, function (a) {
            return b[a] || g[a]
        }, e)
    }
    function x(a, c, b, d, e) {
        for (var f, g, i = ""; f = c.match(M);) {
            i += c.substr(0, f.index);
            if (f[1]) {
                g = i;
                for (var i = a, j = f[1], l = b, m = d, n = e, k = j.length, o = void 0, q = ""; k > 0;) o = N(i, j.substr(0, k), l, m, n), o !== p ? (q += o, j = j.substr(k), k = j.length) : k--;
                i = g + (q + j)
            } else f[3] ? (g = x(a, f[4], b, d, e), parseInt(g.replace(/\D/g, ""), 10) && (i += g)) : i += f[7] || "'";
            c = c.substr(f.index + f[0].length)
        }
        return i + c
    }
    function N(a, c, b, d, e) {
        var g = f.formatters[c];
        if (typeof g == "string") return x(a, g, b, d, e);
        else if (typeof g ==
            "function") return g(a, e || !1, d);
        switch (c) {
            case "fff":
                return i(b(6), 3);
            case "s":
                return b(5);
            case "ss":
                return i(b(5));
            case "m":
                return b(4);
            case "mm":
                return i(b(4));
            case "h":
                return b(3) % 12 || 12;
            case "hh":
                return i(b(3) % 12 || 12);
            case "H":
                return b(3);
            case "HH":
                return i(b(3));
            case "d":
                return b(2);
            case "dd":
                return i(b(2));
            case "ddd":
                return d("dayNamesShort")[b(7)] || "";
            case "dddd":
                return d("dayNames")[b(7)] || "";
            case "M":
                return b(1) + 1;
            case "MM":
                return i(b(1) + 1);
            case "MMM":
                return d("monthNamesShort")[b(1)] || "";
            case "MMMM":
                return d("monthNames")[b(1)] || "";
            case "yy":
                return (b(0) + "").substring(2);
            case "yyyy":
                return b(0);
            case "t":
                return v(b, d).substr(0, 1).toLowerCase();
            case "tt":
                return v(b, d).toLowerCase();
            case "T":
                return v(b, d).substr(0, 1);
            case "TT":
                return v(b, d);
            case "z":
            case "zz":
            case "zzz":
                return e ? c = "Z" : (d = a.getTimezoneOffset(), a = d < 0 ? "+" : "-", b = m.floor(m.abs(d) / 60), d = m.abs(d) % 60, e = b, c == "zz" ? e = i(b) : c == "zzz" && (e = i(b) + ":" + i(d)), c = a + e), c;
            case "w":
                return t(b);
            case "ww":
                return i(t(b));
            case "S":
                return c = b(2), c > 10 && c < 20 ? "th" : ["st", "nd", "rd"][c % 10 - 1] || "th"
        }
    }
    function v(a, c) {
        return a(3) < 12 ? c("amDesignator") : c("pmDesignator")
    }
    function y(a) {
        return !isNaN(+a[0])
    }
    function j(a, c, b) {
        return a["get" + (c ? "UTC" : "") + o[b]]()
    }
    function D(a, c, b, d) {
        a["set" + (c ? "UTC" : "") + o[b]].apply(a, d)
    }
    function s(a) {
        return new g(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), a.getUTCHours(), a.getUTCMinutes(), a.getUTCSeconds(), a.getUTCMilliseconds())
    }
    function E(a, c) {
        return 32 - (new g(n(a, c, 32))).getUTCDate()
    }
    function z(a) {
        return function () {
            return a.apply(p, [this].concat(q(arguments)))
        }
    }
    function k(a) {
        var c = q(arguments, 1);
        return function () {
            return a.apply(p, c.concat(q(arguments)))
        }
    }
    function q(a, c, b) {
        return A.prototype.slice.call(a, c || 0, b === p ? a.length : b)
    }
    function K(a, c) {
        for (var b = 0; b < a.length; b++) c(a[b], b)
    }
    function i(a, c) {
        c = c || 2;
        for (a += ""; a.length < c;) a = "0" + a;
        return a
    }
    var o = "FullYear,Month,Date,Hours,Minutes,Seconds,Milliseconds,Day,Year".split(","),
        L = ["Years", "Months", "Days"],
        G = [12, 31, 24, 60, 60, 1E3, 1],
        M = /(([a-zA-Z])\2*)|(\((('.*?'|\(.*?\)|.)*?)\))|('(.*?)')/,
        n = g.UTC,
        w = g.prototype.toUTCString,
        e = f.prototype;
    e.length = 1;
    e.splice = A.prototype.splice;
    e.getUTCMode = z(l);
    e.setUTCMode = z(B);
    e.getTimezoneOffset = function () {
        return l(this) ? 0 : this[0].getTimezoneOffset()
    };
    K(o, function (a, c) {
        e["get" + a] = function () {
            return j(this[0], l(this), c)
        };
        c != 8 && (e["getUTC" + a] = function () {
            return j(this[0], !0, c)
        });
        c != 7 && (e["set" + a] = function (a) {
            C(this, c, a, arguments, l(this));
            return this
        }, c != 8 && (e["setUTC" + a] = function (a) {
            C(this, c, a, arguments, !0);
            return this
        }, e["add" + (L[c] || a)] = function (a, d) {
            F(this,
            c, a, d);
            return this
        }, e["diff" + (L[c] || a)] = function (a) {
            return H(this, a, c)
        }))
    });
    e.getWeek = function () {
        return t(k(j, this, !1))
    };
    e.getUTCWeek = function () {
        return t(k(j, this, !0))
    };
    e.setWeek = function (a, c) {
        I(this, a, c, !1);
        return this
    };
    e.setUTCWeek = function (a, c) {
        I(this, a, c, !0);
        return this
    };
    e.addWeeks = function (a) {
        return this.addDays(Number(a) * 7)
    };
    e.diffWeeks = function (a) {
        return H(this, a, 2) / 7
    };
    f.parsers = [function (a, c, b) {
        if (a = a.match(/^(\d{4})(-(\d{2})(-(\d{2})([T ](\d{2}):(\d{2})(:(\d{2})(\.(\d+))?)?(Z|(([-+])(\d{2})(:?(\d{2}))?))?)?)?)?$/)) {
            var d = new g(n(a[1], a[3] ? a[3] - 1 : 0, a[5] || 1, a[7] || 0, a[8] || 0, a[10] || 0, a[12] ? Number("0." + a[12]) * 1E3 : 0));
            a[13] ? a[14] && d.setUTCMinutes(d.getUTCMinutes() + (a[15] == "-" ? 1 : -1) * (Number(a[16]) * 60 + (a[18] ? Number(a[18]) : 0))) : c || (d = s(d));
            return b.setTime(+d)
        }
    }];
    f.parse = function (a) {
        return +f("" + a)
    };
    e.toString = function (a, c, b) {
        return a === p || !y(this) ? this[0].toString() : J(this, a, c, b, l(this))
    };
    e.toUTCString = e.toGMTString = function (a, c, b) {
        return a === p || !y(this) ? this[0].toUTCString() : J(this, a, c, b, !0)
    };
    e.toISOString = function () {
        return this.toUTCString("yyyy-MM-dd'T'HH:mm:ss(.fff)zzz")
    };
    f.defaultLocale = "";
    f.locales = {
        "": {
            monthNames: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
            monthNamesShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
            dayNames: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
            dayNamesShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
            amDesignator: "AM",
            pmDesignator: "PM"
        }
    };
    f.formatters = {
        i: "yyyy-MM-dd'T'HH:mm:ss(.fff)",
        u: "yyyy-MM-dd'T'HH:mm:ss(.fff)zzz"
    };
    K("getTime,valueOf,toDateString,toTimeString,toLocaleString,toLocaleDateString,toLocaleTimeString,toJSON".split(","),

    function (a) {
        e[a] = function () {
            return this[0][a]()
        }
    });
    e.setTime = function (a) {
        this[0].setTime(a);
        return this
    };
    e.valid = z(y);
    e.clone = function () {
        return new f(this)
    };
    e.clearTime = function () {
        return this.setHours(0, 0, 0, 0)
    };
    e.toDate = function () {
        return new g(+this[0])
    };
    f.now = function () {
        return +new g
    };
    f.today = function () {
        return (new f).clearTime()
    };
    f.UTC = n;
    f.getDaysInMonth = E;
    if (typeof module !== "undefined" && module.exports) module.exports = f;
    return f
}(Date, Math, Array);

/* jRumble v1.3 - http://jackrugile.com/jrumble - MIT License */
(function (f) {
    f.fn.jrumble = function (g) {
        var a = f.extend({
            x: 2,
            y: 2,
            rotation: 1,
            speed: 15,
            opacity: false,
            opacityMin: 0.5
        }, g);
        return this.each(function () {
            var b = f(this),
                h = a.x * 2,
                i = a.y * 2,
                k = a.rotation * 2,
                g = a.speed === 0 ? 1 : a.speed,
                m = a.opacity,
                n = a.opacityMin,
                l, j, o = function () {
                    var e = Math.floor(Math.random() * (h + 1)) - h / 2,
                        a = Math.floor(Math.random() * (i + 1)) - i / 2,
                        c = Math.floor(Math.random() * (k + 1)) - k / 2,
                        d = m ? Math.random() + n : 1,
                        e = e === 0 && h !== 0 ? Math.random() < 0.5 ? 1 : -1 : e,
                        a = a === 0 && i !== 0 ? Math.random() < 0.5 ? 1 : -1 : a;
                    b.css("display") === "inline" && (l = true, b.css("display", "inline-block"));
                    b.css({
                        position: "relative",
                        left: e + "px",
                        top: a + "px",
                        "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + d * 100 + ")",
                        filter: "alpha(opacity=" + d * 100 + ")",
                        "-moz-opacity": d,
                        "-khtml-opacity": d,
                        opacity: d,
                        "-webkit-transform": "rotate(" + c + "deg)",
                        "-moz-transform": "rotate(" + c + "deg)",
                        "-ms-transform": "rotate(" + c + "deg)",
                        "-o-transform": "rotate(" + c + "deg)",
                        transform: "rotate(" + c + "deg)"
                    })
                }, p = {
                    left: 0,
                    top: 0,
                    "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
                    filter: "alpha(opacity=100)",
                    "-moz-opacity": 1,
                    "-khtml-opacity": 1,
                    opacity: 1,
                    "-webkit-transform": "rotate(0deg)",
                    "-moz-transform": "rotate(0deg)",
                    "-ms-transform": "rotate(0deg)",
                    "-o-transform": "rotate(0deg)",
                    transform: "rotate(0deg)"
                };
            b.bind({
                startRumble: function (a) {
                    a.stopPropagation();
                    clearInterval(j);
                    j = setInterval(o, g)
                },
                stopRumble: function (a) {
                    a.stopPropagation();
                    clearInterval(j);
                    l && b.css("display", "inline");
                    b.css(p)
                }
            })
        })
    }
})(jQuery);