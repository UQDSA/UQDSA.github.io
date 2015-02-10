/**
 * jQuery Facebook Album Plugin
 * @name jquery.fb-album.js
 * @version 4.2
 * @category jQuery Plugin
 */

// Check if Gallery is embedded via iFrame
var isInIFrame 				= (window.location != window.parent.location) ? true : false;
var iFrameDetection			= false;
var language                = (navigator.language || navigator.browserLanguage ).slice(0, 2);

// Other Global Variables
var iFrameWidth 			= 0;
var iFrameHeight 			= 0;
var iFrameAdjust			= 0;
var viewPortWidth 			= 0;
var viewPortHeight			= 0;
var scrollBarWidth			= 0;
var galleryWidth			= 0;
var smartAlbumsPerPage		= 0;
var smartPhotosPerPage		= 0;
var totalItems				= 0;
var galleryContainer 		= "";
var galleryResponsive 		= false;
var lightboxEnabled			= true;
var controlBarAdjust		= 0;
var buttonWidthText			= 0;
var buttonWidthImage		= 0;
var currentPageList			= "";
var AlbumThumbWidth			= 0;
var AlbumThumbHeight		= 0;
var AlbumThumbPadding		= 0;
var AlbumThumbMargin 		= 0;
var PhotoThumbWidth			= 0;
var PhotoThumbHeight		= 0;
var PhotoThumbPadding		= 0;
var PhotoThumbMargin 		= 0;
var TotalThumbs 			= 0;
var TotalPages 				= 0;
var TotalTypes 				= 0;
var SortingOrder 			= "";
var SortingType 			= "";

var RoundOffsetInitital		= 0;
var RoundOffsetAlbums		= 0;
var RoundOffsetLikes 		= 0;
var RoundOffsetComments		= 0;
var RoundOffsetPhotos		= 0;

var CountComments			= 0;
var CountLikes				= 0;

var imageScalerActive		= true;

var infiniteScrollOffset	= 0;
var infiniteAlbums			= 0;
var infiniteAlbumsShow		= 0;
var infiniteAlbumsCount		= 0;
var infinitePhotos			= 0;
var infinitePhotosShow		= 0;
var infinitePhotosCount		= 0;

var jQueryMinimum			= "1.7.2";

var MessiContent 			= "";
var MessiCode 				= "";
var MessiTitle 				= "";
var MessiWidth				= "600px";

// Define Global Variable to Track and Cancel Ajax Requests
var ajaxRequest;

// Functions to retrieve Screen and iFrame Dimensions
function GetScreenDimensions() {
	if (typeof window.innerWidth != 'undefined') {
		// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
		viewPortWidth = 			parent.window.innerWidth;
		viewPortHeight = 			parent.window.innerHeight;
	} else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
		viewPortWidth = 			parent.document.documentElement.clientWidth;
		viewPortHeight = 			parent.document.documentElement.clientHeight;
	} else {
		// older versions of IE
		viewPortWidth = 			parent.document.getElementsByTagName('body')[0].clientWidth;
		viewPortHeight = 			parent.document.getElementsByTagName('body')[0].clientHeight;
	};
}
function GetIFrameDimensions() {
	if ((typeof window.innerWidth != 'undefined') && (typeof( window.innerWidth ) == 'number')) {
		//Non-IE
		iFrameWidth = 				window.innerWidth;
		iFrameHeight = 				window.innerHeight;
	} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE 6+ in 'standards compliant mode'
		iFrameWidth = 				document.documentElement.clientWidth;
		iFrameHeight = 				document.documentElement.clientHeight;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		//IE 4 compatible
		iFrameWidth = 				document.body.clientWidth;
		iFrameHeight = 				document.body.clientHeight;
	};
}
function AdjustIFrameDimensions() {
	// Adjust Height of iFrame Container (if applicable)
	setTimeout(function(){
		if ((isInIFrame) && (iFrameDetection)) {
			GetIFrameDimensions();
			var galleryContainerHeight = jQuery("#" + galleryContainer).height() + iFrameAdjust;
			var galleryContainerWidth = jQuery("#" + galleryContainer).width() + 4;
			var IFrameID = getIframeID(this);
			if (IFrameID != "N/A") {
				window.top.document.getElementById("" + IFrameID + "").style.height = "" + galleryContainerHeight + "px";
				parent.document.getElementById("" + IFrameID + "").style.height = "" + galleryContainerHeight + "px";
				/*if (galleryResponsive) {
					window.top.document.getElementById("" + IFrameID + "").style.width = "" + galleryContainerWidth + "px";
					parent.document.getElementById("" + IFrameID + "").style.width = "" + galleryContainerWidth + "px";
				}*/
			};
		};
	}, 100);
}

// Function for compare jQuery Versions
(function($){
	$.versioncompare = function(version1, version2){
		if ('undefined' === typeof version1) {
			throw new Error("$.versioncompare needs at least one parameter.");
		};
		version2 = version2 || $.fn.jquery;
		if (version1 == version2) {
			return 0;
		};
		var v1 = normalize(version1);
		var v2 = normalize(version2);
		var len = Math.max(v1.length, v2.length);
		for (var i = 0; i < len; i++) {
			v1[i] = v1[i] || 0;
			v2[i] = v2[i] || 0;
			if (v1[i] == v2[i]) {
				continue;
			};
			return v1[i] > v2[i] ? 1 : -1;
		};
		return 0;
	};
	function normalize(version){
		return $.map(version.split('.'), function(value){
			return parseInt(value, 10);
		});
	};
}(jQuery));

// Extend the jQuery Array Functions
(function ($) {
	$.ajaxSetup({ cache: false });
	Array.prototype.frequencies = function() {
		var l = this.length, result = {all:[]};
		while (l--){
		   result[this[l]] = result[this[l]] ? ++result[this[l]] : 1;
		};
		// all pairs (label, frequencies) to an array of arrays(2)
		for (var l in result){
			if (result.hasOwnProperty(l) && l !== 'all'){
			   result.all.push([ l,result[l] ]);
			};
		};
		return result;
	};
	//Extend arrays to have a contains method
	if (!("contains" in Array.prototype)){
		Array.prototype.contains = function ( needle ) {
			var i = 0;
			for (i in this) {
				if (this[i] === needle) {
					return true;
				};
			};
			return false;
		};
	};
})( jQuery );

// Custom plugin for a Slide In/Out Animation with a Fade
(function ($) {
	$.fn.slideFade = function (speed, callback) {
		var slideSpeed;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "number") {
				slideSpeed  = arguments[i];
			} else {
				var callBack = arguments[i];
			};
		};
		if(!slideSpeed) {
			slideSpeed = 500;
		};
		this.animate({
			opacity: 'toggle',
			height: 'toggle'
		}, slideSpeed,
		function(){
			if( typeof callBack != "function" ) { callBack = function(){}; }
			callBack.call(this);
		});
	};
})( jQuery );

// Additional Plugins and Functions used for the Script
(function ($) {
	//case-insensitive version of :contains
	$.extend($.expr[":"], {"containsNC": function(elem, i, match, array) {return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;}});
	// jQuery Plugin for event that happens once after a window resize
    var $event = $.event, $special, resizeTimeout;
    $special = $event.special.debouncedresize = {
        setup: function() {$( this ).on( "resize", $special.handler );},
        teardown: function() {$( this ).off( "resize", $special.handler );},
        handler: function( event, execAsap ) {
            // Save the context
            var context = this,
                args = arguments,
                dispatch = function() {
                    // set correct event type
                    event.type = "debouncedresize";
                    $event.dispatch.apply( context, args );
                };
            if ( resizeTimeout ) {clearTimeout( resizeTimeout );}
            execAsap ? dispatch() : resizeTimeout = setTimeout( dispatch, $special.threshold );
        },
        threshold: 150
    };
	// Adjust element width for responsive layout after window resize
	$(window).on("debouncedresize", function( event ) {
		// Reset viewPort Dimensions
		GetScreenDimensions();
		// Adjust Height of iFrame Container (if applicable)
		AdjustIFrameDimensions();
	});
	// Detect if Scrollbar is present
	$.fn.isScrollable = function(){
		var elem = $(this);
		return (
		elem.css('overflow') == 'scroll'
			|| elem.css('overflow') == 'auto'
			|| elem.css('overflow-x') == 'scroll'
			|| elem.css('overflow-x') == 'auto'
			|| elem.css('overflow-y') == 'scroll'
			|| elem.css('overflow-y') == 'auto'
		);
	};
})(jQuery);

// Function to retrieve iFrame ID in which gallery is embedded (if applicable)
function getIframeID(el) {
	var myTop = top;
	var myURL = location.href.split('?')[0];
	var iFs = top.document.getElementsByTagName('iframe');
	var x, i = iFs.length;
	while ( i-- ){
		x = iFs[i];
		if (x.src && x.src == myURL){
			//return 'The iframe ' + ((x.id)? 'has ID=' + x.id : 'is anonymous');
			return ((x.id)? x.id : 'N/A');
		};
	};
	return 'N/A';
};

// Function to retrieve position of Element in Multi-Dimensional Array
function getIndexByAttribute(list, attr, val){
    var result = null;
    $.each(list, function(index, item){
        if(item[attr].toString() == val.toString()){
           result = index;
           return false;     // breaks the $.each() loop
        };
    });
    return result;
}

// jQuery Facebook Gallery
(function($) {
    $.fn.FB_Album = function (opts) {
		// Set Treshold for Window Resizing Watch
		$.event.special.debouncedresize.threshold = 250;

		// Function to retrieve Absolute Path for a File
		function getAbsolutePath() {
			var loc = window.location;
			var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
			return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
		};

		// Function to check if Logging Console already exists, otherwise Create
		if (!"console" in window || typeof console == "undefined") {
			var methods = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
			var emptyFn = function () {};
			window.console = {};
			for (var i = 0; i < methods.length; ++i) {window.console[methods[i]] = emptyFn;};
		};

		// Define Gallery Options
		opts = $.extend({
            facebookID: 					'',											// Define your Facebook ID
				excludeAlbums: 				[],											// ID's of albums that are to be exclude from showing (only applies if "showSelectionOnly" is set to "false")

			facebookToken:					'',											// Facebook Access Token for Personal / Restricted Facebook Pages

			singleAlbumOnly:				false,										// Set to "true" if you want to show only one specific Facebook Album
				singleAlbumID:				'',											// Define the ID of the single album you want to show

			showSelectionOnly:				false,										// Set to "true" if you want to show only specified albums; otherwise all albums will be pulled (minus the ones marked to be excluded)
				includeAlbums:				[],											// ID's of albums that you want to be shown (only applies if "showSelectionOnly" is set to "true")

			maxNumberGalleries:				20,											// Define how many galleries should be pulled from Facebook (0 = all albums; only applies if "showSelectionOnly" is set to "false")
				excludeTimeLine:			true,										// Define if the "Timeline" album should be excluded automatically

			maxNumberImages:				50,											// Define how many images per gallery should be pulled from Facebook (set to "0" (zero) if all images should be pulled)
				excludeImages: 				[],											// ID's of images that are to be exclude from showing

			graphRequestTiming:				1000,										// Define the waiting time in ms between each graph request
			
			weservImageScaler:				false,										// If set to true, the script will utilize the Cloud Based weserv.nl Service to scale Thumbnails
			senchaImageScaler:				false,										// If set to true, the script will utilize the Cloud Based Sencha.io Service to scale Thumbnails
			innerImageScaler:				false,										// If set to true, the script will use an internal php function to scale images to size, otherwise a cloud based service must be used
				PathInternalPHP:			'PHP/TimThumb.php',							// Define path and name to internal PHP Image Scaler

			imageLazyLoad:					true,										// Define if lazyload for thumbnails should be utilized (images will only be loaded if in view)
			imageSpinnerAnimation:			true,										// If "true", the gallery will show a spinner animation until the thumbnail image has been fully loaded
			
			isotopeGutterWidth:				0,											// Define an additional space between the thumbnail columns (default = "0")
			
			responsiveGallery:				true,										// Define if gallery is supposed to be responsive to window size changes
				responsiveWidth:			90,											// Set percent of window width the responsive frameID container should have; only enter number but no '%' behind number
				fixedWidth:					800,										// Set window width in px for a fixed size frameID container; only enter number but no 'px' behind number

			niceScrollAllow:				false,										// Add niceScroll to Album and Photo Thumbnails (will disable Infinite Scroll)
				niceScrollHeight:			800,										// Define fixed Height for NiceScroll Container
				niceScrollTheme:			'dark-thick',								// Define Theme for custon Scrollbar (light, light-2, light-thick, light-thin, dark, dark-2, dark-thick, dark-thin)
				niceScrollOptions: 			{},											// Options for niceScroll Plugin (INACTIVE)
			
			autoScrollTop:					true,										// If "true", the script will auto-scroll to the tope of the gallery for new pages, opening albums, etc.
			
			detectIFrame:					true,										// If set to "true", script will auto adjust width and height of the iFrame the script is embedded in
				iFrameHeightAdjust:			24,											// Define an adjustment in px that will be used to offset the height adjustment for the iFrame the gallery is embedded in (if applicable)

            PathMomentLanguageFile:         'JS/Language/',                             // Define the path to where the individual language files for Moment.js are located
                FromNowLanguage:            'en',                                       // Define the language for the from-now (i.e. 2 months ago) time phrases; please see manual for listing of available languages

			PathNoCoverImage:				'CSS/Images/no_cover.png',					// Set path to image to be used if Facebook doesn't provide a Cover Image for an album
			allowAlbumDescription:			true,										// Set to "true" if you want to allow the album description in album view
				showDescriptionStart:		false,										// Set to "true" if you want to show the album description by default; toggle button can be used to show/hide
				showCommentsLikes:			true,										// Set to "true" if you want to show the number of likes for an album and a popoup overlay with existing comments

			cacheAlbumContents:				false,										// Set to "true" if you want to keep albums already loaded in DOM and reuse or "false" for reloading every time
			
			// Pagination Settings
			// -------------------
			paginationLayoutAlbums:			true,										// Set to "true" if you want to use pagination for the album thumbnails
				smartAlbumsPerPageAllow:	true,										// If "true", the script will auto paginate the album thumbnails based on screen dimensions
					setAlbumsByPages:		false,										// If "true", you can manually set the total number of pages for album thumbnails
					numberAlbumsPerPage:	9,											// Set the number of albums that should be shown per page (if paginationLayoutAlbums = true)
					numberPagesForAlbums:	3,											// Set the number of pages for album thubmnails that should be shown (if setAlbumsByPages = true)
				albumsPagerControls:		true,										// If "true", a select box with all available pages wil be provided for quicker Album Navigation
			infiniteScrollAlbums:			false,										// Set to "true" if you want to use infinite scroll for album thumbnails
				infiniteScrollAlbumsSmart:	true,										// If "true", the script will automatically determine the number of thumbnails to load per infinite scroll event
				infiniteScrollAlbumsBlock:	9,											// Manually set the number of thumbnails to load per infinite scroll event (applies if "infiniteScrollAlbumsSmart" = false)

			paginationLayoutPhotos:			true,										// Set to "true" if you want to use pagination for the photo thumbnails
				smartPhotosPerPageAllow:	true,										// If "true", the script will auto paginate the photo thumbnails based on screen dimensions
					setPhotosByPages:		false,										// If "true", you can manually set the total number of pages for photo thumbnails
					numberPhotosPerPage:	16,											// Set the number of photos that should be shown per page (if paginationLayoutPhotos = true)
					numberPagesForPhotos:	6,											// Set the number of pages for photo thumbnails that should be shown (if setPhotosByPages = true)
				showBottomControlBar:		true,										// Set to "true" if you want to show a control bar at the bottom of the detailed album view (includes a 2nd "Back" and a "Scroll to Top" Button)
				photosPagerControls:		true,										// If "true", a select box with all available pages will be provided for quicker Photo Navigation
			infiniteScrollPhotos:			false,										// Set to "true" if you want to use infinite scroll for photo thumbnails
				infiniteScrollPhotosSmart:	true,										// If "true", the script will automatically determine the number of thumbnails to load per infinite scroll event
				infiniteScrollPhotosBlock:	16,											// Manually set the number of thumbnails to load per infinite scroll event (applies if "infiniteScrollPhotosBlock" = false)

			infiniteScrollOffset:			100,										// Define an additional offset in px which increases the height the user needs to scroll down before an infinite scroll event get triggered
			infiniteScrollMore:				true,										// If "true", a "Scroll down to show more Items!" message will be shown below the thumbnails

			showTopPaginationBar:			true,										// If "true", a pagination control bar (first / prev / next / last page) will be shown above the thumbnails
			showBottomPaginationBar:		true,										// If "true", a pagination control bar (first / prev / next / last page) will be shown below the thumbnails
			showThumbInfoInPageBar:			true,										// If "true", thumbnail count (i.e. Album 1 to 6 out of 20) will be shown in Pagination Bars

			floatingControlBar:				true,										// If set to "true", the control bar will follow the user while scrolling up/down (only if not in iFrame!)
				controlBarTopOffset:		10,											// Allows for an offset in px for the floating controlbar in order to account for menus or other top-fixed elements
				showFloatingReturnButton:	false,										// If "true", a return button will be shown in album detail view
				showFloatingToTopButton:	true,										// If "true", a Go-To-Top button will be shown in the floating control bar

			// Social Share Settings
			// ---------------------
			socialSharePadding:				5,
			
			albumShowSocialShare:			true,										// Add Section to share album via Facebook, Twitter and Google
				albumSocialSharePopup:		false,										// If "true", the Album Social Share links will open in a popup window instead of a new tab
				albumTitleSummaryLength:	25,											// Define the Length (Number of Characters) of the Album Title to be used in Share Links
				albumThumbSocialShare:		false,										// If "true", the Social Share button will be shown as overlay in the Album Thumbnail, otherwise, below
				albumShortSocialShare:		true,										// If "true", the Album Share URL will be shortened, using the http://safe.mn URL Shortener Service
				albumShowOrder:				false,										// Show Number of album (derived from order as provided by Facebook)

			photoShowSocialShare:			true,										// Add Section to share photo via Facebook, Twitter and Google
				photoSocialSharePopup:		false,										// If "true", the Photo Social Share links will open in a popup window instead of a new tab
				photoTitleSummaryLength:	50,											// Define the Length (Number of Characters) of the Photo Description to be used in Share Links
				photoThumbSocialShare:		false,										// If "true", the Social Share button will be shown as overlay in the Photo Thumbnail, otherwise, below
				photoShortSocialShare:		false,										// If "true", the Photo Share URL will be shortened, using the http://safe.mn URL Shortener Service
				photoShowOrder:				false,										// Show Number of Photo (derived from order as provided by Facebook)

			// Settings for Tooltips
			// ---------------------
			tooltipTipAnchor:				'title',									// Define what anchor or data-key should be used to store tooltips (i.e. "alt", "title", etc.)
			tooltipUseInternal:				true,										// Define if the internal tooltip script (qTip2) should be utilized
				tooltipDesign:				'qtip-jtools',								// Define which design to choose from for the qTip2 Plugin
			createTooltipsAlbums:			true,										// Add Tooltip class "TipGallery" to Album Thumbnails
			createTooltipsPhotos:			true,										// Add Tooltip class "TipPhoto" to Photo Thumbnails
			createTooltipsSocial:			true,
			createTooltipsLightbox:			true,										// Add Tooltip class "TipLightbox" to Description Text in Lightbox
			customTooltipsClass:			'',											// Add a Custom Class Name to all Items that include Tooltip Item
			tooltipTitleBar:				false,										// Define if a Tooltip Title Bar should be shown
			tooltipCloseButton:				false,										// Define if Tooltips should get a Close Button
			tooltipThemeRoller:				false,										// Define whether or not the UI-Widget classes of the Themeroller UI styles are applied to the Tooltip
			tooltipTipCorner:				false,										// Define if the Tooltips should have a Corner to create a Speech Bubble Effect
			tooltipOffsetX:					0,											// Define an additional X-Scale (Horizontal) Tooltip Offset
			tooltipOffsetY:					50,											// Define an additional Y-Scale (Vertical) Tooltip Offset
			tooltipPositionTarget:			'mouse',									// Define HTML element the tooltip will be positioned in relation to; 'mouse' or the 'event' (position at target that triggered the tooltip)
			tooltipPositionMy:				'top center',								// Define where the corner of the Tooltip should be positioned in relation to the Target Element
			tooltipPositionAt:				'bottom center',							// Define the corner of the Target Element to position the Tooltip corner in relation to

			// General Settings for Filter/Search Feature
			// ------------------------------------------
			albumsFilterAllow:				true,										// If "true", provides a filter to filter albums by either dates created or last updated
				albumsFilterAllEnabled:		false,										// If "true", all album filter selections will be unchecked by default
				useAlbumsUpdated:			true,										// If "true", filter will use date last updated; if "false", filter will use date created
			photosFilterAllow:				true,										// If "true", provides a filter to filter photos by dates last added to the album
				photosFilterAllEnabled:		false,										// If "true", all photo filter selections will be unchecked by default
			sortFilterNewToOld:				true,										// If "true", all filter criteria will be sorted from newest to oldest or reverse when "false"
			albumSearchControls:			true,										// If "true", a album search feature will be provided

			// General Settings for Sorting Feature
			// ------------------------------------
			albumSortControls:				true,										// Allow for Sorting of Album Thumbnails
				albumAllowSortName:			true,										// Allow for Sorting by Album Name
				albumAllowSortItems:		true,										// Allow for Sorting by Number of Images per Album
				albumAllowSortCreated:		true,										// Allow for Sorting by Date Album has been created
				albumAllowSortUpdate:		true,										// Allow for Sorting by Date Album has last been updated
				albumAllowSortFacebook:		false,										// Allow for Sorting by order as provided by Facebook
				albumAllowSortID:			false,										// Allow for Sorting by Facebook ID
				albumAllowSortPreSet:		false,										// Allow for Sorting by order in which preset ID's have been entered
			photoSortControls:				true,										// Allow for Sorting of Photo Thumbnails
				photoAllowSortAdded:		true,										// Allow for Sorting by Date Photo has been added to Album
				photoAllowSortUpdate:		true,										// Allow for Sorting by Date Photo has last been updated
				photoAllowSortFacebook:		false,										// Allow for Sorting by order as provided by Facebook
				photoAllowSortID:			false,										// Allow for Sorting by Facebook ID

			// Settings for Initial Album Thumbnail Sorting Order
			// --------------------------------------------------
			defaultSortDirectionASC:		true,										// Set to "true" for ascending (oldest to newest) and "false" for descending (newest to oldest) default sort direction for album thumbnails
				defaultSortByAlbumTitle:	true,										// Set to "true" if the default sorting criteria should be the album title
				defaultSortByNumberImages:	false,										// Set to "true" if the default sorting criteria should be the number of images per album
				defaultSortByDateCreated:	false,										// Set to "true" if the default sorting criteria should be the date at which album was created
				defaultSortByDateUpdated:	false,										// Set to "true" if the default sorting criteria should be the date at which album was last updated
				defaultSortByFacebookOrder:	false,										// Set to "true" if the default sorting criteria should be the order at which albums were received from Facebook
				defaultSortByFacebookID:	false,										// Set to "true" if the default sorting criteria should be the album ID as assigned by Facebook
				defaultSortByPreSet:		false,										// Set to "true" if the default sorting critetia should be the order in which preset ID's have been entered

			// Settings for Initial Photo Thumbnail Sorting Order
			// --------------------------------------------------
			defaultPhotoDirectionsASC:		true,										// Set to "true" for ascending (oldest to newest) and "false" (newest to oldest) for descending default sort direction for photo thumbnails
				defaultPhotoSortAdded:		true,										// Set to "true" if the default sorting criteria should be the date at which photo was added to the album
				defaultPhotoSortUpdated:	false,										// Set to "true" if the default sorting criteria should be the date at which photo was last updated
				defaultPhotoSortOrder:		false,										// Set to "true" if the default sorting criteria should be the order at which photos were received from Facebook
				defaultPhotoSortID:			false,										// Set to "true" if the default sorting criteria should be the photo ID assigned by Facebook

			// Settings for Text Items in Sorting Controls
			// -------------------------------------------
			PagesButtonText:				'Change Page',								// Define Text for Page Gallery Button
			SortButtonTextAlbums:			'Sort Albums',								// Define Text for Sorting Button (Albums)
			SortButtonTextPhotos:			'Sort Photos',								// Define Text for Sorting Button (Photos)
				SortNameText:				'Album Name',								// Define Text for Sorting Option (Sort by Album Name)
				SortItemsText:				'Number Images',							// Define Text for Sorting Option (Sort by Number Items)
				SortAddedText:				'Date Added',								// Define Text for Sorting Option (Sort by Date Photo Added to Album)
				SortCreatedText:			'Date Created',								// Define Text for Sorting Option (Sort by Date Created)
				SortUpdatedText:			'Last Update',								// Define Text for Sorting Option (Sort by Date Updated)
				SortFacebookText:			'Facebook Order',							// Define Text for Sorting Option (Sort by Order as provided by Facebook)
				SortIDText:					'Facebook ID',								// Define Text for Sorting Option (Sort by Facebook ID)
				SortPreSetText:				'Custom Order',								// Define Text for Sorting Option (Sort by Order in which pre-set ID's have been entered)
			FilterButtonTextAlbums:			'Last Updated',								// Define Text for Filter Button (Albums)
			FilterButtonTextPhotos:			'Last Added',								// Define Text for Filter Button (Photos)
			SearchButtonTextAlbums:			'Search Albums',							// Define Text for Search Button (Albums)
			SearchButtonTextPhotos:			'Search Photos',							// Define Text for Search Button (Photos)
			SearchDefaultText:				'Search ...',								// Define Text for Default Search Term

			// Settings for Text Items in Album Preview
			// ----------------------------------------
			AlbumContentPreText:			'Content:',									// Adjust width of CSS classes .albumCount, .albumCreate, .albumUpdate, .albumNumber if necessary
			AlbumCreatedPreText:			'Created:',									// Adjust width of CSS classes .albumCount, .albumCreate, .albumUpdate, .albumNumber if necessary
			AlbumUpdatedPreText:			'Updated:',									// Adjust width of CSS classes .albumCount, .albumCreate, .albumUpdate, .albumNumber if necessary
			AlbumShareMePreText:			'Share Album:',								// Define text shown before "Share Album" Links
			AlbumSharesPreText:				'Share Views:',								// Define text shown before the number of total Album Shares
			AlbumNumericIDPreText:			'Album ID:',								// Adjust width of CSS classes .albumCount, .albumCreate, .albumUpdate, .albumNumber if necessary
			OutOfTotalImagesPreText:		'out of',									// Define pre text when there are more images in album that the script is allowed to pull
			SingleImageWord:				'Image',									// Define word for a single Image
			MultiImagesWord:				'Images',									// Define word for multiple Images

			// Settings for Text Items in Photo Preview
			// ----------------------------------------
			AlbumBackButtonText:			'Back',										// Define text for back button in album preview
			AlbumTitlePreText:				'Album Name:',								// Define text shown before album name
			AlbumCommentsText:				'Show Comments',							// Define text to be shown in button that shows Album Comments
			AlbumLinkButtonText:			'Click here to view Album on Facebook',		// Define text shown for text link to original Facebook Album
			AlbumNoDescription:				'No Album Description available.',			// Define text to be shown if there is no Album description available
			ImageLocationPreText:			'Picture(s) taken at',						// Define text shown before image location text (actual loaction pulled from Facebook; if available)
			ImageNumberPreText:				'Image ID:',								// Define text shown before Image ID Number
			ImageShareMePreText:			'Share Image:',								// Define text shown before "Share Image" Links
			ImageSharesPreText:				'Share Views:',								// Define text shown before the number of total Photo Shares
			lightBoxNoDescription:			'No Image Description available.',			// Define text to be shown in Lightbox if no Image Description available

            // Settings for Text Items in Pagination Summary Bar
            // -------------------------------------------------
            PaginationShowingText:          'Showing',                                  // Define text part in "SHOWING Albums/Photos x to y out of z"
            PaginationAlbumsText:           'Albums',                                   // Define text part in "Showing ALBUMS/Photos x to y out of z"
            PaginationPhotosText:           'Photos',                                   // Define text part in "Showing Albums/PHOTOS x to y out of z"
            PaginationItemsToText:          'to',                                       // Define text part in "Showing Albums/Photos x TO y out of z"
            PaginationOutOfTotalText:       'out of',                                   // Define text part in "Showing Albums/Photos x to y OUT OF z"
            PaginationPageText:             'Page',                                     // Define text part in "PAGE x of z"
            PaginationPageOfText:           'of',                                       // Define text part in "Page x OF z"

			// Settings for Text Items in Share Buttons
			// ----------------------------------------
			SocialShareAlbumText:			'Check out this Album on Facebook ... ',	// Define text to be shown in Twitter Share Text (before Link to Album)
			SocialSharePhotoText:			'Check out this Photo on Facebook ... ',	// Define text to be shown in Twitter Share Text (before Link to Photo)

			// Settings for Text Items in Infinite Scroll
			// ------------------------------------------
			InfiniteScrollMoreText:			'Scroll down to show more Items!',			// Define text to be shown below thumbnails if Infinite Scroll is enabled
			InfiniteScrollLoadText:			'Loading ...',								// Define text to be shown on screen when an Infinite Scroll Event has been triggered

			// Settings for Text Items in Progress Messages
			// --------------------------------------------
			ProgressMessageTextStep1:		'Setup of Gallery Framework ...',
			ProgressMessageTextStep2:		'Loading Album Information ...',
			ProgressMessageTextStep3:		'Loading Album Contents ...',
			
			// Settings for Album Thumbnails
			// -----------------------------
			albumThumbWall:					false,										// If "true", album thumbnails will be shown as photo wall; will override most settings below
				albumThumbWallSimple:		true,
			photoThumbWall:					false,										// If "true", photo thumbnails will be shown as photo wall; will override most settings below
				photoThumbWallSimple:		true,
			
			albumNameTitle:					true,										// Add Name / Title of Album to each Album Thumbnail
				albumNameAbove:				true,										// If "true", the album name will be shown above the thumbnail, otherwise below
				albumNameShorten:			true,										// If "true", the album name shown will automatically be shortened to avoid unnecessary linebreaks
				albumNameThumb:				false,
			albumImageCount:				true,										// Add Image Count per Album Below Album Thumbnail
			albumDateCreate:				true,										// Add Date Created below Album Thumbnail
				albumCreateFromNow:			true,										// Define if date created should be converted into a "from now" period (i.e. 2 days ago)
			albumDateUpdate:				false,										// Add Date Last Updated below Album Thumbnail
				albumUpdateFromNow:			true,										// Define if date last updated should be converted into a "from now" period (i.e. 2 days ago)
			albumFacebookID:				false,										// Add Album ID below Album Thumbnail; ID can be used to exclude album from showing

			matchAlbumPhotoThumbs:			false,										// Set to true if you want to make the album thumbnails look like the photo thumbnails (photo thumbnail settings will be used)
				albumWrapperWidth:			290,										// Define width for each Album Wrapper (should equal albumThumWidth + 2x albumFrameOffset!)
				albumThumbWidth: 			280,										// Define width for each Album Thumbnail (deduct at least 2x albumFrameOffset from albumWrapperWidth to allow for frame offset)
				albumThumbHeight: 			200,										// Define Height for each Album Thumbnail
				albumFrameOffset:			5,											// Define offset for 2nd Album Thumbnail border to create stacked effect (set to "0" (zero) to disable stack effect)
				albumThumbPadding:			0,											// This is just a placeholder variable; no need to change since it will be automatically filled!
			albumWrapperMargin:				10,											// Define margin for each Album Wrapper
			albumShadowOffset:				12,											// Define additional offset (top) for album shadow to fine-tune shadow position
			albumInfoOffset:				0,											// Define additional offset (top) for album information section (name, content, dates)
			albumThumbHoverOpacity:			0.5,
			albumThumbZoomIn:				true,
				albumThumbZoomInScale:		40,
			albumThumbWhiteOut:				false,
				albumThumbWhiteOutLevel:	0.75,
				albumThumbWhiteOutColor:	'#EEEEEE',
			albumThumbOverlay:				true,										// Add Magnifier Overlay to Thumbnail
			albumThumbRotate:				true,										// Add Hover Rotate / Rumble Effect to Album Thumbnail (rotate does not work in IE 8 or less; rumble effect compensates)
				albumRumbleX:				3,											// Define Rumble Movement on X-Scale for Album Thumbnails
				albumRumbleY:				3,											// Define Rumble Movement on Y-Scale for Album Thumbnails
				albumRotate:				3,											// Define Rotation Angle on X+Y-Scale for Album Thumbnails
				albumRumbleSpeed:			150,										// Define Speed for Rumble / Rotate Effect for Album Thumbnails
			albumShowPaperClipL:			true,										// PaperClip on the left
			albumShowPaperClipR:			false,										// PaperClip on the Right
			albumShowPushPin:				false,										// Centered Pushin
			albumShowShadow:				true,										// Show Shadow below Album Thumbnail (use only one shadow type below)
				albumShadowA:				true,										// Images Show Shadow Type 1 (default if none selected and "albumShowShadow" = "true")
				albumShadowB:				false,										// Images Show Shadow Type 2
				albumShadowC:				false,										// Images Show Shadow Type 3
			albumCCS3Shadow:				false,										// CSS3 Show Shadow Type (adds class "ShadowCSS3" to elements; independent from image shadow types)

			// Settings for Photo Thumbnails
			// -----------------------------
			photoThumbWidth: 				210,										// Define Width for each Photo Thumbnail
			photoThumbHeight: 				155,										// Define Height for each Photo Thumbnail
			photoThumbMargin: 				10,											// Define Margin (top-left-bottom-right) for each Photo Thumbnail for space between each thumbnails
			photoThumbPadding:				5,											// Define Padding (top-left-bottom-right) for each Photo Thumbnail for photo frame
			photoThumbHoverOpacity:			0.5,
			photoThumbZoomIn:				true,
				photoThumbZoomInScale:		40,
			photoThumbWhiteOut:				false,
				photoThumbWhiteOutLevel:	0.75,
				photoThumbWhiteOutColor:	'#EEEEEE',
			photoThumbOverlay:				true,										// Add Magnifier Overlay to Photo Thumbnail
			photoThumbRotate:				true,										// Add Hover Rotate / Rumble Effect to Photo Thumbnail (rotate does not work in IE 8 or less; rumble effect compensates)
				photoRumbleX:				5,											// Define Rumble Movement on X-Scale for Photo Thumbnails
				photoRumbleY:				5,											// Define Rumble Movement on Y-Scale for Photo Thumbnails
				photoRotate:				5,											// Define Rotation Angle on X+Y-Scale for Photo Thumbnails
				photoRumbleSpeed:			150,										// Define Speed for Rumble / Rotate Effect for Photo Thumbnails
			photoShowClearTape:				true,										// Add Clear Tape on Top of Photo Thumbnail
			photoShowYellowTape:			false,										// Add Yellow Tape on Top of Photo Thumbnail
			photoShowPushPin:				false,										// Add Centered Pushin on Top of Photo Thumbnail
			photoShowIconFBLink:			true,										// Set to "true" if you want to show a icon link to the original Facebook Album
			photoShowTextFBLink:			true,										// Set to "true" if you want to show a text link to the original Facebook Album
			photoShowNumber:				false,										// Add Facebook Image ID Number below Thumbnail

			// Settings for Optional Lightboxes
			// --------------------------------
			fancyBoxAllow:					true,										// Add fancyBox (Lightbox) to Photo Thumbnails; if not, images will open up in new tab / window
				fancyBoxOptions:			{},											// Options for fancyBox Lightbox Plugin (INACTIVE)
			colorBoxAllow:					false,										// Add colorBox (Lightbox) to Photo Thumbnails; if not, images will open up in new tab / window
				colorBoxOptions:			{},											// Options for colorBox Lightbox Plugin (INACTIVE)
			prettyPhotoAllow:				false,										// Add prettyPhoto (Lightbox) to Photo Thumbnails; if not, images will open up in new tab / window
				prettyPhotoOptions:			{},											// Options for prettyPhoto Lightbox Plugin (INACTIVE)
			photoBoxAllow:					false,										// Add photoBox (Lightbox) to Photo Thumbnails; if not, images will open up in new tab / window
				photoBoxThumbs:				true,										// If "true", photoBox will show thumbnails for all photos in album
				photoBoxOptions:			{},											// Options for photoBox Lightbox Plugin (INACTIVE)
			lightboxCustomClass:			'',											// Add a Custom Class Name to all Items that can be opened with a Lightbox
			lightboxSocialShare:			false,										// If "true", the social share buttons will be shown in the Lightbox
				lightboxFacebookLike:		false,										// Show a Facebook Like Button for each Photo in Lightbox

			// Callback Function
			// -----------------
			callbackFirstAlbumsComplete:	function() {},								// Callback once after all Album Thumbnails for the Gallery have been retrieved and created (first run; after Isotope finished)
			callbackFirstPhotosComplete:	function() {},								// Callback once after all Photo Thumbnails in an Album have been retrieved and created (first run; after Isotope finished)
			callbackSerialAlbumsComplete:	function() {},								// Callback for each subsequent Isotope event for Album Thumbnails (after paging, infinite scroll event, sorting, filtering, etc.)
			callbackSerialPhotosComplete:	function() {},								// Callback for each subsequent Isotope event for Photo Thumbnails (after paging, infinite scroll event, sorting, filtering, etc.)

			// Debug Settings (Experimental)
			// -----------------------------
			consoleLogging:					true,										// Define if error/success messages and notices should be logged into the browser developer console
			outputErrorMessages:			false,										// Define if a popup with error messages should be shown (if error encountered)
			outputGraphAlbums:				false,										// Define if a popup with currently used Facebook Graph JSON link for albums should be shown
			outputGraphPhotos:				false,										// Define if a popup with currently used Facebook Graph JSON link for photos should be shown
			outputCountAlbumID:				false,										// Define if a popup with a listing of ID's, Number of Photos and name for all albums should be shown
			outputLoaderStatus:				true,										// Define if an loader progress animation with status update should be shown

			// Don't change any ID's unless you are also updating the corresponding CSS file
			// -----------------------------------------------------------------------------
			frameID: 						$(this).attr("id"),							// ID of element in which overall gallery script is to be shown
			loaderID: 						'FB_Album_Loader',							// ID of element whichs holds loader animation and loader status message ... ensure ID matches the one used in CSS settings!
			loaderSetupID:					'FB_Album_Loader_Setup',					// ID of element which holds the animated setup gears
			loaderCircleID:					'FB_Album_Loader_Circle',					// ID of element which holds the animated loader status update circle
			loaderMessageID:				'FB_Album_Loader_Message',					// ID of element in which gallery loader animation is to be shown ... ensure ID matches the one used in CSS settings!
			loaderSpinnerID:				'FB_Album_Loader_Spinner',					// ID of element in which gallery loader status message is to be shown ... ensure ID matches the one used in CSS settings!
			galleryID: 						'FB_Album_Display',							// ID of element in which gallery thumbnails are to be shown ... ensure ID matches the one used in CSS settings!
			errorID: 						'FB_Error_Display',							// ID of element in which error messages are to be shown ... ensure ID matches the one used in CSS settings!
			infiniteAlbumsID:				'FB_Album_Infinite_Albums',
			infinitePhotosID:				'FB_Album_Infinite_Photos',
			infiniteLoadID:					'FB_Album_Infinite_Load',
			infiniteMoreID:					'FB_Album_Infinite_More'
		}, opts);
		
		// Check if Selection Only Mode with no Albums and Switch to Standard Mode
		if ((opts.showSelectionOnly) && (opts.includeAlbums.length == 0)) {
			opts.showSelectionOnly = false;
		} else if ((opts.showSelectionOnly) && (opts.includeAlbums.length > 0)) {
			opts.maxNumberGalleries = opts.includeAlbums.length;
		};

		// Check if Selection Only Mode with 1 Album Only and Switch to Single Mode
		if ((opts.showSelectionOnly) && (opts.includeAlbums.length == 1)) {
			opts.singleAlbumOnly = true;
			opts.showSelectionOnly = false;
			opts.singleAlbumID = opts.includeAlbums;
			if (opts.consoleLogging) {
				console.log('User set script to "album-selection" mode with only one album (' + opts.includeAlbums + ') specified. Script has been reset to "single-album" mode.');
			};
		};

		// Define Some Script Variables
		var counterA = 					0;
		var counterB = 					0;
		var counterC = 					0;
		var images = 					0;
		var albumCount =				0;
		var albumId = 					opts.singleAlbumID;
		var headerArray = 				new Array();
		var footerArray = 				new Array();
		var graphLimitA =				opts.maxNumberGalleries;
		var graphLimitB =				opts.maxNumberImages;
		var defaultSortTypeAlbums =		'';
		var defaultSortTypePhotos =		'';
		var defaultSortArrayAlbums =	new Array();
		var defaultSortArrayPhotos =	new Array();
		var defaultThumbArrayScale =	new Array();
		var defaultLightboxArray =		new Array();
		var AlbumsCoverArray = 			new Array();
		var UserIDCleanOut =            opts.facebookID.replace(/[^a-z0-9\s]/gi, '_');
		var albumsAllInfoDisabled =     false;
		var albumsShowControlBar =		true;
		var AlbumPreSetArray =			[];
		var AlbumIDsArray = 			[];
		var PhotoIDsArray = 			[];
		var tooltipClass =				((opts.customTooltipsClass != "") ? (" " + opts.customTooltipsClass) : "");
		AlbumThumbPadding =				opts.albumThumbPadding;
		AlbumThumbMargin =				opts.albumWrapperMargin;
		PhotoThumbPadding =				opts.photoThumbPadding;
		PhotoThumbMargin =				opts.photoThumbMargin;
		galleryContainer =				opts.frameID;
		galleryResponsive = 			opts.responsiveGallery;
		controlBarAdjust = 				opts.controlBarTopOffset;
		iFrameDetection =				opts.detectIFrame;
		iFrameAdjust =					opts.iFrameHeightAdjust;
		infiniteScrollOffset =			opts.infiniteScrollOffset;
	
		// Store and Assign Order for PreSet Album ID's
		if (opts.showSelectionOnly) {
			$.each(opts.includeAlbums, function(intIndex, objValue ){
				AlbumPreSetArray.push({id:objValue, order:intIndex});
			});
		};
		
		// If Album Selection / Single; search all Albums for matching ID's
		if ((opts.showSelectionOnly) || (opts.singleAlbumOnly)) {
			opts.maxNumberGalleries = 	0;
		};
	
        // Load Language File for Moment.js if a Custom Language has been Defined
        if (opts.FromNowLanguage != "en") {
            var LanguageURL = opts.PathMomentLanguageFile + opts.FromNowLanguage + '.js';
            $.getScript(LanguageURL).done(function(script, textStatus) {
                if (opts.consoleLogging) {
                    console.log("Moment.js Language File (" + LanguageURL + ") has been successfully loaded.");
                };
                moment.lang(opts.FromNowLanguage);
            }).fail(function(jqxhr, settings, exception) {
                if (opts.consoleLogging) {
                    console.log("Moment.js Language File (" + LanguageURL + ") could not be loaded; reverting to default language (EN).");
                };
                moment.lang('en');
            });
        };

		opts.SocialShareAlbumText = opts.SocialShareAlbumText.replace(/\s/g,"%20");
		opts.SocialSharePhotoText = opts.SocialSharePhotoText.replace(/\s/g,"%20");

		// Check if all Controlbar Features have been disabled by User
		if ((!opts.albumSortControls) && (!opts.albumsFilterAllow) && (!opts.albumSearchControls) && (!opts.albumsPagerControls)) {
			opts.floatingControlBar = false;
			albumsShowControlBar = false;
		};

		// Check for Contradicting Default Sort Settings and Auto Correct
		defaultSortArrayAlbums.push(opts.defaultSortByAlbumTitle);
		defaultSortArrayAlbums.push(opts.defaultSortByNumberImages);
		defaultSortArrayAlbums.push(opts.defaultSortByDateCreated);
		defaultSortArrayAlbums.push(opts.defaultSortByDateUpdated);
		defaultSortArrayAlbums.push(opts.defaultSortByFacebookOrder);
		if (opts.showSelectionOnly) {
			defaultSortArrayAlbums.push(opts.defaultSortByPreSet);
		};
		defaultSortArrayPhotos.push(opts.defaultPhotoSortAdded);
		defaultSortArrayPhotos.push(opts.defaultPhotoSortUpdated);
		defaultSortArrayPhotos.push(opts.defaultPhotoSortOrder);
		defaultSortArrayPhotos.push(opts.defaultPhotoSortID);
		var checkSortSettingsAlbums = 	defaultSortArrayAlbums.frequencies();
		var checkSortSettingsPhotos = 	defaultSortArrayPhotos.frequencies();
		if (checkSortSettingsAlbums[true] != 1) {
			opts.defaultSortByAlbumTitle = true;
			opts.defaultSortByNumberImages = false;
			opts.defaultSortByDateCreated = false;
			opts.defaultSortByDateUpdated = false;
			opts.defaultSortByFacebookOrder = false;
			if (opts.showSelectionOnly) {
				opts.defaultSortByPreSet = false;
			};
		};
		if (checkSortSettingsPhotos[true] != 1) {
			opts.defaultPhotoSortAdded = true;
			opts.defaultPhotoSortUpdated = false;
			opts.defaultPhotoSortOrder = false;
			opts.defaultPhotoSortID = false;
		};

		// Check for Contradicting Scaling Settings and Auto Correct
		defaultThumbArrayScale.push(opts.weservImageScaler);
		defaultThumbArrayScale.push(opts.senchaImageScaler);
		defaultThumbArrayScale.push(opts.innerImageScaler);
		var checkScalingSettings = 	defaultThumbArrayScale.frequencies();
		if (checkScalingSettings[true] > 1) {
			opts.weservImageScaler = true;
			opts.senchaImageScaler = false;
			opts.innerImageScaler = false;
			imageScalerActive = true;
		} else if (checkScalingSettings[true] == 1) {
			imageScalerActive = true;
		} else {
			imageScalerActive = false;
		};

		// Determine Screen, Scrollbar & Gallery Size
		GetScreenDimensions();
		scrollBarWidth = 				scrollBarWidth();
		if (isInIFrame) {
			opts.floatingControlBar = 	false;
			GetIFrameDimensions();
			galleryWidth = 				iFrameWidth;
		} else {
			if ($("#" + galleryContainer).parent().prop("tagName").length > 0) {
				var parentElement =		$("#" + galleryContainer).parent();
				galleryWidth =			Math.round((opts.responsiveGallery == true ? ((parentElement.width() - scrollBarWidth) * opts.responsiveWidth / 100) : opts.fixedWidth));
			} else {
				galleryWidth =			Math.round((opts.responsiveGallery == true ? ((viewPortWidth - scrollBarWidth) * opts.responsiveWidth / 100) : opts.fixedWidth));
			};
		};
		if (opts.consoleLogging) {
			console.log("Usable Screen Size Detection: Width = " + viewPortWidth + "px / Height = " + viewPortHeight + "px / Width of Scrollbar: " + scrollBarWidth + "px / Width of Gallery: " + galleryWidth + "px");
		};

		// Determine Default Sort Settings for Albums & Photos
		if (opts.defaultSortByAlbumTitle) {
			if ((!opts.albumAllowSortName)) {opts.albumAllowSortName = true;};
			defaultSortTypeAlbums = 'albumTitle';
		} else if (opts.defaultSortByNumberImages) {
			if (!opts.albumAllowSortItems) {opts.albumAllowSortItems = true;};
			defaultSortTypeAlbums = 'numberItems';
		} else if (opts.defaultSortByDateCreated) {
			if	(!opts.albumAllowSortCreated) {opts.albumAllowSortCreated = true;};
			defaultSortTypeAlbums = 'createDate';
		} else if (opts.defaultSortByDateUpdated) {
			if	(!opts.albumAllowSortUpdate) {opts.albumAllowSortUpdate = true;};
			defaultSortTypeAlbums = 'updateDate';
		} else if (opts.defaultSortByFacebookOrder) {
			if	(!opts.albumAllowSortFacebook) {opts.albumAllowSortFacebook = true;};
			defaultSortTypeAlbums = 'orderFacebook';
		} else if (opts.defaultSortByFacebookID) {
			if	(!opts.albumAllowSortID) {opts.albumAllowSortID = true;};
			defaultSortTypeAlbums = 'FacebookID';
		} else if (opts.defaultSortByPreSet) {
			if	(!opts.albumAllowSortPreSet) {opts.albumAllowSortPreSet = true;};
			defaultSortTypeAlbums = 'orderPreSet';
		};
		if (opts.defaultPhotoSortAdded) {
			if (!opts.photoAllowSortAdded) {opts.photoAllowSortAdded = true;};
			defaultSortTypePhotos = 'addedDate';
		} else if (opts.defaultPhotoSortUpdated) {
			if (!opts.photoAllowSortUpdate) {opts.photoAllowSortUpdate = true;};
			defaultSortTypePhotos = 'updateDate';
		} else if (opts.defaultPhotoSortOrder) {
			if (!opts.photoAllowSortFacebook) {opts.photoAllowSortFacebook = true;};
			defaultSortTypePhotos = 'orderFacebook';
		} else if (opts.defaultPhotoSortID) {
			if (!opts.photoAllowSortID) {opts.photoAllowSortID = true;};
			defaultSortTypePhotos = 'FacebookID';
		};

		if ((!opts.allowAlbumDescription) && (!opts.showBottomControlBar)) {
			opts.showFloatingReturnButton = true;
		};

		if ((opts.innerImageScaler) && (opts.PathInternalPHP.length == 0)) {opts.innerImageScaler = false;};

        if (!opts.albumImageCount && !opts.albumDateCreate && !opts.albumDateUpdate && !opts.albumGoogleID) {albumsAllInfoDisabled = true;};

		// Check if Album Thumbnails should be Wall Layout or Match Photo Thumbnails and Adjust
		if (opts.albumThumbWall) {
			opts.matchAlbumPhotoThumbs	= false;
			if (opts.albumThumbWallSimple) {
				opts.albumWrapperWidth 		= opts.albumThumbWidth;
				opts.albumFrameOffset		= 0;
				opts.albumThumbPadding		= 0;
				opts.albumWrapperMargin		= 5;
				opts.albumShowPaperClipL	= false;
				opts.albumShowPaperClipR	= false;
				opts.albumShowPushPin		= false;
				opts.createTooltipsAlbums	= false;
				opts.createTooltipsSocial	= false;
			};
			opts.albumShowShadow			= false;
			opts.albumShadowOffset			= 0;
			opts.albumInfoOffset			= 10;
			opts.albumThumbSocialShare		= true;
			opts.albumNameShorten			= true;
			opts.albumNameAbove				= false;
			opts.albumImageCount			= true;
			opts.albumDateCreate			= true;
			opts.albumDateUpdate			= true;
			opts.albumFacebookID			= true;
		} else if ((opts.matchAlbumPhotoThumbs) && (!opts.albumThumbWall)) {
			opts.albumWrapperWidth 			= opts.photoThumbWidth;
			opts.albumThumbWidth 			= opts.photoThumbWidth;
			opts.albumThumbHeight 			= opts.photoThumbHeight;
			opts.albumWrapperMargin 		= opts.photoThumbMargin;
			opts.albumFrameOffset 			= 0;
			opts.albumThumbPadding 			= opts.photoThumbPadding;
			opts.albumShadowOffset 			= 0;
		} else {
			opts.albumThumbPadding 			= 0;
		};

		// Check if Photo Thumbnails should be Wall Layout and Adjust
		if (opts.photoThumbWall) {
			opts.photoThumbSocialShare	= true;
			opts.photoNameThumb			= true;
		};

		// Check which Lightbox Plugin should be Used
		defaultLightboxArray.push(opts.colorBoxAllow);
		defaultLightboxArray.push(opts.fancyBoxAllow);
		defaultLightboxArray.push(opts.prettyPhotoAllow);
		defaultLightboxArray.push(opts.photoBoxAllow);
		var checkLightboxSettings = defaultLightboxArray.frequencies();
		if (checkLightboxSettings[true] > 1) {
			opts.fancyBoxAllow = true;
			opts.colorBoxAllow = false;
			opts.prettyPhotoAllow = false;
			opts.photoBoxAllow = false;
			lightboxEnabled = true;
		} else if (checkLightboxSettings[true] == 1) {
			lightboxEnabled = true;
		} else {
			lightboxEnabled = false;
		};

		if (opts.AlbumShareMePreText.substr(opts.AlbumShareMePreText.length - 1) == ":") {opts.AlbumShareMePreText = opts.AlbumShareMePreText.slice(0, -1);};
		if (opts.ImageShareMePreText.substr(opts.ImageShareMePreText.length - 1) == ":") {opts.ImageShareMePreText = opts.ImageShareMePreText.slice(0, -1);};

		// Check if NiceScroll if Active and disable Infinite Scroll
		if (opts.niceScrollAllow) {
			opts.floatingControlBar 	= false;
			opts.infiniteScrollOffset 	= -50;
			opts.infiniteScrollAlbums 	= false;
			opts.infiniteScrollPhotos 	= false;
		};
		
		// Initialize Album Gallery
		function galleryAlbumsInit(facebookId, graphPath) {
			$('#fb-album-header').html("");
			$('#fb-album-footer').html("");
			if ($('#fb-albums-all-paged').length != 0) {
				//alert("Restored from 'galleryAlbumsInit'");
				if ($("#paginationControls-" + opts.facebookID).length != 0) {
					if ((opts.floatingControlBar) && (!isInIFrame)) {
						$("#paginationControls-" + opts.facebookID).unbind('stickyScroll');
						$("#paginationControls-" + opts.facebookID).stickyScroll('reset');
					};
				};
				$("#" + opts.loaderID).slideFade(700);
				$('#fb-albums-all-paged').slideFade(700);
				var $container = $('#fb-albums-all');
				$container.isotope('reloadItems');
				$container.isotope('reLayout');
				if (opts.infiniteScrollAlbums) {
					$('.albumWrapper:visible').each(function(i, elem) {
						$(this).addClass("Showing").addClass("Infinite");
					});
					$('#' + opts.infiniteAlbumsID).unbind('inview');
					if (!opts.niceScrollAllow) {
						infiniteGallery($container, true, false, opts.facebookID);
					};
				};
				if ((opts.floatingControlBar) && (!isInIFrame)) {
					isotopeHeightContainer = $container.height();
					if (!opts.paginationLayoutAlbums) {
						$("#paginationControls-" + opts.facebookID).stickyScroll({ container: $("#fb-albums-all-paged") })
					};
				};
				if (opts.autoScrollTop) {
					$('html, body').animate({scrollTop:$("#" + opts.frameID).offset().top - 20}, 'slow', function() {
						if (opts.infiniteScrollAlbums) {
							$("#" + opts.infiniteAlbumsID).show();
						};
					});
				} else {
					if (opts.infiniteScrollAlbums) {
						$("#" + opts.infiniteAlbumsID).show();
					};
				};
				shortLinkAlbumShares();
				scrollBarBeautifierOn($container, true, false, opts.facebookID);
			} else {
				$("<div>", {
					"id": 		"fb-albums-all",
					"class": 	(opts.albumThumbWall == true ? " albumwall" : "")
				}).appendTo("#fb-album-content");
				if (!opts.albumSortControls) {
					$("#fb-albums-all").css("padding-top", "10px");
				};
				if ((opts.outputLoaderStatus) && (!opts.singleAlbumOnly)) {
					RoundOffsetInitital = 0;
					galleryAlbumsCount(opts.facebookID, "");
				} else {
					RoundOffsetAlbums = 0;
					galleryAlbumsShow(opts.facebookID, "");
				};
			};
		};
		
		// Function to count Number of Albums (only if loader status update animation will be shown)
		function galleryAlbumsCount(facebookId, graphPath) {
			var graphOffset 	= RoundOffsetInitital * 500;
			if (graphPath != "") {
				var graph = graphPath;
			} else {
				if (opts.facebookToken.length != 0) {
					var graph = "https://graph.facebook.com/" + opts.facebookID + "/albums?access_token=" + opts.facebookToken + "&fields=id,count,type&limit=500&offset=" + graphOffset + "&callback=?";
				} else {
					var graph = "https://graph.facebook.com/" + opts.facebookID + "/albums?fields=id,count,type&limit=500&offset=" + graphOffset + "&callback=?";
				};
			};
			if (opts.consoleLogging) {
				console.log("Usable JSON Feed for Gallery: " + graph);
			};
			$("#" + opts.loaderMessageID).empty().html(opts.ProgressMessageTextStep1);
			$.ajax({
				url: 			graph,
				cache: 			false,
				dataType: 		"jsonp",
				success: function(json) {
					MessiContent = "";
					if (json.error) {
						$("#" + opts.errorID).html("ERROR: " + json.error.message + " (Facebook ID: " + opts.facebookID + ")");
						$("#" + opts.loaderID).hide();
						$("#" + opts.errorID).show();
						if (opts.outputErrorMessages) {
							MessiContent = 	"The following error has been found:<br/><br/><strong>" + json.error.message + "</strong>";
							MessiCode = 	"anim errors";
							MessiTitle = 	"ERROR for Facebook ID: " + opts.facebookID;
							showMessiContent(MessiContent, MessiTitle, MessiCode);
						};
						if (opts.consoleLogging) {
							console.log('ERROR: ' + json.error.message + '');
						};
						return false;
					} else {
						$.each(json.data, function(k, albums){
							if (typeof albums.id !== "undefined") {
								if (typeof(albums.count) != "undefined") {
									if (((opts.showSelectionOnly) && ($.inArray(albums.id, opts.includeAlbums) > -1)) || ((!opts.showSelectionOnly) && ($.inArray(albums.id, opts.excludeAlbums) == -1))) {
										if (albums.type == "wall") {
											if (!opts.excludeTimeLine) {
												counterC = counterC + 1;
											}
										} else {
											counterC = counterC + 1;
										};
									};
								};
							};
						});
						if ((typeof json.paging.next !== "undefined") && ((counterC < opts.maxNumberGalleries) || (opts.maxNumberGalleries == 0))) {
							setTimeout(function() {
								var albumsNext = json.paging.next;
								RoundOffsetInitital++;
								galleryAlbumsCount(opts.facebookID, albumsNext.replace("\u00252C", ","));
							}, opts.graphRequestTiming);
						} else {
							if (opts.consoleLogging) {
								console.log('The album pre-count determined ' + counterC + ' available albums for Facebook User ID "' + opts.facebookID + '".');
							};
							if (counterC > 0) {
								setTimeout(function() {
									$("#" + opts.loaderSpinnerID).hide();
									$("#" + opts.loaderMessageID).empty().html(opts.ProgressMessageTextStep2);
									RoundOffsetAlbums = 0;
									galleryAlbumsShow(opts.facebookID, "");
								}, opts.graphRequestTiming);
							} else {
								$("#" + opts.errorID).html('The album pre-check could not find any available albums for Facebook ID "' + opts.facebookID + '".');
								$("#" + opts.loaderID).hide();
								$("#" + opts.errorID).show();
								MessiContent = 	'The album pre-check could not find any available albums for Facebook ID "' + opts.facebookID + '".';
								MessiCode = 	'anim errors';
								MessiTitle = 	'ERROR for Facebook ID: ' + opts.facebookID;
								showMessiContent(MessiContent, MessiTitle, MessiCode);
							};
						};
					};
				},
				error: function(jqXHR, textStatus, errorThrown){
					if (opts.outputErrorMessages) {
						MessiContent = 	"Error: \njqXHR:" + jqXHR + "\ntextStatus: " + textStatus + "\nerrorThrown: "  + errorThrown;
						MessiCode = 	"anim errors";
						MessiTitle = 	"ERROR for Facebook ID: " + opts.facebookID;
						showMessiContent(MessiContent, MessiTitle, MessiCode);
					};
					if (opts.consoleLogging) {
						console.log('Error: \njqXHR:' + jqXHR + '\ntextStatus: ' + textStatus + '\nerrorThrown: '  + errorThrown);
					};
					return false;
				}
			});
		};

		// Load and Show Album Gallery Thumbnails and Data
		function galleryAlbumsShow(facebookId, graphPath) {
			if (!opts.singleAlbumOnly) {
				var graphRepeat		= false;
				var graphNext		= "";
				var graphOffset 	= RoundOffsetAlbums * 100;
				if (graphPath != "") {
					var graph = graphPath;
				} else {
					if (opts.facebookToken.length != 0) {
						var graph = "https://graph.facebook.com/" + opts.facebookID + "/albums?access_token=" + opts.facebookToken + "&fields=id,name,cover_photo,count,created_time,updated_time,description,link,type,location,place,from,privacy&limit=100&offset=" + graphOffset + "&callback=?";
					} else {
						var graph = "https://graph.facebook.com/" + opts.facebookID + "/albums?fields=id,name,cover_photo,count,created_time,updated_time,description,link,type,location,place,from,privacy&limit=100&offset=" + graphOffset + "&callback=?";
					};
				};
				if (opts.outputGraphAlbums) {
					MessiContent = 	"<strong>Albums Overview:</strong><br/>" + graph.replace('&callback=?', '') + "";
					MessiCode = 	"anim success";
					MessiTitle = 	"Graph Links for Facebook ID: " + opts.facebookID;
					showMessiContent(MessiContent, MessiTitle, MessiCode);
				};
				if (opts.consoleLogging) {
					console.log("Usable JSON Feed for Gallery: " + graph);
				};
				if (opts.outputLoaderStatus) {
					$("#" + opts.loaderCircleID).show();
					$("#" + opts.loaderSpinnerID).hide();
				} else {
					$("#" + opts.loaderCircleID).hide();
					$("#" + opts.loaderSpinnerID).show();
				};
				$.ajax({
					url: 			graph,
					cache: 			false,
					dataType: 		"jsonp",
					success: function(json) {
						MessiContent = "";
						if (json.error) {
							$("#" + opts.errorID).html("ERROR: " + json.error.message + " (Facebook ID: " + opts.facebookID + ")");
							$("#" + opts.loaderID).hide();
							$("#" + opts.errorID).show();
							if (opts.outputErrorMessages) {
								MessiContent = 	"The following error has been found:<br/><br/><strong>" + json.error.message + "</strong>";
								MessiCode = 	"anim errors";
								MessiTitle = 	"ERROR for Facebook ID: " + opts.facebookID;
								showMessiContent(MessiContent, MessiTitle, MessiCode);
							};
							if (opts.consoleLogging) {
								console.log('ERROR: ' + json.error.message + '');
							};
							return false;
						} else {
							$.each(json.data, function(k, albums){
								if (typeof albums.cover_photo !== "undefined") {
									if (typeof(albums.count) != "undefined") {
										if (opts.outputCountAlbumID) {
											MessiContent += "<div style='margin: 10px 0px; text-align: justify;'><strong>Album #" + k + " - " + albums.name + "</strong><br/>ID: " + albums.id + " / Photos: " + albums.count + "</div>";
										};
										if (((opts.showSelectionOnly) && ($.inArray(albums.id, opts.includeAlbums) > -1)) || ((!opts.showSelectionOnly) && ($.inArray(albums.id, opts.excludeAlbums) == -1))) {
											counterA = counterA + 1;
											if (opts.outputLoaderStatus) {
												var progressStatus 	= ((counterA / counterC) * 100);
												var progressImages 	= counterA;
												if ((opts.maxNumberGalleries != 0) && (opts.maxNumberGalleries < counterC)) {
													var totalAlbums 	= opts.maxNumberGalleries;
												} else if ((opts.maxNumberGalleries != 0) && (opts.maxNumberGalleries > counterC)) {
													var totalAlbums		= counterC;
												} else {
													var totalAlbums 	= counterC;
												};
												if (RoundOffsetAlbums == 0) {
													LoaderStatusAnimationCircle.setValue('0 / 0');
													LoaderStatusAnimationCircle.setProgress(0);
												};
												$("#" + opts.loaderMessageID).empty().html(opts.ProgressMessageTextStep2);
												updateProgress(progressStatus, progressImages, totalAlbums);
											};
											if ((counterA <= opts.maxNumberGalleries) || (opts.maxNumberGalleries === 0) || ((opts.showSelectionOnly) && (counterA <= opts.includeAlbums.length))) {
												if ((albums.count > opts.maxNumberImages) && (opts.maxNumberImages != 0)) {
													var countTxt = opts.maxNumberImages + " ";
												} else {
													var countTxt = albums.count + " ";
												};
												// Convert ISO-8601 Dates into readable Format
												if (opts.albumDateCreate) {
													if (opts.albumCreateFromNow) {
														var timeStampA = moment(albums.created_time).fromNow();
													} else {
														var timeStampA = moment.utc(albums.created_time).format("MM/DD/YYYY - hh:mm A");
													};
												};
												if (opts.albumDateUpdate) {
													if (opts.albumUpdateFromNow) {
														var timeStampB = moment(albums.updated_time).fromNow();
													} else {
														var timeStampB = moment.utc(albums.updated_time).format("MM/DD/YYYY - hh:mm A");
													};
												};
												if (this.count > 1) {
													countTxt += opts.MultiImagesWord;
												} else {
													countTxt += opts.SingleImageWord;
												};
												if ((this.count > opts.maxNumberImages) && (opts.maxNumberImages != 0)) {
													countTxt += " (" + opts.OutOfTotalImagesPreText + " " + albums.count + " " + opts.MultiImagesWord + ")";
												};
												if (!opts.matchAlbumPhotoThumbs) {
													var clear = 'width: ' + (opts.albumWrapperWidth + opts.albumFrameOffset * 2) + 'px; margin: ' + opts.albumWrapperMargin + 'px; display: none;';
												} else {
													var clear = 'width: ' + (opts.albumWrapperWidth + 10) + 'px; margin: ' + opts.albumWrapperMargin + 'px; display: none;';
												};
												if (opts.createTooltipsAlbums) {var tooltips = " TipGallery";} else {var tooltips = "";};
	
												var html = "";
												if (albums.name) {
													var nameSummary = truncateString(albums.name, opts.albumTitleSummaryLength, ' ', ' ...');
												} else {
													var nameSummary = truncateString(opts.AlbumNoDescription, opts.albumTitleSummaryLength, ' ', ' ...');
												};
	
												if ((opts.albumNameTitle) && (opts.albumNameAbove)) {html += '<div id="albumHead_' + albums.id + '" class="albumHead fbLink" style="display:' + (opts.albumNameThumb ? "none;" : "block;") + '"><span class="albumNameHead' + tooltipClass + '" data-albumid="' + albums.id + '" ' + opts.tooltipTipAnchor + '="' + albums.name + '">' + albums.name + '</span></div>';}
	
												if (!opts.matchAlbumPhotoThumbs) {
													html += '<div id="' + albums.id + '" class="albumThumb fbLink' + tooltips + (opts.albumCCS3Shadow == true ? " ShadowCSS3" : "") + tooltipClass + (opts.albumThumbWall == true ? " albumwall" : "") + '" ' + opts.tooltipTipAnchor + '="' + albums.name + '" data-album="' + albums.id + '" data-link="' + albums.link + '" style="width:' + (opts.albumThumbWidth) + 'px; height:' + (opts.albumThumbHeight) + 'px; padding: ' + opts.albumFrameOffset + 'px; overflow:' + ((opts.albumThumbWall && opts.albumThumbWallSimple) ? "hidden" : "visible") + '" data-href="#album-' + albums.id + '" data-user="' + opts.facebookID + '">';
												} else {
													html += '<div id="' + albums.id + '" class="albumThumb fbLink' + tooltips + (opts.albumCCS3Shadow == true ? " ShadowCSS3" : "") + tooltipClass + (opts.albumThumbWall == true ? " albumwall" : "") + '" ' + opts.tooltipTipAnchor + '="' + albums.name + '" data-album="' + albums.id + '" data-link="' + albums.link + '" style="width:' + (opts.albumThumbWidth) + 'px; height:' + (opts.albumThumbHeight) + 'px; padding: 5px;" data-href="#album-' + albums.id + '" data-user="' + opts.facebookID + '">';
												};
												if (!opts.matchAlbumPhotoThumbs) {
													if (opts.albumShowPaperClipL) 	{html += '<span class="PaperClipLeft"></span>';}
													if (opts.albumShowPaperClipR) 	{html += '<span class="PaperClipRight" style="left: ' + (opts.albumWrapperWidth - 30) + 'px;"></span>';}
													if (opts.albumShowPushPin) 		{html += '<span class="PushPin" style="left: ' + (Math.ceil(opts.albumWrapperWidth / 2)) + 'px;"></span>';}
													if (!opts.albumThumbWall) {
														if (opts.albumShowShadow) {
															if ((!opts.albumShadowA) && (!opts.albumShadowB) && (!opts.albumShadowC)) {
																html += '<div class="fb-album-shadow1" style="top: ' + (opts.albumThumbHeight + opts.albumShadowOffset) + 'px;"></div>';
															} else if (opts.albumShadowA){
																html += '<div class="fb-album-shadow1" style="top: ' + (opts.albumThumbHeight + opts.albumShadowOffset) + 'px;"></div>';
															} else if (opts.albumShadowB){
																html += '<div class="fb-album-shadow2" style="top: ' + (opts.albumThumbHeight + opts.albumShadowOffset) + 'px;"></div>';
															} else if (opts.albumShadowC){
																html += '<div class="fb-album-shadow3" style="top: ' + (opts.albumThumbHeight + opts.albumShadowOffset) + 'px;"></div>';
															};
														};
													};
												} else {
													if (!opts.albumThumbWall) {
														if (opts.photoShowClearTape) 	{html += '<span class="ClearTape" style="left: ' + (Math.ceil((opts.albumThumbWidth + opts.albumWrapperMargin + opts.albumThumbPadding - 77) / 2)) + 'px;"></span>';}
														if (opts.photoShowYellowTape) 	{html += '<span class="YellowTape" style="left: ' + (Math.ceil((opts.albumThumbWidth + opts.albumWrapperMargin + opts.albumThumbPadding - 115) / 2)) + 'px;"></span>';}
														if (opts.photoShowPushPin) 		{html += '<span class="PushPin" style="left: ' + (Math.ceil((opts.albumThumbWidth + opts.albumWrapperMargin + opts.albumThumbPadding) / 2)) + 'px;"></span>';}
													};
												};
												if (opts.albumFrameOffset == 0) {
													html += '<span id="Wrap_' + albums.id + '" style="border: none;" class="albumThumbWrap" style="width:' + opts.albumThumbWidth + 'px; height:' + opts.albumThumbHeight + 'px; padding: ' + opts.albumFrameOffset + 'px; left: ' + opts.albumFrameOffset + 'px; top: ' + opts.albumFrameOffset + 'px;">';
												} else {
													html += '<span id="Wrap_' + albums.id + '" class="albumThumbWrap" style="width:' + opts.albumThumbWidth + 'px; height:' + opts.albumThumbHeight + 'px; padding: ' + opts.albumFrameOffset + 'px; left: ' + opts.albumFrameOffset + 'px; top: ' + opts.albumFrameOffset + 'px;">';
												};
												if (opts.imageSpinnerAnimation) {
													if (!opts.matchAlbumPhotoThumbs) {
														html += '<i class="fb-album-spinner' + ((opts.albumThumbWall == true) && (opts.albumThumbWallSimple) ? " albumwall" : "") + '" id="fb-album-spinner-' + albums.id + '" style="width:' + opts.albumThumbWidth + 'px; height:' + opts.albumThumbHeight + 'px;"></i>';
													} else {
														html += '<i class="fb-album-spinner" id="fb-album-spinner-' + albums.id + '" style="width:' + opts.albumThumbWidth + 'px; height:' + opts.albumThumbHeight + 'px; top: 0px; left: 0px;"></i>';
													};
												};
												html += '<i class="fb-album-thumb" id="fb-album-thumb-' + albums.id + '" style="background-size:' + opts.albumThumbWidth + 'px; width:' + opts.albumThumbWidth + 'px; height:' + opts.albumThumbHeight + 'px;"></i>';
												if (!opts.matchAlbumPhotoThumbs) {
													html += '<i class="fb-album-overlay" id="fb-album-overlay-' + albums.id + '" data-album="' + albums.id + '" style="width:' + opts.albumThumbWidth + 'px; height:' + opts.albumThumbHeight + 'px; padding: ' + opts.albumFrameOffset + 'px;"><span id="fb-album-overlay-icon-' + albums.id + '" class="fb-album-overlay-icon" style=""></span></i>';
												} else {
													html += '<i class="fb-album-overlay" id="fb-album-overlay-' + albums.id + '" data-album="' + albums.id + '" style="width:' + opts.albumThumbWidth + 'px; height:' + opts.albumThumbHeight + 'px; padding: ' + opts.albumThumbPadding + 'px; left: -' + opts.albumThumbPadding + 'px; top: -' + opts.albumThumbPadding + 'px; "><span id="fb-album-overlay-icon-' + albums.id + '" class="fb-album-overlay-icon" style=""></span></i>';
												};
												if (opts.albumThumbWhiteOut) {
													html += '<i class="fb-album-blur" id="fb-album-blur-' + albums.id + '" style="width:' + opts.albumThumbWidth + 'px; height:' + opts.albumThumbHeight + 'px; background: ' + opts.albumThumbWhiteOutColor + '; padding: ' + opts.albumFrameOffset + 'px;"></i>';
												};
												if (opts.albumNameThumb) {
													html += '<i class="fb-album-title" id="fb-album-title-' + albums.id + '" style="width:' + (opts.albumThumbWidth - 2 * opts.socialSharePadding + 2 * opts.albumFrameOffset) + 'px; padding: ' + opts.socialSharePadding + 'px;">' + albums.name + '</i>';
												};
												if ((opts.albumShowSocialShare) && (opts.albumThumbSocialShare)) {
													var AlbumSocialShareLink = albums.link;
													AlbumIDsArray.push({id:albums.id, link:AlbumSocialShareLink, clean:"", thumb:"", summary:nameSummary});
													if (!opts.matchAlbumPhotoThumbs) 	{
														html += '<i class="fb-album-shareme" id="fb-album-shareme-' + albums.id + '" data-album="' + albums.id + '" style="width:' + (opts.albumThumbWidth - 2 * opts.socialSharePadding + 2 * opts.albumFrameOffset) + 'px; padding: ' + opts.socialSharePadding + 'px;">';
														if (opts.albumThumbWall) {
															html += '<ul id="albuminfo_' + albums.id + '" class="ts-social-share" style="float: left;">';
																html += '<li class="albuminfo"><div id="AlbumSocialShare_Info_' + albums.id + '" class="AlbumSocialShare AlbumSocialShare_Info TipSocial' + tooltipClass + '" ' + opts.tooltipTipAnchor + '="Click to see information about Album &#34;' + albums.name + '&#34;" data-album="' + albums.id + '" data-link="' + albums.link + '"><span class="social-icon icon-ts-albuminfo"></span></div></li>';
															html += '</ul>';
														};
														html += '<ul id="ts-social-share_' + albums.id + '" class="ts-social-share" style="float: right; display: ' + (opts.albumShortSocialShare == true ? " none;" : "block;") + '">';
															html += '<li class="stumbleupon"><a id="AlbumSocialShare_Stumble_' + albums.id + '" class="AlbumSocialShare TipSocial' + tooltipClass + '" target="_blank" href="http://www.stumbleupon.com/submit?url=' + AlbumSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share Album &#34;' + albums.name + '&#34; on Stumble Upon"><span class="social-icon icon-ts-stumbleupon"></span></a></li>';
															html += '<li class="googleplus"><a id="AlbumSocialShare_Google_' + albums.id + '" class="AlbumSocialShare TipSocial' + tooltipClass + '" target="_blank" href="https://plus.google.com/share?url=' + AlbumSocialShareLink + '&title=' + opts.SocialShareAlbumText + '" ' + opts.tooltipTipAnchor + '="Share Album &#34;' + albums.name + '&#34; on Google Plus"><span class="social-icon icon-ts-googleplus"></span></a></li>';
															html += '<li class="twitter"><a id="AlbumSocialShare_Twitter_' + albums.id + '" class="AlbumSocialShare TipSocial' + tooltipClass + '" target="_blank" href="https://twitter.com/intent/tweet?text=' + fixedEncodeURIComponent(opts.SocialShareAlbumText) + AlbumSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share Album &#34;' + albums.name + '&#34; on Twitter"><span class="social-icon icon-ts-twitter"></span></a></li>';
															html += '<li class="facebook"><a id="AlbumSocialShare_Facebook_' + albums.id + '" class="AlbumSocialShare TipSocial' + tooltipClass + '" target="_blank" href="http://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + AlbumSocialShareLink + '&p[images][0]=' + AlbumSocialShareLink + '&p[title]=' + opts.SocialShareAlbumText + '&p[summary]=' + nameSummary + '" ' + opts.tooltipTipAnchor + '="Share Album &#34;' + albums.name + '&#34; on Facebook"><span class="social-icon icon-ts-facebook"></span></a></li>';
														html += '</ul>';
														html += '</i>';
													} else {
														html += '<i class="fb-album-shareme" id="fb-album-shareme-' + albums.id + '" data-album="' + albums.id + '" style="width:' + (opts.albumThumbWidth - 2 * opts.socialSharePadding + 2 * opts.albumFrameOffset) + 'px; padding: ' + opts.socialSharePadding + 'px; left: -' + opts.socialSharePadding + 'px; top: -' + opts.socialSharePadding + 'px; ">';
														html += '<ul id="ts-social-share_' + albums.id + '" class="ts-social-share" style="float: right; display: ' + (opts.albumShortSocialShare == true ? " none;" : "block;") + '">';
															html += '<li class="stumbleupon"><a id="AlbumSocialShare_Stumble_' + albums.id + '" class="AlbumSocialShare TipSocial' + tooltipClass + '" target="_blank" href="http://www.stumbleupon.com/submit?url=' + AlbumSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share Album &#34;' + albums.name + '&#34; on Stumble Upon"><span class="social-icon icon-ts-stumbleupon"></span></a></li>';
															html += '<li class="googleplus"><a id="AlbumSocialShare_Google_' + albums.id + '" class="AlbumSocialShare TipSocial' + tooltipClass + '" target="_blank" href="https://plus.google.com/share?url=' + AlbumSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share Album &#34;' + albums.name + '&#34; on Google Plus"><span class="social-icon icon-ts-googleplus"></span></a></li>';
															html += '<li class="twitter"><a id="AlbumSocialShare_Twitter_' + albums.id + '" class="AlbumSocialShare TipSocial' + tooltipClass + '" target="_blank" href="https://twitter.com/intent/tweet?text=' + fixedEncodeURIComponent(opts.SocialShareAlbumText) + AlbumSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share Album &#34;' + albums.name + '&#34; on Twitter"><span class="social-icon icon-ts-twitter"></span></a></li>';
															html += '<li class="facebook"><a id="AlbumSocialShare_Facebook_' + albums.id + '" class="AlbumSocialShare TipSocial' + tooltipClass + '" target="_blank" href="http://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + AlbumSocialShareLink + '&p[images][0]=' + AlbumSocialShareLink + '&p[title]=' + opts.SocialShareAlbumText + '&p[summary]=' + nameSummary + '" ' + opts.tooltipTipAnchor + '="Share Album &#34;' + albums.name + '&#34; on Facebook"><span class="social-icon icon-ts-facebook"></span></a></li>';
														html += '</ul>';
														html += '</i>';
													};
												};
												html += '</span>';
												html += '</div>';
												html += '<div id="albumDetails_' + albums.id + '" class="albumDetails' + tooltipClass + (opts.albumThumbWall == true ? " albumwall" : "") + '" ' + opts.tooltipTipAnchor + '="' + albums.id + '" style="width:' + (opts.albumWrapperWidth + 2 * opts.albumThumbPadding) + 'px; padding-top: ' + ((opts.albumShowShadow == true ? opts.albumShadowOffset : 0) + opts.albumInfoOffset) + 'px; display:' + (opts.albumThumbWall ? "none;" : "block;") + '">';
													if ((opts.albumShowSocialShare) && (!opts.albumThumbSocialShare)) {
														html += '<div id="albumShare_' + albums.id + '" class="albumShare clearFixMe" style="height: 30px; width: ' + (opts.albumWrapperWidth + opts.albumFrameOffset + 2 * opts.albumThumbPadding) + 'px;' + (albumsAllInfoDisabled == true ? " border-bottom: none; margin-bottom: 0px;" : "") + '">';
															if (opts.albumShowOrder) {
																html += '<span id="albumSocial_' + albums.id + '" class="albumSocial">' + opts.AlbumShareMePreText + ' (#' + counterA + '):</span>';
															} else {
																html += '<span id="albumSocial_' + albums.id + '" class="albumSocial">' + opts.AlbumShareMePreText + ':</span>';
															};
															var AlbumSocialShareLink = albums.link;
															AlbumIDsArray.push({id:albums.id, link:AlbumSocialShareLink, clean:"", thumb:"", summary:nameSummary});
															html += '<ul id="ts-social-share_' + albums.id + '" class="ts-social-share" style="float: right; display: ' + (opts.albumShortSocialShare == true ? " none;" : "block;") + '">';
																html += '<li class="stumbleupon"><a id="AlbumSocialShare_Stumble_' + albums.id + '" class="AlbumSocialShare TipSocial' + tooltipClass + '" target="_blank" href="http://www.stumbleupon.com/submit?url=' + AlbumSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share Album &#34;' + albums.name + '&#34; on Stumble Upon"><span class="social-icon icon-ts-stumbleupon"></span></a></li>';
																html += '<li class="googleplus"><a id="AlbumSocialShare_Google_' + albums.id + '" class="AlbumSocialShare TipSocial' + tooltipClass + '" target="_blank" href="https://plus.google.com/share?url=' + AlbumSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share Album &#34;' + albums.name + '&#34; on Google Plus"><span class="social-icon icon-ts-googleplus"></span></a></li>';
																html += '<li class="twitter"><a id="AlbumSocialShare_Twitter_' + albums.id + '" class="AlbumSocialShare TipSocial' + tooltipClass + '" target="_blank" href="https://twitter.com/intent/tweet?text=' + fixedEncodeURIComponent(opts.SocialShareAlbumText) + AlbumSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share Album &#34;' + albums.name + '&#34; on Twitter"><span class="social-icon icon-ts-twitter"></span></a></li>';
																html += '<li class="facebook"><a id="AlbumSocialShare_Facebook_' + albums.id + '" class="AlbumSocialShare TipSocial' + tooltipClass + '" target="_blank" href="http://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + AlbumSocialShareLink + '&p[images][0]=' + AlbumSocialShareLink + '&p[title]=' + opts.SocialShareAlbumText + '&p[summary]=' + nameSummary + '" ' + opts.tooltipTipAnchor + '="Share Album &#34;' + albums.name + '&#34; on Facebook"><span class="social-icon icon-ts-facebook"></span></a></li>';
															html += '</ul>';
														html += '</div>';
													};
													html += '<div id="albumText_' + albums.id + '" class="albumText">';
														if ((opts.albumNameTitle) && (!opts.albumNameAbove)) 	{html += '<div id="albumName_' + albums.id + '" class="clearFixMe" style="width: ' + opts.albumWrapperWidth + 'px;"><span class="albumName' + tooltipClass + '" data-albumid="' + albums.id + '" ' + opts.tooltipTipAnchor + '="' + albums.name + '">' + albums.name + '</span></div>';}
														if (opts.albumImageCount) 		{html += '<div id="albumCount_' + albums.id + '" class="albumInfoText clearFixMe" style="width: ' + opts.albumWrapperWidth + 'px; display: block;"><div class="albumCount">' + opts.AlbumContentPreText + '</div><div class="albumInfo clearFixMe">' + countTxt + '</div></div>';}
														if (opts.albumDateCreate) 		{html += '<div id="albumCreate_' + albums.id + '" class="albumInfoText clearFixMe" style="width: ' + opts.albumWrapperWidth + 'px; display: block;"><div class="albumCreate">' + opts.AlbumCreatedPreText + '</div><div class="albumInfo clearFixMe">' + timeStampA + '</div></div>';}
														if (opts.albumDateUpdate) 		{html += '<div id="albumUpdate_' + albums.id + '" class="albumInfoText clearFixMe" style="width: ' + opts.albumWrapperWidth + 'px; display: block;"><div class="albumUpdate">' + opts.AlbumUpdatedPreText + '</div><div class="albumInfo clearFixMe">' + timeStampB + '</div></div>';}
														if (opts.albumFacebookID) 		{html += '<div id="albumNumber_' + albums.id + '" class="albumInfoText clearFixMe" style="width: ' + opts.albumWrapperWidth + 'px; display: block;"><div class="albumNumber">' + opts.AlbumNumericIDPreText + '</div><div class="albumInfo clearFixMe">' + this.id + '</div></div>';}
													html += '</div>';
												html += '</div>';
												if (((counterA <= opts.maxNumberGalleries) && (opts.maxNumberGalleries > 0)) || (opts.maxNumberGalleries === 0)) {
													var coverType = albums.type;
													if (opts.useAlbumsUpdated) {
														var albumTime = moment(albums.updated_time).fromNow().replace(/ /g,"_");
														var albumUTC = (albums.updated_time.length == 10 ? albums.updated_time * 1000 : albums.updated_time);
													} else {
														var albumTime = moment(albums.created_time).fromNow().replace(/ /g,"_");
														var albumUTC = (albums.created_time.length == 10 ? albums.created_time * 1000 : albums.created_time);
													};
													if (opts.showSelectionOnly) {
														var albumPreSet = getIndexByAttribute(AlbumPreSetArray, "id", albums.id);
													} else {
														var albumPreSet = "";
													};
													if (((!opts.excludeTimeLine) && (coverType == "wall")) || (coverType != "wall")) {
														$("<div>", {
															"class": 		"albumWrapper " + albumTime + (opts.albumThumbWall == true ? " albumwall" : ""),
															"id": 			"coverWrapper-" + albums.id,
															"data-title":	albums.name,
															"data-cover":	albums.cover_photo,
															"data-create":	(albums.created_time.length == 10 ? albums.created_time * 1000 : albums.created_time),
															"data-update":	(albums.updated_time.length == 10 ? albums.updated_time * 1000 : albums.updated_time),
															"data-count":	albums.count,
															"data-number":	albums.id,
															"data-order":	counterA,
															"data-preset":	albumPreSet,
															"data-time":	albumTime,
															"data-UTC":		albumUTC,
															"data-id":		albums.id,
															"data-type":	coverType,
															"data-user":	opts.facebookID,
															style: 			clear,
															html : 			html
														}).appendTo("#fb-albums-all").fadeIn(500, function(){});
														/*if (opts.albumNameShorten) {
															if ((opts.albumNameTitle) && (!opts.albumNameAbove) && (!opts.albumThumbWall)) 	{$("#coverWrapper-" + albums.id + " .albumName").shorten({tail: '&nbsp;&nbsp;...'})};
															if ((opts.albumNameTitle) && (opts.albumNameAbove)) 	{$("#coverWrapper-" + albums.id + " .albumNameHead").shorten({tail: '&nbsp;&nbsp;...'})};
															if ((opts.albumNameTitle) && (opts.albumNameThumb)) 	{$("#coverWrapper-" + albums.id + " .fb-album-title").shorten({tail: '&nbsp;&nbsp;...'})};
														};*/
														if ((opts.albumShowSocialShare) && (opts.albumThumbSocialShare)) {
															$('body').on('click', '#' + albums.id, function(event){
																$(this).find(".fb-album-overlay").stop().animate({opacity: 0}, "slow");
																if (opts.infiniteScrollAlbums) {
																	$('#' + opts.infiniteAlbumsID).unbind('inview').hide();
																};
																checkExisting($(this).attr('data-href'));
															}).on('click', '.fb-album-shareme', function(event) {
																event.stopPropagation();
															});
														} else {
															$('body').on('click', '#' + albums.id, function(event){
																$(this).find(".fb-album-overlay").stop().animate({opacity: 0}, "slow");
																if (opts.infiniteScrollAlbums) {
																	$('#' + opts.infiniteAlbumsID).unbind('inview').hide();
																};
																checkExisting($(this).attr('data-href'));
															});
														};
														var coverCount = counterA - 1;
														var coverAlbum = "";
														var coverID = "";
														if (opts.consoleLogging) {
															if (albums.count > 1) {
																if ((opts.maxNumberImages > 0) && (albums.count > opts.maxNumberImages)) {
																	var coverContent = opts.maxNumberImages + " out of " + albums.count + " Images";
																} else {
																	var coverContent = albums.count + " Images";
																};
															} else {
																if ((opts.maxNumberImages > 0) && (albums.count > opts.maxNumberImages)) {
																	var coverContent = opts.maxNumberImages + " out of " + albums.count + " Image";
																} else {
																	var coverContent = albums.count + " Image";
																};
															};
														};
														AlbumsCoverArray.push({
															ID:			albums.id,
															Cover: 		albums.cover_photo, 
															Type: 		albums.type,
															Name:		albums.name,
															Count:		albums.count,
															Created:	albums.created_time,
															Updated:	albums.updated_time,
															Order:		counterA,
															Content: 	coverContent
														});
														// Apply Album Cover Image
														if (typeof(coverID) === "undefined") {
															if (/^[a-z]+:\/\//i.test(opts.PathNoCoverImage)) {
																var pathname = opts.PathNoCoverImage;
															} else {
																var pathname = getAbsolutePath();
																pathname += opts.PathNoCoverImage;
															};
															if (opts.innerImageScaler) {
																var imgcover = '' + opts.PathInternalPHP + '?src=' + (pathname) + '&w=' + (opts.albumThumbWidth) + '&zc=1';
															} else if (opts.senchaImageScaler) {
																var imgcover = 'http://src.sencha.io/' + (opts.albumThumbWidth) + '/' + (pathname);
															} else if (opts.weservImageScaler) {
																var imgcover = 'http://images.weserv.nl/?url=' + (pathname.replace("https://", "").replace("http://", "")) + '&h=' + (opts.albumThumbHeight) + '&w=' + (opts.albumThumbWidth) + '&t=fit';
															} else {
																var imgcover = pathname;
															};
														} else {
															var pathname = "https://graph.facebook.com/" + albums.cover_photo + "/picture?type=normal";
															if (opts.innerImageScaler) {
																var imgcover = '' + opts.PathInternalPHP + '?src=' + (pathname) + '&w=' + (opts.albumThumbWidth) + '&zc=1';
															} else if (opts.senchaImageScaler) {
																var imgcover = 'http://src.sencha.io/' + (opts.albumThumbWidth) + '/' + (pathname);
															} else if (opts.weservImageScaler) {
																var imgcover = 'http://images.weserv.nl/?url=' + (pathname.replace("https://", "").replace("http://", "")) + '&h=' + (opts.albumThumbHeight) + '&w=' + (opts.albumThumbWidth) + '&t=fit';
															} else {
																var imgcover = pathname;
															};
														};
														$.each(AlbumIDsArray, function() {
															if (this.id == albums.id) {
																this.thumb = pathname;
															};
														});
														if ((opts.imageLazyLoad) && ($.isFunction($.fn.lazyloadanything))) {
															$("#fb-album-thumb-" + albums.id).attr("data-original", imgcover).attr("data-cover", albums.cover_photo).attr("data-album", albums.id).attr("data-loaded", "FALSE");
														} else {
															$("#fb-album-thumb-" + albums.id).attr("data-cover", albums.cover_photo).attr("data-album", albums.id).attr("data-loaded", "FALSE");
															if ((opts.imageSpinnerAnimation) && ($.isFunction($.fn.waitForImages))) {
																$("#fb-album-thumb-" + albums.id).hide().css("background-image", "url(" + (imgcover) + ")");
																$("#fb-album-thumb-" + albums.id).waitForImages({
																	waitForAll: 	true,
																	finished: 		function() {},
																	each: 			function() {
																		var $album 	= $(this).attr('data-album');
																		if ($("#fb-album-thumb-" + $album).attr("data-loaded") == "FALSE") {
																			$("#fb-album-spinner-" + $album).hide();
																			$("#fb-album-thumb-" + $album).fadeIn(500);
																			$("#fb-album-thumb-" + $album).attr("data-loaded", "TRUE");
																		};
																	},
																});
															} else {
																$("#fb-album-thumb-" + albums.id).css("background-image", "url(" + (imgcover) + ")");
																$("#fb-album-spinner-" + albums.id).hide();
															};
														};
													} else {
														counterA = counterA - 1;
													};
												};
											};
										};
									};
								};
							});
							if ((typeof json.paging.next !== "undefined") && ((counterA < opts.maxNumberGalleries) || (opts.maxNumberGalleries == 0))) {
								graphNext = json.paging.next;
							};
						};
					},
					complete: function(json) {},
					error: function(jqXHR, textStatus, errorThrown){
						if (opts.outputErrorMessages) {
							MessiContent = 	"Error: \njqXHR:" + jqXHR + "\ntextStatus: " + textStatus + "\nerrorThrown: "  + errorThrown;
							MessiCode = 	"anim errors";
							MessiTitle = 	"ERROR for Facebook ID: " + opts.facebookID;
							showMessiContent(MessiContent, MessiTitle, MessiCode);
						};
						if (opts.consoleLogging) {
							console.log('Error: \njqXHR:' + jqXHR + '\ntextStatus: ' + textStatus + '\nerrorThrown: '  + errorThrown);
						};
						return false;
					}
				}).done(function(result) {
					if (graphNext.length != 0) {
						setTimeout(function() {
							RoundOffsetAlbums++;
							galleryAlbumsShow(opts.facebookID, graphNext.replace("\u00252C", ","));
						}, opts.graphRequestTiming);
					} else {
						if (opts.outputCountAlbumID) {
							MessiCode = 	"anim success";
							MessiTitle = 	"Album Information Summary for Facebook User: " + opts.facebookID;
							showMessiContent(MessiContent, MessiTitle, MessiCode);
						};
						if (opts.outputLoaderStatus) {
							if ((opts.maxNumberGalleries != 0) && (opts.maxNumberGalleries < counterC)) {
								LoaderStatusAnimationCircle.setValue(opts.maxNumberGalleries + ' / ' + opts.maxNumberGalleries);
							} else if ((opts.maxNumberGalleries != 0) && (opts.maxNumberGalleries > counterC)) {
								LoaderStatusAnimationCircle.setValue(counterC + ' / ' + counterC);
							} else {
								LoaderStatusAnimationCircle.setValue(counterC + ' / ' + counterC);
							};
							LoaderStatusAnimationCircle.setProgress(100);
						};
						if (opts.consoleLogging) {
							console.log('Update: Data for ' + counterA + ' album(s) for Facebook ID "' + opts.facebookID + '" could be successfully retrieved!');
						};
						if (opts.outputLoaderStatus) {
							$("#" + opts.loaderSpinnerID).hide();
						};
						sortMultiArrayByKey(AlbumsCoverArray, "Name", opts.defaultSortDirectionASC);
						var $container = $('#fb-albums-all');
						$("#" + opts.loaderID).slideFade(700);
						$("#FB_Album_Display").slideFade(700);
						// Initialize Paging Feature
						equalHeightFloat(true, opts.facebookID);
						currentPageList = $container;
						setTimeout(function(){
							if (!opts.paginationLayoutAlbums) {
								if (opts.infiniteScrollAlbums) {
									if (opts.infiniteScrollAlbumsSmart) {
										infiniteAlbums = smartAlbumsPerPage;
										var albumItemsPerPage = smartAlbumsPerPage;
									} else {
										infiniteAlbums = opts.infiniteScrollAlbumsBlock;
										var albumItemsPerPage = opts.infiniteScrollAlbumsBlock;
									};
									infiniteAlbumsCount = counterA;
								} else {
									var albumItemsPerPage = counterA;
								};
							} else if (opts.smartAlbumsPerPageAllow) {
								var albumItemsPerPage = smartAlbumsPerPage;
							} else {
								if (opts.setAlbumsByPages) {
									var albumItemsPerPage = ((opts.paginationLayoutAlbums = true && opts.numberPagesForAlbums > 0) ? (Math.ceil(counterA / opts.numberPagesForAlbums)) : counterA);
								} else {
									var albumItemsPerPage = ((opts.paginationLayoutAlbums = true && opts.numberAlbumsPerPage > 0) ? opts.numberAlbumsPerPage : counterA);
								};
							};
							var AlbumSettings = {
								'searchBoxDefault' 		: 	opts.SearchDefaultText,
								'itemsPerPageDefault' 	: 	albumItemsPerPage,
								'hideToTop'				:	(opts.showFloatingToTopButton == true ? false : true),
								'hideFilter' 			: 	(opts.albumsFilterAllow == true ? false : true),
								'hideSort' 				: 	(opts.albumSortControls == true ? false : true),
								'hideSearch' 			: 	(opts.albumSearchControls == true ? false : true),
								'hidePager'				:	((opts.albumsPagerControls == true && !opts.infiniteScrollAlbums) ? false : true)
							};
							new CallPagination(currentPageList, AlbumSettings, "fb-albums-all-paged", true, true, opts.facebookID, totalItems);
						}, 500);
						// Initialize LazyLoad for Thumbnails
						if ((opts.imageLazyLoad) && ($.isFunction($.fn.lazyloadanything))) {
							$('.fb-album-thumb').lazyloadanything({
								'auto': 			true,
								'repeatLoad':		true,
								'onLoadingStart': 	function(e, LLobjs, indexes) {
									return true
								},
								'onLoad': 			function(e, LLobj) {
									var $img 	= LLobj.$element;
									var $src 	= $img.attr('data-original');
									var $album 	= $img.attr('data-album');
									if (($('#fb-albums-all-paged').is(':visible')) && $("#fb-album-thumb-" + $album).is(':visible')) {
										if ((opts.imageSpinnerAnimation) && ($.isFunction($.fn.waitForImages))) {
											if ($("#fb-album-thumb-" + $album).attr("data-loaded") == "FALSE") {
												$img.hide().css('background-image', 'url("' + $src + '")');
												$img.waitForImages({
													waitForAll: 	true,
													finished: 		function() {},
													each: 			function() {
														if ($("#coverWrapper-" + $album).css('display') != 'none') {
															$("#fb-album-spinner-" + $album).hide();
															$("#fb-album-thumb-" + $album).fadeIn(500);
															$("#fb-album-thumb-" + $album).attr("data-loaded", "TRUE");
														};
													},
												});
											};
										} else {
											if ($("#fb-album-thumb-" + $album).attr("data-loaded") == "FALSE") {
												$img.hide().css('background-image', 'url("' + $src + '")').fadeIn(500);
												$("#fb-album-thumb-" + $album).attr("data-loaded", "TRUE");
											};
										};
									};
								},
								'onLoadComplete':	function(e, LLobjs, indexes) {
									return true
								}
							});
							restartLazyLoad();
						} else {
							if ((opts.imageSpinnerAnimation) && ($.isFunction($.fn.waitForImages))) {
								$('.albumWrapper .fb-album-thumb').waitForImages({
									waitForAll: true,
									finished: function() {},
									each: function() {
										var $album 	= $(this).attr("data-album");
										var $cover 	= $$(this).attr('data-cover');
										if ($("#fb-album-thumb-" + $cover).attr("data-loaded") == "FALSE") {
											$("#fb-album-spinner-" + $cover).hide();
											$("#fb-album-thumb-" + $cover).hide().fadeIn(500);
											$("#fb-album-thumb-" + $cover).attr("data-loaded", "TRUE");
										};
									},
								});
							} else {
								$('.albumWrapper .fb-album-thumb').each(function(index) {
									var $album 	= $(this).attr("data-album");
									var $cover 	= $(this).attr('data-cover');
									if ($("#fb-album-thumb-" + $cover).attr("data-loaded") == "FALSE") {
										$("#fb-album-thumb-" + $cover).hide().fadeIn(500);
										$("#fb-album-thumb-" + $cover).attr("data-loaded", "TRUE");
									};
								});
							};
						};
						shortLinkAlbumShares("");
						// Adjust Height of iFrame Container (if applicable)
						AdjustIFrameDimensions();
					};
				});
			} else {
				$("#" + opts.loaderID).show();
				singleAlbumInit();
			};
		};
		
		// Initialize Single Album Preview
		function singleAlbumInit() {
			if ((opts.infiniteScrollAlbums) || (opts.infiniteScrollPhotos)) {
				$('#' + opts.infiniteMoreID).hide();
			};
			if (!opts.singleAlbumOnly) {
				$("#" + opts.loaderID).slideFade(700);
			};
			if (opts.cacheAlbumContents) {
				if (($('#fb-album-paged-' + albumId).length != 0) || ($('#fb-album-' + albumId).length != 0)) {
					//alert("Restore from 'singleAlbumInit'");
					if ($("#paginationControls-" + albumId).length != 0) {
						if ((opts.floatingControlBar) && (!isInIFrame)) {
							$("#paginationControls-" + albumId).unbind('stickyScroll');
							$("#paginationControls-" + albumId).stickyScroll('reset');
						};
					};
					$('#fb-album-header').html(headerArray[albumId]);
					if (opts.showBottomControlBar) {
						$('#fb-album-footer').html(footerArray[albumId]);
					};
					$('#Back-' + albumId + '_1').unbind("click").bind('click', function(e){
						if (opts.infiniteScrollPhotos) {
							$('#' + opts.infinitePhotosID).unbind('inview');
						};
						checkExisting($(this).attr('data-href'));
					});
					if (opts.showBottomControlBar) {
						$('#Back-' + albumId + '_2').unbind("click").bind('click', function(e){
							if (opts.infiniteScrollPhotos) {
								$('#' + opts.infinitePhotosID).unbind('inview');
							};
							checkExisting($(this).attr('data-href'));
						});
						$('#Back_To_Top-' + albumId).click(function(e){
							if (opts.autoScrollTop) {
								$('html, body').animate({scrollTop:$("#" + opts.frameID).offset().top - 20}, 'slow');
							};
						});
					};
					$('#albumCommentsShow_' + albumId).unbind("click").bind('click', function(e){
						MessiContent = 	$('#albumCommentsFull_' + albumId).html();
						MessiCode = 	"anim success";
						MessiTitle = 	"Comments for Album: " + albumId;
						showMessiContent(MessiContent, MessiTitle, MessiCode);
					});
					$('#Back-' + albumId + '_3').unbind("click").bind('click', function(e){
						if (opts.infiniteScrollPhotos) {
							$('#' + opts.infinitePhotosID).unbind('inview');
						};
						checkExisting($(this).attr('data-href'));
					});
					$('.paginationMain').hide();
					$("#" + opts.loaderID).slideFade(700);
					setTimeout(function(){
						$('#fb-album-paged-' + albumId).show();
						$('#fb-album-' + albumId).show();
						var $albumContainer = $('#fb-album-' + albumId);
						$albumContainer.isotope('reloadItems');
						$albumContainer.isotope('reLayout');
						if (opts.infiniteScrollPhotos) {
							$('.photoWrapper:visible').each(function(i, elem) {
								$(this).addClass("Showing").addClass("Infinite");
							});
							$('#' + opts.infinitePhotosID).unbind('inview');
							if (!opts.niceScrollAllow) {
								infiniteGallery($albumContainer, false, false, albumId);
							};
						};
						if ((opts.floatingControlBar) && (!isInIFrame) && ($("#paginationControls-" + albumId).length != 0)) {
							isotopeHeightContainer = $albumContainer.height();
							$("#paginationControls-" + albumId).stickyScroll({ container: $("#fb-album-paged-" + albumId) });
						};
						if (opts.autoScrollTop) {
							$('html, body').animate({scrollTop:$("#" + opts.frameID).offset().top - 20}, 'slow', function() {
								if (opts.infiniteScrollPhotos) {
									$("#" + opts.infinitePhotosID).show();
								};
							});
						} else {
							if (opts.infiniteScrollPhotos) {
								$("#" + opts.infinitePhotosID).show();
							};
						};
						if (opts.consoleLogging) {
							console.log('Update: All data for Album ' + albumId + ' has been restored from cache and set to visible!');
						};
						shortLinkPhotoShares(albumId);
					}, 800);
					return;
				};
			} else {
				removeAlbumDOM(albumId);
				if (opts.infiniteScrollPhotos) {
					$("#" + opts.infinitePhotosID).show();
				};
			};
			counterB = 0;
			if (opts.facebookToken.length != 0) {
				var album = "https://graph.facebook.com/" + albumId + "?access_token=" + opts.facebookToken + "&fields=description,count,cover_photo,id,link,location,name,place,from,created_time,updated_time,type,likes&callback=?";
			} else {
				var album = "https://graph.facebook.com/" + albumId + "?fields=description,count,cover_photo,id,link,location,name,place,from,created_time,updated_time,type,likes&callback=?";
			};
			if (opts.outputGraphPhotos) {
				MessiContent = 	"<strong>Album Info:</strong><br/>" + album.replace('&callback=?', '') + "<br/><br/><strong>Album Comments:</strong><br/>" + comments.replace('&callback=?', '') + "<br/><br/>";
				MessiCode = 	"anim success";
				MessiTitle = 	"Graph Links for Album: " + albumId;
			};
			if (opts.consoleLogging) {
				console.log("Usable JSON Feed for Album Information: " + album);
			};
			$.ajax({
				url: 			album,
				cache: 			false,
				dataType: 		"jsonp",
				success: function(data){
					$.each([data], function(i, item){
						var albname = item.name;
						var alblikes = 0;
						if ((item.likes) && (opts.showCommentsLikes)) {
							$.each(item.likes.data, function(j, likes){
								alblikes = alblikes + 1;
							});
						};
						var desc = "";
						if (item.description){desc += item.description;};
						if (item.location){
							if(desc != ""){desc += ' ';};
							desc += '[' + opts.ImageLocationPreText + ' ' + item.location + ']';
						};
						if ((desc!='') && (desc!=' ')){
							desc = '<p>' + desc + '</p>';
						} else {
							desc='<p>' + opts.AlbumNoDescription + '</p>';
						};
						if (!opts.singleAlbumOnly) {
							var headerID = 	'<div data-href="#" id="Back-' + albumId + '_1" class="BackButton fbLink clearFixMe">' + opts.AlbumBackButtonText + '</div>';
						} else {
							var headerID = 	'';
						};
						if (!opts.singleAlbumOnly) {
							var footerID =	'<div class="seperator clearFixMe" style="width: 100%; margin-top: 0px;"></div>';
							footerID += 		'<div data-href="#" id="Back-' + albumId + '_2" class="BackButton fbLink clearFixMe">' + opts.AlbumBackButtonText + '</div>';
							footerID += 		'<ul id="Top-' + albumId + '" class="TopButton fbLink clearFixMe"><li><a style="width: 40px;" id="Back_To_Top-' + albumId + '"><div id="To_Top_' + albumId + '" class="Album_To_Top"></div></a></li></ul>';
						} else {
							var footerID =	'<div class="seperator clearFixMe" style="width: 100%; margin-top: 0px;"></div>';
							footerID += 		'<ul id="Top-' + albumId + '" class="TopButton fbLink clearFixMe"><li><a style="width: 40px;" id="Back_To_Top-' + albumId + '"><div id="To_Top_' + albumId + '" class="Album_To_Top"></div></a></li></ul>';
						};
						if ((opts.photoShowIconFBLink) && (!opts.singleAlbumOnly)) {
							headerID +=		'<div id="Link-' + albumId + '" class="albumFacebook"><a href="' + item.link + '" target="_blank" style="text-decoration: none; border: 0px;"><div class="albumLinkSimple TipGeneric' + tooltipClass + '" style="top: 25px;" ' + opts.tooltipTipAnchor + '="Click here to view the full Album on Facebook!"></div></a></div>';
						} else if ((opts.photoShowIconFBLink) && (opts.singleAlbumOnly)) {
							headerID +=		'<div id="Link-' + albumId + '" class="albumFacebook"><a href="' + item.link + '" target="_blank" style="text-decoration: none; border: 0px;"><div class="albumLinkSimple TipGeneric' + tooltipClass + '" ' + opts.tooltipTipAnchor + '="Click here to view the full Album on Facebook!"></div></a></div>';
						};
						headerID += 			'<div class="albumTitle clearFixMe" style="' + (((opts.photoShowIconFBLink) && (opts.singleAlbumOnly)) ? "margin-top: -20px;" : "") + '">' + opts.AlbumTitlePreText + ' ' + albname + '</div>';
						if (opts.allowAlbumDescription) {
							headerID += 		'<div class="albumDesc clearFixMe"><span id="albumDesc_' + albumId + '">' + desc + '</span>';
							if ((opts.showCommentsLikes)) {
								headerID +=		'<div data-href="#" id="albumCommentsShow_' + albumId + '" class="albumCommentsShow" data-album="' + albumId + '">' + opts.AlbumCommentsText + '</div>';
								headerID +=		'<div style="margin-top: 15px;">';
							} else {
								headerID +=		'<div style="margin-top: 5px;">';
							};
							if (opts.showCommentsLikes) {
								headerID += 	'<div class="albumCommentsSimpleIcon"></div><div id="albumCommentsSimple_' + albumId + '" class="albumCommentsSimple">N/A</div>';
								headerID += 	'<div class="albumLikesSimpleIcon"></div><div id="albumLikesSimple_' + albumId + '" class="albumLikesSimple">N/A</div>';
							};
							headerID +=			'</div>';
							headerID +=			'</div>';
							if (opts.photoShowTextFBLink) {
								headerID += 		'<div class="albumLinkText clearFixMe"><a class="AlbumLinkButtonText" href="' + item.link + '" target="_blank">' + opts.AlbumLinkButtonText + '</a></div>';
							};
						};
						headerID += 		'<div id="albumCommentsFull_' + albumId + '" data-album="' + albumId + '" class="albumCommentsFull clearFixMe"><strong>Comments:</strong><br/><div id="albumCommentsDetail_' + albumId + '" data-album="' + albumId + '" ></div></div>';
						headerID +=			'<div class="seperator clearFixMe' + ((opts.floatingControlBar == true && !isInIFrame) ? " Floater" : "") + '" style="width: 100%; ' + (opts.floatingControlBar == false ? "margin-bottom: 0px;" : "") + '"></div>';
						headerArray[albumId] = headerID;
						footerArray[albumId] = footerID;
						$('#fb-album-header').html(headerID).hide();
						if (opts.showBottomControlBar) {
							$('#fb-album-footer').html(footerID).hide();
						};
						$("<div>", {
							id: 		'fb-album-' + albumId,
							"class": 	'album'
						}).appendTo("#fb-album-content").hide();
						albumCount = item.count;
					});
					RoundOffsetPhotos = 0;
					singleAlbumShow(albumCount, "");
					if (!opts.singleAlbumOnly) {
						$('#Back-' + albumId + '_1').unbind("click").bind('click', function(e){
							if (!opts.cacheAlbumContents) {
								removeAlbumDOM(albumId);
							};
							checkExisting($(this).attr('data-href'));
						});
						$('#Back-' + albumId + '_2').unbind("click").bind('click', function(e){
							if (!opts.cacheAlbumContents) {
								removeAlbumDOM(albumId);
							};
							checkExisting($(this).attr('data-href'));
						});
					}
					$('#Back_To_Top-' + albumId).click(function(e){
						if (opts.autoScrollTop) {
							$('html, body').animate({scrollTop:$("#" + opts.frameID).offset().top - 20}, 'slow');
						};
					});
					$('#albumCommentsShow_' + albumId).unbind("click").bind('click', function(e){
						MessiContent = 	$('#albumCommentsFull_' + albumId).html();
						MessiCode = 	"anim success";
						MessiTitle = 	"Comments for Album: " + albumId;
						showMessiContent(MessiContent, MessiTitle, MessiCode);
					});
					if (opts.showCommentsLikes) {
						RoundOffsetLikes 		= 0;
						CountLikes 				= 0;
						RoundOffsetComments 	= 0;
						CountComments 			= 0;
						singleAlbumComments(albumId, "");
						singleAlbumLikes(albumId, "");
					};
				},
				error: function(jqXHR, textStatus, errorThrown){
					if (opts.outputErrorMessages) {
						MessiContent = 	"Error: \njqXHR:" + jqXHR + "\ntextStatus: " + textStatus + "\nerrorThrown: "  + errorThrown;
						MessiCode = 	"anim errors";
						MessiTitle = 	"ERROR for Facebook ID: " + opts.facebookID;
						showMessiContent(MessiContent, MessiTitle, MessiCode);
					};
					if (opts.consoleLogging) {
						console.log('Error: \njqXHR:' + jqXHR + '\ntextStatus: ' + textStatus + '\nerrorThrown: '  + errorThrown);
					};
					return false;
				}
			});
		};
		
		// Retrieve Data for Album Likes
		function singleAlbumLikes(albumId, graphPath) {
			var likesCount 		= 0;
			var graphOffset 	= RoundOffsetLikes * 100;
			if (graphPath != "") {
				var likes = graphPath;
			} else {
				if (opts.facebookToken.length != 0) {
					var likes = "https://graph.facebook.com/" + albumId + "/likes?access_token=" + opts.facebookToken + "&fields=id,name&limit=100&offset=" + graphOffset + "&callback=?";
				} else {
					var likes = "https://graph.facebook.com/" + albumId + "/likes?fields=id,name&limit=100&offset=" + graphOffset + "&callback=?";
				};
			};
			if (opts.consoleLogging) {
				console.log("Usable JSON Feed for Album Likes: " + likes + " (" + RoundOffsetLikes + ")");
			};
			$.ajax({
				url: 			likes,
				cache: 			false,
				dataType: 		"jsonp",
				success: function(json){
					if (json.data.length != 0) {
						$.each(json.data, function(l, likes){
							likesCount 		= likesCount + 1;
						});
						CountLikes = CountLikes + likesCount;
						if (typeof json.paging.next !== "undefined") {
							var likesNext = json.paging.next;
							RoundOffsetLikes++;
							singleAlbumLikes(albumId, likesNext.replace("\u00252C", ","));
						} else {
							$("#albumLikesSimple_" + albumId).empty().html(CountLikes);
						};
					} else {
						$("#albumLikesSimple_" + albumId).empty().html("0");
					};
				},
				complete: function(){},
				error: function(jqXHR, textStatus, errorThrown){
					if (opts.outputErrorMessages) {
						MessiContent = 	"Error: \njqXHR:" + jqXHR + "\ntextStatus: " + textStatus + "\nerrorThrown: "  + errorThrown;
						MessiCode = 	"anim errors";
						MessiTitle = 	"ERROR for Facebook ID: " + opts.facebookID;
						showMessiContent(MessiContent, MessiTitle, MessiCode);
					};
					if (opts.consoleLogging) {
						console.log('Error: \njqXHR:' + jqXHR + '\ntextStatus: ' + textStatus + '\nerrorThrown: '  + errorThrown);
					};
					return false;
				}
			});
		};
		
		// Retrieve Data for Album Comments
		function singleAlbumComments(albumId, graphPath) {
			var commentsCount 	= 0;
			var commentsUser 	= "";
			var commentsText 	= "";
			var commentsOutput 	= "";
			var graphOffset 	= RoundOffsetComments * 100;
			if (graphPath != "") {
				var comments = graphPath;
			} else {
				if (opts.facebookToken.length != 0) {
					var comments = "https://graph.facebook.com/" + albumId + "/comments?access_token=" + opts.facebookToken + "&fields=from,message,created_time&limit=100&offset=" + graphOffset + "&callback=?";
				} else {
					var comments = "https://graph.facebook.com/" + albumId + "/comments?fields=from,message,created_time&limit=100&offset=" + graphOffset + "&callback=?";
				};
			};
			if (opts.consoleLogging) {
				console.log("Usable JSON Feed for Album Comments: " + comments + " (" + RoundOffsetComments + ")");
			};
			$.ajax({
				url: 			comments,
				cache: 			false,
				dataType: 		"jsonp",
				success: function(json){
					if (json.data.length != 0) {
						$.each(json.data, function(c, comments){
							commentsCount 	= commentsCount + 1;
							commentsUser 	= comments.from.name;
							commentsText 	= comments.message;
							commentsOutput += '<div class="albumCommentsUser">' + commentsUser + '</div>';
							commentsOutput += '<div class="albumCommentsText">' + commentsText + "</div>";
						});
						if (commentsOutput.length == 0) {
							commentsOutput += "No Comments available for this Album.";
						};
						$("#albumCommentsDetail_" + albumId).append(commentsOutput);
						CountComments = CountComments + commentsCount;
						if (typeof json.paging.next !== "undefined") {
							var commentsNext = json.paging.next;
							RoundOffsetComments++;
							singleAlbumComments(albumId, commentsNext.replace("\u00252C", ","));
						} else {
							$("#albumCommentsSimple_" + albumId).empty().html(CountComments);
							if (CountComments == 0) {
								$('#albumCommentsShow_' + albumId).hide();
							};
						};
					} else {
						commentsOutput += "No Comments available for this Album.";
						$("#albumCommentsDetail_" + albumId).append(commentsOutput);
						$("#albumCommentsSimple_" + albumId).empty().html("0");
						$('#albumCommentsShow_' + albumId).hide();
					};
				},
				complete: function(){},
				error: function(jqXHR, textStatus, errorThrown){
					if (opts.outputErrorMessages) {
						MessiContent = 	"Error: \njqXHR:" + jqXHR + "\ntextStatus: " + textStatus + "\nerrorThrown: "  + errorThrown;
						MessiCode = 	"anim errors";
						MessiTitle = 	"ERROR for Facebook ID: " + opts.facebookID;
						showMessiContent(MessiContent, MessiTitle, MessiCode);
					};
					if (opts.consoleLogging) {
						console.log('Error: \njqXHR:' + jqXHR + '\ntextStatus: ' + textStatus + '\nerrorThrown: '  + errorThrown);
					};
					return false;
				}
			});
		};

		// Load and Show Single Album Thumbnails and Data
		function singleAlbumShow(albumCount, graphPath) {
			var graphLimit 		= opts.excludeImages.length + opts.maxNumberImages;
			var graphOffset 	= RoundOffsetPhotos * 100;
			if (graphPath != "") {
				var pictures = graphPath;
			} else {
				if (opts.facebookToken.length != 0) {
					var pictures = "https://graph.facebook.com/" + albumId + "/photos?access_token=" + opts.facebookToken + "&fields=id,name,picture,created_time,updated_time,source,height,width,album,link,images&limit=" + albumCount + "&offset=" + graphOffset + "&callback=?";
				} else {
					var pictures = "https://graph.facebook.com/" + albumId + "/photos?fields=id,name,picture,created_time,updated_time,source,height,width,album,link,images&limit=" + albumCount + "&offset=" + graphOffset + "&callback=?";
				};
			};
			if (opts.outputGraphPhotos) {
				MessiContent += "<strong>Photos Info:</strong><br/>" + pictures.replace('&callback=?', '') + "";
				showMessiContent(MessiContent, MessiTitle, MessiCode);
			};
			if (opts.consoleLogging) {
				console.log("Usable JSON Feed for Album Thumbnails: " + pictures);
			};
			if (opts.outputLoaderStatus) {
				$("#" + opts.loaderSpinnerID).hide();
				$("#" + opts.loaderCircleID).show();
			} else {
				$("#" + opts.loaderCircleID).hide();
				$("#" + opts.loaderSpinnerID).show();
			};
			$.ajax({
				url: 			pictures,
				cache: 			false,
				dataType: 		"jsonp",
				success: function(json) {
					if (opts.consoleLogging) {
						console.log("Loading Album Data for Photos " + (RoundOffsetPhotos * 100 + 1) + " to " + ((((RoundOffsetPhotos + 1) * 100) > albumCount) ? albumCount : ((RoundOffsetPhotos + 1) * 100)) + "");
					};
					if (opts.outputLoaderStatus) {
						var progressStatus 	= (((RoundOffsetPhotos * 100 + 1) / albumCount) * 100);
						var progressImages 	= (RoundOffsetPhotos * 100 + 1);
						if ((opts.maxNumberImages != 0) && (opts.maxNumberImages < albumCount)) {
							var totalImages 	= opts.maxNumberImages;
						} else if ((opts.maxNumberImages != 0) && (opts.maxNumberImages > albumCount)) {
							var totalImages 	= albumCount;
						} else {
							var totalImages 	= albumCount;
						};
						if (RoundOffsetPhotos == 0) {
							LoaderStatusAnimationCircle.setValue('0 / 0');
							LoaderStatusAnimationCircle.setProgress(0);
						};
						$("#" + opts.loaderMessageID).empty().html(opts.ProgressMessageTextStep3);
						updateProgress(progressStatus, progressImages, totalImages);
					};
					$.each(json.data, function(j, photos){
						if (typeof photos.picture !== "undefined") {
							if($.inArray(photos.id, opts.excludeImages) == -1) {
								counterB = counterB + 1;
								if ((counterB <= opts.maxNumberImages) || (opts.maxNumberImages == 0)) {
									if (photos.name) {
										var name = photos.name;
										var nameSummary = truncateString(name, opts.photoTitleSummaryLength, ' ', ' ...');
									} else {
										var name = "";
										var nameSummary = truncateString(opts.lightBoxNoDescription, opts.photoTitleSummaryLength, ' ', ' ...');
									};
									if (opts.createTooltipsPhotos) {
										var tooltips = " TipPhoto";
									} else {
										var tooltips = "";
									};
									if (opts.lightboxCustomClass != "") {
										var lightboxClass = " " + opts.lightboxCustomClass;
									} else {
										var lightboxClass = "";
									};
									// Create Hidden Links for Lightbox if Social Share in Photo Thumbnail
									if ((opts.photoShowSocialShare) && (opts.photoThumbSocialShare)) {
										if (opts.prettyPhotoAllow) {
											if (opts.tooltipTipAnchor != "title") {
												var html = '<a id="' + albumId + '_' + counterB + '" class="photoThumbLink ' + albumId + '" data-photo="' + photos.id + '" data-album="' + albumId + '" data-key="' + counterB + '" data-short="" rel="prettyPhoto[' + albumId + ']" style="display: none !important" ' + opts.tooltipTipAnchor + '="' + name + '" href="' + photos.images[0].source + '" title="' + name + '" target="_blank">Lightbox Link</a>';
											} else {
												var html = '<a id="' + albumId + '_' + counterB + '" class="photoThumbLink ' + albumId + '" data-photo="' + photos.id + '" data-album="' + albumId + '" data-key="' + counterB + '" data-short="" rel="prettyPhoto[' + albumId + ']" style="display: none !important" ' + opts.tooltipTipAnchor + '="' + name + '" href="' + photos.images[0].source + '" target="_blank">Lightbox Link</a>';
											};
										} else {
											if ((opts.photoThumbSocialShare) && (opts.photoBoxAllow)) {
												var html = '<a id="' + albumId + '_' + counterB + '" class="photoThumbLink ' + albumId + '" data-photo="' + photos.id + '" data-album="' + albumId + '" data-key="' + counterB + '" data-short="" rel="' + albumId + '" style="display: none;" ' + opts.tooltipTipAnchor + '="' + name + '" href="' + photos.images[0].source + '" target="_blank"><img src="' + photos.images[0].source + '" alt="' + name + '"></a>';
											} else {
												var html = '<a id="' + albumId + '_' + counterB + '" class="photoThumbLink ' + albumId + '" data-photo="' + photos.id + '" data-album="' + albumId + '" data-key="' + counterB + '" data-short="" rel="' + albumId + '" style="display: none;" ' + opts.tooltipTipAnchor + '="' + name + '" href="' + photos.images[0].source + '" target="_blank">Lightbox Link</a>';
											};
										};
									};
									// Create Container for Photo Thumbnails
									var photoThumbWidthSingle = opts.photoThumbWidth;
									var photoThumbHeightSingle = opts.photoThumbHeight;
									
									if (opts.prettyPhotoAllow) {
										if (opts.tooltipTipAnchor != "title") {
											if (((opts.photoShowSocialShare) && (!opts.photoThumbSocialShare)) || (!opts.photoShowSocialShare)) {
												var html = '<a id="' + albumId + '_' + counterB + '" class="photoThumb prettyPhoto ' + albumId + tooltips + lightboxClass + tooltipClass + '" data-photo="' + photos.id + '" data-album="' + albumId + '" data-key="' + counterB + '" data-short="" rel="prettyPhoto[' + albumId + ']" style="width:' + photoThumbWidthSingle + 'px; height:' + photoThumbHeightSingle + 'px; padding:' + opts.photoThumbPadding + 'px;" ' + opts.tooltipTipAnchor + '="' + name + '" title="' + name + '" href="' + photos.images[0].source + '" target="_blank">';
											} else if ((opts.photoShowSocialShare) && (opts.photoThumbSocialShare)) {
												html += '<div id="Call_' + albumId + '_' + counterB + '" class="photoThumb prettyPhoto Call_' + albumId + tooltips + lightboxClass + tooltipClass + '" data-photo="' + photos.id + '" data-album="' + albumId + '" data-key="' + counterB + '" style="width:' + photoThumbWidthSingle + 'px; height:' + photoThumbHeightSingle + 'px; padding:' + opts.photoThumbPadding + 'px;" ' + opts.tooltipTipAnchor + '="' + name + '" title="' + name + '" data-link="' + photos.images[0].source + '">';
											};
										} else {
											if (((opts.photoShowSocialShare) && (!opts.photoThumbSocialShare)) || (!opts.photoShowSocialShare)) {
												var html = '<a id="' + albumId + '_' + counterB + '" class="photoThumb prettyPhoto ' + albumId + tooltips + lightboxClass + tooltipClass + '" data-photo="' + photos.id + '" data-album="' + albumId + '" data-key="' + counterB + '" data-short="" rel="prettyPhoto[' + albumId + ']" style="width:' + photoThumbWidthSingle + 'px; height:' + photoThumbHeightSingle + 'px; padding:' + opts.photoThumbPadding + 'px;" ' + opts.tooltipTipAnchor + '="' + name + '" href="' + photos.images[0].source + '" target="_blank">';
											} else if ((opts.photoShowSocialShare) && (opts.photoThumbSocialShare)) {
												html += '<div id="Call_' + albumId + '_' + counterB + '" class="photoThumb prettyPhoto Call_' + albumId + tooltips + lightboxClass + tooltipClass + '" data-photo="' + photos.id + '" data-album="' + albumId + '" data-key="' + counterB + '" style="width:' + photoThumbWidthSingle + 'px; height:' + photoThumbHeightSingle + 'px; padding:' + opts.photoThumbPadding + 'px;" ' + opts.tooltipTipAnchor + '="' + name + '" data-link="' + photos.images[0].source + '">';
											};
										};
									} else {
										if (((opts.photoShowSocialShare) && (!opts.photoThumbSocialShare)) || (!opts.photoShowSocialShare)) {
											var html = '<a id="' + albumId + '_' + counterB + '" class="photoThumb ' + albumId + tooltips + lightboxClass + tooltipClass + '" data-photo="' + photos.id + '" data-album="' + albumId + '" data-key="' + counterB + '" data-short="" rel="' + albumId + '" style="width:' + photoThumbWidthSingle + 'px; height:' + photoThumbHeightSingle + 'px; padding:' + opts.photoThumbPadding + 'px;" ' + opts.tooltipTipAnchor + '="' + name + '" href="' + photos.images[0].source + '" target="_blank">';
										} else if ((opts.photoShowSocialShare) && (opts.photoThumbSocialShare)) {
											html += '<div id="Call_' + albumId + '_' + counterB + '" class="photoThumb Call_' + albumId + tooltips + lightboxClass + tooltipClass + '" data-photo="' + photos.id + '" data-album="' + albumId + '" data-key="' + counterB + '" rel="' + albumId + '" style="width:' + photoThumbWidthSingle + 'px; height:' + photoThumbHeightSingle + 'px; padding:' + opts.photoThumbPadding + 'px;" ' + opts.tooltipTipAnchor + '="' + name + '" data-link="' + photos.images[0].source + '">';
										};
									};

									if (opts.photoShowClearTape) {
										html += '<span id="ImageDecoration_' + photos.id + '" class="ClearTape" style="left: ' + (Math.ceil((photoThumbWidthSingle + opts.photoThumbMargin + opts.photoThumbPadding - 77) / 2)) + 'px;"></span>';
									};
									if (opts.photoShowYellowTape) {
										html += '<span id="ImageDecoration_' + photos.id + '" class="YellowTape" style="left: ' + (Math.ceil((photoThumbWidthSingle + opts.photoThumbMargin + opts.photoThumbPadding - 115) / 2)) + 'px;"></span>';
									};
									if (opts.photoShowPushPin) {
										html += '<span id="ImageDecoration_' + photos.id + '" class="PushPin" style="left: ' + (Math.ceil((photoThumbWidthSingle + opts.photoThumbMargin + opts.photoThumbPadding) / 2)) + 'px;"></span>';
									};

									html += '<span class="photoThumbWrap" style="width:' + opts.photoThumbWidth + 'px; height:' + opts.photoThumbHeight + 'px; padding: ' + opts.photoThumbPadding + 'px; left: 0px; top: 0px;">';

									if (opts.innerImageScaler) {
										var imgthumb = '' + opts.PathInternalPHP + '?src=' + (photos.source) + '&w=' + photoThumbWidthSingle + '&zc=1';
									} else if (opts.senchaImageScaler) {
										var imgthumb = 'http://src.sencha.io/' + photoThumbWidthSingle + '/' + (photos.source);
									} else if (opts.weservImageScaler) {
										var imgthumb = 'http://images.weserv.nl/?url=' + (photos.source.replace("https://", "").replace("http://", "")) + '&h' + (photoThumbHeightSingle) + '&w=' + (photoThumbWidthSingle) + '&t=fit';
									} else {
										var imgthumb = photos.source;
									};
									if (opts.imageSpinnerAnimation) {
										html += '<i class="fb-photo-spinner fb-photo-spinner-' + albumId + '" id="fb-photo-spinner-' + photos.id + '" style="width:' + photoThumbWidthSingle + 'px; height:' + photoThumbHeightSingle + 'px;  padding:' + opts.photoThumbPadding + 'px;"></i>';
									};
									if (opts.imageLazyLoad) {
										html += '<i class="fb-photo-thumb fb-photo-thumb-' + albumId + '" id="fb-photo-thumb-' + photos.id + '" style="background-size:' + photoThumbWidthSingle + 'px; width:' + photoThumbWidthSingle + 'px; height:' + photoThumbHeightSingle + 'px;" data-loaded="FALSE" data-original="' + imgthumb + '" data-album="' + albumId + '" data-photo="' + photos.id + '"></i>';
									} else {
										html += '<i class="fb-photo-thumb fb-photo-thumb-' + albumId + '" id="fb-photo-thumb-' + photos.id + '" style="background-size:' + photoThumbWidthSingle + 'px; width:' + photoThumbWidthSingle + 'px; height:' + photoThumbHeightSingle + 'px; background-image:url(' + (imgthumb) + ')" data-loaded="FALSE" data-album="' + albumId + '" data-photo="' + photos.id + '"></i>';
									};
									if ((opts.photoBoxAllow) && (!opts.photoThumbSocialShare)) {
										html += '<i class="fb-photo-image fb-photo-image-' + albumId + '" id="fb-photo-image-' + photos.id + '" style="z-index: 0; display: none;"><img src="' + imgthumb + '" alt="' + name + '"></i>';
									};

									html += '<i class="fb-photo-overlay fb-photo-overlay-' + albumId + '" id="fb-photo-overlay-' + photos.id + '" data-photo="' + photos.id + '" style="width:' + photoThumbWidthSingle + 'px; height:' + photoThumbHeightSingle + 'px;  padding:' + opts.photoThumbPadding + 'px;"><span id="fb-photo-overlay-icon-' + photos.id + '" class="fb-photo-overlay-icon"></i>';

									if (opts.photoThumbWhiteOut) {
										html += '<i class="fb-photo-blur" id="fb-photo-blur-' + photos.id + '" style="width:' + photoThumbWidthSingle + 'px; height:' + photoThumbHeightSingle + 'px; background: ' + opts.photoThumbWhiteOutColor + '; padding: ' + opts.photoThumbPadding + 'px;"></i>';
									};
									
									if ((opts.photoShowSocialShare) && (opts.photoThumbSocialShare)) {
										var PhotoSocialSaveLink 	= photos.images[0].source;
										var PhotoSocialShareLink 	= photos.link;
										PhotoSocialShareLink = PhotoSocialShareLink.replace("graph", "www").replace("/?type=1", "");
										// Check if Image ID has been added to Array in a prior Call, if not add
										if (!opts.cacheAlbumContents) {
											var params = {searchedID: photos.id, elementFound: null};
											var isCorrectImageID = function(element) {
												if (element.id == this.searchedID) {
													return (this.elementFound = element);
												} else {
													return false;
												};
											};
											var isFound = PhotoIDsArray.some(isCorrectImageID, params);
											if (!isFound) {
												PhotoIDsArray.push({id:photos.id, album:albumId, link:PhotoSocialShareLink, save:PhotoSocialSaveLink, clean:"", thumb:photos.source, summary:fixedEncodeURIComponent(nameSummary)});
											};
										} else {
											PhotoIDsArray.push({id:photos.id, album:albumId, link:PhotoSocialShareLink, save:PhotoSocialSaveLink, clean:"", thumb:photos.source, summary:fixedEncodeURIComponent(nameSummary)});
										};
										html += '<i class="fb-photo-shareme" id="fb-photo-shareme-' + photos.id + '" data-photo="' + albumId + "_" + counterB + '" style="width:' + photoThumbWidthSingle + 'px; padding: ' + opts.photoThumbPadding + 'px;">';
											html += '<ul id="ts-social-share_' + photos.id + '" data-share="' + PhotoSocialShareLink + '" data-save="' + PhotoSocialSaveLink + '" data-parent="' + albumId + '_' + counterB + '" class="ts-social-share" style="float: right; display: ' + (opts.photoShortSocialShare == true ? " none;" : "block;") + '">';
												html += '<li class="stumbleupon"><a id="PhotoSocialShare_Stumble_' + photos.id + '" class="PhotoSocialShare Share_Stumble TipSocial' + tooltipClass + '" target="_blank" href="http://www.stumbleupon.com/submit?url=' + PhotoSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Stumble Upon"><span class="social-icon icon-ts-stumbleupon"></span></a></li>';
												html += '<li class="googleplus"><a id="PhotoSocialShare_Google_' + photos.id + '" class="PhotoSocialShare Share_Google TipSocial' + tooltipClass + '" target="_blank" href="https://plus.google.com/share?url=' + PhotoSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Google Plus"><span class="social-icon icon-ts-googleplus"></span></a></li>';
												html += '<li class="twitter"><a id="PhotoSocialShare_Twitter_' + photos.id + '" class="PhotoSocialShare Share_Twitter TipSocial' + tooltipClass + '" target="_blank" href="https://twitter.com/intent/tweet?text=' + opts.SocialSharePhotoText + PhotoSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Twitter"><span class="social-icon icon-ts-twitter"></span></a></li>';
												html += '<li class="facebook"><a id="PhotoSocialShare_Facebook_' + photos.id + '" class="PhotoSocialShare Share_Facebook TipSocial' + tooltipClass + '" target="_blank" href="http://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + PhotoSocialShareLink + '&p[images][0]=' + photos.source + '&p[title]=' + opts.SocialSharePhotoText + '&p[summary]=' + nameSummary + '" ' + opts.tooltipTipAnchor + '="Share this Image on Facebook"><span class="social-icon icon-ts-facebook"></span></a></li>';
												html += '<li class="savetodisk"><a id="PhotoSocialShare_Save_' + photos.id + '" class="PhotoSocialShare Share_Save TipSocial' + tooltipClass + '" target="_blank" href="' + PhotoSocialSaveLink + '" ' + opts.tooltipTipAnchor + '="Save this Image to disk" data-original="' + photos.images[0].source + '"><span class="social-icon icon-ts-disk"></span></a></li>';
											html += '</ul>';
										html += '</i>';
									};

									html += '</span>';
									if (((opts.photoShowSocialShare) && (!opts.photoThumbSocialShare)) || (!opts.photoShowSocialShare)) {
										html += '</a>';
									} else {
										html += '</div>';
									};

									if (((opts.photoShowSocialShare) && (!opts.photoThumbSocialShare)) || (opts.photoShowNumber)) {
										html += '<div class="photoDetails' + tooltipClass + '" ' + opts.tooltipTipAnchor + '="' + photos.id + '" style="width: ' + (photoThumbWidthSingle + opts.photoThumbMargin) + 'px; margin-top: ' + (((opts.photoShowSocialShare) && (opts.photoThumbSocialShare)) ? 10 : 0) + 'px;">';
										if ((opts.photoShowSocialShare) && (!opts.photoThumbSocialShare)) {
											html += '<div id="photoShare_' + photos.id + '" class="photoShare clearFixMe" style="height: 30px; width: ' + (photoThumbWidthSingle + opts.photoThumbMargin) + 'px; ' + (!opts.photoShowNumber ? "border-bottom: none;" : "") + '">';
												if (opts.photoShowOrder) {
													html += '<span id="photoSocial_' + photos.id + '" class="photoSocial">' + opts.ImageShareMePreText + ' (#' + counterB + '):</span>';
												} else {
													html += '<span id="photoSocial_' + photos.id + '" class="photoSocial">' + opts.ImageShareMePreText + ':</span>';
												};
												var PhotoSocialSaveLink 	= photos.images[0].source;
												var PhotoSocialShareLink 	= photos.link;
												PhotoSocialShareLink = PhotoSocialShareLink.replace("graph", "www").replace("/?type=1", "");
												// Check if Image ID has been added to Array in a prior Call, if not add
												if (!opts.cacheAlbumContents) {
													var params = {searchedID: photos.id, elementFound: null};
													var isCorrectImageID = function(element) {
														if (element.id == this.searchedID) {
															return (this.elementFound = element);
														} else {
															return false;
														};
													};
													var isFound = PhotoIDsArray.some(isCorrectImageID, params);
													if (!isFound) {
														PhotoIDsArray.push({id:photos.id, album:albumId, link:PhotoSocialShareLink, save:PhotoSocialSaveLink, clean:"", thumb:photos.source, summary:fixedEncodeURIComponent(nameSummary)});
													};
												} else {
													PhotoIDsArray.push({id:photos.id, album:albumId, link:PhotoSocialShareLink, save:PhotoSocialSaveLink, clean:"", thumb:photos.source, summary:fixedEncodeURIComponent(nameSummary)});
												};
												html += '<ul id="ts-social-share_' + photos.id + '" data-share="' + PhotoSocialShareLink + '" data-save="' + PhotoSocialSaveLink + '" data-parent="' + albumId + '_' + counterB + '" class="ts-social-share" style="float: right; display: ' + (opts.photoShortSocialShare == true ? " none;" : "block;") + '">';
													html += '<li class="stumbleupon"><a id="PhotoSocialShare_Stumble_' + photos.id + '" class="PhotoSocialShare Share_Stumble TipSocial' + tooltipClass + '" target="_blank" href="http://www.stumbleupon.com/submit?url=' + PhotoSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Stumble Upon"><span class="social-icon icon-ts-stumbleupon"></span></a></li>';
													html += '<li class="googleplus"><a id="PhotoSocialShare_Google_' + photos.id + '" class="PhotoSocialShare Share_Google TipSocial' + tooltipClass + '" target="_blank" href="https://plus.google.com/share?url=' + PhotoSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Google Plus"><span class="social-icon icon-ts-googleplus"></span></a></li>';
													html += '<li class="twitter"><a id="PhotoSocialShare_Twitter_' + photos.id + '" class="PhotoSocialShare Share_Twitter TipSocial' + tooltipClass + '" target="_blank" href="https://twitter.com/intent/tweet?text=' + opts.SocialSharePhotoText + PhotoSocialShareLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Twitter"><span class="social-icon icon-ts-twitter"></span></a></li>';
													html += '<li class="facebook"><a id="PhotoSocialShare_Facebook_' + photos.id + '" class="PhotoSocialShare Share_Facebook TipSocial' + tooltipClass + '" target="_blank" href="http://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + PhotoSocialShareLink + '&p[images][0]=' + photos.source + '&p[title]=' + opts.SocialSharePhotoText + '&p[summary]=' + nameSummary + '" ' + opts.tooltipTipAnchor + '="Share this Image on Facebook"><span class="social-icon icon-ts-facebook"></span></a></li>';
													html += '<li class="savetodisk"><a id="PhotoSocialShare_Save_' + photos.id + '" class="PhotoSocialShare Share_Save TipSocial' + tooltipClass + '" target="_blank" href="' + PhotoSocialSaveLink + '" ' + opts.tooltipTipAnchor + '="Save this Image to disk" data-original="' + photos.images[0].source + '"><span class="social-icon icon-ts-disk"></span></a></li>';
												html += '</ul>';
											html += '</div>';
										};
										if (opts.photoShowNumber) {
											html += '<div class="clearFixMe" style="width: ' + photoThumbWidthSingle + 'px; display: block; height: 20px; margin-bottom: 10px;"><div class="photoNumber">' + opts.ImageNumberPreText + '</div><div class="photoInfo clearFixMe">' + photos.id + '</div></div>';
										};
										html += '</div>';
									};

									var clear = 'width: ' + (photoThumbWidthSingle + opts.photoThumbPadding * 2) + 'px; margin: ' + opts.photoThumbMargin + 'px; display: none;';
									if (((counterB <= albumCount) && (counterB <= opts.maxNumberImages)) || (opts.maxNumberImages == 0)) {
										if (typeof(photos.source)  === "undefined") {
											var fileExtension = "N/A";
										} else {
											var fileExtension = photos.source.substring(photos.source.lastIndexOf('.') + 1).toUpperCase();
										};
										var photoTime = moment(photos.created_time).fromNow().replace(/ /g,"_");
										$("<div>", {
											"class": 			"photoWrapper " + fileExtension + " " + photoTime + " Wrapper_" + albumId,
											"id": 				'fb-photo-' + photos.id,
											"data-title":		'',
											"data-cover":		'',
											"data-added":		photos.created_time,
											"data-update":		photos.updated_time,
											"data-height-s":	photoThumbHeightSingle + 2 * opts.photoThumbMargin,
											"data-height-o":	photos.height,
											"data-width-s":		photoThumbWidthSingle + 2 * opts.photoThumbMargin,
											"data-width-o":		photos.width,
											"data-number":		photos.id,
											"data-order":		counterB,
											"data-type":		fileExtension,
											"data-time":		photoTime,
											"data-ID":			photos.id,
											"data-location":	'',
											"style":			clear,
											html: 				html
										}).appendTo('#fb-album-' + albumId).show();
									};
								};
							};
						};
					});
					if ((typeof json.paging.next !== "undefined") && ((counterB < opts.maxNumberImages) || (opts.maxNumberImages == 0))) {
						setTimeout(function() {
							var photosNext = json.paging.next;
							RoundOffsetPhotos++;
							singleAlbumShow(albumCount, photosNext.replace("\u00252C", ","));
						}, opts.graphRequestTiming);
					} else {
						if (opts.outputLoaderStatus) {
							if ((opts.maxNumberImages != 0) && (opts.maxNumberImages < albumCount)) {
								LoaderStatusAnimationCircle.setValue(opts.maxNumberImages + ' / ' + opts.maxNumberImages);
							} else if ((opts.maxNumberImages != 0) && (opts.maxNumberImages > albumCount)) {
								LoaderStatusAnimationCircle.setValue(albumCount + ' / ' + albumCount);
							} else {
								LoaderStatusAnimationCircle.setValue(albumCount + ' / ' + albumCount);
							};
							LoaderStatusAnimationCircle.setProgress(100);
						};
						if (opts.consoleLogging) {
							console.log('Update: ' + counterB + ' Photo(s) for album ID "' + albumId + '" could be successfully retrieved!');
						};
						setTimeout(function() {
							if ($('#fb-album-' + albumId + ' > .photoWrapper').length == 0) {
								$('#fb-album-' + albumId).wrap('<div id="fb-album-paged-' + albumId + '" class="paginationMain" />');
								$("<div>", {
									"id": 				'no-fb-photos',
									html: 				"Sorry, there are either no public images in that album or all of the images have been exluded from being shown ... Please check your settings!"
								}).appendTo('#fb-album-' + albumId).fadeIn(500);
								// Remove Loader Animation and Show Album Content
								$("#" + opts.loaderID).hide();
								if ((opts.allowAlbumDescription) && (opts.showDescriptionStart)) {
									$('#fb-album-header').show();
								} else {
									$('#fb-album-header').hide();
								};
								if (opts.showBottomControlBar) {
									$('#fb-album-footer').show();
								};
								$("#fb-album-" + albumId).slideFade(700);
							} else {
								var $albumContainer = $('#fb-album-' + albumId);
								$("#" + opts.loaderID).hide();
								//$("#fb-album-paged" + albumId).slideFade(700);
								// Initialize Paging Feature
								equalHeightFloat(false, albumId);
								currentPageList = $albumContainer;
								setTimeout(function(){
									if (!opts.paginationLayoutPhotos) {
										if (opts.infiniteScrollPhotos) {
											if (opts.infiniteScrollPhotosSmart) {
												infinitePhotos = smartPhotosPerPage;
												var photoItemsPerPage = smartPhotosPerPage;
											} else {
												infinitePhotos = opts.infiniteScrollPhotosBlock;
												var photoItemsPerPage = opts.infiniteScrollPhotosBlock;
											};
											infinitePhotosCount = counterB;
										} else {
											var photoItemsPerPage = counterB;
										};
									} else if (opts.smartPhotosPerPageAllow) {
										var photoItemsPerPage = smartPhotosPerPage;
									} else {
										if (opts.setPhotosByPages) {
											var photoItemsPerPage = ((opts.paginationLayoutPhotos = true && opts.numberPagesForPhotos > 0) ? (Math.ceil(counterB / opts.numberPagesForPhotos)) : counterB);
										} else {
											var photoItemsPerPage = ((opts.paginationLayoutPhotos = true && opts.numberPhotosPerPage > 0) ? opts.numberPhotosPerPage : counterB);
										};
									};
									var PhotoSettings = {
										'searchBoxDefault' 		: 	opts.SearchDefaultText,
										'itemsPerPageDefault' 	: 	photoItemsPerPage,
										'hideToTop'				:	(opts.showFloatingToTopButton == true ? false : true),
										'hideFilter' 			: 	(opts.photosFilterAllow == true ? false : true),
										'hideSort' 				: 	(opts.photoSortControls == true ? false : true),
										'hideSearch' 			: 	true,
										'hidePager'				:	((opts.photosPagerControls == true && !opts.infiniteScrollPhotos) == true ? false : true)
									};
									new CallPagination($albumContainer, PhotoSettings, "fb-album-paged-" + albumId, false, false, albumId);
								}, 500);
								// Initialize LazyLoad for Thumbnails
								if ((opts.imageLazyLoad) && ($.isFunction($.fn.lazyloadanything))) {
									$('.fb-photo-thumb-' + albumId).lazyloadanything({
										'auto': 			true,
										'repeatLoad':		true,
										'onLoadingStart': 	function(e, LLobjs, indexes) {
											return true
										},
										'onLoad': 			function(e, LLobj) {
											var $img = LLobj.$element;
											var $src = $img.attr('data-original');
											var $lazy = $img.attr('data-photo');
											var $frame = $img.attr('data-album');
											if (($('#fb-album-paged-' + $frame).is(':visible')) && $('#fb-photo-' + $lazy).hasClass('Showing')) {
												if ((opts.imageSpinnerAnimation) && ($.isFunction($.fn.waitForImages))) {
													if ($("#fb-photo-thumb-" + $lazy).attr("data-loaded") == "FALSE") {
														$img.hide().css('background-image', 'url("' + $src + '")');
														$img.waitForImages({
															waitForAll: 	true,
															finished: 		function() {},
															each: 			function() {
																if ($("#fb-photo-" + $lazy).css('display') != 'none') {
																	$("#fb-photo-spinner-" + $lazy).hide();
																	$("#fb-photo-thumb-" + $lazy).fadeIn(500);
																	$("#fb-photo-thumb-" + $lazy).attr("data-loaded", "TRUE");
																};
															},
														});
													};
												} else {
													if ($("#fb-photo-thumb-" + $lazy).attr("data-loaded") == "FALSE") {
														$img.hide().css('background-image', 'url("' + $src + '")').fadeIn(500);
														$("#fb-photo-thumb-" + $lazy).attr("data-loaded", "TRUE");
													};
												};
											};
										},
										'onLoadComplete':	function(e, LLobjs, indexes) {
											return true
										}
									});
									restartLazyLoad();
								} else {
									if ((opts.imageSpinnerAnimation) && ($.isFunction($.fn.waitForImages))) {
										$('#fb-album-' + albumId + ' .fb-photo-thumb').waitForImages({
											waitForAll: true,
											finished: function() {},
											each: function() {
												var $picture 	= $(this).attr("data-photo");
												if ($("#fb-photo-thumb-" + $picture).attr("data-loaded") == "FALSE") {
													$("#fb-photo-spinner-" + $picture).hide();
													$("#fb-photo-thumb-" + $picture).hide().fadeIn(500);
													$("#fb-photo-thumb-" + $picture).attr("data-loaded", "TRUE");
												};
											},
										});
									} else {
										$('#fb-album-' + albumId + ' .fb-photo-thumb').each(function(index) {
											var $picture 	= $(this).attr("data-photo");
											if ($("#fb-photo-thumb-" + $picture).attr("data-loaded") == "FALSE") {
												$("#fb-photo-thumb-" + $picture).hide().fadeIn(500);
												$("#fb-photo-thumb-" + $picture).attr("data-loaded", "TRUE");
											};
										});
									};
								};
								// Remove Loader Animation and Show Album Content
								if (opts.singleAlbumOnly) {
									$("#" + opts.loaderID).hide();
									$("#" + opts.galleryID).show();
									if (opts.showDescriptionStart) {
										$('#fb-album-header').show();
									};
									$('#fb-album-footer').hide();
									$('#fb-album-' + albumId).show();
								} else {
									$("#" + opts.loaderID).hide();
									if (opts.showDescriptionStart) {
										$('#fb-album-header').show();
									};
									$('#fb-album-footer').show();
									$('#fb-album-' + albumId).show();
								};
							};
							shortLinkPhotoShares(albumId);
							// Adjust Height of iFrame Container (if applicable)
							AdjustIFrameDimensions();
							// Reset Counter Animations
							if (opts.outputLoaderStatus) {
								$("#" + opts.loaderCircleID).hide();
								LoaderStatusAnimationCircle.setValue('0 / 0');
								LoaderStatusAnimationCircle.setProgress(0);
								$("#" + opts.loaderSpinnerID).show();
							};
						}, 500);
					};
				},
				error: function(jqXHR, textStatus, errorThrown){
					if (opts.outputErrorMessages) {
						MessiContent = 	"Error: \njqXHR:" + jqXHR + "\ntextStatus: " + textStatus + "\nerrorThrown: "  + errorThrown;
						MessiCode = 	"anim errors";
						MessiTitle = 	"ERROR for Facebook ID: " + opts.facebookID;
						showMessiContent(MessiContent, MessiTitle, MessiCode);
					};
					if (opts.consoleLogging) {
						console.log('Error: \njqXHR:' + jqXHR + '\ntextStatus: ' + textStatus + '\nerrorThrown: '  + errorThrown);
					};
					return false;
				}
			});
		};

		// Check if alredy created Gallery or Album Preview can be restored
		function checkExisting(href) {
			if ((typeof href != 'undefined') && (href.length != 0)) {
				var anchor = href.split('-');
				scrollBarBeautifierOff();
				if (anchor[0] == '#album') {
					// Hide Album Thumbnail Gallery
					if ($('#fb-albums-all-paged').length != 0) {
						if (opts.infiniteScrollAlbums) {
							$('#' + opts.infiniteAlbumsID).unbind('inview').hide();
						};
						$('#fb-albums-all-paged').slideFade(700);
						if ((opts.floatingControlBar) && (!isInIFrame)) {
							$("#paginationControls-" + opts.facebookID).unbind('stickyScroll');
							$("#paginationControls-" + opts.facebookID).stickyScroll('reset');
						};
					};
					if (typeof ajaxRequest !== 'undefined') {
						ajaxRequest.abort();
					};
					// Check if selected album has just been viewed or not
					if (albumId != anchor[1]){
						albumId = anchor[1];
						singleAlbumInit();
					} else {
						if (opts.cacheAlbumContents) {
							//alert("Restore from 'checkExisting'");
							if (opts.infiniteScrollPhotos) {
								$('#' + opts.infiniteMoreID).hide();
							};
							$("#" + opts.loaderID).slideFade(700);
							if ($("#paginationControls-" + albumId).length != 0) {
								if ((opts.floatingControlBar) && (!isInIFrame)) {
									$("#paginationControls-" + albumId).unbind('stickyScroll');
									$("#paginationControls-" + albumId).stickyScroll('reset');
								};
							};
							$('#fb-album-header').html(headerArray[albumId]);
							if (opts.showBottomControlBar) {
								$('#fb-album-footer').html(footerArray[albumId]);
							};
							$('#Back-' + albumId + '_1').unbind("click").bind('click', function(e){
								if (opts.infiniteScrollPhotos) {
									$('#' + opts.infinitePhotosID).unbind('inview');
								};
								checkExisting($(this).attr('data-href'));
							});
							if (opts.showBottomControlBar) {
								$('#Back-' + albumId + '_2').unbind("click").bind('click', function(e){
									if (opts.infiniteScrollPhotos) {
										$('#' + opts.infinitePhotosID).unbind('inview');
									};
									checkExisting($(this).attr('data-href'));
								});
								$('#Back_To_Top-' + albumId).click(function(e){
									if (opts.autoScrollTop) {
										$('html, body').animate({scrollTop:$("#" + opts.frameID).offset().top - 20}, 'slow');
									};
								});
							};
							$('#albumCommentsShow_' + albumId).unbind("click").bind('click', function(e){
								MessiContent = 	$('#albumCommentsFull_' + commentsAlbum).html();
								MessiCode = 	"anim success";
								MessiTitle = 	"Comments for Album: " + commentsAlbum;
								showMessiContent(MessiContent, MessiTitle, MessiCode);
							});
							$('#Back-' + albumId + '_3').unbind("click").bind('click', function(e){
								if (opts.infiniteScrollPhotos) {
									$('#' + opts.infinitePhotosID).unbind('inview');
								};
								checkExisting($(this).attr('data-href'));
							});
							$('.paginationMain').hide();
							$("#" + opts.loaderID).slideFade(700);
							setTimeout(function(){
								$('#fb-album-paged-' + albumId).show();
								$('#fb-album-' + albumId).show();
								var $albumContainer = $('#fb-album-' + albumId);
								$albumContainer.isotope('reloadItems');
								$albumContainer.isotope('reLayout');
								if (opts.infiniteScrollPhotos) {
									$('.photoWrapper:visible').each(function(i, elem) {
										$(this).addClass("Showing").addClass("Infinite");
									});
									$('#' + opts.infinitePhotosID).unbind('inview');
									if (!opts.niceScrollAllow) {
										infiniteGallery($albumContainer, false, false, albumId);
									};
								};
								if ((opts.floatingControlBar) && (!isInIFrame) && ($("#paginationControls-" + albumId).length != 0)) {
									isotopeHeightContainer = $albumContainer.height();
									$("#paginationControls-" + albumId).stickyScroll({ container: $("#fb-album-paged-" + albumId) });
								};
								if (opts.autoScrollTop) {
									$('html, body').animate({scrollTop:$("#" + opts.frameID).offset().top - 20}, 'slow', function() {
										if (opts.infiniteScrollPhotos) {
											$("#" + opts.infinitePhotosID).show();
										};
									});
								} else {
									if (opts.infiniteScrollPhotos) {
										$("#" + opts.infinitePhotosID).show();
									};
								};
								shortLinkPhotoShares(albumId);
								if (opts.consoleLogging) {
									console.log('Update: All data for Album ' + albumId + ' has been restored from cache and set to visible!');
								};
							}, 700);
							scrollBarBeautifierOn(false);
						} else {
							singleAlbumInit();
						};
					};
				} else {
					if (opts.infiniteScrollPhotos) {
						$('#' + opts.infinitePhotosID).unbind('inview');
						$('#' + opts.infiniteMoreID).hide();
					};
					if (typeof ajaxRequest !== 'undefined') {
						ajaxRequest.abort();
					};
					$(".albumThumb").find(".fb-album-overlay").stop().animate({opacity: 0}, "fast");
					$(".albumThumb").find(".fb-album-shareme").stop().animate({opacity: 0}, "fast");
					$(".albumThumb").find(".fb-album-loading").stop().animate({opacity: 0}, "fast");
					$('.paginationMain').hide();
					$("#" + opts.loaderID).slideFade(700);
					if ((opts.consoleLogging) && (opts.cacheAlbumContents)) {
						console.log('Update: All data for Album ' + albumId + ' has been cached and set to temporarily hidden!');
					};
					if ($("#paginationControls-" + opts.facebookID).length != 0) {
						if ((opts.floatingControlBar) && (!isInIFrame)) {
							$("#paginationControls-" + opts.facebookID).unbind('stickyScroll');
							$("#paginationControls-" + opts.facebookID).stickyScroll('reset');
						};
					};
					galleryAlbumsInit(opts.facebookID, "");
				};
				// Adjust Height of iFrame Container (if applicable)
				AdjustIFrameDimensions();
			};
		};

		// Function for Scrollbar Beautification Feature
		function scrollBarBeautifierOn(currentPageList, Gallery, firstRun, Identifier) {
			if ((opts.niceScrollAllow) && ($.isFunction($.fn.mCustomScrollbar))) {
				$("#" + opts.galleryID).mCustomScrollbar("destroy");
				$("#" + opts.galleryID).mCustomScrollbar({
					theme:								opts.niceScrollTheme,
					mouseWheelPixels: 					(Gallery ? opts.albumThumbHeight : opts.photoThumbHeight), //"auto"
					scrollButtons: {
						enable:							true,
						scrollType: 					"continuous",
						scrollSpeed: 					"auto"
					},
					horizontalScroll:					false,
					autoDraggerLength:					true,
					advanced:{
						updateOnBrowserResize: 			true,
						updateOnContentResize: 			true
					},
					contentTouchScroll:					true,
					callbacks:{
						onScrollStart:					function(){
							// Triggered on Scroll Start Event
						},
						onScroll: 						function(){
							// Triggered on Scroll Event
							restartLazyLoad();
						},
						whileScrolling:					function(){
							// Triggered while scrolling
						},
						onTotalScroll:					function(){
							// Triggered when Scroll end-limit is reached 
							scrollBarCall_onTotalScroll(this, currentPageList, Gallery, firstRun, Identifier);
							restartLazyLoad();
						},
						onTotalScrollBack: 				function(){
							// Triggered when Scroll beginning is reached
						},
						onTotalScrollOffset:			(opts.infiniteScrollMore ? 0 : 50),
						onTotalScrollBackOffset:		50,
						
					}
				});
			};
		};
		function scrollBarBeautifierOff(args) {
			if ((opts.niceScrollAllow) && ($.isFunction($.fn.mCustomScrollbar))) {
				$("#" + opts.galleryID).mCustomScrollbar("destroy");
			};
		};
		function scrollBarBeautifierUpdate(args) {
			if ((opts.niceScrollAllow) && ($.isFunction($.fn.mCustomScrollbar))) {
				$("#" + opts.galleryID).mCustomScrollbar("update");
			};
		};
		function scrollBarCall_onScrollStart(el, Gallery) {}
		function scrollBarCall_onScroll(el, Gallery) {
			if (opts.consoleLogging) {
				console.log(mcs.top);
			};
		}
		function scrollBarCall_whileScrolling(el, Gallery){
			if (opts.consoleLogging) {
				console.log("Content inside the element with id '" + el.attr("id") + "' has scrolled " + mcs.topPct + "%");
			};
		}
		function scrollBarCall_onTotalScroll(el, currentPageList, Gallery, firstRun, Identifier) {
			if ((Gallery) && (opts.infiniteScrollAlbums)) {
				//alert("Infinite Scroll Event for Gallery");
				infiniteGalleryTrue(currentPageList, Gallery, firstRun, Identifier);
			} else if ((!Gallery) && (opts.infiniteScrollPhotos)) {
				alert("Infinite Scroll Event for Album");
			};
		}
		function scrollBarCall_onTotalScrollBack(el, Gallery) {}
		function infiniteGalleryTrue(currentPageList, Gallery, firstRun, Identifier) {
			var hiddenItemsCountView = $('.albumWrapper.isotope-hidden').length;
			if (hiddenItemsCountView != 0) {
				if (opts.infiniteScrollMore) {
					$("#" + opts.infiniteMoreID).show();
				};
				var nextItemsCount = 0;
				var totalItemsCount = $('.albumWrapper').length;
				var hiddenItemsCount = $('.albumWrapper.isotope-hidden').length;
				if (hiddenItemsCount != 0) {
					$("#" + opts.infiniteLoadID).show();
					$('.albumWrapper.isotope-hidden').each(function(i, elem) {
						if ($(this).is(":hidden") == true) {
							nextItemsCount++;
							if (nextItemsCount <= infiniteAlbums) {
								$(this).addClass("Showing").addClass("Infinite").show();
							};
						};
					});
					isotopeGallery(currentPageList, Gallery, false, Identifier);
					var visibleItemsCount = $('.albumWrapper.Showing.Infinite').length;
					$("#thumbnailStage-" + Identifier + " .thumbnailStageB").html(visibleItemsCount);
					if (visibleItemsCount == totalItemsCount) {
						if (opts.infiniteScrollMore) {
							$("#" + opts.infiniteMoreID).hide();
						};
					} else {
						if (opts.infiniteScrollMore) {
							$("#" + opts.infiniteMoreID).show();
						};
					};
				} else {
					if (opts.infiniteScrollMore) {
						$("#" + opts.infiniteMoreID).hide();
					};
				};
			} else {
				if (opts.infiniteScrollMore) {
					$("#" + opts.infiniteMoreID).hide();
				};
			};
		};
		function infiniteGalleryFalse(currentPageList, Gallery, firstRun, Identifier) {};

		// Function to Update Circle Progressbar
		function updateProgress(progress, itemCount, totalCount) {
			LoaderStatusAnimationCircle.setValue(itemCount + ' / ' + totalCount);
			LoaderStatusAnimationCircle.setProgress(progress / 100);
		};

		// Function to Check if Key Node exists in JSON Feed
		function returnIfExist(property) {
			try {
				return property;
			} catch (err) {
				return null;
			};
		};
		
		// Function to auto generate Thumbnail Sizes within given Limits
		function randomFromInterval(from, to) {
			return Math.floor(Math.random()*(to - from + 1) + from);
		};

		// Function to Clean HTML Strings
		function htmlEntities(str) {
			return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		};

		// Ensure that all Thumbnails have the same Height
		function equalHeightFloat(Gallery, Identity){
			var heightArray 	= new Array();
			var widthArray 		= new Array();
			if (opts.albumNameShorten && Gallery) {
				if ((opts.albumNameTitle) && (!opts.albumNameAbove) && (!opts.albumThumbWall)) 	{$('.albumName').shorten({tail: '&nbsp;&nbsp;...'})};
				if ((opts.albumNameTitle) && (opts.albumNameAbove)) 	{$('.albumNameHead').shorten({tail: '&nbsp;&nbsp;...'})};
				if ((opts.albumNameTitle) && (opts.albumNameThumb)) 	{$('.fb-album-title').shorten({tail: '&nbsp;&nbsp;...'})};
			};
			if (Gallery) {
				$("#fb-albums-all .albumWrapper").each( function(){
					heightArray.push((opts.albumThumbWall ? 2 * opts.albumWrapperMargin : 0) + (!opts.albumThumbWall ? $(this).find(".albumHead").outerHeight(true) : 0) + $(this).find(".albumThumb").outerHeight(true) + (!opts.albumThumbWall ? $(this).find(".albumDetails").outerHeight(true) : 0));
					widthArray.push($(this).outerWidth(true));
				});
			} else {
				$("#fb-album-" + Identity + " .photoWrapper").each( function(){
					//heightArray.push(2 * opts.photoThumbMargin + $(this).outerHeight(true) + $(this).find(".photoThumb").outerHeight(true) + $(this).find(".photoDetails").outerHeight(true) + $(this).find(".photoShare").outerHeight(true));
					heightArray.push(2 * opts.photoThumbMargin + $(this).find(".photoThumb").outerHeight(true) + $(this).find(".photoDetails").outerHeight(true) + $(this).find(".photoShare").outerHeight(true));
					widthArray.push($(this).outerWidth(true));
				});
			};
			var maxHeight = Math.max.apply(Math, heightArray);
			var maxWidth = Math.max.apply(Math, widthArray);
			totalItems = 0;
			if (Gallery) {
				AlbumThumbHeight = maxHeight;
				AlbumThumbWidth = maxWidth;
				if (opts.niceScrollAllow) {
					//smartAlbumsPerPage = Math.floor(galleryWidth / maxWidth) * (Math.floor(opts.niceScrollHeight / maxHeight));
					smartAlbumsPerPage = Math.floor(galleryWidth / maxWidth) * (Math.floor(viewPortHeight / maxHeight));
				} else {
					smartAlbumsPerPage = Math.floor(galleryWidth / maxWidth) * (Math.floor(viewPortHeight / maxHeight));
				};
				$("#fb-albums-all .albumWrapper").each( function(){$(this).height(maxHeight + "px"); totalItems++});
			} else {
				PhotoThumbHeight = maxHeight;
				PhotoThumbWidth = maxWidth;
				smartPhotosPerPage = Math.floor(galleryWidth / maxWidth) * ((Math.floor(viewPortHeight / maxHeight) - ((opts.showTopPaginationBar == true && opts.allowAlbumDescription == true) ? 1 : 0)));
				$("#fb-album-" + Identity + " .photoWrapper").each( function(){$(this).height(PhotoThumbHeight + "px"); totalItems++});
			};
		};
		
		// Determine Width for Scrollbar based on Browser Settings
		function scrollBarWidth() {
			var parent, child, width;
			if (width === undefined) {
				parent = $('<div style="width:50px; height:50px; overflow:auto; position:absolute; top:-200px; left:-200px;"><div/>').appendTo('body');
				child = parent.children();
				width = child.innerWidth() - child.height(99).innerWidth();
				parent.remove();
			};
			return width;
		};

		// Remove Album Data from DOM
		function removeAlbumDOM(albumId) {
			if (($('#fb-album-paged-' + albumId).length != 0) || ($('#fb-album-' + albumId).length != 0)) {
				var $albumContainer = $('#fb-album-' + albumId);
				$albumContainer.isotope('destroy');
				$('#Back-' + albumId + '_1').unbind("click");
				if (opts.showBottomControlBar) {
					$('#Back-' + albumId + '_2').unbind("click");
				};
				$('#albumCommentsShow_' + albumId).unbind("click");
				$('#Back-' + albumId + '_3').unbind("click");
				if (opts.showFloatingToTopButton) {
					$('#Scroll_To_Top-' + albumId).unbind("click");
				};
				if ((opts.floatingControlBar) && (!isInIFrame)) {
					$("#paginationControls-" + albumId).unbind('stickyScroll');
					$("#paginationControls-" + albumId).stickyScroll('reset');
				};
				if ((opts.photoBoxAllow) && ($.isFunction($.fn.photobox))) {
					if (!isInIFrame) {
						if ($("#pbOverlay").attr("data-album") == albumId) {
							$("#pbOverlay").attr("data-album", "").attr("data-photo", "");
							$('#fb-album-' + albumId).data('_photobox').destroy();
						};
					} else {
						if (parent.$("#FaceBookGalleryPhotoBox").length != 0) {
							parent.$("#pbOverlay").attr("data-album", "").attr("data-photo", "");
							parent.$('#FaceBookGalleryPhotoBox').data('_photobox').destroy();
							parent.$("#FaceBookGalleryPhotoBox").remove();
						};
					};
					if (opts.consoleLogging) {
						console.log('Update: PhotoBox Lightbox for Album ' + albumId + ' has been removed from DOM!');
					};
				};
				if (typeof ajaxRequest !== 'undefined') {
					ajaxRequest.abort();
				};
				$('#fb-album-' + albumId).remove();
				$('#fb-album-paged-' + albumId).remove();
				if (opts.consoleLogging) {
					console.log('Update: All Data for Album ' + albumId + ' has been removed from DOM!');
				};
			};
		};

		// Messi Message Overlays
		function showMessiContent(MessiContent, MessiTitle, MessiCode, MessiWidth) {
			var currentWindowHeight = jQuery(window).height() * 0.75 + "px";
			if (MessiWidth == "") {MessiWidth = "600px";};
			new Messi(MessiContent, {
				title:              MessiTitle,
				titleClass: 		MessiCode,
				buttons:            [{id: 0, label: 'Close', val: 'X'}],
				modal: 				true,
				modalOpacity:		0.70,
				width:				MessiWidth,
				maxheight:			currentWindowHeight,
				viewport: 			{top: '50%', left: '50%'}
			});
		};
		
		// Initialize Pagination of Thumbnails
		function CallPagination(currentPageList, options, ID, Gallery, firstRun, Identifier, totalItems){
			var thisFileList 				= this;
			this.timeClassArray 			= new Array();
			TotalThumbs 					= 0;
			TotalPages 						= 0;
			TotalTypes 						= 0;
			TotalTimes						= 0;
			this.settings = {
				'searchBoxDefault' 		: 	"Search ...",
				'itemsPerPageDefault' 	: 	6,
				'hideToTop'				:	false,
				'hideFilter' 			: 	false,
				'hideSort' 				: 	false,
				'hideSearch' 			: 	false,
				'hidePager'				:	false
			};
			if ( options ) {
				$.extend( this.settings, options );
			};
			$('.' + (Gallery == true ? 'albumWrapper' : 'photoWrapper'), currentPageList).each(function(){
				var linkItem = $(this);
				var fileTime = linkItem.attr('data-time');
				var fileUTC = linkItem.attr('data-UTC');
				var added = false;
				TotalThumbs = TotalThumbs + 1;
				$.map(thisFileList.timeClassArray, function(elementOfArray, indexInArray) {
					if (thisFileList.timeClassArray[indexInArray].Time == fileTime) {
						added = true;
						//return false;
					};
				});
				if (!added) {
					TotalTimes = TotalTimes + 1;
					thisFileList.timeClassArray.push({
						Time: fileTime,
						UTC: fileUTC
					});
				};
				linkItem.addClass('paginationItem');
			});
			thisFileList.timeClassArray.sort(sortFilters('UTC'));

			currentPageList.wrap('<div id="' + ID + '" class="paginationMain" />');
			currentPageList.addClass('paginationFrame');
			this.hideToTopDef 				= this.settings.hideToTop;
			this.hideFilterDef 				= this.settings.hideFilter;
			this.hideSearchDef 				= this.settings.hideSearch;
			this.hideSortDef 				= this.settings.hideSort;
			this.hidePagerDef 				= this.settings.hidePager;
			this.PerPageItems 				= this.settings.itemsPerPageDefault;
			this.SearchBox 					= this.settings.searchBoxDefault;

			if ((opts.floatingControlBar == false) && (Gallery == true)) {
				var CSSAdjust = "padding-bottom: 0px;"
			} else if ((opts.floatingControlBar == false) || (Gallery == false)) {
				var CSSAdjust = "padding-bottom: 5px;"
			} else {
				var CSSAdjust = "";
			};

			this.paginationControls 		= $('<div id="paginationControls-' + Identifier +'" class="paginationControls' + ((opts.floatingControlBar == true && !isInIFrame) ? " Floater" : "") + '" style="' + CSSAdjust + '"></div>');
			this.paginationControls.append((this.hideToTopDef === false ? '<a id="Scroll_To_Top-' + Identifier +'" class="Scroll_To_Top float_right defaultPaginationStyle btn TipGeneric' + tooltipClass + '" style="display:none" ' + opts.tooltipTipAnchor + '="Click here to go back to the top of the Facebook gallery."><div id="To_Top-' + Identifier +'" class="To_Top"></div></a>' : ''));
			this.paginationControls.append((((Gallery === false) && (opts.allowAlbumDescription)) ? '<a id="Toggle_Info_Main-' + Identifier +'" class="Toggle_Info_Main TipGeneric ' + ((opts.showDescriptionStart) ? "Toggle_Info_On" : "Toggle_Info_Off") + ' float_right defaultPaginationStyle btn' + tooltipClass + '" ' + opts.tooltipTipAnchor + '="Click here to toggle the Album Description." href="#"><div id="Toggle_Info-' + Identifier +'" class="Toggle_Info"></div></a>' : ''));
			this.paginationControls.append((this.hideSortDef === false ? '<a href="#" id="showSortingBtn-' + Identifier +'" class="showSortingBtn float_right defaultPaginationStyle btn"><div class="AdjustSort">' + (Gallery == true ? opts.SortButtonTextAlbums : opts.SortButtonTextPhotos) + '</div></a>' : ''));
			this.paginationControls.append((((this.hideFilterDef === false) && (TotalTimes > 1)) ? '<a href="#" id="showFilterBtn-' + Identifier +'" class="showFilterBtn float_right defaultPaginationStyle btn"><div class="AdjustType">' + (Gallery == true ? opts.FilterButtonTextAlbums : opts.FilterButtonTextPhotos) + '</div></a>' : ''));
			this.paginationControls.append((this.hidePagerDef === false ? '<a href="#" id="showPagerBtn-' + Identifier +'" class="showPagerBtn float_right defaultPaginationStyle btn"><div class="AdjustPage">' + opts.PagesButtonText + '</div></a>' : ''));
			this.paginationControls.append((this.hideSearchDef === false ? '<div id="paginationSearch-' + Identifier +'" class="paginationSearch"><label style="display:none;">Search</label><input type="text" value="' + this.settings.searchBoxDefault + '" class="paginationSearchValue"><a class="paginationSearchGo btn defaultPaginationStyle"><div class="AdjustSearch">' + (Gallery == true ? opts.SearchButtonTextAlbums : opts.SearchButtonTextPhotos) + '</div></a><a class="clearSearch btn defaultPaginationStyle hidden"><div class="AdjustClear">Clear</div></a></div>' : '<div class="paginationSearch" style="height: 20px;"></div>'));
			this.paginationControls.append((((Gallery === false) && (!opts.singleAlbumOnly)) ? '<div id="Back-' + Identifier + '_3" class="BackButton fblink clearFixMe" style="margin-top: 10px; ' +  (((opts.showFloatingReturnButton == false) && (opts.showDescriptionStart == true)) ? "display: none;" : "") + '" data-href="#">' + opts.AlbumBackButtonText + '</div>' : ""));
			this.paginationControls.append(((opts.showThumbInfoInPageBar == true && (Gallery == true && opts.paginationLayoutAlbums == false) || (Gallery == false && opts.paginationLayoutPhotos == false)) ? '<span id="thumbnailStage-' + Identifier +'" class="thumbnailStage" style="' + (Gallery == false ? "margin: -25px 0px 0px 0px" : "") + '"> (' + opts.PaginationShowingText + ' ' + (Gallery == true ? opts.PaginationAlbumsText : opts.PaginationPhotosText) + ' <span class="thumbnailStageA"></span> ' + opts.PaginationItemsToText + ' <span class="thumbnailStageB"></span> ' + opts.PaginationOutOfTotalText + ' <span class="thumbnailStageC"></span>)</span>' : ''));
			
			// Create and Define Filter List
			var filterList = '<div id="paginationFilters-' + Identifier +'" class="paginationFilters"><ul id="Filter-Selections-' + Identifier +'" class="Selections unstyled">';
			if ((Gallery == true && opts.albumsFilterAllEnabled == true) || (!Gallery == true && opts.photosFilterAllEnabled == true)) {
				var enableAllFilters = true;
			} else {
				var enableAllFilters = false;
			};
			for(var i = 0; i < thisFileList.timeClassArray.length; i++){
				if (thisFileList.timeClassArray[i].Time != "") {
					filterList += '<li data-UTC="' + thisFileList.timeClassArray[i].UTC + '"><a href="" data-filter-type="' + thisFileList.timeClassArray[i].Time + '" class="'+ thisFileList.timeClassArray[i].Time +'Filter ' +  thisFileList.timeClassArray[i].Time + ' ' + (enableAllFilters == true ? "showing" : "")  + ' FilterA">' + thisFileList.timeClassArray[i].Time.replace(/_/g, ' ') + '</a></li>';
				};
			};
			filterList += '</ul><p class="bar"><a href="#" class="Closer">Close</a></p></div>';
			this.paginationControls.append((((this.hideFilterDef === false) && ((TotalTypes > 1) || (TotalTimes > 1))) ? filterList : ''));

			// Create and Define Paging List
			TotalPages = Math.ceil(TotalThumbs / this.PerPageItems);
			if (this.hidePagerDef === false) {
				this.paginationContainer = $('<div id="paginationPagers-' + Identifier +'" class="paginationPagers"></div>');
				this.paginationControls.append(this.paginationContainer);
				this.paginationListing = $('<ul id="Pager-Selections-' + Identifier +'" class="Selections unstyled"></ul>');
				this.paginationContainer.append(this.paginationListing);
				for (var i = 1; i < TotalPages+1; i++){
					this.paginationListing.append('<li><a id="Page_' + i + '_' + Identifier + '" class="" href="" data-filter-type="Page ' + i + '">' + i +'</a></li>');
				};
				this.paginationContainer.append('<p class="bar"><a href="#" class="Closer">Close</a></p>');
			};

			// Create and Define Sorting List
			if (Gallery) {
				var initialSort = (opts.defaultSortDirectionASC == true ? "asc" : "dec");
				if (defaultSortTypeAlbums == 'albumTitle') {SortByName = initialSort} else {SortByName = ""};
				if (defaultSortTypeAlbums == 'numberItems') {SortBySize = initialSort} else {SortBySize = ""};
				if (defaultSortTypeAlbums == 'createDate') {SortByCreated = initialSort} else {SortByCreated = ""};
				if (defaultSortTypeAlbums == 'updateDate') {SortByUpdated = initialSort} else {SortByUpdated = ""};
				if (defaultSortTypeAlbums == 'orderFacebook') {SortByOrder = initialSort} else {SortByOrder = ""};
				if (defaultSortTypeAlbums == 'FacebookID') {SortByID = initialSort} else {SortByID = ""};
				if (opts.showSelectionOnly) {
					if (defaultSortTypeAlbums == 'orderPreSet') {SortByPreSet = initialSort} else {SortByPreSet = ""};
				};
			} else {
				var initialSort = (opts.defaultPhotoDirectionsASC == true ? "asc" : "dec");
				if (defaultSortTypePhotos == 'addedDate') {SortByAdded = initialSort} else {SortByAdded = ""};
				if (defaultSortTypePhotos == 'updateDate') {SortByUpdated = initialSort} else {SortByUpdated = ""};
				if (defaultSortTypePhotos == 'orderFacebook') {SortByOrder = initialSort} else {SortByOrder = ""};
				if (defaultSortTypePhotos == 'FacebookID') {SortByID = initialSort} else {SortByID = ""};
			};

			if (this.hideSortDef === false) {
				this.paginationSorting = $('<div id="paginationSorting-' + Identifier +'" class="paginationSorting" style="height: auto; ' + (this.hideFilterDef === true ? 'right: 0;' : '') + '">');
				this.paginationCriteria = $('<ul id="Sort-Selections-' + Identifier +'" class="Selections unstyled"></ul>');
				this.paginationCriteria.append(((TotalThumbs > 1 && Gallery && opts.albumAllowSortName) ? '<li><a id="SortByName" class="' + SortByName + '" href="" data-sort-type="bytitle" data-sort-direction="' + SortByName + '">' + opts.SortNameText + '</a></li>' : ''));
				this.paginationCriteria.append(((TotalThumbs > 1 && Gallery && opts.albumAllowSortItems) ? '<li><a id="SortBySize" class="' + SortBySize + '" href="" data-sort-type="bysize" data-sort-direction="' + SortBySize + '">' + opts.SortItemsText + '</a></li>' : ''));
				this.paginationCriteria.append(((TotalThumbs > 1 && Gallery && opts.albumAllowSortCreated) ? '<li><a id="SortByCreated" class="' + SortByCreated + '" href="" data-sort-type="bycreate" data-sort-direction="' + SortByCreated + '">' + opts.SortCreatedText + '</a></li>' : ''));
				this.paginationCriteria.append(((TotalThumbs > 1 && !Gallery && opts.photoAllowSortAdded) ? '<li><a id="SortByAdded" class="' + SortByAdded + '" href="" data-sort-type="byadded" data-sort-direction="' + SortByAdded + '">' + opts.SortAddedText + '</a></li>' : ''));
				this.paginationCriteria.append(((TotalThumbs > 1 && ((Gallery && opts.albumAllowSortUpdate) || (!Gallery && opts.photoAllowSortUpdate))) ? '<li><a id="SortByUpdated" class="' + SortByUpdated + '" href="" data-sort-type="byupdate" data-sort-direction="' + SortByUpdated + '">' + opts.SortUpdatedText + '</a></li>' : ''));
				this.paginationCriteria.append(((TotalThumbs > 1 && ((Gallery && opts.albumAllowSortID) || (!Gallery && opts.photoAllowSortID))) ? '<li><a id="SortByID" class="' + SortByID + '" href="" data-sort-type="byID" data-sort-direction="' + SortByID + '">' + opts.SortIDText + '</a></li>' : ''));
				this.paginationCriteria.append(((TotalThumbs > 1 && ((Gallery && opts.albumAllowSortFacebook) || (!Gallery && opts.photoAllowSortFacebook))) ? '<li><a id="SortByOrder" class="' + SortByOrder + '" href="" data-sort-type="byorder" data-sort-direction="' + SortByOrder + '">' + opts.SortFacebookText + '</a></li>' : ''));
				if (opts.showSelectionOnly) {
					this.paginationCriteria.append(((TotalThumbs > 1 && Gallery && opts.albumAllowSortPreSet) ? '<li><a id="SortByPreSet" class="' + SortByPreSet + '" href="" data-sort-type="bypreset" data-sort-direction="' + SortByPreSet + '">' + opts.SortPreSetText + '</a></li>' : ''));
				};
				this.paginationSorting.append(this.paginationCriteria);
				this.paginationSorting.append('<p class="bar"><a href="#" class="Closer">Close</a></p>');
				this.paginationControls.append(this.paginationSorting);
			};

			currentPageList.before('<div id="paginationBar-top-' + Identifier +'" class="paginationBar"></div>');
			if (opts.showTopPaginationBar) {
				if (((Gallery) && (!opts.infiniteScrollAlbums)) || ((!Gallery) && (!opts.infiniteScrollPhotos))) {
					$("#paginationBar-top-" + Identifier, $("#" + ID)).append('<div id="paginationButtonsTop-' + Identifier +'" class="paginationButtons ControlsTop" style="' + (opts.floatingControlBar == false ? "padding-top: 15px;" : "") + '">'
						+ '<a href="#" class="pfl_first btn defaultPaginationStyle"><div id="FirstPage"></div></a>'
						+ '<a href="#" class="pfl_prev btn disabled defaultPaginationStyle"><div id="PrevPage"></div></a>'
						+ '<a href="#" class="pfl_last btn defaultPaginationStyle"><div id="LastPage"></div></a>'
						+ '<a href="#" class="pfl_next btn defaultPaginationStyle"><div id="NextPage"></div></a>'
						+ '<div class="defaultPaginationInfo"><span class="pagingInfo" style="' + (opts.showThumbInfoInPageBar == false ? "margin-top: 5px;" : "") + '">' + opts.PaginationPageText + ' <span class="currentPage"></span> ' + opts.PaginationPageOfText + ' <span class="totalPages"></span></span>'
						+ (opts.showThumbInfoInPageBar == true ? '<span class="thumbnailStage"> (' + opts.PaginationShowingText + ' ' + (Gallery == true ? opts.PaginationAlbumsText : opts.PaginationPhotosText) + ' <span class="thumbnailStageA"></span> ' + opts.PaginationItemsToText + ' <span class="thumbnailStageB"></span> ' + opts.PaginationOutOfTotalText + ' <span class="thumbnailStageC"></span>)</span>' : '')
						+ '</div></div>');
				};
			};

			if (((Gallery == true) && (albumsShowControlBar)) || (Gallery == false)){
				$(".paginationBar", $("#" + ID)).append(this.paginationControls);
			};
			$(".paginationBar", $("#" + ID)).append('<div style="display:none" class="paginationMessage"><div id="ErrorMessage"></div><a class="btn defaultPaginationStyle" href="#">Show All Albums</a></div>');
			$(".paginationBar", $("#" + ID)).append('<div style="display:none" class="paginationEmpty"><span></span></div>');

			currentPageList.after('<div id="paginationBar-bottom-' + Identifier +'" class="paginationBar"></div>');
			if (opts.showBottomPaginationBar) {
				if (((Gallery) && (!opts.infiniteScrollAlbums)) || ((!Gallery) && (!opts.infiniteScrollPhotos))) {
					$("#paginationBar-bottom-" + Identifier, $("#" + ID)).append('<div id="paginationButtonsBottom-' + Identifier +'" class="paginationButtons ControlsBottom" style="' + (opts.floatingControlBar == false ? "padding-top: 15px;" : "") + '">'
						+ '<a href="#" class="pfl_first btn defaultPaginationStyle"><div id="FirstPage"></div></a>'
						+ '<a href="#" class="pfl_prev btn disabled defaultPaginationStyle"><div id="PrevPage"></div></a>'
						+ '<a href="#" class="pfl_last btn defaultPaginationStyle"><div id="LastPage"></div></a>'
						+ '<a href="#" class="pfl_next btn defaultPaginationStyle"><div id="NextPage"></div></a>'
						+ '<div class="defaultPaginationInfo"><span class="pagingInfo" style="' + (opts.showThumbInfoInPageBar == false ? "margin-top: 5px;" : "") + '">' + opts.PaginationPageText + ' <span class="currentPage"></span> ' + opts.PaginationPageOfText + ' <span class="totalPages"></span></span>'
						+ (opts.showThumbInfoInPageBar == true ? '<span class="thumbnailStage"> (' + opts.PaginationShowingText + ' ' + (Gallery == true ? opts.PaginationAlbumsText : opts.PaginationPhotosText) + ' <span class="thumbnailStageA"></span> ' + opts.PaginationItemsToText + ' <span class="thumbnailStageB"></span> ' + opts.PaginationOutOfTotalText + ' <span class="thumbnailStageC"></span>)</span>' : '')
						+ '</div></div>');
				};
			};

			// Assign and Define Variables
			this.allThumbsContainer = 		$("#" + ID);
			this.messageBox = 				$('.paginationMessage', this.allThumbsContainer);
			this.messageText = 				$('span', this.messageBox);
			this.emptyThumbsBox = 			$('.paginationEmpty', this.allThumbsContainer);
			this.emptyThumbsText = 			$('span', this.emptyThumbsBox);
			this.filteredThumbs = 			$('.paginationItem', this.allThumbsContainer);
			this.allThumbs = 				$('.paginationItem', this.allThumbsContainer);
			this.fileContainer = 			$('.paginationFrame', this.allThumbsContainer);
			this.firstButton = 				$('.pfl_first', this.allThumbsContainer);
			this.lastButton = 				$('.pfl_last', this.allThumbsContainer);
			this.nextButton = 				$('.pfl_next', this.allThumbsContainer);
			this.prevButton = 				$('.pfl_prev', this.allThumbsContainer);
			this.pageAt = 					currentPageList.data('itemsperpage') !== undefined ? currentPageList.data('itemsperpage') : this.settings.itemsPerPageDefault;
			this.paginationContainer = 		$('.paginationButtons', this.allThumbsContainer);
			this.currentPageCounter = 		$('.currentPage', this.allThumbsContainer);
			this.totalPageCounter = 		$('.totalPages', this.allThumbsContainer);
			this.searchAndFilterContainer = this.paginationControls;
			this.showPagerBtn = 			$('.showPagerBtn', this.allThumbsContainer);
			this.pagerLinksContainer = 		$('.paginationPagers',this.allThumbsContainer);
			this.pagerLinks = 				$('li a', this.pagerLinksContainer);
			this.showFilterBtn = 			$('.showFilterBtn', this.allThumbsContainer);
			this.filterLinksContainer = 	$('.paginationFilters', this.allThumbsContainer);
			this.filterLinks = 				$('li a', this.filterLinksContainer);
			this.showSortingBtn = 			$('.showSortingBtn', this.allThumbsContainer);
			this.sortingLinksContainer = 	$('.paginationSorting', this.allThumbsContainer);
			this.sortingLinks = 			$('.paginationSorting li a', this.allThumbsContainer);
			this.searchBoxContainer = 		$('.paginationSearch', this.allThumbsContainer);
			this.searchBox = 				$('.paginationSearchValue', this.searchBoxContainer);
			this.searchButton = 			$('.paginationSearchGo', this.searchBoxContainer);
			this.clearSearchButton = 		$('.clearSearch', this.searchBoxContainer);
			this.currentPage = 				0;
			this.totalFiles = 				this.filteredThumbs.length;
			if (((Gallery) && (opts.infiniteScrollAlbums)) || ((!Gallery) && (opts.infiniteScrollPhotos))) {
				this.totalPages =			1;
			} else {
				this.totalPages = 			(Math.ceil(this.totalFiles / this.pageAt));
			};
			this.itemsLastPage = 			this.totalFiles - ((this.totalPages - 1) * this.PerPageItems);

			// Scroll To Top Click
			$('#Scroll_To_Top-' + Identifier).click(function(e){
				$('html, body').animate({scrollTop:$("#" + opts.frameID).offset().top - 20}, 'slow');
			});
			// Info Panel Toggle Button Click
			$('#Back-' + Identifier + '_3').unbind("click").bind('click', function(e){
				checkExisting($(this).attr('data-href'));
			});
			$('#Toggle_Info_Main-' + Identifier).click(function(e){
				$('#fb-album-header').slideFade();
				if ($(this).hasClass('Toggle_Info_On')) {
					$(this).addClass('Toggle_Info_Off');
					$(this).removeClass('Toggle_Info_On');
					if ((!opts.showFloatingReturnButton)) {$('#Back-' + Identifier + '_3').show();}
				} else {
					$(this).addClass('Toggle_Info_On');
					$(this).removeClass('Toggle_Info_Off');
					if ((!opts.showFloatingReturnButton)) {$('#Back-' + Identifier + '_3').hide();}
				};
				if (isInIFrame && iFrameDetection) {
					AdjustIFrameDimensions();
				};
			});
			// Paging Click Events
			if(this.pageAt < this.totalFiles){
				this.nextButton.click(function(event) {
					event.preventDefault();
					if($(this).hasClass('disabled')){return false;};
					//currentPageList.isotope('destroy');
					thisFileList.currentPage++;
					showHidePages(thisFileList, Gallery, Identifier, currentPageList);
					isotopeGallery(currentPageList, Gallery, false, Identifier);
					scrollBarBeautifierOn(currentPageList, Gallery, false, Identifier);
					return false;
				});
				this.prevButton.click(function(event) {
					event.preventDefault();
					if($(this).hasClass('disabled')){return false;};
					//currentPageList.isotope('destroy');
					thisFileList.currentPage--;
					showHidePages(thisFileList, Gallery, Identifier, currentPageList);
					isotopeGallery(currentPageList, Gallery, false, Identifier);
					scrollBarBeautifierOn(currentPageList, Gallery, false, Identifier);
					return false;
				});
				this.firstButton.click(function(event) {
					event.preventDefault();
					if($(this).hasClass('disabled')){return false;};
					//currentPageList.isotope('destroy');
					thisFileList.currentPage = 0;
					showHidePages(thisFileList, Gallery, Identifier, currentPageList);
					isotopeGallery(currentPageList, Gallery, false, Identifier);
					scrollBarBeautifierOn(currentPageList, Gallery, false, Identifier);
					return false;
				});
				this.lastButton.click(function(event) {
					event.preventDefault();
					if($(this).hasClass('disabled')){return false;};
					//currentPageList.isotope('destroy');
					thisFileList.currentPage = thisFileList.totalPages - 1;
					showHidePages(thisFileList, Gallery, Identifier, currentPageList);
					isotopeGallery(currentPageList, Gallery, false, Identifier);
					scrollBarBeautifierOn(currentPageList, Gallery, false, Identifier);
					return false;
				});
			};
			$('.paginationPagers li a').click(function(event){
				event.preventDefault();
				//currentPageList.isotope('destroy');
				thisFileList.currentPage = $(this).text() - 1;
				showHidePages(thisFileList, Gallery, Identifier, currentPageList);
				thisFileList.pagerLinksContainer.toggle();
				isotopeGallery(currentPageList, Gallery, false, Identifier);
				scrollBarBeautifierOn(currentPageList, Gallery, false, Identifier);
				return false;
			});
			// Filter Click Events
			this.showFilterBtn.click(function(event){
				event.preventDefault();
				$('#paginationFilters-' + Identifier, this.allThumbsContainer).css("height", "auto").css("left", $('#showFilterBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
				thisFileList.sortingLinksContainer.hide();
				thisFileList.pagerLinksContainer.hide();
				thisFileList.filterLinksContainer.show();
				return false;
			});
			$('.Closer', this.filterLinksContainer).click(function(event){
				event.preventDefault();
				thisFileList.sortingLinksContainer.hide();
				thisFileList.pagerLinksContainer.hide();
				thisFileList.filterLinksContainer.hide();
				return false;
			});
			this.filterLinks.click(function(event){
				event.preventDefault();
				//currentPageList.isotope('destroy');
				if ((Gallery) && (opts.infiniteScrollAlbums)) {
					if ($('.albumWrapper.Showing.Infinite').length > infiniteAlbumsShow) {
						infiniteAlbumsShow = $('.albumWrapper.Showing.Infinite').length;
					};
				} else if ((!Gallery) && (opts.infiniteScrollPhotos)) {
					if ($('.photoWrapper.Showing.Infinite').length > infinitePhotosShow) {
						infinitePhotosShow = $('.photoWrapper.Showing.Infinite').length;
					};
				};
				$(this).toggleClass('showing');
				var typeToShowA = $('.paginationFilters a.showing', thisFileList.allThumbsContainer);
				var typesString = "";
				if (typeToShowA.length > 0){
					thisFileList.fileContainer.show();
					$.each(typeToShowA, function(){
						typesString += "." + $(this).data('filter-type') + ',';
					});
					thisFileList.filteredThumbs.remove();
					thisFileList.filteredThumbs = thisFileList.allThumbs.filter(typesString.slice(0,-1));
					if(thisFileList.filteredThumbs.length === 0){
						showHideMessage("Sorry, no images of selected type(s) could be found.", thisFileList, Gallery, Identifier, currentPageList);
					} else {
						thisFileList.fileContainer.append(thisFileList.filteredThumbs);
						sortGallery(SortingOrder, SortingType, thisFileList, Gallery);
						thisFileList.currentPage = 0;
						resetPaging(thisFileList);
						showHidePages(thisFileList, Gallery, Identifier, currentPageList);
						showHideMessage("", thisFileList, Gallery, Identifier, currentPageList);
					};
					$(".Selections").css("max-height", 300);
				} else {
					if (((Gallery) && (!opts.albumsFilterAllEnabled)) || ((!Gallery) && (!opts.photosFilterAllEnabled))) {
						thisFileList.filteredThumbs.remove();
						thisFileList.filteredThumbs = thisFileList.allThumbs;
						thisFileList.fileContainer.append(thisFileList.filteredThumbs);
						sortGallery(SortingOrder, SortingType, thisFileList, Gallery);
						thisFileList.currentPage = 0;
						resetPaging(thisFileList);
						showHidePages(thisFileList, Gallery, Identifier, currentPageList);
						showHideMessage("", thisFileList, Gallery, Identifier, currentPageList);
						$(".Selections").css("max-height", 300);
					} else {
						showHideMessage('No types selected.', thisFileList, Gallery, Identifier, currentPageList);
						$(".Selections").css("max-height", 75);
						thisFileList.fileContainer.hide();
					};
				};
				if ((opts.showThumbInfoInPageBar == true && opts.paginationLayoutAlbums == false)) {
					$('.thumbnailStageA', thisFileList.allThumbsContainer).text(((parseInt(thisFileList.currentPage)) * parseInt(thisFileList.PerPageItems) + 1));
					$('.thumbnailStageB', thisFileList.allThumbsContainer).text(((parseInt(thisFileList.currentPage) + 1) * thisFileList.PerPageItems < parseInt(thisFileList.filteredThumbs.length) ? ((parseInt(thisFileList.currentPage) + 1) * thisFileList.PerPageItems) : parseInt(thisFileList.filteredThumbs.length)));
					$('.thumbnailStageC', thisFileList.allThumbsContainer).text(parseInt(thisFileList.filteredThumbs.length));
				};
				isotopeGallery(currentPageList, Gallery, false, Identifier);
				if ($('#paginationFilters-' + Identifier, this.allThumbsContainer).length != 0) {
					$('#paginationFilters-' + Identifier, this.allThumbsContainer).css("left", $('#showFilterBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
				};
				if ($('#paginationSorting-' + Identifier, this.allThumbsContainer).length !=0) {
					$('#paginationSorting-' + Identifier, this.allThumbsContainer).css("left", $('#showSortingBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
				};
				if ($('#paginationPagers-' + Identifier, this.allThumbsContainer).length !=0) {
					$('#paginationPagers-' + Identifier, this.allThumbsContainer).css("left", $('#showPagerBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
				};
				// Adjust Height of iFrame Container (if applicable)
				AdjustIFrameDimensions();
				return false;
			});
			// Search Click Events
			this.searchBox.focus(function(e){
				$(this).addClass("active");
				if($(this).val() === thisFileList.settings.searchBoxDefault){
					$(this).val("");
				};
			});
			this.searchBox.blur(function(e){
				$(this).removeClass("active");
				if($(this).val() === "") {
					$(this).val(thisFileList.settings.searchBoxDefault);
				};
				if ((opts.imageLazyLoad) && ($.isFunction($.fn.lazyloadanything))) {
					$.fn.lazyloadanything('load');
				};
			});
			this.searchBox.keydown(function (e){
				if(e.keyCode === 13){
					thisFileList.searchButton.click();
				};
			});
			this.searchButton.click(function(e){
				e.preventDefault();
				if (thisFileList.searchBox.val() !== "" && thisFileList.searchBox.val() !== thisFileList.settings.searchBoxDefault){
					thisFileList.searchBox.removeClass("error");
					thisFileList.filteredThumbs.remove();
					thisFileList.filteredThumbs = thisFileList.allThumbs.filter(':containsNC(' + thisFileList.searchBox.val() + ')');
					if (thisFileList.filteredThumbs.length > 0){
						//currentPageList.isotope('destroy');
						$('#' + opts.infiniteAlbumsID).unbind('inview');
						thisFileList.fileContainer.append(thisFileList.filteredThumbs);
						thisFileList.currentPage = 0;
						resetPaging(thisFileList);
						showHidePages(thisFileList, Gallery, Identifier, currentPageList);
						showHideMessage("", thisFileList, Gallery, Identifier, currentPageList);
						thisFileList.clearSearchButton.removeClass('hidden');
						thisFileList.fileContainer.show();
						isotopeGallery(currentPageList, Gallery, false, Identifier);
					} else {
						thisFileList.clearSearchButton.removeClass('hidden');
						showHideMessage("No albums matching your keyword(s) could be found.", thisFileList, Gallery, Identifier, currentPageList);
						thisFileList.fileContainer.hide();
					};
				} else {
					thisFileList.searchBox.addClass("error");
				};
				if ($('#paginationFilters-' + Identifier, this.allThumbsContainer).length != 0) {
					$('#paginationFilters-' + Identifier, this.allThumbsContainer).css("height", "auto").css("left", $('#showFilterBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
				};
				if ($('#paginationSorting-' + Identifier, this.allThumbsContainer).length !=0) {
					$('#paginationSorting-' + Identifier, this.allThumbsContainer).css("height", "auto").css("left", $('#showSortingBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
				};
				if ($('#paginationPagers-' + Identifier, this.allThumbsContainer).length !=0) {
					$('#paginationPagers-' + Identifier, this.allThumbsContainer).css("height", "auto").css("left", $('#showPagerBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
				};
				// Adjust Height of iFrame Container (if applicable)
				AdjustIFrameDimensions();
			});
			this.clearSearchButton.click(function(e){
				e.preventDefault();
				//currentPageList.isotope('destroy');
				thisFileList.searchBox.val(thisFileList.SearchBox);
				resetWholeList(thisFileList, currentPageList, Identifier, Gallery, firstRun);
				isotopeGallery(currentPageList, Gallery, false, Identifier);
				return false;
			});
			// Show Options - Sorting Button
			this.showSortingBtn.click(function(event){
				event.preventDefault();
				$('#paginationSorting-' + Identifier, this.allThumbsContainer).css("height", "auto").css("left", $('#showSortingBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
				thisFileList.filterLinksContainer.hide();
				thisFileList.pagerLinksContainer.hide();
				thisFileList.sortingLinksContainer.show();
				return false;
			});
			// Show Options - Paging Button
			this.showPagerBtn.click(function(event){
				event.preventDefault();
				$('#paginationPagers-' + Identifier, this.allThumbsContainer).css("height", "auto").css("left", $('#showPagerBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
				thisFileList.filterLinksContainer.hide();
				thisFileList.sortingLinksContainer.hide();
				if ((Gallery) || (!Gallery && opts.cacheAlbumContents)) {
					showHidePages(thisFileList, Gallery, Identifier, currentPageList);
				};
				thisFileList.pagerLinksContainer.show();
				return false;
			});
			$('.Closer', this.sortingLinksContainer).click(function(){
				thisFileList.filterLinksContainer.hide();
				thisFileList.pagerLinksContainer.hide();
				thisFileList.sortingLinksContainer.hide();
				return false;
			});
			$('.Closer', this.pagerLinksContainer).click(function(){
				thisFileList.filterLinksContainer.hide();
				thisFileList.sortingLinksContainer.hide();
				thisFileList.pagerLinksContainer.hide();
				return false;
			});
			// Sorting Links Click Events
			this.sortingLinks.click(function(event){
				event.preventDefault();
				//currentPageList.isotope('destroy');
				if (((Gallery) && (opts.infiniteScrollAlbums)) || ((!Gallery) && (opts.infiniteScrollPhotos))) {
					$('#' + opts.infiniteAlbumsID).unbind('inview');
				};
				var clicked = $(this);
				var sortType = clicked.attr("data-sort-type");
				var sortDirection = "";
				var sortLinks = thisFileList.sortingLinks;
				sortDirection = clicked.attr("data-sort-direction");
				sortLinks.attr('class', '');
				if (sortDirection === "" || sortDirection === undefined){
					sortLinks.attr('data-sort-direction', '');
					sortDirection = 'asc';
				} else {
					if (clicked.attr('data-sort-direction') === 'asc'){
						sortDirection = 'dec';
					} else {
						sortDirection = 'asc';
					};
				};
				clicked.attr('data-sort-direction', sortDirection);
				clicked.addClass(sortDirection);
				SortingOrder = sortDirection;
				SortingType = sortType;
				sortGallery(sortDirection, sortType, thisFileList, Gallery);
				thisFileList.currentPage = 0;
				resetPaging(thisFileList);
				showHidePages(thisFileList, Gallery, Identifier, currentPageList);
				showHideMessage("", thisFileList, Gallery, Identifier, currentPageList);
				if (thisFileList.sortingLinksContainer.is(":hidden") == false){
					thisFileList.sortingLinksContainer.toggle();
				};
				isotopeGallery(currentPageList, Gallery, false, Identifier);
				return false;
			});
			// Show All Files Button
			$('.btn', thisFileList.messageBox).click(function(event){
				event.preventDefault();
				//currentPageList.isotope('destroy');
				thisFileList.searchBox.val(thisFileList.SearchBox);
				resetWholeList(thisFileList, currentPageList, Identifier, Gallery, firstRun);
				isotopeGallery(currentPageList, Gallery, false, Identifier);
				if ($('#paginationFilters-' + Identifier, this.allThumbsContainer).length != 0) {
					$('#paginationFilters-' + Identifier, this.allThumbsContainer).css("left", $('#showFilterBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
				};
				if ($('#paginationSorting-' + Identifier, this.allThumbsContainer).length !=0) {
					$('#paginationSorting-' + Identifier, this.allThumbsContainer).css("left", $('#showSortingBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
				};
				if ($('#paginationPagers-' + Identifier, this.allThumbsContainer).length !=0) {
					$('#paginationPagers-' + Identifier, this.allThumbsContainer).css("left", $('#showPagerBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
				};
				return false;
			});
			initialSorting(thisFileList, currentPageList, Gallery);
			showHidePages(thisFileList, Gallery, Identifier, currentPageList);
			isotopeGallery(currentPageList, Gallery, true, Identifier);
			if (!Gallery) {
				initializeLightboxes(thisFileList, currentPageList, Gallery, true, Identifier);
			};
			// Restart LazyLoad
			restartLazyLoad();
		};

		// Other Functions used for Pagination & Layout
		function showHideMessage (message, thisFileList, Gallery, Identifier, currentPageList){
			$("#ErrorMessage", thisFileList.messageBox).html(message);
			if (message.length > 0){
				thisFileList.filteredThumbs.remove();
				thisFileList.currentPage = 0;
				$('.thumbnailStageA', thisFileList.allThumbsContainer).text(0);
				$('.thumbnailStageB', thisFileList.allThumbsContainer).text(0);
				thisFileList.totalPages = 1;
				showHidePages(thisFileList, Gallery, Identifier, currentPageList);
				thisFileList.messageBox.show();
			} else {
				thisFileList.messageBox.hide();
			};
		};
		function showHidePages(thisFileList, Gallery, Identifier, currentPageList){
			thisFileList.filteredThumbs.hide();
			if (((Gallery) && (opts.infiniteScrollAlbums)) || ((!Gallery) && (opts.infiniteScrollPhotos))) {
				thisFileList.filteredThumbs.filter(':lt(' + ((parseInt(thisFileList.currentPage) + 1) * parseInt(thisFileList.pageAt)) + ')').addClass("Showing").addClass("Infinite").removeClass("Hiding").show();
			} else {
				thisFileList.filteredThumbs.filter(':lt(' + ((parseInt(thisFileList.currentPage) + 1) * parseInt(thisFileList.pageAt)) + ')').addClass("Showing").removeClass("Hiding").show();
			};
			thisFileList.filteredThumbs.filter(':lt(' + ((parseInt(thisFileList.currentPage) + 0) * parseInt(thisFileList.pageAt)) + ')').addClass("Hiding").removeClass("Showing").removeClass("Infinite").removeClass("isotope-item").hide();
			thisFileList.fileContainer.removeClass('loading');
			if (thisFileList.currentPage === 0){
				thisFileList.prevButton.addClass('disabled');
				thisFileList.firstButton.addClass('disabled');
			} else {
				thisFileList.prevButton.removeClass('disabled');
				thisFileList.firstButton.removeClass('disabled');
			};
			if (thisFileList.currentPage === (thisFileList.totalPages - 1)){
				thisFileList.nextButton.addClass('disabled');
				thisFileList.lastButton.addClass('disabled');
			} else {
				thisFileList.nextButton.removeClass('disabled');
				thisFileList.lastButton.removeClass('disabled');
			};
			if (thisFileList.totalPages > 1){
				thisFileList.paginationContainer.show();
				$('.currentPage', thisFileList.allThumbsContainer).text(parseInt(thisFileList.currentPage) + 1);
				$('.thumbnailStageA', thisFileList.allThumbsContainer).text(((parseInt(thisFileList.currentPage)) * parseInt(thisFileList.PerPageItems) + 1));
				$('.thumbnailStageB', thisFileList.allThumbsContainer).text(((parseInt(thisFileList.currentPage) + 1) * thisFileList.PerPageItems < parseInt(thisFileList.filteredThumbs.length) ? ((parseInt(thisFileList.currentPage) + 1) * thisFileList.PerPageItems) : parseInt(thisFileList.filteredThumbs.length)));
				$('.thumbnailStageC', thisFileList.allThumbsContainer).text(parseInt(thisFileList.filteredThumbs.length));
				$('.paginationPagers > ul > li > a').each(function() {
					if (this.innerHTML == (thisFileList.currentPage + 1)) {
						$(this).addClass('Active');
						$(this).removeClass('InActive');
						$(this).removeClass('Disabled');
					} else if (this.innerHTML > thisFileList.totalPages) {
						$(this).removeClass('Active');
						$(this).removeClass('InActive');
						$(this).addClass('Disabled');
					} else {
						$(this).removeClass('Active');
						$(this).removeClass('Disabled');
						$(this).addClass('InActive');
					};
				});
				thisFileList.showPagerBtn.show();
				resetPaging(thisFileList);
			} else {
				thisFileList.paginationContainer.hide();
				thisFileList.showPagerBtn.hide();
				if (TotalThumbs == 1) {
					thisFileList.showSortingBtn.hide();
				} else {
					thisFileList.showSortingBtn.show();
				};
			};
			var CurrentFiles = 0;
			$('.paginationItem', this.allThumbsContainer).each(function(index) {
				if ($(this).is(":visible")) {
					CurrentFiles = CurrentFiles + 1;
					$(this).addClass("Showing");
				} else {
					$(this).removeClass("Showing");
				};
			});
			if ((thisFileList.hideToTopDef == true) && (thisFileList.hideFilterDef == true) && (thisFileList.hideSearchDef == true) && (thisFileList.hideSortDef == true) && (thisFileList.hidePagerDef == true) && (opts.singleAlbumOnly == true)) {
				thisFileList.paginationControls.hide();
			} else {
				thisFileList.paginationControls.show();
			};
			thisFileList.fileContainer.show();
			$('span', thisFileList.emptyThumbsBox).html("");
			$('span', thisFileList.messageBox).html("");
			thisFileList.emptyThumbsBox.hide();
			if (Gallery) {
				// Assign Rotate Effect to Album Thumbnails
				if ((opts.albumThumbRotate) && ($.isFunction($.fn.jrumble))) {
					$('.albumThumb').jrumble({
						x: 				opts.albumRumbleX,
						y: 				opts.albumRumbleY,
						rotation: 		opts.albumRotate,
						speed: 			opts.albumRumbleSpeed,
						opacity:		false,
						opacityMin:		0.6
					});
				};
				// Add Effects for Album Thumbnails
				$(".fb-album-overlay").css("opacity", "0");
				$(".fb-album-title").css("opacity", "0");
				$(".fb-album-shareme").css("opacity", "0");
				$(".albumThumb").hover(function () {
					//$("#fb-albums-all").find("*").stop(true, true);
					var albumShareMe = $(this).attr("data-album");
					// Show Album Title
					if (opts.albumNameThumb) {
						$("#fb-album-title-" + albumShareMe).stop().animate({
							opacity: 				1,
							top:					0
						}, 500, function() {});
					};
					// Show Album Social Share Buttons
					if ((opts.albumShowSocialShare) && (opts.albumThumbSocialShare)) {
						$("#fb-album-shareme-" + albumShareMe).stop().animate({
							opacity: 			1,
							bottom:				(((opts.albumThumbZoomIn) && (opts.albumThumbWall) && (opts.albumThumbWallSimple)) ? + (opts.albumThumbZoomInScale / 2) : 0)
						}, 500, function() {});
					};
					// Start Album Thumbnail Zoom-In Effect
					if (opts.albumThumbZoomIn) {
						$("#fb-album-thumb-" + albumShareMe).stop().animate({
							"height": 			opts.albumThumbHeight + opts.albumThumbZoomInScale,
							"width": 			opts.albumThumbWidth + opts.albumThumbZoomInScale,
							"background-size": 	opts.albumThumbWidth + opts.albumThumbZoomInScale,
							"margin-left": 		-(opts.albumThumbZoomInScale / 2),
							"margin-top": 		-(opts.albumThumbZoomInScale / 2)
						}, 500, function() {});
					};
					// Start Album Thumbnail Rumble Effect
					if ((opts.albumThumbRotate) && ($.isFunction($.fn.jrumble))) {
						$(this).trigger('startRumble');
					};
					// Start Album Thumbnail Magnifier Effect
					if (opts.albumThumbOverlay) {
						$("#fb-album-overlay-" + albumShareMe).stop().animate({
							opacity: 			opts.albumThumbHoverOpacity,
							top:				0
						}, 500, function() {});
						if ((opts.albumThumbSocialShare) && (opts.albumNameThumb)) {
							var albumTopAdjust = 0;
						} else if ((opts.albumThumbSocialShare) && (!opts.albumNameThumb)) {
							var albumTopAdjust = 36;
						} else if ((!opts.albumThumbSocialShare) && (opts.albumNameThumb)) {
							var albumTopAdjust = -32;
						} else {
							var albumTopAdjust = 0;
						};
						$("#fb-album-overlay-icon-" + albumShareMe).stop().animate({
							opacity: 			1,
							top:				((opts.albumThumbHeight - 75) / 2) - (albumTopAdjust / 2),
							left:				(opts.albumThumbWidth - 75) / 2
						}, 500, function() {});
					};
					// Start Album Thumbnail White-Out Effect
					if (opts.albumThumbWhiteOut) {
						$(".albumWrapper:not(.isotope-hidden) .albumThumb .albumThumbWrap .fb-album-blur").stop().css({
							opacity: 			opts.albumThumbWhiteOutLevel
						}, 0);
						$("#fb-album-blur-" + albumShareMe).stop().css({
							opacity: 			0
						}, 500, function() {});
					};
				}, function () {
					var albumShareMe = $(this).attr("data-album");
					// Hide Album Title
					if (opts.albumNameThumb) {
						$("#fb-album-title-" + albumShareMe).stop().animate({
							opacity: 			0,
							top:				-50
						}, 500, function() {});
					};
					// Hide Album Social Share Buttons
					if (opts.albumThumbSocialShare) {
						$("#fb-album-shareme-" + albumShareMe).stop().animate({
							opacity: 			0,
							bottom:				-50
						}, 500, function() {});
					};
					// End Album Thumbnail Zoom-Out Effect
					if (opts.albumThumbZoomIn) {
						$("#fb-album-thumb-" + albumShareMe).stop().animate({
							"height": 			opts.albumThumbHeight,
							"width": 			opts.albumThumbWidth,
							"background-size": 	opts.albumThumbWidth,
							"margin-left": 		0,
							"margin-top": 		0
						}, 500, function() {});
					};
					// End Album Thumbnail Rumble Effect
					if ((opts.albumThumbRotate) && ($.isFunction($.fn.jrumble))) {
						$(this).trigger('stopRumble');
					};
					// End Album Thumbnail Magnifier Effect
					if (opts.albumThumbOverlay) {
						$("#fb-album-overlay-" + albumShareMe).stop().animate({
							opacity: 			0,
							top:				-50
						}, 500, function() {});
						$("#fb-album-overlay-icon-" + albumShareMe).stop().animate({
							opacity: 			0,
							top:				-75,
							left:				-75
						}, 500, function() {});
					};
					// End Album Thumbnail White-Out Effect
					if (opts.albumThumbWhiteOut) {
						$(".albumWrapper:not(.isotope-hidden) .albumThumb .albumThumbWrap .fb-album-blur").stop().css({
							opacity: 			0
						}, 500, function() {});
					};
				});
				// Show Album Social Share Bar with Full Opacity and Stop Rumble
				if ((opts.albumShowSocialShare) && (opts.albumThumbSocialShare)) {
					$(".fb-album-shareme").hover(function () {
						var albumShareMe = $(this).attr("data-album");
						if ((opts.albumThumbRotate) && ($.isFunction($.fn.jrumble))) {
							$('#' + albumShareMe).trigger('stopRumble');
						};
					}, function () {
						var albumShareMe = $(this).attr("data-album");
						if ((opts.albumThumbRotate) && ($.isFunction($.fn.jrumble))) {
							$('#' + albumShareMe).trigger('stopRumble');
						};
					});
				} else {
					$(".fb-album-shareme").css("display", "none");
				};
				// Show Album Information after Click on Info Button
				if (opts.albumThumbWall) {
					$(".AlbumSocialShare_Info").unbind("click").on("click", function() {
						var albumShareMe 			= $(this).attr("data-album");
						var albumShareMeLink 		= $(this).attr("data-link");
						var albumShareImageURL 		= $("#fb-album-thumb-" + albumShareMe).css('background-image');
						var albumShareImageSize 	= opts.albumThumbWidth + "px auto";
						var albumShareImageWidth 	= opts.albumThumbWidth + "px";
						var albumShareImageHeight 	= opts.albumThumbHeight + "px";
						var albumShareInfoName 		= $("#albumName_" + albumShareMe).html();
						var albumShareInfoCount 	= $("#albumCount_" + albumShareMe).html();
						var albumShareInfoCreate 	= $("#albumCreate_" + albumShareMe).html();
						var albumShareInfoUpdate 	= $("#albumUpdate_" + albumShareMe).html();
						var albumShareInfoNumber 	= $("#albumNumber_" + albumShareMe).html();
						var albumShareInfoSocial	= $("#ts-social-share_" + albumShareMe).html();
						MessiContent = "<div style='display: block; width: 100%; margin: 10px 0px 20px 0px;'>" + albumShareInfoName + "</div>";
						MessiContent += "<a href='" + albumShareMeLink + "' target='_blank'>";
						MessiContent += "<div class='fb-album-thumb noscaler' style='border: 1px solid #DDDDDD; background-image: " + albumShareImageURL + "; background-size: " + albumShareImageSize + "; width: " + albumShareImageWidth + "; height: " + albumShareImageHeight + "'></div>";
						MessiContent += "</a>";
						MessiContent +=	"<div style='width: 100%; border-bottom: 1px solid #DDDDDD; margin: 20px auto;'></div>";
						MessiContent +=	"<div style='display: block; width: 100%; float: left;'>" + albumShareInfoCount + "</div>";
						MessiContent +=	"<div style='display: block; width: 100%; float: left;'>" + albumShareInfoCreate + "</div>";
						MessiContent +=	"<div style='display: block; width: 100%; float: left;'>" + albumShareInfoUpdate + "</div>";
						MessiContent +=	"<div style='display: block; width: 100%; float: left;'>" + albumShareInfoNumber + "</div>";
						MessiContent += "<div style='display: block; width: 100%; float: left; margin-top: 20px;'><ul class='ts-social-share fb-album-summary' style='float: left;'>";
						MessiContent +=	"" + albumShareInfoSocial + "";
						MessiContent += "</ul></div>";
						MessiCode = 	"anim success";
						MessiTitle = 	"Album Information";
						MessiWidth =	(opts.albumWrapperWidth + 20) + "px";
						showMessiContent(MessiContent, MessiTitle, MessiCode, MessiWidth);
					});
				};
				scrollBarBeautifierOn(currentPageList, Gallery, false, Identifier);
			} else {
				// Assign Rotate Effect to Album Thumbnails
				if ((opts.photoThumbRotate) && ($.isFunction($.fn.jrumble))) {
					$('.photoThumb').jrumble({
						x: 				opts.photoRumbleX,
						y: 				opts.photoRumbleY,
						rotation: 		opts.photoRotate,
						speed: 			opts.photoRumbleSpeed,
						opacity:		false,
						opacityMin:		0.6
					});
				};
				// Add Effects for Photo Thumbnails
				$(".fb-photo-overlay").css("opacity", "0");
				$(".fb-photo-shareme").css("opacity", "0");
				$('.photoThumb').hover(function(){
					//$("#fb-album-" + Identifier).find("*").stop(true, true);
					var photoShareMe = $(this).attr("data-photo");
					// Show Photo Social Share Buttons
					if ((opts.photoShowSocialShare) && (opts.photoThumbSocialShare)) {
						$("#fb-photo-shareme-" + photoShareMe).stop().animate({
							opacity: 			1,
							bottom:				(((opts.photoThumbZoomIn) && (opts.photoThumbWall) && (opts.photoThumbWallSimple)) ? + (opts.photoThumbZoomInScale / 2) : 0)
						}, 500, function() {});
					};
					// Start Photo Thumbnail Zoom-In Effect
					if (opts.photoThumbZoomIn) {
						$("#fb-photo-thumb-" + photoShareMe).stop().animate({
							"height": 			opts.photoThumbHeight + opts.photoThumbZoomInScale,
							"width": 			opts.photoThumbWidth + opts.photoThumbZoomInScale,
							"background-size": 	opts.photoThumbWidth + opts.photoThumbZoomInScale,
							"margin-left": 		-(opts.photoThumbZoomInScale / 2),
							"margin-top": 		-(opts.photoThumbZoomInScale / 2)
						}, 500, function() {});
					};
					// Start Photo Thumbnail Rumble Effect
					if ((opts.photoThumbRotate) && ($.isFunction($.fn.jrumble))) {
						$(this).trigger('startRumble');
					};
					// Start Photo Thumbnail Magnifier Effect
					if (opts.photoThumbOverlay) {
						$("#fb-photo-overlay-" + photoShareMe).stop().animate({
							opacity: 			opts.photoThumbHoverOpacity,
							top:				0
						}, 500, function() {});
						if (opts.photoThumbSocialShare) {var photoTopAdjust = 36;} else {var photoTopAdjust = 0;};
						$("#fb-photo-overlay-icon-" + photoShareMe).stop().animate({
							opacity: 			1,
							top:				((opts.photoThumbHeight + opts.photoThumbPadding * 2 - 75) / 2) - (photoTopAdjust / 2),
							left:				(opts.photoThumbWidth + opts.photoThumbPadding * 2 - 75) / 2
						}, 500, function() {});
					};
					// Start Photo Thumbnail White-Out Effect
					if (opts.photoThumbWhiteOut) {
						$(".photoWrapper:not(.isotope-hidden) .photoThumb .photoThumbWrap .fb-photo-blur").stop().css({
							opacity: 			opts.photoThumbWhiteOutLevel
						}, 0);
						$("#fb-photo-blur-" + photoShareMe).stop().css({
							opacity: 			0
						}, 250, function() {});
					};
				}, function(){
					var photoShareMe = $(this).attr("data-photo");
					// Hide Photo Social Share Buttons
					if ((opts.photoShowSocialShare) && (opts.photoThumbSocialShare)) {
						$("#fb-photo-shareme-" + photoShareMe).stop().animate({
							opacity: 			0,
							bottom:				-50
						}, 500, function() {});
					};
					// End Photo Thumbnail Zoom-Out Effect
					if (opts.photoThumbZoomIn) {
						$("#fb-photo-thumb-" + photoShareMe).stop().animate({
							"height": 			opts.photoThumbHeight,
							"width": 			opts.photoThumbWidth,
							"background-size": 	opts.photoThumbWidth,
							"margin-left": 		0,
							"margin-top": 		0
						}, 500, function() {});
					};
					// End Photo Thumbnail Rumble Effect
					if ((opts.photoThumbRotate) && ($.isFunction($.fn.jrumble))) {
						$(this).trigger('stopRumble');
					};
					// End Photo Thumbnail Magnifier Effect
					if (opts.photoThumbOverlay) {
						$("#fb-photo-overlay-" + photoShareMe).stop().animate({
							opacity: 			0,
							top:				-50
						}, 500, function() {});
						$("#fb-photo-overlay-icon-" + photoShareMe).stop().animate({
							opacity: 			0,
							top:				-75,
							left:				-75
						}, 500, function() {});
					};
					// End Photo Thumbnail White-Out Effect
					if (opts.photoThumbWhiteOut) {
						$(".photoWrapper:not(.isotope-hidden) .photoThumb .photoThumbWrap .fb-photo-blur").stop().css({
							opacity: 			0
						}, 0, function() {});
					};
				});
				// Show Photo Social Share Bar with Full Opacity and Stop Rumble
				if ((opts.photoShowSocialShare) && (opts.photoThumbSocialShare)) {
					$(".fb-photo-shareme").hover(function () {
						var photoShareMe = $(this).attr("data-photo");
						if ((opts.photoThumbRotate) && ($.isFunction($.fn.jrumble))) {
							$('#Call_' + photoShareMe).trigger('stopRumble');
						};
					}, function () {
						var photoShareMe = $(this).attr("data-photo");
						if ((opts.photoThumbRotate) && ($.isFunction($.fn.jrumble))) {
							$('#Call_' + photoShareMe).trigger('stopRumble');
						};
					});
				} else {
					$(".fb-photo-shareme").css("display", "none");
				};
				scrollBarBeautifierOn(currentPageList, Gallery, false, Identifier);
			};
			if ((opts.showThumbInfoInPageBar == true && (Gallery == true && opts.paginationLayoutAlbums == false) || (Gallery == false && opts.paginationLayoutPhotos == false))) {
				$('.thumbnailStageA', thisFileList.allThumbsContainer).text(((parseInt(thisFileList.currentPage)) * parseInt(thisFileList.PerPageItems) + 1));
				$('.thumbnailStageB', thisFileList.allThumbsContainer).text(((parseInt(thisFileList.currentPage) + 1) * thisFileList.PerPageItems < parseInt(thisFileList.filteredThumbs.length) ? ((parseInt(thisFileList.currentPage) + 1) * thisFileList.PerPageItems) : parseInt(thisFileList.filteredThumbs.length)));
				$('.thumbnailStageC', thisFileList.allThumbsContainer).text(parseInt(thisFileList.filteredThumbs.length));
			};
			// Restart LazyLoad
			restartLazyLoad();
			// Adjust Height of iFrame Container (if applicable)
			AdjustIFrameDimensions();
			// Reset Animation Counter
			if (opts.outputLoaderStatus) {
				$("#" + opts.loaderSpinnerID).hide();
				LoaderStatusAnimationCircle.setValue('0 / 0');
				LoaderStatusAnimationCircle.setProgress(0);
			};
		};
		function resetWholeList(thisFileList, currentPageList, Identifier, Gallery, firstRun){
			thisFileList.filteredThumbs.remove();
			thisFileList.filteredThumbs = thisFileList.allThumbs;
			thisFileList.fileContainer.append(thisFileList.filteredThumbs);
			if ((Gallery) && (opts.albumsFilterAllEnabled)) {
				thisFileList.filterLinks.addClass('showing');
			} else if ((!Gallery) && (opts.photosFilterAllEnabled)) {
				thisFileList.filterLinks.addClass('showing');
			};
			thisFileList.currentPage = 0;
			resetPaging(thisFileList);
			//showHidePages(thisFileList, Gallery, Identifier, currentPageList);
			showHideMessage("", thisFileList, Gallery, Identifier, currentPageList);
			thisFileList.clearSearchButton.addClass('hidden');
			if (typeof $("#Sort-Selections-" + Identifier).find(".asc").attr("data-sort-type") != 'undefined') {
				sortGallery('asc', $("#Sort-Selections-" + Identifier).find(".asc").attr("data-sort-type"), thisFileList, Gallery);
			} else {
				sortGallery('dec', $("#Sort-Selections-" + Identifier).find(".dec").attr("data-sort-type"), thisFileList, Gallery);
			};
			$(".Selections").css("max-height", 300);
			//currentPageList.isotope('flush');
			currentPageList.isotope('reloadItems');
			currentPageList.isotope({
				itemSelector: 				'.albumWrapper',
				animationEngine:			'best-available',
				itemPositionDataEnabled: 	false,
				transformsEnabled:			true,
				resizesContainer: 			true,
				masonry: {
					columnOffset: 			0
				},
				layoutMode: 				'masonry',
				filter:						'.Showing',
				onLayout: function( $elems, instance ) {
					if (!firstRun) {
						if (opts.autoScrollTop) {
							$('html, body').animate({scrollTop:$("#" + opts.frameID).offset().top - 20}, 'slow');
						};
						// Restart LazyLoad
						restartLazyLoad();
					}
				}
			}, function($elems){});
			showHidePages(thisFileList, Gallery, Identifier, currentPageList);
			if ($('#paginationFilters-' + Identifier, this.allThumbsContainer).length != 0) {
				$('#paginationFilters-' + Identifier, this.allThumbsContainer).css("left", $('#showFilterBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
			};
			if ($('#paginationSorting-' + Identifier, this.allThumbsContainer).length !=0) {
				$('#paginationSorting-' + Identifier, this.allThumbsContainer).css("left", $('#showSortingBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
			};
			if ($('#paginationPagers-' + Identifier, this.allThumbsContainer).length !=0) {
				$('#paginationPagers-' + Identifier, this.allThumbsContainer).css("left", $('#showPagerBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
			};
			// Adjust Height of iFrame Container (if applicable)
			AdjustIFrameDimensions();
			// Restart LazyLoad
			restartLazyLoad();
		};
		function resetPaging(thisFileList){
			thisFileList.totalPages = Math.ceil(thisFileList.filteredThumbs.length / thisFileList.pageAt);
			$('.totalPages', thisFileList.allThumbsContainer).text(thisFileList.totalPages);
		};
		function infiniteGallery(currentPageList, Gallery, firstRun, Identifier) {
			if (opts.infiniteScrollMore) {
				$("#" + opts.infiniteMoreID).hide();
			};
			if ((Gallery) && (opts.infiniteScrollAlbums)) {
				var hiddenItemsCountView = $('.albumWrapper.isotope-hidden').length;
				if (hiddenItemsCountView != 0) {
					if (opts.infiniteScrollMore) {
						$("#" + opts.infiniteMoreID).show();
					};
					$('#' + opts.infiniteAlbumsID).unbind('inview').bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
						if (isInView) {
							var nextItemsCount = 0;
							var totalItemsCount = $('.albumWrapper').length;
							var hiddenItemsCount = $('.albumWrapper.isotope-hidden').length;
							if (hiddenItemsCount != 0) {
								$("#" + opts.infiniteLoadID).show();
								$('.albumWrapper.isotope-hidden').each(function(i, elem) {
									if ($(this).is(":hidden") == true) {
										nextItemsCount++;
										if (nextItemsCount <= infiniteAlbums) {
											$(this).addClass("Showing").addClass("Infinite").show();
										};
									};
								});
								isotopeGallery(currentPageList, Gallery, false, Identifier);
								var visibleItemsCount = $('.albumWrapper.Showing.Infinite').length;
								$("#thumbnailStage-" + Identifier + " .thumbnailStageB").html(visibleItemsCount);
								if (visibleItemsCount == totalItemsCount) {
									if (opts.infiniteScrollMore) {
										$("#" + opts.infiniteMoreID).hide();
									};
									$('#' + opts.infiniteAlbumsID).unbind('inview');
								} else {
									if (opts.infiniteScrollMore) {
										$("#" + opts.infiniteMoreID).show();
									};
								};
							} else {
								$('#' + opts.infiniteAlbumsID).unbind('inview');
								if (opts.infiniteScrollMore) {
									$("#" + opts.infiniteMoreID).hide();
								};
							};
						};
					});
				} else {
					$('#' + opts.infiniteAlbumsID).unbind('inview');
					if (opts.infiniteScrollMore) {
						$("#" + opts.infiniteMoreID).hide();
					};
				};
			} else if ((!Gallery) && (opts.infiniteScrollPhotos)) {
				var hiddenItemsCountView = $('.photoWrapper.Wrapper_' + Identifier + '.isotope-hidden').length;
				if (hiddenItemsCountView != 0) {
					if (opts.infiniteScrollMore) {
						$("#" + opts.infiniteMoreID).show();
					};
					$('#' + opts.infinitePhotosID).unbind('inview').bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
						if (isInView) {
							var nextItemsCount = 0;
							var totalItemsCount = $('.photoWrapper.Wrapper_' + Identifier).length;
							var hiddenItemsCount = $('.photoWrapper.Wrapper_' + Identifier + '.isotope-hidden').length;
							if (hiddenItemsCount != 0) {
								$("#" + opts.infiniteLoadID).show();
								$('#fb-album-' + Identifier + ' .photoWrapper.Wrapper_' + Identifier + '.isotope-hidden').each(function(i, elem) {
									if ($(this).is(":hidden") == true) {
										nextItemsCount++;
										if (nextItemsCount <= infinitePhotos) {
											$(this).addClass("Showing").addClass("Infinite").show();
										};
									};
								});
								isotopeGallery(currentPageList, Gallery, false, Identifier);
								var visibleItemsCount = $('.photoWrapper.Wrapper_' + Identifier + '.Showing.Infinite').length;
								$("#thumbnailStage-" + Identifier + " .thumbnailStageB").html(visibleItemsCount);
								if (visibleItemsCount == totalItemsCount) {
									if (opts.infiniteScrollMore) {
										$("#" + opts.infiniteMoreID).hide();
									};
									$('#' + opts.infinitePhotosID).unbind('inview');
								} else {
									if (opts.infiniteScrollMore) {
										$("#" + opts.infiniteMoreID).show();
									};
								};
							} else {
								$('#' + opts.infinitePhotosID).unbind('inview');
								if (opts.infiniteScrollMore) {
									$("#" + opts.infiniteMoreID).hide();
								};
							};
						};
					});
				} else {
					$('#' + opts.infinitePhotosID).unbind('inview');
					if (opts.infiniteScrollMore) {
						$("#" + opts.infiniteMoreID).hide();
					};
				};
			};
		};

		function isotopeGallery(currentPageList, Gallery, firstRun, Identifier) {
			if (Gallery) {
				if (opts.infiniteScrollAlbums) {
					var isotopeFilter = '.Showing.Infinite';
				} else {
					var isotopeFilter = '.Showing';
				};
				if (firstRun) {
					setTimeout(function(){
						currentPageList.isotope({
							itemSelector: 				'.albumWrapper',
							animationEngine:			'best-available',
							itemPositionDataEnabled: 	false,
							transformsEnabled:			true,
							resizesContainer: 			true,
							masonry: {
								gutterWidth: 			opts.isotopeGutterWidth
							},
							layoutMode: 				'masonry',
							filter:						isotopeFilter,
							onLayout: function( $elems, instance ) {
								isotopeHeightContainer = currentPageList.height();
								if ((opts.floatingControlBar) && (!isInIFrame)) {
									$("#paginationControls-" + Identifier).stickyScroll({ container: $("#fb-albums-all-paged") })
								};
								if ($('#paginationFilters-' + Identifier, this.allThumbsContainer).length != 0) {
									$('#paginationFilters-' + Identifier, this.allThumbsContainer).css("left", $('#showFilterBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
								};
								if ($('#paginationSorting-' + Identifier, this.allThumbsContainer).length !=0) {
									$('#paginationSorting-' + Identifier, this.allThumbsContainer).css("left", $('#showSortingBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
								};
								if ($('#paginationPagers-' + Identifier, this.allThumbsContainer).length !=0) {
									$('#paginationPagers-' + Identifier, this.allThumbsContainer).css("left", $('#showPagerBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
								};
								if (!opts.niceScrollAllow) {
									infiniteGallery(currentPageList, Gallery, true, Identifier);
								};
								$("#" + opts.infiniteLoadID).hide();
							}
						}, function($elems){
							opts.callbackFirstAlbumsComplete.call(this);
						});
					}, 100);
				} else {
					//currentPageList.isotope('flush');
					currentPageList.isotope('reloadItems');
					currentPageList.isotope({
						itemSelector: 				'.albumWrapper',
						animationEngine:			'best-available',
						itemPositionDataEnabled: 	false,
						transformsEnabled:			true,
						resizesContainer: 			true,
						masonry: {
							gutterWidth: 			opts.isotopeGutterWidth
						},
						layoutMode: 				'masonry',
						filter:						isotopeFilter,
						onLayout: function( $elems, instance ) {
							isotopeHeightContainer = currentPageList.height();
							if (!opts.infiniteScrollAlbums) {
								if (opts.autoScrollTop) {
									$('html, body').animate({scrollTop:$("#" + opts.frameID).offset().top - 20}, 'slow');
								};
							};
							if ($('#paginationFilters-' + Identifier, this.allThumbsContainer).length != 0) {
								$('#paginationFilters-' + Identifier, this.allThumbsContainer).css("left", $('#showFilterBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
							};
							if ($('#paginationSorting-' + Identifier, this.allThumbsContainer).length !=0) {
								$('#paginationSorting-' + Identifier, this.allThumbsContainer).css("left", $('#showSortingBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
							};
							if ($('#paginationPagers-' + Identifier, this.allThumbsContainer).length !=0) {
								$('#paginationPagers-' + Identifier, this.allThumbsContainer).css("left", $('#showPagerBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
							};
							if (!opts.niceScrollAllow) {
								infiniteGallery(currentPageList, Gallery, false, Identifier);
							};
							$("#" + opts.infiniteLoadID).hide();
						}
					}, function($elems){
						opts.callbackSerialAlbumsComplete.call(this);
					});
				};
			} else {
				if (opts.infiniteScrollPhotos) {
					var isotopeFilter = '.Showing.Infinite';
				} else {
					var isotopeFilter = '.Showing';
				};
				if (firstRun) {
					setTimeout(function(){
						currentPageList.isotope({
							itemSelector: 				'.photoWrapper',
							animationEngine:			'best-available',
							itemPositionDataEnabled: 	false,
							transformsEnabled:			true,
							resizesContainer: 			true,
							masonry: {
								gutterWidth: 			opts.isotopeGutterWidth
							},
							layoutMode: 				'masonry',
							filter:						isotopeFilter,
							onLayout: function( $elems, instance ) {
								isotopeHeightContainer = currentPageList.height();
								if ((opts.floatingControlBar) && (!isInIFrame)) {
									$("#paginationControls-" + Identifier).stickyScroll({ container: $("#fb-album-paged-" + Identifier) });
								};
								$('#Back-' + albumId + '_3').unbind("click").bind('click', function(e){
									if (!opts.cacheAlbumContents) {
										removeAlbumDOM(Identifier);
									}
									checkExisting($(this).attr('data-href'));
								});
								if ($('#paginationFilters-' + Identifier, this.allThumbsContainer).length != 0) {
									$('#paginationFilters-' + Identifier, this.allThumbsContainer).css("left", $('#showFilterBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
								};
								if ($('#paginationSorting-' + Identifier, this.allThumbsContainer).length !=0) {
									$('#paginationSorting-' + Identifier, this.allThumbsContainer).css("left", $('#showSortingBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
								};
								if ($('#paginationPagers-' + Identifier, this.allThumbsContainer).length !=0) {
									$('#paginationPagers-' + Identifier, this.allThumbsContainer).css("left", $('#showPagerBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
								};
								if (!opts.niceScrollAllow) {
									infiniteGallery(currentPageList, Gallery, true, Identifier);
								};
								$("#" + opts.infiniteLoadID).hide();
							}
						}, function($elems){
							//currentPageList.isotope('reLayout');
							opts.callbackFirstPhotosComplete.call(this);
						});
					}, 100);
				} else {
					//currentPageList.isotope('flush');
					currentPageList.isotope('reloadItems');
					currentPageList.isotope({
						itemSelector: 				'.photoWrapper',
						animationEngine:			'best-available',
						itemPositionDataEnabled: 	false,
						transformsEnabled:			true,
						resizesContainer: 			true,
						masonry: {
							gutterWidth: 			opts.isotopeGutterWidth
						},
						layoutMode: 				'masonry',
						filter:						isotopeFilter,
						onLayout: function( $elems, instance ) {
							isotopeHeightContainer = currentPageList.height();
							if (!opts.infiniteScrollPhotos) {
								if (opts.autoScrollTop) {
									$('html, body').animate({scrollTop:$("#" + opts.frameID).offset().top - 20}, 'slow');
								};
							};
							if ($('#paginationFilters-' + Identifier, this.allThumbsContainer).length != 0) {
								$('#paginationFilters-' + Identifier, this.allThumbsContainer).css("left", $('#showFilterBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
							};
							if ($('#paginationSorting-' + Identifier, this.allThumbsContainer).length !=0) {
								$('#paginationSorting-' + Identifier, this.allThumbsContainer).css("left", $('#showSortingBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
							};
							if ($('#paginationPagers-' + Identifier, this.allThumbsContainer).length !=0) {
								$('#paginationPagers-' + Identifier, this.allThumbsContainer).css("left", $('#showPagerBtn-' + Identifier, this.allThumbsContainer).position().left + 0);
							};
							if ((opts.photoBoxAllow) && ($.isFunction($.fn.photobox))) {
								if (!isInIFrame) {
									if ($("#pbOverlay").attr("data-album") == Identifier) {
										$("#pbOverlay").attr("data-album", "").attr("data-photo", "");
										$('#fb-album-' + Identifier).data('_photobox').destroy();
									};
								} else {
									if (parent.$("#FaceBookGalleryPhotoBox").length != 0) {
										parent.$("#pbOverlay").attr("data-album", "").attr("data-photo", "");
										parent.$('#FaceBookGalleryPhotoBox').data('_photobox').destroy();
										parent.$("#FaceBookGalleryPhotoBox").remove();
									};
								};
								initializeLightboxes(currentPageList, Gallery, firstRun, Identifier);
							};
							if (!opts.niceScrollAllow) {
								infiniteGallery(currentPageList, Gallery, false, Identifier);
							};
							$("#" + opts.infiniteLoadID).hide();
						}
					}, function($elems){
						//currentPageList.isotope('reLayout');
						opts.callbackSerialPhotosComplete.call(this);
					});
				};
			};
			// Restart LazyLoad
			restartLazyLoad();
			//return false;
		}
		function initializeLightboxes(thisFileList, currentPageList, Gallery, firstRun, Identifier) {
			// Assign Intermediary Click Event if Social Share is embedded in Thumbnail
			if ((opts.photoShowSocialShare) && (opts.photoThumbSocialShare)) {
				if (!lightboxEnabled) {
					$("a." + albumId).unbind("click").on("click", function(event){
						event.preventDefault();
						var link = $(this).attr("id");
						var target = $("#" + link).attr("target");
						if($.trim(target).length > 0) {
							window.open($("#" + link).attr("href"), target);
						} else {
							window.location = $("#" + link).attr("href", "_blank");
						};
					});
				}
				$(".Call_" + albumId).unbind("click").on("click", function(event){
					var retrieveCounter = $(this).attr("data-key");
					$('a#' + albumId + "_" + retrieveCounter).click();
				}).on('click', '.fb-photo-shareme', function(event) {
					event.stopPropagation();
				}).on("click", "a.PhotoSocialShare", function(event) {
					event.stopPropagation();
					if (opts.photoSocialSharePopup) {
						event.preventDefault();
						window.open(this.href, 'Share Photo', 'width=500, height=500');
					};
				});
			};
			// Initialize fancyBox Plugin for Photo Thumbnails
			if ((opts.fancyBoxAllow) && ($.isFunction($.fn.fancybox))) {
				if (isInIFrame) {
					$('a.' + albumId).click(function(e) {
						e.preventDefault();
						$(this).trigger('stopRumble');
						$(this).stop().animate({opacity: 1}, "slow");
						var currentImage = $(this).attr('data-key') - 1;
						$(".fb-photo-overlay").animate({opacity: 0}, "fast");
						var galleryArray = [];
						$('a.' + albumId).each(function(index){
							if ($(this).attr('href') != "undefined") {
								galleryArray.push({
									href: 	$(this).attr('href'),
									title:  $(this).attr(opts.tooltipTipAnchor),
									id:		$(this).attr('id'),
									key:	$(this).attr('data-key'),
									rel:	$(this).attr('rel'),
									short:	$(this).attr('data-short'),
									photo:	$(this).attr('data-photo')
								});
							};
						});
						if (parent.$("#FaceBookGalleryFancyBox").length > 0) {
							parent.$("#FaceBookGalleryFancyBox").empty();
							var $gallery = parent.$("#FaceBookGalleryFancyBox");
						} else {
							var $gallery = parent.$('<div id="FaceBookGalleryFancyBox">').hide().appendTo('body');
						};
						$.each(galleryArray, function(i){
							$('<a id="' + galleryArray[i].id + '" class="fancyBoxOutSource ' + albumId + '" rel="' + albumId + '" data-key="' + galleryArray[i].key + '" data-photo="' + galleryArray[i].photo + '" data-short="' + galleryArray[i].short + '" href="' + galleryArray[i].href + '" ' + opts.tooltipTipAnchor + '="' + galleryArray[i].title + '">' + galleryArray[i].id + '</a>').appendTo($gallery);
						});
						$gallery.find('a.fancyBoxOutSource').fancybox({
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
								//this.title = (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
							},
							beforeShow: function(){
								if ($(this.element).attr(opts.tooltipTipAnchor).length != 0) {
									this.title = '<div class="lightBoxInfo clearFixMe' + (opts.lightboxSocialShare ? " SocialShareFB" : "") + '">' + $(this.element).attr(opts.tooltipTipAnchor) + '</div>';
								} else {
									this.title = '<div class="lightBoxInfo clearFixMe' + (opts.lightboxSocialShare ? " SocialShareFB" : "") + '">' + opts.lightBoxNoDescription + '</div>';
								};
								if (opts.lightboxSocialShare) {
									var thisPhotoID = $(this.element).attr("data-photo");
									var thisPhotoLink = $("#ts-social-share_" + thisPhotoID + "").attr("data-share");
									var thisPhotoSave = $("#ts-social-share_" + thisPhotoID + "").attr("data-save");
									
									if (!this.title) {
										this.title = opts.lightBoxNoDescription;
									} else {
										this.title += '<br />';
									};
									this.title += '<ul id="light_ts-social-share_' + thisPhotoID + '" class="ts-social-share" style="float: right; height: 25px;">';
										this.title += '<li class="stumbleplus"><a id="Light_PhotoSocialShare_Stumble_' + thisPhotoID + '" class="Share_Stumble TipSocial' + tooltipClass + '" target="_blank" href="http://www.stumbleupon.com/submit?url=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Stumble Upon"><span class="social-icon icon-ts-stumbleupon"></span></a></li>';
										this.title += '<li class="googleplus"><a id="Light_PhotoSocialShare_Google_' + thisPhotoID + '" class="Share_Google TipSocial' + tooltipClass + '" target="_blank" href="https://plus.google.com/share?url=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Google Plus"><span class="social-icon icon-ts-googleplus"></span></a></li>';
										this.title += '<li class="twitter"><a id="Light_PhotoSocialShare_Twitter_' + thisPhotoID + '" class="Share_Twitter TipSocial' + tooltipClass + '" target="_blank" href="https://twitter.com/intent/tweet?text=' + opts.SocialSharePhotoText + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Twitter"><span class="social-icon icon-ts-twitter"></span></a></li>';
										this.title += '<li class="facebook"><a id="Light_PhotoSocialShare_Facebook_' + thisPhotoID + '" class="Share_Facebook TipSocial' + tooltipClass + '" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Facebook"><span class="social-icon icon-ts-facebook"></span></a></li>';
										this.title += '<li class="savetodisk"><a id="Light_PhotoSocialShare_Save_' + thisPhotoID + '" class="Share_Save TipSocial' + tooltipClass + '" target="_blank" href="' + thisPhotoSave + '" ' + opts.tooltipTipAnchor + '="Save this Image to disk" data-original="' + $(this.element).attr("href") + '"><span class="social-icon icon-ts-disk"></span></a></li>';
									this.title += '</ul>';
									if (opts.lightboxFacebookLike) {
										this.title += '<iframe src="//www.facebook.com/plugins/like.php?href=' + thisPhotoSave + '&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="float: right; border:none; overflow:hidden; width:100px; height:23px; margin-top: 2px;" allowTransparency="true"></iframe>';
									};
									this.title += '<br />';
								};
							},
							afterShow: function(){},
							onUpdate: function(){},
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
						parent.$('a#' + $(this).attr('id')).click();
					});
				} else {
					var fancyBoxLink = "";
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
							//this.title = $(this.element).attr(opts.tooltipTipAnchor);
						},
						beforeShow: function(){
							if ($(this.element).attr(opts.tooltipTipAnchor).length != 0) {
								this.title = '<div class="lightBoxInfo clearFixMe' + (opts.lightboxSocialShare ? " SocialShareFB" : "") + '">' + $(this.element).attr(opts.tooltipTipAnchor) + '</div>';
							} else {
								this.title = '<div class="lightBoxInfo clearFixMe' + (opts.lightboxSocialShare ? " SocialShareFB" : "") + '">' + opts.lightBoxNoDescription + '</div>';
							};
							if (opts.lightboxSocialShare) {
								var thisPhotoID = $(this.element).attr("data-photo");
								var thisPhotoLink = $("#ts-social-share_" + thisPhotoID + "").attr("data-share");
								var thisPhotoSave = $("#ts-social-share_" + thisPhotoID + "").attr("data-save");
								this.title += '<ul id="light_ts-social-share_' + thisPhotoID + '" class="ts-social-share clearFixMe" style="float: right; height: 25px;">';
									this.title += '<li class="stumbleplus"><a id="Light_PhotoSocialShare_Stumble_' + thisPhotoID + '" class="Share_Stumble TipSocial' + tooltipClass + '" target="_blank" href="http://www.stumbleupon.com/submit?url=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Stumble Upon"><span class="social-icon icon-ts-stumbleupon"></span></a></li>';
									this.title += '<li class="googleplus"><a id="Light_PhotoSocialShare_Google_' + thisPhotoID + '" class="Share_Google TipSocial' + tooltipClass + '" target="_blank" href="https://plus.google.com/share?url=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Google Plus"><span class="social-icon icon-ts-googleplus"></span></a></li>';
									this.title += '<li class="twitter"><a id="Light_PhotoSocialShare_Twitter_' + thisPhotoID + '" class="Share_Twitter TipSocial' + tooltipClass + '" target="_blank" href="https://twitter.com/intent/tweet?text=' + opts.SocialSharePhotoText + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Twitter"><span class="social-icon icon-ts-twitter"></span></a></li>';
									this.title += '<li class="facebook"><a id="Light_PhotoSocialShare_Facebook_' + thisPhotoID + '" class="Share_Facebook TipSocial' + tooltipClass + '" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Facebook"><span class="social-icon icon-ts-facebook"></span></a></li>';
									this.title += '<li class="savetodisk"><a id="Light_PhotoSocialShare_Save_' + thisPhotoID + '" class="Share_Save TipSocial' + tooltipClass + '" target="_blank" href="' + thisPhotoSave + '" ' + opts.tooltipTipAnchor + '="Save this Image to disk" data-original="' + $(this.element).attr("href") + '"><span class="social-icon icon-ts-disk"></span></a></li>';
								this.title += '</ul>';
								if (opts.lightboxFacebookLike) {
									this.title += '<iframe src="//www.facebook.com/plugins/like.php?href=' + thisPhotoSave + '&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="float: right; border:none; overflow:hidden; width:100px; height:23px; margin-top: 2px;" allowTransparency="true"></iframe>';
								};
								this.title += '<br />';
							};
						},
						afterShow: function(){},
						onUpdate: function(){},
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
				};
			};
			// Initialize colorBox Plugin for Photo Thumbnails
			if ((opts.colorBoxAllow) && ($.isFunction($.fn.colorbox))) {
				if (isInIFrame) {
					$('a.' + albumId).click(function(e) {
						e.preventDefault();
						$(this).trigger('stopRumble');
						$(this).stop().animate({opacity: 1}, "slow");
						var currentImage = $(this).attr('data-key') - 1;
						$(".fb-photo-overlay").animate({opacity: 0}, "fast");
						var galleryArray = [];
						$('a.' + albumId).each(function(index){
							if ($(this).attr('href') != "undefined") {
								galleryArray.push({
									href: 	$(this).attr('href'),
									title:  $(this).attr(opts.tooltipTipAnchor),
									id:		$(this).attr('id'),
									key:	$(this).attr('data-key'),
									rel:	$(this).attr('rel'),
									short:	$(this).attr('data-short'),
									photo:	$(this).attr('data-photo')
								});
							};
						});
						if (parent.$("#FaceBookGalleryColorBox").length > 0) {
							parent.$("#FaceBookGalleryColorBox").empty();
							var $gallery = parent.$("#FaceBookGalleryColorBox");
						} else {
							var $gallery = parent.$('<div id="FaceBookGalleryColorBox">').hide().appendTo('body');
						};
						$.each(galleryArray, function(i){
							$('<a id="' + galleryArray[i].id + '" class="ColorBoxOutSource" rel="' + galleryArray[i].rel + '" data-key="' + galleryArray[i].key + '" data-photo="' + galleryArray[i].photo + '" data-short="' + galleryArray[i].short + '" href="' + galleryArray[i].href + '" title="' + galleryArray[i].title + '">' + galleryArray[i].id + '</a>').appendTo($gallery);
						});
						$gallery.find('a.ColorBoxOutSource').colorbox({
							rel:				albumId,
							scalePhotos: 		true,
							maxWidth:			'100%',
							maxHeight:			'100%',
							scrolling:			false,
							returnFocus:		false,
							slideshow:			true,
							slideshowSpeed:		6000,
							slideshowAuto:		false,
							slideshowStart:		'<span id="cboxPlay"></span>',
							slideshowStop:		'<span id="cboxStop"></span>',
							current: 			'Image {current} of {total}',
							title: 				function(){
								var thisPhotoText = 	$(this).attr(opts.tooltipTipAnchor);
								var thisPhotoInfo = 	"";
								var thisPhotoID = 		$(this).attr("data-photo");
								var thisPhotoLink = $("#ts-social-share_" + thisPhotoID + "").attr("data-share");
								var thisPhotoSave = $("#ts-social-share_" + thisPhotoID + "").attr("data-save");
								if (thisPhotoText.length != 0) {
									if (opts.createTooltipsLightbox) {
										thisPhotoInfo = '<div class="TipLightbox clearFixMe lightBoxInfo ' + tooltipClass + (opts.lightboxSocialShare ? " SocialShareCB" : "") + '" style="cursor: pointer;" ' + opts.tooltipTipAnchor + '="' + thisPhotoText + '">' + thisPhotoText + '</div>';
									} else {
										thisPhotoInfo = '<div class="clearFixMe lightBoxInfo' + (opts.lightboxSocialShare ? " SocialShareCB" : "") + '">' + thisPhotoText + '</div>';
									}
								} else {
									thisPhotoInfo = '<div class="clearFixMe lightBoxInfo' + (opts.lightboxSocialShare ? " SocialShareCB" : "") + '">' + opts.lightBoxNoDescription + '</div>';
								};
								if (opts.lightboxSocialShare) {
									thisPhotoInfo += '<br />';
									thisPhotoInfo += '<ul id="light_ts-social-share_' + thisPhotoID + '" class="ts-social-share" style="float: right; height: 25px; margin-right: 10px;">';
										thisPhotoInfo += '<li class="stumbleplus"><a id="Light_PhotoSocialShare_Stumble_' + thisPhotoID + '" class="Share_Stumble TipSocial' + tooltipClass + '" target="_blank" href="http://www.stumbleupon.com/submit?url=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Stumble Upon"><span class="social-icon icon-ts-stumbleupon"></span></a></li>';
										thisPhotoInfo += '<li class="googleplus"><a id="Light_PhotoSocialShare_Google_' + thisPhotoID + '" class="Share_Google TipSocial' + tooltipClass + '" target="_blank" href="https://plus.google.com/share?url=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Google Plus"><span class="social-icon icon-ts-googleplus"></span></a></li>';
										thisPhotoInfo += '<li class="twitter"><a id="Light_PhotoSocialShare_Twitter_' + thisPhotoID + '" class="Share_Twitter TipSocial' + tooltipClass + '" target="_blank" href="https://twitter.com/intent/tweet?text=' + opts.SocialSharePhotoText + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Twitter"><span class="social-icon icon-ts-twitter"></span></a></li>';
										thisPhotoInfo += '<li class="facebook"><a id="Light_PhotoSocialShare_Facebook_' + thisPhotoID + '" class="Share_Facebook TipSocial' + tooltipClass + '" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Facebook"><span class="social-icon icon-ts-facebook"></span></a></li>';
										thisPhotoInfo += '<li class="savetodisk"><a id="Light_PhotoSocialShare_Save_' + thisPhotoID + '" class="Share_Save TipSocial' + tooltipClass + '" target="_blank" href="' + thisPhotoSave + '" ' + opts.tooltipTipAnchor + '="Save this Image to disk" data-original="' + $(this.element).attr("href") + '"><span class="social-icon icon-ts-disk"></span></a></li>';
									thisPhotoInfo += '</ul>';
									if (opts.lightboxFacebookLike) {
										thisPhotoInfo += '<iframe src="//www.facebook.com/plugins/like.php?href=' + thisPhotoSave + '&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="float: right; border:none; overflow:hidden; width:100px; height:23px; margin-top: 2px;" allowTransparency="true"></iframe>';
									};
									thisPhotoInfo += '<br />';
								};
								return thisPhotoInfo;
							},
							onOpen: 			function(){},
							onLoad: 			function(){},
							onComplete:			function(){},
							onCleanup: 			function(){},
							onClosed: 			function(){}
						});
						parent.$('a#' + $(this).attr('id')).click();
					});
				} else {
					$('a.' + albumId).colorbox({
						rel: 				albumId,
						scalePhotos: 		true,
						maxWidth:			'100%',
						maxHeight:			'100%',
						scrolling:			false,
						returnFocus:		false,
						slideshow:			true,
						slideshowSpeed:		6000,
						slideshowAuto:		false,
						slideshowStart:		'<span id="cboxPlay"></span>',
						slideshowStop:		'<span id="cboxStop"></span>',
						current: 			'Image {current} of {total}',
						title: 				function(){
							var thisPhotoText = 	$(this).attr(opts.tooltipTipAnchor);
							var thisPhotoInfo = 	"";
							var thisPhotoID = 		$(this).attr("data-photo");
							var thisPhotoLink = $("#ts-social-share_" + thisPhotoID + "").attr("data-share");
							var thisPhotoSave = $("#ts-social-share_" + thisPhotoID + "").attr("data-save");
							if (thisPhotoText.length != 0) {
								if (opts.createTooltipsLightbox) {
									thisPhotoInfo = '<div class="TipLightbox clearFixMe lightBoxInfo ' + tooltipClass + (opts.lightboxSocialShare ? " SocialShareCB" : "") + '" style="cursor: pointer;" ' + opts.tooltipTipAnchor + '="' + thisPhotoText + '">' + thisPhotoText + '</div>';
								} else {
									thisPhotoInfo = '<div class="clearFixMe lightBoxInfo' + (opts.lightboxSocialShare ? " SocialShareCB" : "") + '">' + thisPhotoText + '</div>';
								};
							} else {
								thisPhotoInfo = '<div class="clearFixMe lightBoxInfo' + (opts.lightboxSocialShare ? " SocialShareCB" : "") + '">' + opts.lightBoxNoDescription + '</div>';
							};
							if (opts.lightboxSocialShare) {
								thisPhotoInfo += '<br />';
								thisPhotoInfo += '<ul id="light_ts-social-share_' + thisPhotoID + '" class="ts-social-share" style="float: right; height: 25px; margin-right: 10px;">';
									thisPhotoInfo += '<li class="stumbleplus"><a id="Light_PhotoSocialShare_Stumble_' + thisPhotoID + '" class="Share_Stumble TipSocial' + tooltipClass + '" target="_blank" href="http://www.stumbleupon.com/submit?url=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Stumble Upon"><span class="social-icon icon-ts-stumbleupon"></span></a></li>';
									thisPhotoInfo += '<li class="googleplus"><a id="Light_PhotoSocialShare_Google_' + thisPhotoID + '" class="Share_Google TipSocial' + tooltipClass + '" target="_blank" href="https://plus.google.com/share?url=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Google Plus"><span class="social-icon icon-ts-googleplus"></span></a></li>';
									thisPhotoInfo += '<li class="twitter"><a id="Light_PhotoSocialShare_Twitter_' + thisPhotoID + '" class="Share_Twitter TipSocial' + tooltipClass + '" target="_blank" href="https://twitter.com/intent/tweet?text=' + opts.SocialSharePhotoText + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Twitter"><span class="social-icon icon-ts-twitter"></span></a></li>';
									thisPhotoInfo += '<li class="facebook"><a id="Light_PhotoSocialShare_Facebook_' + thisPhotoID + '" class="Share_Facebook TipSocial' + tooltipClass + '" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Facebook"><span class="social-icon icon-ts-facebook"></span></a></li>';
									thisPhotoInfo += '<li class="savetodisk"><a id="Light_PhotoSocialShare_Save_' + thisPhotoID + '" class="Share_Save TipSocial' + tooltipClass + '" target="_blank" href="' + thisPhotoSave + '" ' + opts.tooltipTipAnchor + '="Save this Image to disk" data-original="' + $(this.element).attr("href") + '"><span class="social-icon icon-ts-disk"></span></a></li>';
								thisPhotoInfo += '</ul>';
								if (opts.lightboxFacebookLike) {
									thisPhotoInfo += '<iframe src="//www.facebook.com/plugins/like.php?href=' + thisPhotoSave + '&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="float: right; border:none; overflow:hidden; width:100px; height:23px; margin-top: 2px;" allowTransparency="true"></iframe>';
								};
								thisPhotoInfo += '<br />';
							};
							return thisPhotoInfo;
						},
						onOpen: 			function(){},
						onLoad: 			function(){},
						onComplete:			function(){},
						onCleanup: 			function(){},
						onClosed: 			function(){}
					});
				};
			};
			// Initialize prettyPhoto Plugin for Photo Thumbnails
			if ((opts.prettyPhotoAllow) && ($.isFunction($.fn.prettyPhoto))) {
				if (isInIFrame) {
					$('a.' + albumId).click(function(e) {
						e.preventDefault();
						$(this).trigger('stopRumble');
						$(this).stop().animate({opacity: 1}, "slow");
						var currentImage = $(this).attr('data-key') - 1;
						$(".fb-photo-overlay").animate({opacity: 0}, "fast");
						var galleryArray = [];
						$('a.' + albumId).each(function(index){
							if ($(this).attr('href') != "undefined") {
								galleryArray.push({
									href: 	$(this).attr('href'),
									title:  $(this).attr(opts.tooltipTipAnchor),
									id:		$(this).attr('id'),
									key:	$(this).attr('data-key'),
									rel:	$(this).attr('rel'),
									short:	$(this).attr('data-short'),
									photo:	$(this).attr('data-photo')
								});
							};
						});
						if (parent.$("#FaceBookGalleryPrettyPhoto").length > 0) {
							parent.$("#FaceBookGalleryPrettyPhoto").empty();
							var $gallery = parent.$("#FaceBookGalleryPrettyPhoto");
						} else {
							var $gallery = parent.$('<div id="FaceBookGalleryPrettyPhoto">').hide().appendTo('body');
						};
						$.each(galleryArray, function(i){
							$('<a id="' + galleryArray[i].id + '" class="prettyPhotoOutSource" rel="prettyPhoto[' + albumId + ']" data-key="' + galleryArray[i].key + '" data-photo="' + galleryArray[i].photo + '" data-short="' + galleryArray[i].short + '" href="' + galleryArray[i].href + '" title="' + galleryArray[i].title + '">' + galleryArray[i].id + '</a>').appendTo($gallery);
						});
						$gallery.find('a.prettyPhotoOutSource[rel^="prettyPhoto"]').prettyPhoto({
							animation_speed: 			'fast', 			/* fast/slow/normal */
							slideshow: 					8000, 				/* false OR interval time in ms */
							autoplay_slideshow: 		false, 				/* true/false */
							opacity: 					0.80, 				/* Value between 0 and 1 */
							show_title: 				true, 				/* true/false */
							allow_resize: 				true, 				/* Resize the photos bigger than viewport. true/false */
							counter_separator_label: 	'/', 				/* The separator for the gallery counter 1 "of" 2 */
							theme: 						'facebook', 		/* light_rounded / dark_rounded / light_square / dark_square / facebook */
							horizontal_padding: 		20, 				/* The padding on each side of the picture */
							hideflash: 					false, 				/* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
							wmode: 						'opaque', 			/* Set the flash wmode attribute */
							autoplay: 					true, 				/* Automatically start videos: True/False */
							modal: 						false, 				/* If set to true, only the close button will close the window */
							deeplinking: 				false, 				/* Allow prettyPhoto to update the url to enable deeplinking. */
							overlay_gallery: 			true, 				/* If set to true, a gallery will overlay the fullscreen image on mouse over */
							keyboard_shortcuts: 		true, 				/* Set to false if you open forms inside prettyPhoto */
							changepicturecallback: 		function(){			/* Called everytime a photo is shown/changed */
								if (opts.lightboxSocialShare) {
									var thisPhotoID 	= $(this).attr("data-photo");
									var thisPhotoLink	= $("#ts-social-share_" + thisPhotoID + "").attr("data-share");
									var thisPhotoSave 	= $("#ts-social-share_" + thisPhotoID + "").attr("data-save");
									parent.$(".Share_PrettyPhoto").each(function(index, value) {
										var currentHREF = $(this).attr("data-href");
										//currentHREF += parent.$('#fullResImage').attr("src");
										currentHREF += thisPhotoLink;
										if ($(this).hasClass("Share_Save")) {
											$(this).attr("href", thisPhotoSave);
										} else {
											$(this).attr("href", currentHREF);
										};
									});
									if (opts.lightboxFacebookLike) {
										$("#Like_Facebook").attr("src", "//www.facebook.com/plugins/like.php?href=" + thisPhotoSave + "&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23");   
									} else {
										$("#Like_Facebook_DIV").remove();
									};
								}  else {
									$("#light_ts-social-share").remove();
									$("#Like_Facebook_DIV").remove();
								};
							},
							callback: 					function(){}, 		/* Called when prettyPhoto is closed */
							ie6_fallback: 				false,
							markup: 					'<div class="pp_pic_holder"> \
															<div class="ppt">&nbsp;</div> \
															<div class="pp_top"> \
																<div class="pp_left"></div> \
																<div class="pp_middle"></div> \
																<div class="pp_right"></div> \
															</div> \
															<div class="pp_content_container"> \
																<div class="pp_left"> \
																<div class="pp_right"> \
																	<div class="pp_content"> \
																		<div class="pp_loaderIcon"></div> \
																		<div class="pp_fade"> \
																			<a href="#" class="pp_expand" title="Expand the Image">Expand</a> \
																			<div class="pp_hoverContainer"> \
																				<a class="pp_next" href="#">next</a> \
																				<a class="pp_previous" href="#">previous</a> \
																			</div> \
																			<div id="pp_full_res"></div> \
																			<div class="pp_details"> \
																				<div class="clearFixMe"> \
																					<div class="pp_nav"> \
																						<a href="#" class="pp_arrow_previous">Previous</a> \
																						<p class="currentTextHolder">0/0</p> \
																						<a href="#" class="pp_arrow_next">Next</a> \
																					</div> \
																					<ul id="light_ts-social-share" class="ts-social-share clearFixMe" style="float: right; height: 25px; margin-right: 40px; display: ' + (opts.lightboxSocialShare == true ? "block;" : "none;") + '"> \
																						<li class="share_stumbleplus"><a id="Light_PhotoSocialShare_Stumble" class="Share_PrettyPhoto Share_Stumble TipSocial" target="_blank" data-href="http://www.stumbleupon.com/submit?url=" href="http://www.stumbleupon.com/submit?url=" ' + opts.tooltipTipAnchor + '="Share this Image on Stumble Upon"><span class="social-icon icon-ts-stumbleupon"></span></a></li> \
																						<li class="share_googleplus"><a id="Light_PhotoSocialShare_Google" class="Share_PrettyPhoto Share_Google TipSocial" target="_blank" data-href="https://plus.google.com/share?url=" href="https://plus.google.com/share?url=" ' + opts.tooltipTipAnchor + '="Share this Image on Google Plus"><span class="social-icon icon-ts-googleplus"></span></a></li> \
																						<li class="share_twitter"><a id="Light_PhotoSocialShare_Twitter" class="Share_PrettyPhoto Share_Twitter TipSocial" target="_blank" data-href="https://twitter.com/intent/tweet?text=' + opts.SocialSharePhotoText + '" href="https://twitter.com/intent/tweet?text=' + opts.SocialSharePhotoText + '" ' + opts.tooltipTipAnchor + '="Share this Image on Twitter"><span class="social-icon icon-ts-twitter"></span></a></li> \
																						<li class="share_facebook"><a id="Light_PhotoSocialShare_Facebook" class="Share_PrettyPhoto Share_Facebook TipSocial" target="_blank" data-href="https://www.facebook.com/sharer/sharer.php?u=" href="https://www.facebook.com/sharer/sharer.php?u=" ' + opts.tooltipTipAnchor + '="Share this Image on Facebook"><span class="social-icon icon-ts-facebook"></span></a></li> \
																						<li class="share_savetodisk"><a id="Light_PhotoSocialShare_Save" class="Share_PrettyPhoto Share_Save TipSocial" target="_blank" data-href="" href="" ' + opts.tooltipTipAnchor + '="Save this Image to disk" data-original="' + location.href + '"><span class="social-icon icon-ts-disk"></span></a></li> \
																					</ul> \
																					{pp_social} \
																					<a class="pp_close" href="#">Close</a> \
																				</div> \
																				<div id="Like_Facebook_DIV" class="clearFixMe" style="float: left;"> \
																					<iframe id="Like_Facebook" name="Like_Facebook" src="//www.facebook.com/plugins/like.php?href=#" scrolling="no" frameborder="0" style="float: left; border:none; overflow:hidden; width:auto; height:23px; margin-top: 2px;" allowTransparency="true"></iframe> \
																				</div> \
																				<div class="clearFixMe lightBoxInfo' + (opts.lightboxSocialShare ? " SocialSharePP" : "") + '" style="float: left;"><p class="pp_description">' + opts.lightBoxNoDescription + '</p></div> \
																			</div> \
																		</div> \
																	</div> \
																</div> \
																</div> \
															</div> \
															<div class="pp_bottom"> \
																<div class="pp_left"></div> \
																<div class="pp_middle"></div> \
																<div class="pp_right"></div> \
															</div> \
														</div> \
														<div class="pp_overlay"></div>',
							social_tools: 				''
						});
						parent.$('a#' + $(this).attr('id')).click();
					});
				} else {
					$('a.' + albumId + '[rel^="prettyPhoto"]').prettyPhoto({
						animation_speed: 			'fast', 			/* fast/slow/normal */
						slideshow: 					8000, 				/* false OR interval time in ms */
						autoplay_slideshow: 		false, 				/* true/false */
						opacity: 					0.80, 				/* Value between 0 and 1 */
						show_title: 				true, 				/* true/false */
						allow_resize: 				true, 				/* Resize the photos bigger than viewport. true/false */
						counter_separator_label: 	'/', 				/* The separator for the gallery counter 1 "of" 2 */
						theme: 						'facebook', 		/* light_rounded / dark_rounded / light_square / dark_square / facebook */
						horizontal_padding: 		20, 				/* The padding on each side of the picture */
						hideflash: 					false, 				/* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
						wmode: 						'opaque', 			/* Set the flash wmode attribute */
						autoplay: 					true, 				/* Automatically start videos: True/False */
						modal: 						false, 				/* If set to true, only the close button will close the window */
						deeplinking: 				false, 				/* Allow prettyPhoto to update the url to enable deeplinking. */
						overlay_gallery: 			true, 				/* If set to true, a gallery will overlay the fullscreen image on mouse over */
						keyboard_shortcuts: 		true, 				/* Set to false if you open forms inside prettyPhoto */
						changepicturecallback: 		function(){			/* Called everytime a photo is shown/changed */
							if (opts.lightboxSocialShare) {
								var thisPhotoID 	= $(this).attr("data-photo");
								var thisPhotoLink	= $("#ts-social-share_" + thisPhotoID + "").attr("data-share");
								var thisPhotoSave 	= $("#ts-social-share_" + thisPhotoID + "").attr("data-save");
								$("a.Share_PrettyPhoto").each(function(index, value) {
									var currentHREF = $(this).attr("data-href");
									//currentHREF += $('#fullResImage').attr("src");
									currentHREF += thisPhotoLink;
									if ($(this).hasClass("Share_Save")) {
										$(this).attr("href", thisPhotoSave);
									} else {
										$(this).attr("href", currentHREF);
									};
								});
								if (opts.lightboxFacebookLike) {
									$("#Like_Facebook").attr("src", "//www.facebook.com/plugins/like.php?href=" + thisPhotoSave + "&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23");   
								} else {
									$("#Like_Facebook_DIV").remove();
								};
							} else {
								$("#light_ts-social-share").remove();
								$("#Like_Facebook_DIV").remove();
							};
						},
						callback: 					function(){}, 		/* Called when prettyPhoto is closed */
						ie6_fallback: 				false,
						markup: 					'<div class="pp_pic_holder"> \
														<div class="ppt">&nbsp;</div> \
														<div class="pp_top"> \
															<div class="pp_left"></div> \
															<div class="pp_middle"></div> \
															<div class="pp_right"></div> \
														</div> \
														<div class="pp_content_container"> \
															<div class="pp_left"> \
															<div class="pp_right"> \
																<div class="pp_content"> \
																	<div class="pp_loaderIcon"></div> \
																	<div class="pp_fade"> \
																		<a href="#" class="pp_expand" title="Expand the Image">Expand</a> \
																		<div class="pp_hoverContainer"> \
																			<a class="pp_next" href="#">next</a> \
																			<a class="pp_previous" href="#">previous</a> \
																		</div> \
																		<div id="pp_full_res"></div> \
																		<div class="pp_details"> \
																			<div class="clearFixMe"> \
																				<div class="pp_nav"> \
																					<a href="#" class="pp_arrow_previous">Previous</a> \
																					<p class="currentTextHolder">0/0</p> \
																					<a href="#" class="pp_arrow_next">Next</a> \
																				</div> \
																				<ul id="light_ts-social-share" class="ts-social-share clearFixMe" style="float: right; height: 25px; margin-right: 40px; display: ' + (opts.lightboxSocialShare == true ? "block;" : "none;") + '"> \
																					<li class="share_stumbleplus"><a id="Light_PhotoSocialShare_Stumble" class="Share_PrettyPhoto Share_Stumble TipSocial" target="_blank" data-href="http://www.stumbleupon.com/submit?url=" href="http://www.stumbleupon.com/submit?url=" ' + opts.tooltipTipAnchor + '="Share this Image on Stumble Upon"><span class="social-icon icon-ts-stumbleupon"></span></a></li> \
																					<li class="share_googleplus"><a id="Light_PhotoSocialShare_Google" class="Share_PrettyPhoto Share_Google TipSocial" target="_blank" data-href="https://plus.google.com/share?url=" href="https://plus.google.com/share?url=" ' + opts.tooltipTipAnchor + '="Share this Image on Google Plus"><span class="social-icon icon-ts-googleplus"></span></a></li> \
																					<li class="share_twitter"><a id="Light_PhotoSocialShare_Twitter" class="Share_PrettyPhoto Share_Twitter TipSocial" target="_blank" data-href="https://twitter.com/intent/tweet?text=' + opts.SocialSharePhotoText + '" href="https://twitter.com/intent/tweet?text=' + opts.SocialSharePhotoText + '" ' + opts.tooltipTipAnchor + '="Share this Image on Twitter"><span class="social-icon icon-ts-twitter"></span></a></li> \
																					<li class="share_facebook"><a id="Light_PhotoSocialShare_Facebook" class="Share_PrettyPhoto Share_Facebook TipSocial" target="_blank" data-href="https://www.facebook.com/sharer/sharer.php?u=" href="https://www.facebook.com/sharer/sharer.php?u=" ' + opts.tooltipTipAnchor + '="Share this Image on Facebook"><span class="social-icon icon-ts-facebook"></span></a></li> \
																					<li class="share_savetodisk"><a id="Light_PhotoSocialShare_Save" class="Share_PrettyPhoto Share_Save TipSocial" target="_blank" data-href="" href="" ' + opts.tooltipTipAnchor + '="Save this Image to disk" data-original="' + location.href + '"><span class="social-icon icon-ts-disk"></span></a></li> \
																				</ul> \
																				{pp_social} \
																				<a class="pp_close" href="#">Close</a> \
																			</div> \
																			<div id="Like_Facebook_DIV" class="clearFixMe" style="float: left;"> \
																				<iframe id="Like_Facebook" name="Like_Facebook" src="//www.facebook.com/plugins/like.php?href=#" scrolling="no" frameborder="0" style="float: left; border:none; overflow:hidden; width:auto; height:23px; margin-top: 2px;" allowTransparency="true"></iframe> \
																			</div> \
																			<div class="clearFixMe lightBoxInfo' + (opts.lightboxSocialShare ? " SocialSharePP" : "") + '" style="float: left;"><p class="pp_description">' + opts.lightBoxNoDescription + '</p></div> \
																		</div> \
																	</div> \
																</div> \
															</div> \
															</div> \
														</div> \
														<div class="pp_bottom"> \
															<div class="pp_left"></div> \
															<div class="pp_middle"></div> \
															<div class="pp_right"></div> \
														</div> \
													</div> \
													<div class="pp_overlay"></div>',
						social_tools: 				''
					});
				};
			};
			// Initialize photoBox Plugin for Photo Thumbnails
			if ((opts.photoBoxAllow) && ($.isFunction($.fn.photobox))) {
				if (isInIFrame) {
					$('a.' + albumId).click(function(e) {
						e.preventDefault();
						$(this).trigger('stopRumble');
						$(this).stop().animate({opacity: 1}, "slow");
						var currentImage = $(this).attr('data-key') - 1;
						$(".fb-photo-overlay").animate({opacity: 0}, "fast");
						var galleryArray = [];
						$('a.' + albumId).each(function(index){
							if ($(this).attr('href') != "undefined") {
								galleryArray.push({
									href: 	$(this).attr('href'),
									title:  $(this).attr(opts.tooltipTipAnchor),
									id:		$(this).attr('id'),
									key:	$(this).attr('data-key'),
									rel:	$(this).attr('rel'),
									short:	$(this).attr('data-short'),
									photo:	$(this).attr('data-photo')
								});
							};
						});
						if (parent.$("#FaceBookGalleryPhotoBox").length > 0) {
							parent.$("#FaceBookGalleryPhotoBox").empty();
							var $gallery = parent.$("#FaceBookGalleryPhotoBox");
						} else {
							var $gallery = parent.$('<div id="FaceBookGalleryPhotoBox">').hide().appendTo('body');
						};
						$.each(galleryArray, function(i){
							$('<a id="' + galleryArray[i].id + '" class="photoBoxOutSource ' + albumId + '" rel="' + albumId + '" data-key="' + galleryArray[i].key + '" data-photo="' + galleryArray[i].photo + '" data-short="' + galleryArray[i].short + '" href="' + galleryArray[i].href + '" ' + opts.tooltipTipAnchor + '="' + galleryArray[i].title + '"><img style="width: 50px; height: auto;" src="' + galleryArray[i].href + '"></a>').appendTo($gallery);
						});
						parent.$('#FaceBookGalleryPhotoBox').photobox('a.' + albumId, {
							history:			false,
							time:				5000,
							counter:			true,
							autoplay:			false,
							thumbs:				opts.photoBoxThumbs
						}, photoBoxCallback);
						parent.$('a#' + $(this).attr('id')).click();
					});
				} else {
					$('#fb-album-' + albumId).photobox('.photoWrapper a.' + albumId, {
						history:			false,
						time:				5000,
						counter:			true,
						autoplay:			false,
						thumbs:				opts.photoBoxThumbs
					}, photoBoxCallback);
				};
			};
		};
		function photoBoxCallback(){
			var currentTitle = $("#pbOverlay #pbCaption .pbCaptionText .title").html();
			var currentAlbum = $(this).attr("data-album");
			var currentPhoto = $(this).attr("data-photo");
			var currentKey = $(this).attr("data-key");
			var thisPhotoLink = $("#ts-social-share_" + currentPhoto + "").attr("data-share");
			var thisPhotoSave = $("#ts-social-share_" + currentPhoto + "").attr("data-save");
			if (currentTitle.length == 0) {
				$("#pbOverlay #pbCaption .pbCaptionText .title").html(opts.lightBoxNoDescription);
			};
			$("#pbOverlay").attr("data-album", currentAlbum).attr("data-photo", currentPhoto);
			if (opts.lightboxSocialShare) {
				var socialTitle = '<div class="photoBoxSocial clearFixMe" style="margin: 10px auto; width: 130px; z-index: 999999;">';
				socialTitle += '<ul id="ts-social-share_' + currentPhoto + '" data-parent="' + currentAlbum + '_' + currentKey + '" class="ts-social-share" style="">';
					socialTitle += '<li class="stumbleplus"><a id="PhotoSocialShare_Stumble_' + currentPhoto + '" class="Share_Stumble TipSocial' + tooltipClass + '" target="_blank" href="http://www.stumbleupon.com/submit?url=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Stumble Upon"><span class="social-icon icon-ts-stumbleupon"></span></a></li>';
					socialTitle += '<li class="googleplus"><a id="PhotoSocialShare_Google_' + currentPhoto + '" class="Share_Google TipSocial' + tooltipClass + '" target="_blank" href="https://plus.google.com/share?url=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Google Plus"><span class="social-icon icon-ts-googleplus"></span></a></li>';
					socialTitle += '<li class="twitter"><a id="PhotoSocialShare_Twitter_' + currentPhoto + '" class="Share_Twitter TipSocial' + tooltipClass + '" target="_blank" href="https://twitter.com/intent/tweet?text=' + opts.SocialSharePhotoText + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Twitter"><span class="social-icon icon-ts-twitter"></span></a></li>';
					socialTitle += '<li class="facebook"><a id="PhotoSocialShare_Facebook_' + currentPhoto + '" class="Share_Facebook TipSocial' + tooltipClass + '" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + thisPhotoLink + '" ' + opts.tooltipTipAnchor + '="Share this Image on Facebook"><span class="social-icon icon-ts-facebook"></span></a></li>';
					socialTitle += '<li class="savetodisk"><a id="PhotoSocialShare_Save_' + currentPhoto + '" class="Share_Save TipSocial' + tooltipClass + '" target="_blank" href="' + thisPhotoSave + '" ' + opts.tooltipTipAnchor + '="Save this Image to disk"><span class="social-icon icon-ts-disk"></span></a></li>';
				socialTitle += '</ul>';
				if (opts.lightboxFacebookLike) {
					socialTitle += '<iframe src="//www.facebook.com/plugins/like.php?href=' + thisPhotoSave + '&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="float: right; border:none; overflow:hidden; width:100px; height:23px; margin-top: 2px;" allowTransparency="true"></iframe>';
				};
				socialTitle += '</div>';
				$("#pbOverlay #pbCaption .pbCaptionText .photoBoxSocial").remove();
				$("#pbOverlay #pbCaption .pbCaptionText").prepend(socialTitle);
			};
		}
		function initialSorting(thisFileList, currentPageList, Gallery) {
			if (Gallery) {
				if (defaultSortTypeAlbums == 'albumTitle') 				{sortType = "bytitle"
				} else if (defaultSortTypeAlbums == 'numberItems') 		{sortType = "bysize"
				} else if (defaultSortTypeAlbums == 'createDate') 		{sortType = "bycreate"
				} else if (defaultSortTypeAlbums == 'updateDate') 		{sortType = "byupdate"
				} else if (defaultSortTypeAlbums == 'orderFacebook') 	{sortType = "byorder"
				} else if (defaultSortTypeAlbums == 'FacebookID') 		{sortType = "byID"
				} else if (defaultSortTypeAlbums == 'orderPreSet') 		{
					if (opts.showSelectionOnly) {
						sortType = "bypreset"
					} else {
						sortType = "bytitle"
					};
				};
				sortGallery((opts.defaultSortDirectionASC == true ? "asc" : "dec"), sortType, thisFileList, Gallery);
			} else {
				if (defaultSortTypePhotos == 'addedDate') 				{sortType = "byadded"
				} else if (defaultSortTypePhotos == 'updateDate') 		{sortType = "byupdate"
				} else if (defaultSortTypePhotos == 'orderFacebook') 	{sortType = "byorder"
				} else if (defaultSortTypePhotos == 'FacebookID') 		{sortType = "byID"
				};
				sortGallery((opts.defaultPhotoDirectionsASC == true ? "asc" : "dec"), sortType, thisFileList, Gallery);
			};
		};
		function sortGallery(direction, sortType, thisFileList, Gallery){
			thisFileList.filteredThumbs.remove();
			var sortAlg = direction + "_" + sortType;
			switch (sortAlg){
				case 'asc_byorder':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(asc_byorder);
					break;
				case 'dec_byorder':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(dec_byorder);
					break;
				case 'asc_bysize':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(asc_bysize);
					break;
				case 'dec_bysize':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(dec_bysize);
					break;
				case 'asc_bycreate':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(asc_bycreate);
					break;
				case 'dec_bycreate':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(dec_bycreate);
					break;
				case 'asc_byupdate':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(asc_byupdate);
					break;
				case 'dec_byupdate':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(dec_byupdate);
					break;
				case 'asc_bytitle':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(asc_bytitle);
					break;
				case 'dec_bytitle':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(dec_bytitle);
					break;
				case 'asc_byadded':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(asc_byadded);
					break;
				case 'dec_byadded':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(dec_byadded);
					break;
				case 'asc_byID':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(asc_byID);
					break;
				case 'dec_byID':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(dec_byID);
					break;
				case 'asc_bypreset':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(asc_bypreset);
					break;
				case 'dec_bypreset':
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(dec_bypreset);
					break;
				default:
					thisFileList.filteredThumbs = thisFileList.filteredThumbs.sort(asc_bytitle);
					break;
			};
			thisFileList.fileContainer.hide().append(thisFileList.filteredThumbs).fadeIn('slow');
			// Restart LazyLoad
			restartLazyLoad();
		};
		function restartLazyLoad() {
			if ((opts.imageLazyLoad) && ($.isFunction($.fn.lazyloadanything))) {
				$.fn.lazyloadanything('load');
			};
		};
		function shortLinkAlbumShares(Identifier) {
			// Check for and implement URL Shortener Service for Album Share URLs
			if ((opts.albumShowSocialShare) && (opts.albumShortSocialShare)) {
				if (typeof ajaxRequest !== 'undefined') {
					ajaxRequest.abort();
				};
				$.each(AlbumIDsArray, function(i, albumShare){
					var ShortURL = AlbumIDsArray[i].clean;
					var SocialShareText = opts.SocialShareAlbumText;
					if (ShortURL.length == 0) {
						ajaxRequest = $.ajax({
							url: 			"http://safe.mn/api/shorten?format=jsonp&callback=?&url=" + fixedEncodeURIComponent(AlbumIDsArray[i].link),
							cache: 			false,
							dataType: 		"jsonp",
							success: function(data, textStatus){
								if (data.url) {
									ShortURL = data.url;
									var shareLinkTwitter = 	'https://twitter.com/intent/tweet?text=' + SocialShareText + ShortURL;
									var shareLinkGoogle = 	'https://plus.google.com/share?url=' + ShortURL;
									var shareLinkFacebook = 'http://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + ShortURL + '&p[images][0]=' + AlbumIDsArray[i].thumb + '&p[title]=' + SocialShareText + '&p[summary]=' + AlbumIDsArray[i].summary;
									var shareLinkStumble = 	'http://www.stumbleupon.com/submit?url=' + ShortURL;
									$("#AlbumSocialShare_Twitter_" + AlbumIDsArray[i].id + "").attr("href", shareLinkTwitter);
									$("#AlbumSocialShare_Google_" + AlbumIDsArray[i].id + "").attr("href", shareLinkGoogle);
									$("#AlbumSocialShare_Facebook_" + AlbumIDsArray[i].id + "").attr("href", shareLinkFacebook);
									$("#AlbumSocialShare_Stumble_" + AlbumIDsArray[i].id + "").attr("href", shareLinkStumble);
									AlbumIDsArray[i].clean = ShortURL;
									if (opts.consoleLogging) {
										console.log('The Share URL for Album #' + AlbumIDsArray[i].id + ' has been shortened to: ' + ShortURL);
									};
								} else {
									if (opts.consoleLogging) {
										console.log('The Share URL for Album #' + AlbumIDsArray[i].id + ' could not be shortened! Error: ' + data.error);
									};
								};
							},
							error: function(jqXHR, textStatus, errorThrown){
								if (opts.consoleLogging) {
									console.log('No connection to the URL Shortener Service could be established! Error: \njqXHR:' + jqXHR + '\ntextStatus: ' + textStatus + '\nerrorThrown: '  + errorThrown);
								};
							}
						});
					} else {
						var shareLinkTwitter = 'https://twitter.com/intent/tweet?text=' + SocialShareText + ShortURL;
						var shareLinkGoogle = 'https://plus.google.com/share?url=' + ShortURL;
						var shareLinkFacebook = 'http://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + ShortURL + '&p[images][0]=' + AlbumIDsArray[i].thumb + '&p[title]=' + SocialShareText + '&p[summary]=' + AlbumIDsArray[i].summary;
						var shareLinkStumble = 'http://www.stumbleupon.com/submit?url=' + ShortURL;
						$("#AlbumSocialShare_Twitter_" + AlbumIDsArray[i].id + "").attr("href", shareLinkTwitter);
						$("#AlbumSocialShare_Google_" + AlbumIDsArray[i].id + "").attr("href", shareLinkGoogle);
						$("#AlbumSocialShare_Facebook_" + AlbumIDsArray[i].id + "").attr("href", shareLinkFacebook);
						$("#AlbumSocialShare_Stumble_" + AlbumIDsArray[i].id + "").attr("href", shareLinkStumble);
					};
					$("#ts-social-share_" + AlbumIDsArray[i].id).show();
				});
			};
			// Check if Album Social Share should open as Popup
			$("body").on("click", "a.AlbumSocialShare", function(event) {
				if (opts.albumSocialSharePopup) {
					event.preventDefault();
					window.open(this.href, 'Share Album', 'width=500, height=500');
				};
			});
		};
		function shortLinkPhotoShares(Identifier) {
			// Check for and implement URL Shortener Service for Photo Share URLs
			if ((opts.photoShowSocialShare) && (opts.photoShortSocialShare)) {
				if (typeof ajaxRequest !== 'undefined') {
					ajaxRequest.abort();
				};
				$.each(PhotoIDsArray, function(i, photoShare){
					if (PhotoIDsArray[i].album == Identifier) {
						var ShortURL = PhotoIDsArray[i].clean;
						var SocialShareText = opts.SocialSharePhotoText;
						if (ShortURL.length == 0) {
							ajaxRequest = $.ajax({
								url: 			"http://safe.mn/api/shorten?format=jsonp&callback=?&url=" + fixedEncodeURIComponent(PhotoIDsArray[i].link),
								cache: 			false,
								dataType: 		"jsonp",
								success: function(data){
									if (data.url) {
										ShortURL = data.url;
										var shareLinkTwitter = 'https://twitter.com/intent/tweet?text=' + SocialShareText + ShortURL;
										var shareLinkGoogle = 'https://plus.google.com/share?url=' + ShortURL;
										var shareLinkFacebook = 'https://www.facebook.com/sharer/sharer.php?u=' + ShortURL + '&title=' + SocialShareText;
										var shareLinkStumble = 'http://www.stumbleupon.com/submit?url=' + ShortURL;
										$("#PhotoSocialShare_Twitter_" + PhotoIDsArray[i].id + "").attr("href", shareLinkTwitter);
										$("#PhotoSocialShare_Google_" + PhotoIDsArray[i].id + "").attr("href", shareLinkGoogle);
										$("#PhotoSocialShare_Facebook_" + PhotoIDsArray[i].id + "").attr("href", shareLinkFacebook);
										$("#PhotoSocialShare_Stumble_" + PhotoIDsArray[i].id + "").attr("href", shareLinkStumble);
										$("#PhotoSocialShare_Save_" + PhotoIDsArray[i].id + "").attr("href", PhotoIDsArray[i].save);
										$("#" + $("#ts-social-share_" + PhotoIDsArray[i].id + "").attr("data-parent")).attr("data-short", ShortURL);
										$("#ts-social-share_" + PhotoIDsArray[i].id + "").attr("data-share", ShortURL);
										PhotoIDsArray[i].clean = ShortURL;
										if (opts.consoleLogging) {
											console.log('The Share URL for Photo #' + PhotoIDsArray[i].id + ' has been shortened to: ' + ShortURL);
										};
									} else {
										if (opts.consoleLogging) {
											console.log('The Share URL for Photo #' + PhotoIDsArray[i].id + ' could not be shortened! Error: ' + data.error);
										};
									};
								},
								error: function(jqXHR, textStatus, errorThrown){
									if (opts.consoleLogging) {
										console.log('No connection to the URL Shortener Service could be established! Error: \njqXHR:' + jqXHR + '\ntextStatus: ' + textStatus + '\nerrorThrown: '  + errorThrown);
									};
								}
							});
						} else {
							var shareLinkTwitter = 'https://twitter.com/intent/tweet?text=' + SocialShareText + ShortURL;
							var shareLinkGoogle = 'https://plus.google.com/share?url=' + ShortURL;
							var shareLinkFacebook = 'https://www.facebook.com/sharer/sharer.php?u=' + ShortURL + '&title=' + SocialShareText;
							var shareLinkStumble = 'http://www.stumbleupon.com/submit?url=' + ShortURL;
							$("#PhotoSocialShare_Twitter_" + PhotoIDsArray[i].id + "").attr("href", shareLinkTwitter);
							$("#PhotoSocialShare_Google_" + PhotoIDsArray[i].id + "").attr("href", shareLinkGoogle);
							$("#PhotoSocialShare_Facebook_" + PhotoIDsArray[i].id + "").attr("href", shareLinkFacebook);
							$("#PhotoSocialShare_Stumble_" + PhotoIDsArray[i].id + "").attr("href", shareLinkStumble);
							$("#PhotoSocialShare_Save_" + PhotoIDsArray[i].id + "").attr("href", PhotoIDsArray[i].save);
							$("#" + $("#ts-social-share_" + PhotoIDsArray[i].id + "").attr("data-parent")).attr("data-short", ShortURL);
							$("#ts-social-share_" + PhotoIDsArray[i].id + "").attr("data-share", ShortURL);
						};
						$("#ts-social-share_" + PhotoIDsArray[i].id).show();
					};
				});
			};
			// Check if Photo Social Share should open as Popup
			$("body").on("click", "a.PhotoSocialShare", function(event) {
				if (opts.photoSocialSharePopup) {
					event.preventDefault();
					window.open(this.href, 'Share Photo', 'width=500, height=500');
				};
			});
		};
		function fixedEncodeURIComponent(str) {
			return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
		};
		function truncateString(string, limit, breakChar, rightPad) {
			//truncateString(text, 52, ' ', '...')
			if (string.length <= limit) return string;
			var substr = string.substr(0, limit);
			if ((breakPoint = substr.lastIndexOf(breakChar)) >= 0) {
				if (breakPoint < string.length -1) {
					return string.substr(0, breakPoint) + rightPad;
				} else {
					return string
				};
			} else {
				return string
			};
		};
		function sortMultiArrayByKey(array, key, asc) {
			return array.sort(function(a, b) {
				var x = a[key];
				var y = b[key];
				if (typeof x == "string") {
					x = x.toLowerCase(); 
					y = y.toLowerCase();
				};
				if (asc) {
					return ((x < y) ? -1 : ((x > y) ? 1 : 0));
				} else {
					return ((x > y) ? -1 : ((x < y) ? 1 : 0));
				};
			});
		};
		function sortFilters(propName) {
			return function (a,b) {
				// return a[propName] - b[propName];
				var aVal = a[propName], bVal = b[propName];
				if (opts.sortFilterNewToOld) {
					return aVal < bVal ? 1 : (aVal > bVal ?  - 1 : 0);
				} else {
					return aVal > bVal ? 1 : (aVal < bVal ?  - 1 : 0);
				};
			};
		};
		function asc_byorder(a, b){
			var compA = parseInt($(a).attr("data-order"));
			var compB = parseInt($(b).attr("data-order"));
			return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
		};
		function dec_byorder(a, b){
			var compA = parseInt($(a).attr("data-order"));
			var compB = parseInt($(b).attr("data-order"));
			return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
		};
		function asc_bysize(a, b){
			var compA = parseInt($(a).attr("data-count"));
			var compB = parseInt($(b).attr("data-count"));
			return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
		};
		function dec_bysize(a, b){
			var compA = parseInt($(a).attr("data-count"));
			var compB = parseInt($(b).attr("data-count"));
			return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
		};
		function asc_bycreate(a, b){
			var compA = $(a).attr("data-create").toUpperCase();
			var compB = $(b).attr("data-create").toUpperCase();
			return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
		};
		function dec_bycreate(a, b){
			var compA = $(a).attr("data-create").toUpperCase();
			var compB = $(b).attr("data-create").toUpperCase();
			return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
		};
		function asc_byupdate(a, b){
			var compA = $(a).attr("data-update").toUpperCase();
			var compB = $(b).attr("data-update").toUpperCase();
			return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
		};
		function dec_byupdate(a, b){
			var compA = $(a).attr("data-update").toUpperCase();
			var compB = $(b).attr("data-update").toUpperCase();
			return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
		};
		function asc_byadded(a, b){
			var compA = $(a).attr("data-added").toUpperCase();
			var compB = $(b).attr("data-added").toUpperCase();
			return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
		};
		function dec_byadded(a, b){
			var compA = $(a).attr("data-added").toUpperCase();
			var compB = $(b).attr("data-added").toUpperCase();
			return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
		};
		function asc_bytitle(a, b){
			var compA = $(a).attr("data-title").toUpperCase();
			var compB = $(b).attr("data-title").toUpperCase();
			return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
		};
		function dec_bytitle(a, b){
			var compA = $(a).attr("data-title").toUpperCase();
			var compB = $(b).attr("data-title").toUpperCase();
			return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
		};
		function asc_byID(a, b){
			var compA = $(a).attr("data-id").toUpperCase();
			var compB = $(b).attr("data-id").toUpperCase();
			return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
		};
		function dec_byID(a, b){
			var compA = $(a).attr("data-id").toUpperCase();
			var compB = $(b).attr("data-id").toUpperCase();
			return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
		};
		function asc_bypreset(a, b){
			var compA = $(a).attr("data-preset").toUpperCase();
			var compB = $(b).attr("data-preset").toUpperCase();
			return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
		};
		function dec_bypreset(a, b){
			var compA = $(a).attr("data-preset").toUpperCase();
			var compB = $(b).attr("data-preset").toUpperCase();
			return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
		};
		
		// Create Necessary HTML Markup for Gallery
		if (opts.outputLoaderStatus) {
			var loaderHTML = '<div id="' + opts.loaderCircleID + '" style="display: none;"></div>';
			$("#" + opts.frameID).append("<div id='" + opts.loaderID + "' class='clearFixMe'><div id='" + opts.loaderSpinnerID + "' class=''></div>" + loaderHTML + "<div id='" + opts.loaderMessageID + "'></div></div>");
		} else {
			$("#" + opts.frameID).append("<div id='" + opts.loaderID + "' class='clearFixMe'><div id='" + opts.loaderSpinnerID + "' class=''></div></div>");
		};
		if (opts.niceScrollAllow) {
			$("#" + opts.frameID).append("<div id='" + opts.galleryID + "' class='clearFixMe' style='max-height: " + opts.niceScrollHeight + "px;'></div>");
		} else {
			$("#" + opts.frameID).append("<div id='" + opts.galleryID + "' class='clearFixMe'></div>");
		};
		$("#" + opts.frameID).append("<div id='" + opts.errorID + "' class='clearFixMe'></div>");

		$("<div>", {id : "fb-album-header"}).appendTo("#" + opts.galleryID);
		$("<div>", {id : "fb-album-content"}).appendTo("#" + opts.galleryID);
		if (opts.showBottomControlBar) {$("<div>", {id : "fb-album-footer"}).appendTo("#" + opts.galleryID);}
		
		if ((opts.infiniteScrollAlbums) || (opts.infiniteScrollPhotos)) {
			$("#" + opts.frameID).append("<div id='" + opts.infiniteLoadID + "' class='clearFixMe' style='display: none; position: " + (opts.niceScrollAllow ? "absolute;" : "fixed;") + "'><div id='FB_Album_Infinite_Image'></div>" + opts.InfiniteScrollLoadText + "</div>");
			if (opts.infiniteScrollMore) {
				$("#" + opts.frameID).append("<div id='" + opts.infiniteMoreID + "' class='clearFixMe' style='display: none;'><div id='FB_Album_Infinite_More_Arrow_Left'></div><div id='FB_Album_Infinite_More_Text'>" + opts.InfiniteScrollMoreText + "</div><div id='FB_Album_Infinite_More_Arrow_Right'></div></div>");
			};
			$("#" + opts.frameID).append("<div id='" + opts.infiniteAlbumsID + "' class='clearFixMe' style='display: block;'></div>");
			$("#" + opts.frameID).append("<div id='" + opts.infinitePhotosID + "' class='clearFixMe' style='display: block;'></div>");
		};

		if (opts.responsiveGallery) {
			$("#" + opts.frameID).css("width", opts.responsiveWidth + "%").css("padding", (opts.floatingControlBar == true ? "0px 0px 5px 0px" : "5px 0px"));
		} else {
			$("#" + opts.frameID).css("width", opts.fixedWidth + "px").css("padding", (opts.floatingControlBar == true ? "0px 0px 5px 0px" : "5px 0px"));
		};

		$('.paginationMain').hide();
		
		if (opts.outputLoaderStatus) {
			var LoaderStatusAnimationCircle = $("#" + opts.loaderCircleID).percentageLoader({
				width: 				200,
				height: 			200,
				fontSizeText:		12,
				progress: 			0,
				value: 				'',
				onProgressUpdate : function (value) {}
			});
		};
		
		// Initialize qTip2 Tooltips as live mouseover event
		if ((opts.tooltipUseInternal) && ($.isFunction($.fn.qtip))) {
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
					solo: 			true,
					ready: 			false,
					modal: 			false
				}
			};
			// Initialize Tooltips for Gallery
			$('body').on('mouseover', '.TipGallery, .TipLightbox, .TipPhoto, .TipSocial, .TipGeneric', function() {
				// Make sure to only apply one Tooltip per Element!
				if ((typeof($(this).data('qtip') ) == 'object') || ($(this).parents('.fb-album-summary').length != 0)) {
					return;
				};
				if (($(this).hasClass("TipGallery")) || ($(this).hasClass("TipSocial"))) {
					var tooltipWidth = 250;
				} else if ($(this).hasClass("TipGeneric")) {
					var tooltipWidth = 220;
				} else if (($(this).hasClass("TipPhoto")) || ($(this).hasClass("TipLightbox"))) {
					var tooltipWidth = 400;
				};
				$(this).qtip( $.extend({}, qTipShared, {
					style: {
						classes: 		opts.tooltipDesign,
						def: 			true,
						widget: 		opts.tooltipThemeRoller,
						width: 			tooltipWidth,
						tip: {
							corner: 	opts.tooltipTipCorner,
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
							text: 		(opts.tooltipTitleBar == true ? 'Album Title:' : false),
							button: 	(opts.tooltipTitleBar == true ? opts.tooltipCloseButton : false)
						}
					},
					position: {
						my: 			opts.tooltipPositionMy,
						at: 			opts.tooltipPositionAt,
						target: 		opts.tooltipPositionTarget,
						container: 		false,
						viewport: 		$(window),
						adjust: {
							x: 			opts.tooltipOffsetX,
							y: 			opts.tooltipOffsetY,
							mouse: 		true,
							resize: 	true,
							method: 	'flipinvert flipinvert'
						},
						effect: 		true
					}
				}));
				$(this).qtip('show');
			});
		}

		// Check for Minimum jQuery Version
		if ($.versioncompare(jQueryMinimum, jQuery.fn.jquery) == 1) {
			var jQueryCurrent = $().jquery;
			$("#" + opts.errorID).html("You are using an incompatible version of jQuery (" + jQueryCurrent + "). This script requires at least Version " + jQueryMinimum + "; please update to a newer jQuery version.");
			$("#" + opts.loaderID).hide();
			$("#" + opts.errorID).show();
			if (opts.consoleLogging) {
				console.log("You are using an incompatible version of jQuery (" + jQueryCurrent + "). This script requires at least Version " + jQueryMinimum + "; please update to a newer jQuery version.");
			};
			if (opts.outputErrorMessages) {
				MessiContent = 	"The following error has been found:<br/><br/>You are using an incompatible version of jQuery (" + jQueryCurrent + ") you are using is incompatible with this script. This script requires at least Version " + jQueryMinimum + "; please update to a newer jQuery version.";
				MessiCode = 	"anim errors";
				MessiTitle = 	"ERROR for Facebook ID: " + opts.facebookID;
				showMessiContent(MessiContent, MessiTitle, MessiCode);
			};
			return false;
		} else {
			galleryAlbumsInit(opts.facebookID, "");
		};
    };
})(jQuery);


// -------------------------------
// Other External REQUIRED Plugins
// -------------------------------

// jquery.percentageloader.js (Docs & Licensing: https://bitbucket.org/Better2Web/jquery.percentageloader)
(function ($) {
    /* Strict mode for this plugin */
    "use strict";
    /*jslint browser: true */
    /* Our spiral gradient data */
    var imgdata = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDM4RjdFNzQ5MzAyMTFFMUFFQTdENUVDNDUwOEI2RUYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDM4RjdFNzU5MzAyMTFFMUFFQTdENUVDNDUwOEI2RUYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMzhGN0U3MjkzMDIxMUUxQUVBN0Q1RUM0NTA4QjZFRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMzhGN0U3MzkzMDIxMUUxQUVBN0Q1RUM0NTA4QjZFRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv4BSzoAAA+OSURBVHja1F1bkutKEazSdUAErIAdsVaCTfDNAvhgHXCJe8448ciW3I96drdmYGJiwpYl25NZlfXoVjfjn38lJuGHxafsnRB46rw0+BEonqI4AfY5xNLB/QFLB8W3DZ/QPH6cuXXHlB94RyJv4p4Zf5M1P+y+Au9rwntL6B/xeGmL4vs6gkGUvxrZ8Lfj6HeE6HbeY+if+3y8JWy85wArQIf+HJebu2zgYfN3Rc9GvyZgCQdBoL9DhTD/Kq+Q/vpNtrTWX6E8V4DOrgmz7BMcEnd4HxdBf48BUasfFaIBJ/gqnrLmkVYkD/3DA5ZzMIvaV4ds6OZvx15RfOLoU5UFYR0HA3xgmaPYcZVM/Un5wTz6XhDOcpBVm+/ITWE80M0fsUiTRR9+EMYFyoH/RRWa54/y6FMoCGOFEGWV59oYy0a9aph/LjAE0A8HYVwpRCscAKFGlmm/XkMMMfFJoU+JVkScg2xnCZerEZYqDCbQhxUDFnAwndLgC8IACw7BTt2LDEPNhVqIxkgrAuvaOJg2Zix2CATdgs20h72kqHYUKQuaMnyMoIZLlCeKr2f+VnSJeYaRnm4C4rSIg2/FXZEX1hr90DUkLv1iH8kuDhYG4XBATuCOLCtZ5QOH/q2V6LPWjo5wMNNvGLD3uDdwEveY+ccjsI0+9Jb1lgsAiQwHzje6Lu/kaP0VNH8/I+LY/8ptUoRoJTyYccaECItwjwfYANDi6Hy8gwRTdvKVMK3jII3yelqg/UMsH+wv8ft3XcdCq8XMdjSWcpDT1ClHkb8pq70EmAzBy69gir5di60rxLITBL76h2F/C5bI6KQ/iH6qGYe2gl3egTCE6FJ62IkNsAPDDPpsNSRqCYIkFG4Cmrb9fCaP2TAAQ39M8xcDbwp9xEriZmLWhCvEORhwghR37OtPa/4cigQp9F3DVwoxkYZZ/VmH+JdEEWjJaIc+ugfBTlzpTFozDkv153yMQMk/izhsxTfNP4V+a/hspkMNcvx6Q6MZF3YFlV8zIOegz5cPb6A5GCeg9yF89E0AqJukfXwxdusARG0f8UwfaatfNNW3N/8QMdwKjoG+bfh4GT4/PztWBwDWsHtcggwOhrt1SdANoZePdJdXol/IDsijoYNeGhETXaFXpOEwELR6LIJe0h/1ozLoBw2/kfsG+qYOCPQhBmagWBwgpy3i+ZkeXKXj3LbblqAvG/4h93DqgCgNiivAswStwnKT8MyoQHC8xf9MltPNpmqz9KfQHCOR3EL6MzkZCwYAGIfbdx6WCygpE7UqtfJM1jujxeUR6M3xAPdg7wpZDnzNmYrI0b4qy/k+xJCrGD7qaiAIfeEBQcO3achKkBgMoFBoOoc2LQ7smL+AKSufaRp+J/ch6EmYmKXF3rFpcas4SLoBqEo5qLNiWdk19DvZEd5BMXwbeiUNTdh+zBWIrDLGbnnCqw8iU1LN24DfULJVGIMUDiagf/7cXs9Y+SfYPCg8xetmaxzHy3OeByE9xf4vgOsj9UczdUejuJeIC67goa8XwEyx8SctPbu1r7NyHWdoYLy/fol1CTpRi3X/lzQaJNHn9hBEGjz0/SKATqv32z7kzXm5qVbEnkMYNGiuoJHx/vu4yrwkWYK9oxhXobJHP2j4Z02bmIKof7FDglj35wU0cGXvZKvQwYFBmMcHqOoMUy0+qE+LoD8DPbyVC27tsbgEOSpUZDiiKxgqREcwkEGPusNp7JDCQI++moMemoPwwAcFpiRhRIJy5t8p0vNL2R7QM9Qy6i6IwfKzko/OJzT0NeiDJu/OM/EkKMJEnIYzOBseQJ0Qie+mK0/1t0BcRZ+FLLOPtI75J3GvPcCQoHhYbk4TgdNcQeOA2ILekyJIKtR08PUUyILerTMyHmC8Ph8PLBrYykFLDoRvAv1Oa36jzB0NCvqa5kQm5FJyQnNz/KZb+FA8aOAmSc3fIiNlCe0lEM5hte9Ztn0ahakSUJY7Cu0EFnF0ZQ53KQbII0jsu4V4XAsJkOg5FYml7Igs0dcGA07z722/paTKfxzowSHcU+ZvSxAGyWAzJDSecSrS+V4CB1ATm/bzGbX5ixG4UyEOVF6JmouCM5tYJEAjQ3QOwwMMLWoeu4pUctCUeB1YfSJ0Z5mJ/XzWyi570DE+tAHTblBLkOfvMh/sRGM/IOuZDTceyWpxQK2+3xv0hayUzYo33+fxEBcZuvnOwzYfHRm9W9hOwOLMLbYiM0RRZKot/cWBIEGsJD8jg3ga4sHbBW+JwT2/VkB9Anc6o0iQ9qkocs0HkBuqZk3BxEt8+BP0+35ug/69kHsEZj9EDT+GuPHSTX6R5ygRnQNJJs7KmWoO7nzc1XCEgQPBO70M/0kD+HUEh9zbvYdQmOUpuPtzbrn34DwlvXMgtVYVdiaOacRPDtpu56eqvD2AGw/gRv3Vjlv/D3lwz9/teSPKoWGk4SFKhJs1WAjD5d+nYt93Odp2UM+AfIyBPnH/2H+f6B8csJiAGuNc2cySkjNpEJKgrChFnAZaxQuhc99zwEeeuh0n8jGpY7f9D9oJoBcTj7PvUuJP5v3v8Qp2CRkZDxjmySAGouifj7nj4DlufFz8ecLzGn4g/nOjny8C+F6n/6RPQMdqSclee6O1P3GeYNVbR8etHO/lNw2Pl7b9LR5/b/Sx0W8b/XhwwPzRVF4k34E0szzt2vt0bovfbzhoa60OlF3OU3x4T4f2p7/nX3+hXzf+cSSgxuzBtThiDQGX/uCiy48X/o1//Onif+HiH8bf//KlLjeGe3Nz2TPB/AD9Rh//uv/tz3/8A3AD/XKEaq4GInPJRLz9+v8gQQkKYQlz0+S87/rzk+4/Pl/4zx4hfke47WnR85cP3WomDUX4wAVM8EoJmrlxOru0d9tfxmH+hI9XGPhJ9OPzX+Q78Au//GA7ggUXZPRMwGOCpyEOZEFYbeoDK/bZCx2d0D/Rv3+ij8dfvOqIRxq6ty14Pwsbv3JaLjPYenCTofZqx+waQ9dmJWh66wY3AxdsH1Ve+cD9viN/LyrhT5c4tgDCZ7Fw9i9OGoiqB9XMI6RNngMYRHzi5gCzdpV/ZDSHDujpDf2ned/R3sLMn0Fh2/+++n47BxtRSQMV3tBOROJuausQ9JyUan4Nyl9R4QULHtXwUUv/6xdPibm/H5et0rJo27tueJs8v4fd2J0EnFQWnuhh3haXgEjSgK5pKt4FcaJ/PzLSzlFfbZ+jPntysLeLcK/DwEmDPRFbBI8htBIxGh7YyoImm09p24d1G0pp7xDuzoDCwS4mzIcr9DRAaV9pS3mXrXSW0jr22sGdB6xthYwsNge5TVw8wBGHT/MH0ON1RortfPAMD+3g8puGM4xzQGegk6Hx4VJyGxeWsSSHulvDiGwCKvRh3Zb07r6han/e9w0L+biJsYq3nLQ/hQxqnEPPyVn2gKz+BJVHlR2YyY+AvvN1+KXOp6zjiMxbhZkyEUOhgfUJTVpGxAXx1NUcpM4NnfSDxPquHvTUoX9e19TDuh88naD98JoDQXYO8Dg2isHmDJBKfBTnCBRiWKg8nRmYHADoxKWNHWLkRA0NBPzY3t+kuSzrB6LoVwfZ7gXNK74LvccBUN3xiqYzYX61EmQWb+NGoJI96oaUH7CNuxQGblOi7+Q8CN233T1t0YdOp0lDKUQKfkfBFqCBvXnG7M1JE0EalaAx6APiAziLK8LoA8Q7VXyWVCyqFNfBw6BBa+dF3CIvQb4fwJ/cFEQfHdxImAp3rMDyAxJdwaXBdggKHLkti7cR6E0PENCHnr963zlSEDGXgNbCpPlETQN5DuEycZvd99GGnqJLdkBbr6M+GXrT1tg1ANBDaM1Bea6gRQEaKMnEbcLkSeikDukPtLWBECju4nKkqXbF0DHZSL+dWaRhICpIlXAi5CJceTn6A6kXBHk1segulNzVyQQrb+FjBE06S717qqTh/Cdch2iObGKl01WWNfSAdY47uOihP76CGeurjnP7TUH2ak1stge7B2x9hIqlGgMiahPsuOn6I6M/sXQ0knePCw+O9LSa+6gvckFhb9CeRtYNhdB7GVhQ2kaf3NZQZtlKxQlgjz1LfgBjtSZtZSrJG7SndiWM9L3fMRoE9FF84LqpSuIaE9riLRDKtNegjugKTnkseUPvmsrCraLVU2ZnsQj6JFW5SsSOLACuuRzp9z5CG4xobyZgMpaP1t3C9gZpR20DeuQlCFIiH+nHuUlX0g8yncC3CfccJIRIp0HbyC0GvRt7dQsEWVsITG5lq93ioi12HhiPEDiAslJZZAHhcjSuWTUxA/3oZg4wRmOUFr/zamY8wlmsNcyBKEdwoddp2KLQU9IPMuh77zwblHPKE1q8koMeoMrEQUN4+XqM+4GLPiI05BGPrF6I4PsITiMsaZPYwuSgYctBHw8AEd0X5eXifZyRcQXqltCt35PRbQkQUiEhCAcHeJM7yUATkDjc59Bw/BKO+QSHhIj8FQ14UIWsOiBi+F74bdGPiM+X7HuI5N8UB1kViu0pnw+/PvrfhK/rK0EO+rCccgV9A4dU4yGLvpj4m9uc4Gp62CLJqhTlBYU40hEun3pbmORjgIU+rCZTIpKudibXXbT9cW0OXPNfHwNC6I9F4zma7DQ/kstmNhHjiPmT3I6m8RIsij7MytbWn1UrW+R1P8uBLUekbug8GoERLFkxuTfMrEOQ5wQItDQiHBhypDTjJiIw7B4xknoxTU92z42pjc0lDmw5ougmPin0Y125sPnjaldoQedR85c46ORIrQm2yRp4EH33Q3FhwWDsYT5o/t6mtsUt++27xQoxGkJ/UqcvawSNNXn91aS7Tp8WEmhJIeajnzJ/7cphhniIHvYz5IUcYDgIw5UJTD1eHhcwYfUp6DUOxAx1MAjL6JtC9GVL3mT3q9ecYAZ6kQPNFbbscJiPvpH4h1a/xhdTFSTsIg62VCYeQh9zYOaixTU+wekuyTAHkS3NR9FvDuDLrZxzmReUaBxC2R4J0DmIBuER9IO2/B36k3WO+O7sKjFsb+Y5j362EbPwpXW8ISBESDoEKZNT6Z2G+ikQQlOTI+Kz5KpRA18+9DnAQeMKm4s+shPTbb7wfWXxAJQ8IjuRJdhhtSKaZzMztFKozqyB/b08DZShLG7oLKA/UlNhFMT1qPJ0Xs+JeIc8B9ss+su8YfnSjYtZzOagQQ625ehHo+gq4VrKyozcj7W+tmXoT5v4Fe4xIB0RJ1igP9XMOBf9hb2V/4GQOuwN4ZZN4vEWQj8rPt8tOMurYsScYODx5mM4ID6Tw+hr+eC0IQfNPL6zofEm/xVgACau5NQhMGZKAAAAAElFTkSuQmCC",
        gradient = new Image();
    gradient.src = imgdata;
    /** Percentage loader
     * @param	params	Specify options in {}. May be on of width, height, progress or value.
     *
     * @example $("#myloader-container).percentageLoader({
		    width : 256,  // width in pixels
		    height : 256, // height in pixels
		    progress: 0,  // initialise progress bar position, within the range [0..1]
		    value: '0kb'  // initialise text label to this value
		});
     */
    $.fn.percentageLoader = function (params) {
        var settings, canvas, percentageText, valueText, items, i, item, selectors, s, ctx, progress,
            value, cX, cY, lingrad, innerGrad, tubeGrad, innerRadius, innerBarRadius, outerBarRadius,
            radius, startAngle, endAngle, counterClockwise, completeAngle, setProgress, setValue,
            applyAngle, drawLoader, clipValue, outerDiv;
        /* Specify default settings */
        settings = {
            width: 				256,
            height: 			256,
			fontSizeText:		"auto",
			fontSizeValue:		"auto",
            progress: 			0,
            value: 				'0kb',
            controllable: 		false
        };
        /* Override default settings with provided params, if any */
        if (params !== undefined) {
            $.extend(settings, params);
        } else {
            params = settings;
        }
        outerDiv = document.createElement('div');
        outerDiv.style.width = settings.width + 'px';
        outerDiv.style.height = settings.height + 'px';
        outerDiv.style.position = 'relative';
        $(this).append(outerDiv);
        /* Create our canvas object */
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', settings.width);
        canvas.setAttribute('height', settings.height);
        outerDiv.appendChild(canvas);
        /* Create div elements we'll use for text. Drawing text is
         * possible with canvas but it is tricky working with custom
         * fonts as it is hard to guarantee when they become available
         * with differences between browsers. DOM is a safer bet here */
        percentageText = document.createElement('div');
		percentageText.setAttribute("id", "percentageLoaderValue");
        percentageText.style.width = (settings.width.toString() - 2) + 'px';
        percentageText.style.textAlign = 'center';
        percentageText.style.height = '50px';
        percentageText.style.left = 0;
        percentageText.style.position = 'absolute';
        valueText = document.createElement('div');
		valueText.setAttribute("id", "percentageLoaderText");
        valueText.style.width = (settings.width - 2).toString() + 'px';
        valueText.style.textAlign = 'center';
        valueText.style.height = '0px';
        valueText.style.overflow = 'hidden';
        valueText.style.left = 0;
        valueText.style.position = 'absolute';
        /* Force text items to not allow selection */
        items = [valueText, percentageText];
        for (i  = 0; i < items.length; i += 1) {
            item = items[i];
            selectors = [
                '-webkit-user-select',
                '-khtml-user-select',
                '-moz-user-select',
                '-o-user-select',
                'user-select'];
            for (s = 0; s < selectors.length; s += 1) {
                $(item).css(selectors[s], 'none');
            }
        }
        /* Add the new dom elements to the containing div */
        outerDiv.appendChild(percentageText);
        outerDiv.appendChild(valueText);
        /* Get a reference to the context of our canvas object */
        ctx = canvas.getContext("2d");
        /* Set various initial values */
        /* Centre point */
        cX = (canvas.width / 2) - 1;
        cY = (canvas.height / 2) - 1;
        /* Create our linear gradient for the outer ring */
        lingrad = ctx.createLinearGradient(cX, 0, cX, canvas.height);
        lingrad.addColorStop(0, '#d6eeff');
        lingrad.addColorStop(1, '#b6d8f0');
        /* Create inner gradient for the outer ring */
        innerGrad = ctx.createLinearGradient(cX, cX * 0.133333, cX, canvas.height - cX * 0.133333);
        innerGrad.addColorStop(0, '#f9fcfe');
        innerGrad.addColorStop(1, '#d9ebf7');
        /* Tube gradient (background, not the spiral gradient) */
        tubeGrad = ctx.createLinearGradient(cX, 0, cX, canvas.height);
        tubeGrad.addColorStop(0, '#c1dff4');
        tubeGrad.addColorStop(1, '#aacee6');
        /* The inner circle is 2/3rds the size of the outer one */
        innerRadius = cX * 0.6666;
        /* Outer radius is the same as the width / 2, same as the centre x
        * (but we leave a little room so the borders aren't truncated) */
        radius = cX - 2;
        /* Calculate the radii of the inner tube */
        innerBarRadius = innerRadius + (cX * 0.06);
        outerBarRadius = radius - (cX * 0.06);
        /* Bottom left angle */
        startAngle = 2.1707963267949;
        /* Bottom right angle */
        endAngle = 0.9707963267949 + (Math.PI * 2.0);
        /* Nicer to pass counterClockwise / clockwise into canvas functions
        * than true / false */
        counterClockwise = false;
        /* Borders should be 1px */
        ctx.lineWidth = 1;
        /**
         * Little helper method for transforming points on a given
         * angle and distance for code clarity
         */
        applyAngle = function (point, angle, distance) {
            return {
                x : point.x + (Math.cos(angle) * distance),
                y : point.y + (Math.sin(angle) * distance)
            };
        };
        /**
         * render the widget in its entirety.
         */
        drawLoader = function () {
            /* Clear canvas entirely */
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            /*** IMAGERY ***/
            /* draw outer circle */
            ctx.fillStyle = lingrad;
            ctx.beginPath();
            ctx.strokeStyle = '#b2d5ed';
            ctx.arc(cX, cY, radius, 0, Math.PI * 2, counterClockwise);
            ctx.fill();
            ctx.stroke();
            /* draw inner circle */
            ctx.fillStyle = innerGrad;
            ctx.beginPath();
            ctx.arc(cX, cY, innerRadius, 0, Math.PI * 2, counterClockwise);
            ctx.fill();
            ctx.strokeStyle = '#b2d5edaa';
            ctx.stroke();
            ctx.beginPath();
            /**
             * Helper function - adds a path (without calls to beginPath or closePath)
             * to the context which describes the inner tube. We use this for drawing
             * the background of the inner tube (which is always at 100%) and the
             * progress meter itself, which may vary from 0-100% */
            function makeInnerTubePath(startAngle, endAngle) {
                var centrePoint, startPoint, controlAngle, capLength, c1, c2, point1, point2;
                centrePoint = {
                    x : cX,
                    y : cY
                };
                startPoint = applyAngle(centrePoint, startAngle, innerBarRadius);
                ctx.moveTo(startPoint.x, startPoint.y);
                point1 = applyAngle(centrePoint, endAngle, innerBarRadius);
                point2 = applyAngle(centrePoint, endAngle, outerBarRadius);
                controlAngle = endAngle + (3.142 / 2.0);
                /* Cap length - a fifth of the canvas size minus 4 pixels */
                capLength = (cX * 0.20) - 4;
                c1 = applyAngle(point1, controlAngle, capLength);
                c2 = applyAngle(point2, controlAngle, capLength);
                ctx.arc(cX, cY, innerBarRadius, startAngle, endAngle, false);
                ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, point2.x, point2.y);
                ctx.arc(cX, cY, outerBarRadius, endAngle, startAngle, true);
                point1 = applyAngle(centrePoint, startAngle, innerBarRadius);
                point2 = applyAngle(centrePoint, startAngle, outerBarRadius);
                controlAngle = startAngle - (3.142 / 2.0);
                c1 = applyAngle(point2, controlAngle, capLength);
                c2 = applyAngle(point1, controlAngle, capLength);
                ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, point1.x, point1.y);
            }
            /* Background tube */
            ctx.beginPath();
            ctx.strokeStyle = '#bcd4e5';
            makeInnerTubePath(startAngle, endAngle);
            ctx.fillStyle = tubeGrad;
            ctx.fill();
            ctx.stroke();
            /* Calculate angles for the the progress metre */
            completeAngle = startAngle + (progress * (endAngle - startAngle));
            ctx.beginPath();
            makeInnerTubePath(startAngle, completeAngle);
            /* We're going to apply a clip so save the current state */
            ctx.save();
            /* Clip so we can apply the image gradient */
            ctx.clip();
            /* Draw the spiral gradient over the clipped area */
            ctx.drawImage(gradient, 0, 0, canvas.width, canvas.height);
            /* Undo the clip */
            ctx.restore();
            /* Draw the outline of the path */
            ctx.beginPath();
            makeInnerTubePath(startAngle, completeAngle);
            ctx.stroke();
            /*** TEXT ***/
            (function () {
                var fontSize, string, smallSize, heightRemaining;
                /* Calculate the size of the font based on the canvas size */
                fontSize = cX / 2;
                percentageText.style.top = ((settings.height / 2) - (fontSize / 2)).toString() + 'px';
                percentageText.style.color = '#80a9c8';
                percentageText.style.font = fontSize.toString() + 'px BebasNeueRegular';
                percentageText.style.textShadow = '0 1px 1px #FFFFFF';
                /* Calculate the text for the given percentage */
                string = (progress * 100.0).toFixed(0) + '%';
                percentageText.innerHTML = string;
                /* Calculate font and placement of small 'value' text */
				if (settings.fontSizeText == "auto") {
					smallSize = cX / 5.5;
				} else {
					smallSize = settings.fontSizeText;
				}
                valueText.style.color = '#80a9c8';
                valueText.style.font = smallSize.toString() + 'px BebasNeueRegular';
                valueText.style.height = smallSize.toString() + 'px';
                valueText.style.textShadow = 'None';
                /* Ugly vertical align calculations - fit into bottom ring.
                 * The bottom ring occupes 1/6 of the diameter of the circle */
                heightRemaining = (settings.height * 0.16666666) - smallSize;
                valueText.style.top = ((settings.height * 0.8333333) + (heightRemaining / 4)).toString() + 'px';
            }());
        };
        clipValue = function () {
            if (progress < 0) {
                progress = 0;
            }
            if (progress > 1.0) {
                progress = 1.0;
            }
        };
        setProgress = function (value) {
            /* Clip values to the range [0..1] */
            progress = value;
            clipValue();
            drawLoader();
        };
        this.setProgress = setProgress;
        setValue = function (val) {
            value = val;
            valueText.innerHTML = value;
        };
        this.setValue = setValue;
        this.setValue(settings.value);
        progress = settings.progress;
        clipValue();
        /* Do an initial draw */
        drawLoader();
        /* In controllable mode, add event handlers */
        if (params.controllable === true) {
            (function () {
                var mouseDown, getDistance, adjustProgressWithXY;
                getDistance = function (x, y) {
                    return Math.sqrt(Math.pow(x - cX, 2) + Math.pow(y - cY, 2));
                };
                mouseDown = false;
                adjustProgressWithXY = function (x, y) {
                    /* within the bar, calculate angle of touch point */
                    var pX, pY, angle, startTouchAngle, range, posValue;
                    pX = x - cX;
                    pY = y - cY;
                    angle = Math.atan2(pY, pX);
                    if (angle > Math.PI / 2.0) {
                        angle -= (Math.PI * 2.0);
                    }
                    startTouchAngle = startAngle - (Math.PI * 2.0);
                    range = endAngle - startAngle;
                    posValue = (angle - startTouchAngle) / range;
                    setProgress(posValue);
                    if (params.onProgressUpdate) {
                        /* use the progress value as this will have been clipped
                         * to the correct range [0..1] after the call to setProgress
                         */
                        params.onProgressUpdate(progress);
                    }
                };
                $(outerDiv).mousedown(function (e) {
                    var offset, x, y, distance;
                    offset = $(this).offset();
                    x = e.pageX - offset.left;
                    y = e.pageY - offset.top;
                    distance = getDistance(x, y);
                    if (distance > innerRadius && distance < radius) {
                        mouseDown = true;
                        adjustProgressWithXY(x, y);
                    }
                }).mouseup(function () {
                    mouseDown = false;
                }).mousemove(function (e) {
                    var offset, x, y;
                    if (mouseDown) {
                        offset = $(outerDiv).offset();
                        x = e.pageX - offset.left;
                        y = e.pageY - offset.top;
                        adjustProgressWithXY(x, y);
                    }
                }).mouseleave(function () {
                    mouseDown = false;
                });
            }());
        }
        return this;
    };
}(jQuery));

// jQuery Messi Plugin 1.3 (Docs & Licensing: http://marcosesperon.es/apps/messi/)
function Messi(data, options) {
    var _this = this;
    _this.options = jQuery.extend({}, Messi.prototype.options, options || {});
    _this.messi = jQuery(_this.template);
    _this.setContent(data);
    if(_this.options.title == null) {
        jQuery('.messi-titlebox', _this.messi).remove();
    } else {
        jQuery('.messi-title', _this.messi).append(_this.options.title);
        if(_this.options.buttons.length === 0 && !_this.options.autoclose) {
            if(_this.options.closeButton) {
                var close = jQuery('<span class="messi-closebtn"></span>');
                close.bind('click', function() {
                    _this.hide();
                });
                jQuery('.messi-titlebox', this.messi).prepend(close);
            };
        };
        if(_this.options.titleClass != null) jQuery('.messi-titlebox', this.messi).addClass(_this.options.titleClass);
    };
    if(_this.options.width != null) jQuery('.messi-box', _this.messi).css('width', _this.options.width);
    if(_this.options.buttons.length > 0) {
        for (var i = 0; i < _this.options.buttons.length; i++) {
            var cls = (_this.options.buttons[i]["class"]) ? _this.options.buttons[i]["class"] : '';
            var btn = jQuery('<div class="btnbox"><button class="btn ' + cls + '" href="#" data-value="' + _this.options.buttons[i].val + '">' + _this.options.buttons[i].label + '</button></div>');
            btn.on('click', 'button', function() {
                var value = jQuery.attr(this, 'data-value');
                var after = (_this.options.callback != null) ? function() { _this.options.callback(value); } : null;
                _this.hide(after);
            });
            jQuery('.messi-actions', this.messi).append(btn);
        };
    } else {
        jQuery('.messi-footbox', this.messi).remove();
    };
    if(_this.options.buttons.length === 0 && _this.options.title == null && !_this.options.autoclose) {
        if (_this.options.closeButton) {
            var close = jQuery('<span class="messi-closebtn"></span>');
            close.on('click', function() {
                _this.hide();
            });
            jQuery('.messi-content', this.messi).prepend(close);
        };
    };
    _this.modal = (_this.options.modal) ? jQuery('<div class="messi-modal"></div>').css({
        opacity: _this.options.modalOpacity,
        width: jQuery(document).width(),
        height: jQuery(document).height(),
        'z-index': _this.options.zIndex + jQuery('.messi').length
    }).appendTo(document.body) : null;
    if ((_this.options.modal) && (_this.options.modalClick)) {
        _this.modal.on('click', function() {_this.hide();})
    }
    if(_this.options.show) _this.show();
    jQuery(window).bind('resize', function(){ _this.resize(); });
    if(_this.options.autoclose != null) {
        setTimeout(function(_this) {
            _this.hide();
        }, _this.options.autoclose, this);
    };
    return _this;
};
Messi.prototype = {
    options: {
        autoclose:              null,                           // autoclose message after 'x' miliseconds, i.e: 5000
        buttons:                [],                             // array of buttons, i.e: [{id: 'ok', label: 'OK', val: 'OK'}]
        callback:               null,                           // callback function after close message
        center:                 true,                           // center message on screen
        closeButton:            true,                           // show close button in header title (or content if buttons array is empty).
        height:                 'auto',                         // content height
		maxheight:				'90%',							// content max height
        title:                  null,                           // message title
        titleClass:             null,                           // title style: info, warning, success, error
        modal:                  false,                          // shows message in modal (loads background)
        modalClick:             true,                           // close modal on click in modal area
        modalOpacity:           .2,                             // modal background opacity
        padding:                '10px',                         // content padding
        show:                   true,                           // show message after load
        unload:                 true,                           // unload message after hide
        viewport:               {top: '0px', left: '0px'},      // if not center message, sets X and Y position
        width:                  '500px',                        // message width
        zIndex:                  999999                         // message z-index
    },
    template: '<div class="messi"><div class="messi-box"><div class="messi-wrapper"><div class="messi-titlebox"><span class="messi-title"></span></div><div class="messi-content"></div><div class="messi-footbox"><div class="messi-actions"></div></div></div></div></div>',
    content: '<div></div>',
    visible: false,
    setContent: function(data) {
        jQuery('.messi-content', this.messi).css({padding: this.options.padding, height: this.options.height, maxHeight: this.options.maxheight}).empty().append(data);
    },
    viewport: function() {
        return {
            top:    ((jQuery(window).height() - this.messi.height()) / 2) + "px",
            left:   ((jQuery(window).width() - this.messi.width()) / 2) + "px"
        };
    },
    show: function() {
        if(this.visible) return;
        if(this.options.modal && this.modal != null) this.modal.show();
        this.messi.appendTo(document.body);
        if(this.options.center) this.options.viewport = this.viewport(jQuery('.messi-box', this.messi));
        this.messi.css({
            'z-index':      this.options.zIndex + jQuery('.messi').length
        });
		this.messi.show().stop().animate({
            top:            this.options.viewport.top,
            left:           this.options.viewport.left,
			opacity: 		1
		}, {
			duration: 		250,
			easing: 		"swing",
			specialEasing: {
				width: 		"linear",
				height: 	"easeOutBounce"
			},
			queue: 			true
        });
        //document.documentElement.style.overflow = "hidden";
        //jQuery("body").css("overflow", "hidden");
        this.visible = true;
    },
    hide: function(after) {
        if (!this.visible) return;
        var _this = this;
        this.messi.animate({opacity: 0}, 300, function() {
            if(_this.options.modal && _this.modal != null) _this.modal.remove();
            _this.messi.css({display: 'none'}).remove();
            //document.documentElement.style.overflow = "visible";
            //jQuery("body").css("overflow", "visible");
            _this.visible = false;
            if (after) after.call();
            if(_this.options.unload) _this.unload();
        });
        return this;
    },
    resize: function() {
        if(this.options.modal) {
            jQuery('.messi-modal').css({
                width: 	jQuery(document).width(),
                height: jQuery(document).height()
            });
        };
        if(this.options.center) {
            this.options.viewport = this.viewport(jQuery('.messi-box', this.messi));
            this.messi.css({top: this.options.viewport.top, left: this.options.viewport.left});
        };
    },
    toggle: function() {
        this[this.visible ? 'hide' : 'show']();
        return this;
    },
    unload: function() {
        if (this.visible) this.hide();
        jQuery(window).unbind('resize', function () { this.resize(); });
        this.messi.remove();
    },
};
jQuery.extend(Messi, {
    alert: function(data, callback, options) {
        var buttons = [
            {id: 'ok',      label: 'OK',    val: 'OK'}
        ];
        options = jQuery.extend({closeButton: false, buttons: buttons, callback:function() {}}, options || {}, {show: true, unload: true, callback: callback});
        return new Messi(data, options);
    },
    ask: function(data, callback, options) {
        var buttons = [
            {id: 'yes',     label: 'Yes',   val: 'Y',   "class": 'btn-success'},
            {id: 'no',      label: 'No',    val: 'N',   "class": 'btn-danger'},
        ];
        options = jQuery.extend({closeButton: false, modal: true, buttons: buttons, callback:function() {}}, options || {}, {show: true, unload: true, callback: callback});
        return new Messi(data, options);
    },
    img: function(src, options) {
        var img = new Image();
        jQuery(img).load(function() {
            var vp = {width: jQuery(window).width() - 50, height: jQuery(window).height() - 50};
            var ratio = (this.width > vp.width || this.height > vp.height) ? Math.min(vp.width / this.width, vp.height / this.height) : 1;
            jQuery(img).css({width: this.width * ratio, height: this.height * ratio});
            options = jQuery.extend(options || {}, {show: true, unload: true, closeButton: true, width: this.width * ratio, height: this.height * ratio, padding: 0});
            new Messi(img, options);
        }).error(function() {
            console.log('Error loading ' + src);
        }).attr('src', src);
    },
    load: function(url, options) {
        options = jQuery.extend(options || {}, {show: true, unload: true, params: {}});
        var request = {
            url: url,
            data: options.params,
            dataType: 'html',
            cache: false,
            error: function (request, status, error) {
                console.log(request.responseText);
            },
            success: function(html) {
                //html = jQuery(html);
                new Messi(html, options);
            }
        };
        jQuery.ajax(request);
    }
});

// jQuery inView (Docs & Licensing: https://github.com/protonet/jquery.inview)
(function ($) {
    var inviewObjects = {}, viewportSize, viewportOffset, d = document, w = window, documentElement = d.documentElement, expando = $.expando;
    $.event.special.inview = {
        add: function(data) {
            inviewObjects[data.guid + "-" + this[expando]] = { data: data, $element: $(this) };
        },
        remove: function(data) {
            try { delete inviewObjects[data.guid + "-" + this[expando]]; } catch(e) {}
        }
    };
    function getViewportSize() {
        var mode, domObject, size = { height: w.innerHeight, width: w.innerWidth };
        // if this is correct then return it. iPad has compat Mode, so will
        // go into check clientHeight/clientWidth (which has the wrong value).
        if (!size.height) {
            mode = d.compatMode;
            if (mode || !$.support.boxModel) { // IE, Gecko
                domObject = mode === 'CSS1Compat' ?
                    documentElement : // Standards
                    d.body; // Quirks
                size = {
                    height: domObject.clientHeight,
                    width:  domObject.clientWidth
                };
            }
        }
        return size;
    }
    function getViewportOffset() {
        return {
            top:  w.pageYOffset || documentElement.scrollTop   || d.body.scrollTop,
            left: w.pageXOffset || documentElement.scrollLeft  || d.body.scrollLeft
        };
    }
    function checkInView() {
        var $elements = $(), elementsLength, i = 0;
        $.each(inviewObjects, function(i, inviewObject) {
            var selector  = inviewObject.data.selector,
                $element  = inviewObject.$element;
            $elements = $elements.add(selector ? $element.find(selector) : $element);
        });
        elementsLength = $elements.length;
        if (elementsLength) {
            viewportSize   = viewportSize   || getViewportSize();
            viewportOffset = viewportOffset || getViewportOffset();
            for (; i<elementsLength; i++) {
                // Ignore elements that are not in the DOM tree
                if (!$.contains(documentElement, $elements[i])) {
                    continue;
                }
                var $element      = $($elements[i]),
                    elementSize   = { height: $element.height(), width: $element.width() },
                    elementOffset = $element.offset(),
                    inView        = $element.data('inview'),
                    visiblePartX,
                    visiblePartY,
                    visiblePartsMerged;
                // Don't ask me why because I haven't figured out yet:
                // viewportOffset and viewportSize are sometimes suddenly null in Firefox 5.
                // Even though it sounds weird:
                // It seems that the execution of this function is interferred by the onresize/onscroll event
                // where viewportOffset and viewportSize are unset
                if (!viewportOffset || !viewportSize) {
                    return;
                }
                if (elementOffset.top + elementSize.height - infiniteScrollOffset > viewportOffset.top &&
                    elementOffset.top < viewportOffset.top + viewportSize.height - infiniteScrollOffset &&
                    elementOffset.left + elementSize.width > viewportOffset.left &&
                    elementOffset.left < viewportOffset.left + viewportSize.width) {
                    visiblePartX = (viewportOffset.left > elementOffset.left ?
                        'right' : (viewportOffset.left + viewportSize.width) < (elementOffset.left + elementSize.width) ?
                        'left' : 'both');
                    visiblePartY = (viewportOffset.top > elementOffset.top ?
                        'bottom' : (viewportOffset.top + viewportSize.height) < (elementOffset.top + elementSize.height) ?
                        'top' : 'both');
                    visiblePartsMerged = visiblePartX + "-" + visiblePartY;
                    if (!inView || inView !== visiblePartsMerged) {
                        $element.data('inview', visiblePartsMerged).trigger('inview', [true, visiblePartX, visiblePartY]);
                    }
                } else if (inView) {
                    $element.data('inview', false).trigger('inview', [false]);
                }
            }
        }
    }
    $(w).bind("scroll resize", function() {
        viewportSize = viewportOffset = null;
    });
    // IE < 9 scrolls to focused elements without firing the "scroll" event
    if (!documentElement.addEventListener && documentElement.attachEvent) {
        documentElement.attachEvent("onfocusin", function() {
            viewportOffset = null;
        });
    }
    // Use setInterval in order to also make sure this captures elements within
    // "overflow:scroll" elements or elements that appeared in the dom tree due to
    // dom manipulation and reflow
    // old: $(window).scroll(checkInView);
    //
    // By the way, iOS (iPad, iPhone, ...) seems to not execute, or at least delays
    // intervals while the user scrolls. Therefore the inview event might fire a bit late there
    setInterval(checkInView, 250);
})(jQuery);

// jQuery Shorten (Docs & Licensing: https://github.com/MarcDiethelm/jQuery-Shorten)
(function(a){function s(g,c){return c.measureText(g).width}function t(g,c){c.text(g);return c.width()}var q=false,o,j,k;a.fn.shorten=function(){var g={},c=arguments,r=c.callee;if(c.length)if(c[0].constructor==Object)g=c[0];else if(c[0]=="options")return a(this).eq(0).data("shorten-options");else g={width:parseInt(c[0]),tail:c[1]};this.css("visibility","hidden");var h=a.extend({},r.defaults,g);return this.each(function(){var e=a(this),d=e.text(),p=d.length,i,f=a("<span/>").html(h.tail).text(),l={shortened:false, textOverflow:false};i=e.css("float")!="none"?h.width||e.width():h.width||e.parent().width();if(i<0)return true;e.data("shorten-options",h);this.style.display="block";this.style.whiteSpace="nowrap";if(o){var b=a(this),n=document.createElement("canvas");ctx=n.getContext("2d");b.html(n);ctx.font=b.css("font-style")+" "+b.css("font-variant")+" "+b.css("font-weight")+" "+Math.ceil(parseFloat(b.css("font-size")))+"px "+b.css("font-family");j=ctx;k=s}else{b=a('<table style="padding:0; margin:0; border:none; font:inherit;width:auto;zoom:1;position:absolute;"><tr style="padding:0; margin:0; border:none; font:inherit;"><td style="padding:0; margin:0; border:none; font:inherit;white-space:nowrap;"></td></tr></table>'); $td=a("td",b);a(this).html(b);j=$td;k=t}b=k.call(this,d,j);if(b<i){e.text(d);this.style.visibility="visible";e.data("shorten-info",l);return true}h.tooltip&&this.setAttribute("title",d);if(r._native&&!g.width){n=a("<span>"+h.tail+"</span>").text();if(n.length==1&&n.charCodeAt(0)==8230){e.text(d);this.style.overflow="hidden";this.style[r._native]="ellipsis";this.style.visibility="visible";l.shortened=true;l.textOverflow="ellipsis";e.data("shorten-info",l);return true}}f=k.call(this,f,j);i-=f;f=i*1.15; if(b-f>0){f=d.substring(0,Math.ceil(p*(f/b)));if(k.call(this,f,j)>i){d=f;p=d.length}}do{p--;d=d.substring(0,p)}while(k.call(this,d,j)>=i);e.html(a.trim(a("<span/>").text(d).html())+h.tail);this.style.visibility="visible";l.shortened=true;e.data("shorten-info",l);return true})};var m=document.documentElement.style;if("textOverflow"in m)q="textOverflow";else if("OTextOverflow"in m)q="OTextOverflow";if(typeof Modernizr!="undefined"&&Modernizr.canvastext)o=Modernizr.canvastext;else{m=document.createElement("canvas"); o=!!(m.getContext&&m.getContext("2d")&&typeof m.getContext("2d").fillText==="function")}a.fn.shorten._is_canvasTextSupported=o;a.fn.shorten._native=q;a.fn.shorten.defaults={tail:"&hellip;",tooltip:true}})(jQuery);

// jQuery LazyLoadAnything (Docs & Licensing: https://github.com/shrimpwagon/jquery-lazyloadanything)
(function($) {
	// Cache jQuery window
	var $window = $(window);
	// Element to listen to scroll event
	var $listenTo;
	// Force load flag
	var force_load_flag = false;
	// Plugin methods
	var methods = {
		'init': function(options) {
			var defaults = {
				'auto': 			true,
				'cache': 			false,
				'timeout': 			1000,
				'includeMargin': 	false,
				'viewportMargin': 	0,
				'repeatLoad': 		false,
				'listenTo': 		window,
				'onLoadingStart': function(e, llelements, indexes) {
					return true;
				},
				'onLoad': function(e, llelement) {
					return true;
				},
				'onLoadingComplete': function(e, llelements, indexes) {
					return true;
				}
			};
			var settings = $.extend({}, defaults, options);
			$listenTo = $(settings.listenTo);
			var timeout = 0;
			var llelements = [];
			var $selector = this;
			// Scroll listener
			$listenTo.bind('scroll.lla', function(e) {
				// Check for manually/auto load
				if(!force_load_flag && !settings.auto) return false;
				force_load_flag = false;
				// Clear timeout if scrolling continues
				clearTimeout(timeout);
				// Set the timeout for onLoad
				timeout = setTimeout(function() {
					var viewport_left = $listenTo.scrollLeft();
					var viewport_top = $listenTo.scrollTop();
					var viewport_width = $listenTo.innerWidth();
					var viewport_height = $listenTo.innerHeight();
					var viewport_x1 = viewport_left - settings.viewportMargin;
					var viewport_x2 = viewport_left + viewport_width + settings.viewportMargin;
					var viewport_y1 = viewport_top - settings.viewportMargin;
					var viewport_y2 = viewport_top + viewport_height + settings.viewportMargin;
					var load_elements = [];
					var i, llelem_top, llelem_bottom;
					// Cycle through llelements and check if they are within viewpane
					for(i = 0; i < llelements.length; i++) {
						// Get top and bottom of llelem
						llelem_x1 = llelements[i].getLeft();
						llelem_x2 = llelements[i].getRight();
						llelem_y1 = llelements[i].getTop();
						llelem_y2 = llelements[i].getBottom();
						if(llelements[i].$element.is(':visible')) {
							if ((viewport_x1 < llelem_x2) && (viewport_x2 > llelem_x1) && (viewport_y1 < llelem_y2) && (viewport_y2 > llelem_y1)) {
								// Grab index of llelements that will be loaded
								if(settings.repeatLoad || !llelements[i].loaded) load_elements.push(i);
							}
						}
					};
					// Call onLoadingStart event
					if(settings.onLoadingStart.call(undefined, e, llelements, load_elements)) {
						// Cycle through array of indexes that will be loaded
						for(i = 0; i < load_elements.length; i++) {
							// Set loaded flag
							llelements[load_elements[i]].loaded = true;
							// Call the individual element onLoad
							if(settings.onLoad.call(undefined, e, llelements[load_elements[i]]) === false) break;
						}
						// Call onLoadingComplete event
						settings.onLoadingComplete.call(undefined, e, llelements, load_elements);
					}
				}, settings.timeout);
			});
			// LazyLoadElement class
			function LazyLoadElement($element) {
				var self = this;
				this.loaded = false;
				this.$element = $element;
				this.top = undefined;
				this.bottom = undefined;
				this.left = undefined;
				this.right = undefined;
				this.getTop = function() {
					if (self.top) return self.top;
					//return self.$element.position().top;
					return self.$element.offset().top;
				};
				this.getBottom = function() {
					if(self.bottom) return self.bottom;
					var top = (self.top) ? self.top : this.getTop();
					return top + self.$element.outerHeight(settings.includeMargin);
				};
				this.getLeft = function() {
					if(self.left) return self.left;
					return self.$element.position().left;
				};
				this.getRight = function() {
					if(self.right) return self.right;
					var left = (self.left) ? self.left : this.getLeft();
					return left + self.$element.outerWidth(settings.includeMargin);
				};
				// Cache the top and bottom of set
				if(settings.cache) {
					this.top = this.getTop();
					this.bottom = this.getBottom();
					this.left = this.getLeft();
					this.right = this.getRight();
				};
			};
			// Cycle throught the selector(s)
			var chain = $selector.each(function() {
				// Add LazyLoadElement classes to the main array
				llelements.push(new LazyLoadElement($(this)));
			});
			return chain;
		},
		'destroy': function() {
			$listenTo.unbind('scroll.lla');
		},
		'load': function() {
			force_load_flag = true;
			$listenTo.trigger('scroll.lla');
		}
	};
	$.fn.lazyloadanything = function(method) {
		// Method calling logic
		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.lazyloadanything');
		}
	};
})( jQuery );

// waitForImages 1.5.0 (Docs & Licensing: https://github.com/alexanderdickson/waitForImages)
!function(a){var b="waitForImages";a.waitForImages={hasImageProperties:["backgroundImage","listStyleImage","borderImage","borderCornerImage","cursor"]},a.expr[":"].uncached=function(b){if(!a(b).is('img[src!=""]'))return!1;var c=new Image;return c.src=b.src,!c.complete},a.fn.waitForImages=function(c,d,e){var f=0,g=0;if(a.isPlainObject(arguments[0])&&(e=arguments[0].waitForAll,d=arguments[0].each,c=arguments[0].finished),c=c||a.noop,d=d||a.noop,e=!!e,!a.isFunction(c)||!a.isFunction(d))throw new TypeError("An invalid callback was supplied.");return this.each(function(){var h=a(this),i=[],j=a.waitForImages.hasImageProperties||[],k=/url\(\s*(['"]?)(.*?)\1\s*\)/g;e?h.find("*").addBack().each(function(){var b=a(this);b.is("img:uncached")&&i.push({src:b.attr("src"),element:b[0]}),a.each(j,function(a,c){var d,e=b.css(c);if(!e)return!0;for(;d=k.exec(e);)i.push({src:d[2],element:b[0]})})}):h.find("img:uncached").each(function(){i.push({src:this.src,element:this})}),f=i.length,g=0,0===f&&c.call(h[0]),a.each(i,function(e,i){var j=new Image;a(j).on("load."+b+" error."+b,function(a){return g++,d.call(i.element,g,f,"load"==a.type),g==f?(c.call(h[0]),!1):void 0}),j.src=i.src})})}}(jQuery);

// Custom Layout Modes for Isotope
(function ($) {
	if ($.isFunction($.fn.isotope)) {
		$.Isotope.prototype.flush = function() {
			this.$allAtoms = $();
			this.$filteredAtoms = $();
			//this.element.children().remove();
			//this.reLayout();
		};
		// Centered Masonry
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
			var colW = this.options.masonry && this.options.masonry.columnWidth || this.$filteredAtoms.outerWidth(true) || parentWidth;
			var cols = Math.floor(parentWidth / colW);
			cols = Math.max(cols, 1);
			this.masonry.cols = cols;
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
			while ( --i ) {
				if ( this.masonry.colYs[i] !== 0 ) {
					break;
				}
				unusedCols++;
			}
			return {
				height:	Math.max.apply( Math, this.masonry.colYs ),
				width: 	(this.masonry.cols - unusedCols) * this.masonry.columnWidth
			};
		};
	};
})( jQuery );

// moment.js 2.5.0 (Docs & Licensing: http://momentjs.com/)
(function(a){function b(a,b){return function(c){return i(a.call(this,c),b)}}function c(a,b){return function(c){return this.lang().ordinal(a.call(this,c),b)}}function d(){}function e(a){u(a),g(this,a)}function f(a){var b=o(a),c=b.year||0,d=b.month||0,e=b.week||0,f=b.day||0,g=b.hour||0,h=b.minute||0,i=b.second||0,j=b.millisecond||0;this._milliseconds=+j+1e3*i+6e4*h+36e5*g,this._days=+f+7*e,this._months=+d+12*c,this._data={},this._bubble()}function g(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return b.hasOwnProperty("toString")&&(a.toString=b.toString),b.hasOwnProperty("valueOf")&&(a.valueOf=b.valueOf),a}function h(a){return 0>a?Math.ceil(a):Math.floor(a)}function i(a,b,c){for(var d=Math.abs(a)+"",e=a>=0;d.length<b;)d="0"+d;return(e?c?"+":"":"-")+d}function j(a,b,c,d){var e,f,g=b._milliseconds,h=b._days,i=b._months;g&&a._d.setTime(+a._d+g*c),(h||i)&&(e=a.minute(),f=a.hour()),h&&a.date(a.date()+h*c),i&&a.month(a.month()+i*c),g&&!d&&cb.updateOffset(a),(h||i)&&(a.minute(e),a.hour(f))}function k(a){return"[object Array]"===Object.prototype.toString.call(a)}function l(a){return"[object Date]"===Object.prototype.toString.call(a)||a instanceof Date}function m(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;e>d;d++)(c&&a[d]!==b[d]||!c&&q(a[d])!==q(b[d]))&&g++;return g+f}function n(a){if(a){var b=a.toLowerCase().replace(/(.)s$/,"$1");a=Qb[a]||Rb[b]||b}return a}function o(a){var b,c,d={};for(c in a)a.hasOwnProperty(c)&&(b=n(c),b&&(d[b]=a[c]));return d}function p(b){var c,d;if(0===b.indexOf("week"))c=7,d="day";else{if(0!==b.indexOf("month"))return;c=12,d="month"}cb[b]=function(e,f){var g,h,i=cb.fn._lang[b],j=[];if("number"==typeof e&&(f=e,e=a),h=function(a){var b=cb().utc().set(d,a);return i.call(cb.fn._lang,b,e||"")},null!=f)return h(f);for(g=0;c>g;g++)j.push(h(g));return j}}function q(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=b>=0?Math.floor(b):Math.ceil(b)),c}function r(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function s(a){return t(a)?366:365}function t(a){return a%4===0&&a%100!==0||a%400===0}function u(a){var b;a._a&&-2===a._pf.overflow&&(b=a._a[ib]<0||a._a[ib]>11?ib:a._a[jb]<1||a._a[jb]>r(a._a[hb],a._a[ib])?jb:a._a[kb]<0||a._a[kb]>23?kb:a._a[lb]<0||a._a[lb]>59?lb:a._a[mb]<0||a._a[mb]>59?mb:a._a[nb]<0||a._a[nb]>999?nb:-1,a._pf._overflowDayOfYear&&(hb>b||b>jb)&&(b=jb),a._pf.overflow=b)}function v(a){a._pf={empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function w(a){return null==a._isValid&&(a._isValid=!isNaN(a._d.getTime())&&a._pf.overflow<0&&!a._pf.empty&&!a._pf.invalidMonth&&!a._pf.nullInput&&!a._pf.invalidFormat&&!a._pf.userInvalidated,a._strict&&(a._isValid=a._isValid&&0===a._pf.charsLeftOver&&0===a._pf.unusedTokens.length)),a._isValid}function x(a){return a?a.toLowerCase().replace("_","-"):a}function y(a,b){return b._isUTC?cb(a).zone(b._offset||0):cb(a).local()}function z(a,b){return b.abbr=a,ob[a]||(ob[a]=new d),ob[a].set(b),ob[a]}function A(a){delete ob[a]}function B(a){var b,c,d,e,f=0,g=function(a){if(!ob[a]&&pb)try{require("./lang/"+a)}catch(b){}return ob[a]};if(!a)return cb.fn._lang;if(!k(a)){if(c=g(a))return c;a=[a]}for(;f<a.length;){for(e=x(a[f]).split("-"),b=e.length,d=x(a[f+1]),d=d?d.split("-"):null;b>0;){if(c=g(e.slice(0,b).join("-")))return c;if(d&&d.length>=b&&m(e,d,!0)>=b-1)break;b--}f++}return cb.fn._lang}function C(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function D(a){var b,c,d=a.match(tb);for(b=0,c=d.length;c>b;b++)d[b]=Vb[d[b]]?Vb[d[b]]:C(d[b]);return function(e){var f="";for(b=0;c>b;b++)f+=d[b]instanceof Function?d[b].call(e,a):d[b];return f}}function E(a,b){return a.isValid()?(b=F(b,a.lang()),Sb[b]||(Sb[b]=D(b)),Sb[b](a)):a.lang().invalidDate()}function F(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(ub.lastIndex=0;d>=0&&ub.test(a);)a=a.replace(ub,c),ub.lastIndex=0,d-=1;return a}function G(a,b){var c,d=b._strict;switch(a){case"DDDD":return Gb;case"YYYY":case"GGGG":case"gggg":return d?Hb:xb;case"YYYYYY":case"YYYYY":case"GGGGG":case"ggggg":return d?Ib:yb;case"S":if(d)return Eb;case"SS":if(d)return Fb;case"SSS":case"DDD":return d?Gb:wb;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return Ab;case"a":case"A":return B(b._l)._meridiemParse;case"X":return Db;case"Z":case"ZZ":return Bb;case"T":return Cb;case"SSSS":return zb;case"MM":case"DD":case"YY":case"GG":case"gg":case"HH":case"hh":case"mm":case"ss":case"ww":case"WW":return d?Fb:vb;case"M":case"D":case"d":case"H":case"h":case"m":case"s":case"w":case"W":case"e":case"E":return d?Eb:vb;default:return c=new RegExp(O(N(a.replace("\\","")),"i"))}}function H(a){a=a||"";var b=a.match(Bb)||[],c=b[b.length-1]||[],d=(c+"").match(Nb)||["-",0,0],e=+(60*d[1])+q(d[2]);return"+"===d[0]?-e:e}function I(a,b,c){var d,e=c._a;switch(a){case"M":case"MM":null!=b&&(e[ib]=q(b)-1);break;case"MMM":case"MMMM":d=B(c._l).monthsParse(b),null!=d?e[ib]=d:c._pf.invalidMonth=b;break;case"D":case"DD":null!=b&&(e[jb]=q(b));break;case"DDD":case"DDDD":null!=b&&(c._dayOfYear=q(b));break;case"YY":e[hb]=q(b)+(q(b)>68?1900:2e3);break;case"YYYY":case"YYYYY":case"YYYYYY":e[hb]=q(b);break;case"a":case"A":c._isPm=B(c._l).isPM(b);break;case"H":case"HH":case"h":case"hh":e[kb]=q(b);break;case"m":case"mm":e[lb]=q(b);break;case"s":case"ss":e[mb]=q(b);break;case"S":case"SS":case"SSS":case"SSSS":e[nb]=q(1e3*("0."+b));break;case"X":c._d=new Date(1e3*parseFloat(b));break;case"Z":case"ZZ":c._useUTC=!0,c._tzm=H(b);break;case"w":case"ww":case"W":case"WW":case"d":case"dd":case"ddd":case"dddd":case"e":case"E":a=a.substr(0,1);case"gg":case"gggg":case"GG":case"GGGG":case"GGGGG":a=a.substr(0,2),b&&(c._w=c._w||{},c._w[a]=b)}}function J(a){var b,c,d,e,f,g,h,i,j,k,l=[];if(!a._d){for(d=L(a),a._w&&null==a._a[jb]&&null==a._a[ib]&&(f=function(b){var c=parseInt(b,10);return b?b.length<3?c>68?1900+c:2e3+c:c:null==a._a[hb]?cb().weekYear():a._a[hb]},g=a._w,null!=g.GG||null!=g.W||null!=g.E?h=Y(f(g.GG),g.W||1,g.E,4,1):(i=B(a._l),j=null!=g.d?U(g.d,i):null!=g.e?parseInt(g.e,10)+i._week.dow:0,k=parseInt(g.w,10)||1,null!=g.d&&j<i._week.dow&&k++,h=Y(f(g.gg),k,j,i._week.doy,i._week.dow)),a._a[hb]=h.year,a._dayOfYear=h.dayOfYear),a._dayOfYear&&(e=null==a._a[hb]?d[hb]:a._a[hb],a._dayOfYear>s(e)&&(a._pf._overflowDayOfYear=!0),c=T(e,0,a._dayOfYear),a._a[ib]=c.getUTCMonth(),a._a[jb]=c.getUTCDate()),b=0;3>b&&null==a._a[b];++b)a._a[b]=l[b]=d[b];for(;7>b;b++)a._a[b]=l[b]=null==a._a[b]?2===b?1:0:a._a[b];l[kb]+=q((a._tzm||0)/60),l[lb]+=q((a._tzm||0)%60),a._d=(a._useUTC?T:S).apply(null,l)}}function K(a){var b;a._d||(b=o(a._i),a._a=[b.year,b.month,b.day,b.hour,b.minute,b.second,b.millisecond],J(a))}function L(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function M(a){a._a=[],a._pf.empty=!0;var b,c,d,e,f,g=B(a._l),h=""+a._i,i=h.length,j=0;for(d=F(a._f,g).match(tb)||[],b=0;b<d.length;b++)e=d[b],c=(h.match(G(e,a))||[])[0],c&&(f=h.substr(0,h.indexOf(c)),f.length>0&&a._pf.unusedInput.push(f),h=h.slice(h.indexOf(c)+c.length),j+=c.length),Vb[e]?(c?a._pf.empty=!1:a._pf.unusedTokens.push(e),I(e,c,a)):a._strict&&!c&&a._pf.unusedTokens.push(e);a._pf.charsLeftOver=i-j,h.length>0&&a._pf.unusedInput.push(h),a._isPm&&a._a[kb]<12&&(a._a[kb]+=12),a._isPm===!1&&12===a._a[kb]&&(a._a[kb]=0),J(a),u(a)}function N(a){return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e})}function O(a){return a.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function P(a){var b,c,d,e,f;if(0===a._f.length)return a._pf.invalidFormat=!0,a._d=new Date(0/0),void 0;for(e=0;e<a._f.length;e++)f=0,b=g({},a),v(b),b._f=a._f[e],M(b),w(b)&&(f+=b._pf.charsLeftOver,f+=10*b._pf.unusedTokens.length,b._pf.score=f,(null==d||d>f)&&(d=f,c=b));g(a,c||b)}function Q(a){var b,c=a._i,d=Jb.exec(c);if(d){for(a._pf.iso=!0,b=4;b>0;b--)if(d[b]){a._f=Lb[b-1]+(d[6]||" ");break}for(b=0;4>b;b++)if(Mb[b][1].exec(c)){a._f+=Mb[b][0];break}c.match(Bb)&&(a._f+="Z"),M(a)}else a._d=new Date(c)}function R(b){var c=b._i,d=qb.exec(c);c===a?b._d=new Date:d?b._d=new Date(+d[1]):"string"==typeof c?Q(b):k(c)?(b._a=c.slice(0),J(b)):l(c)?b._d=new Date(+c):"object"==typeof c?K(b):b._d=new Date(c)}function S(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return 1970>a&&h.setFullYear(a),h}function T(a){var b=new Date(Date.UTC.apply(null,arguments));return 1970>a&&b.setUTCFullYear(a),b}function U(a,b){if("string"==typeof a)if(isNaN(a)){if(a=b.weekdaysParse(a),"number"!=typeof a)return null}else a=parseInt(a,10);return a}function V(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function W(a,b,c){var d=gb(Math.abs(a)/1e3),e=gb(d/60),f=gb(e/60),g=gb(f/24),h=gb(g/365),i=45>d&&["s",d]||1===e&&["m"]||45>e&&["mm",e]||1===f&&["h"]||22>f&&["hh",f]||1===g&&["d"]||25>=g&&["dd",g]||45>=g&&["M"]||345>g&&["MM",gb(g/30)]||1===h&&["y"]||["yy",h];return i[2]=b,i[3]=a>0,i[4]=c,V.apply({},i)}function X(a,b,c){var d,e=c-b,f=c-a.day();return f>e&&(f-=7),e-7>f&&(f+=7),d=cb(a).add("d",f),{week:Math.ceil(d.dayOfYear()/7),year:d.year()}}function Y(a,b,c,d,e){var f,g,h=new Date(i(a,6,!0)+"-01-01").getUTCDay();return c=null!=c?c:e,f=e-h+(h>d?7:0),g=7*(b-1)+(c-e)+f+1,{year:g>0?a:a-1,dayOfYear:g>0?g:s(a-1)+g}}function Z(a){var b=a._i,c=a._f;return"undefined"==typeof a._pf&&v(a),null===b?cb.invalid({nullInput:!0}):("string"==typeof b&&(a._i=b=B().preparse(b)),cb.isMoment(b)?(a=g({},b),a._d=new Date(+b._d)):c?k(c)?P(a):M(a):R(a),new e(a))}function $(a,b){cb.fn[a]=cb.fn[a+"s"]=function(a){var c=this._isUTC?"UTC":"";return null!=a?(this._d["set"+c+b](a),cb.updateOffset(this),this):this._d["get"+c+b]()}}function _(a){cb.duration.fn[a]=function(){return this._data[a]}}function ab(a,b){cb.duration.fn["as"+a]=function(){return+this/b}}function bb(a){var b=!1,c=cb;"undefined"==typeof ender&&(a?(fb.moment=function(){return!b&&console&&console.warn&&(b=!0,console.warn("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.")),c.apply(null,arguments)},g(fb.moment,c)):fb.moment=cb)}for(var cb,db,eb="2.5.0",fb=this,gb=Math.round,hb=0,ib=1,jb=2,kb=3,lb=4,mb=5,nb=6,ob={},pb="undefined"!=typeof module&&module.exports&&"undefined"!=typeof require,qb=/^\/?Date\((\-?\d+)/i,rb=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,sb=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,tb=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,ub=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,vb=/\d\d?/,wb=/\d{1,3}/,xb=/\d{1,4}/,yb=/[+\-]?\d{1,6}/,zb=/\d+/,Ab=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,Bb=/Z|[\+\-]\d\d:?\d\d/gi,Cb=/T/i,Db=/[\+\-]?\d+(\.\d{1,3})?/,Eb=/\d/,Fb=/\d\d/,Gb=/\d{3}/,Hb=/\d{4}/,Ib=/[+\-]?\d{6}/,Jb=/^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,Kb="YYYY-MM-DDTHH:mm:ssZ",Lb=["YYYY-MM-DD","GGGG-[W]WW","GGGG-[W]WW-E","YYYY-DDD"],Mb=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],Nb=/([\+\-]|\d\d)/gi,Ob="Date|Hours|Minutes|Seconds|Milliseconds".split("|"),Pb={Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6},Qb={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",D:"date",w:"week",W:"isoWeek",M:"month",y:"year",DDD:"dayOfYear",e:"weekday",E:"isoWeekday",gg:"weekYear",GG:"isoWeekYear"},Rb={dayofyear:"dayOfYear",isoweekday:"isoWeekday",isoweek:"isoWeek",weekyear:"weekYear",isoweekyear:"isoWeekYear"},Sb={},Tb="DDD w W M D d".split(" "),Ub="M D H h m s w W".split(" "),Vb={M:function(){return this.month()+1},MMM:function(a){return this.lang().monthsShort(this,a)},MMMM:function(a){return this.lang().months(this,a)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(a){return this.lang().weekdaysMin(this,a)},ddd:function(a){return this.lang().weekdaysShort(this,a)},dddd:function(a){return this.lang().weekdays(this,a)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return i(this.year()%100,2)},YYYY:function(){return i(this.year(),4)},YYYYY:function(){return i(this.year(),5)},YYYYYY:function(){var a=this.year(),b=a>=0?"+":"-";return b+i(Math.abs(a),6)},gg:function(){return i(this.weekYear()%100,2)},gggg:function(){return this.weekYear()},ggggg:function(){return i(this.weekYear(),5)},GG:function(){return i(this.isoWeekYear()%100,2)},GGGG:function(){return this.isoWeekYear()},GGGGG:function(){return i(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return q(this.milliseconds()/100)},SS:function(){return i(q(this.milliseconds()/10),2)},SSS:function(){return i(this.milliseconds(),3)},SSSS:function(){return i(this.milliseconds(),3)},Z:function(){var a=-this.zone(),b="+";return 0>a&&(a=-a,b="-"),b+i(q(a/60),2)+":"+i(q(a)%60,2)},ZZ:function(){var a=-this.zone(),b="+";return 0>a&&(a=-a,b="-"),b+i(q(a/60),2)+i(q(a)%60,2)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},X:function(){return this.unix()},Q:function(){return this.quarter()}},Wb=["months","monthsShort","weekdays","weekdaysShort","weekdaysMin"];Tb.length;)db=Tb.pop(),Vb[db+"o"]=c(Vb[db],db);for(;Ub.length;)db=Ub.pop(),Vb[db+db]=b(Vb[db],2);for(Vb.DDDD=b(Vb.DDD,3),g(d.prototype,{set:function(a){var b,c;for(c in a)b=a[c],"function"==typeof b?this[c]=b:this["_"+c]=b},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(a){return this._months[a.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(a){return this._monthsShort[a.month()]},monthsParse:function(a){var b,c,d;for(this._monthsParse||(this._monthsParse=[]),b=0;12>b;b++)if(this._monthsParse[b]||(c=cb.utc([2e3,b]),d="^"+this.months(c,"")+"|^"+this.monthsShort(c,""),this._monthsParse[b]=new RegExp(d.replace(".",""),"i")),this._monthsParse[b].test(a))return b},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(a){return this._weekdays[a.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(a){return this._weekdaysShort[a.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(a){return this._weekdaysMin[a.day()]},weekdaysParse:function(a){var b,c,d;for(this._weekdaysParse||(this._weekdaysParse=[]),b=0;7>b;b++)if(this._weekdaysParse[b]||(c=cb([2e3,1]).day(b),d="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,""),this._weekdaysParse[b]=new RegExp(d.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},longDateFormat:function(a){var b=this._longDateFormat[a];return!b&&this._longDateFormat[a.toUpperCase()]&&(b=this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a]=b),b},isPM:function(a){return"p"===(a+"").toLowerCase().charAt(0)},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(a,b){var c=this._calendar[a];return"function"==typeof c?c.apply(b):c},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(a,b,c,d){var e=this._relativeTime[c];return"function"==typeof e?e(a,b,c,d):e.replace(/%d/i,a)},pastFuture:function(a,b){var c=this._relativeTime[a>0?"future":"past"];return"function"==typeof c?c(b):c.replace(/%s/i,b)},ordinal:function(a){return this._ordinal.replace("%d",a)},_ordinal:"%d",preparse:function(a){return a},postformat:function(a){return a},week:function(a){return X(a,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6},_invalidDate:"Invalid date",invalidDate:function(){return this._invalidDate}}),cb=function(b,c,d,e){return"boolean"==typeof d&&(e=d,d=a),Z({_i:b,_f:c,_l:d,_strict:e,_isUTC:!1})},cb.utc=function(b,c,d,e){var f;return"boolean"==typeof d&&(e=d,d=a),f=Z({_useUTC:!0,_isUTC:!0,_l:d,_i:b,_f:c,_strict:e}).utc()},cb.unix=function(a){return cb(1e3*a)},cb.duration=function(a,b){var c,d,e,g=a,h=null;return cb.isDuration(a)?g={ms:a._milliseconds,d:a._days,M:a._months}:"number"==typeof a?(g={},b?g[b]=a:g.milliseconds=a):(h=rb.exec(a))?(c="-"===h[1]?-1:1,g={y:0,d:q(h[jb])*c,h:q(h[kb])*c,m:q(h[lb])*c,s:q(h[mb])*c,ms:q(h[nb])*c}):(h=sb.exec(a))&&(c="-"===h[1]?-1:1,e=function(a){var b=a&&parseFloat(a.replace(",","."));return(isNaN(b)?0:b)*c},g={y:e(h[2]),M:e(h[3]),d:e(h[4]),h:e(h[5]),m:e(h[6]),s:e(h[7]),w:e(h[8])}),d=new f(g),cb.isDuration(a)&&a.hasOwnProperty("_lang")&&(d._lang=a._lang),d},cb.version=eb,cb.defaultFormat=Kb,cb.updateOffset=function(){},cb.lang=function(a,b){var c;return a?(b?z(x(a),b):null===b?(A(a),a="en"):ob[a]||B(a),c=cb.duration.fn._lang=cb.fn._lang=B(a),c._abbr):cb.fn._lang._abbr},cb.langData=function(a){return a&&a._lang&&a._lang._abbr&&(a=a._lang._abbr),B(a)},cb.isMoment=function(a){return a instanceof e},cb.isDuration=function(a){return a instanceof f},db=Wb.length-1;db>=0;--db)p(Wb[db]);for(cb.normalizeUnits=function(a){return n(a)},cb.invalid=function(a){var b=cb.utc(0/0);return null!=a?g(b._pf,a):b._pf.userInvalidated=!0,b},cb.parseZone=function(a){return cb(a).parseZone()},g(cb.fn=e.prototype,{clone:function(){return cb(this)},valueOf:function(){return+this._d+6e4*(this._offset||0)},unix:function(){return Math.floor(+this/1e3)},toString:function(){return this.clone().lang("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){var a=cb(this).utc();return 0<a.year()&&a.year()<=9999?E(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):E(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var a=this;return[a.year(),a.month(),a.date(),a.hours(),a.minutes(),a.seconds(),a.milliseconds()]},isValid:function(){return w(this)},isDSTShifted:function(){return this._a?this.isValid()&&m(this._a,(this._isUTC?cb.utc(this._a):cb(this._a)).toArray())>0:!1},parsingFlags:function(){return g({},this._pf)},invalidAt:function(){return this._pf.overflow},utc:function(){return this.zone(0)},local:function(){return this.zone(0),this._isUTC=!1,this},format:function(a){var b=E(this,a||cb.defaultFormat);return this.lang().postformat(b)},add:function(a,b){var c;return c="string"==typeof a?cb.duration(+b,a):cb.duration(a,b),j(this,c,1),this},subtract:function(a,b){var c;return c="string"==typeof a?cb.duration(+b,a):cb.duration(a,b),j(this,c,-1),this},diff:function(a,b,c){var d,e,f=y(a,this),g=6e4*(this.zone()-f.zone());return b=n(b),"year"===b||"month"===b?(d=432e5*(this.daysInMonth()+f.daysInMonth()),e=12*(this.year()-f.year())+(this.month()-f.month()),e+=(this-cb(this).startOf("month")-(f-cb(f).startOf("month")))/d,e-=6e4*(this.zone()-cb(this).startOf("month").zone()-(f.zone()-cb(f).startOf("month").zone()))/d,"year"===b&&(e/=12)):(d=this-f,e="second"===b?d/1e3:"minute"===b?d/6e4:"hour"===b?d/36e5:"day"===b?(d-g)/864e5:"week"===b?(d-g)/6048e5:d),c?e:h(e)},from:function(a,b){return cb.duration(this.diff(a)).lang(this.lang()._abbr).humanize(!b)},fromNow:function(a){return this.from(cb(),a)},calendar:function(){var a=y(cb(),this).startOf("day"),b=this.diff(a,"days",!0),c=-6>b?"sameElse":-1>b?"lastWeek":0>b?"lastDay":1>b?"sameDay":2>b?"nextDay":7>b?"nextWeek":"sameElse";return this.format(this.lang().calendar(c,this))},isLeapYear:function(){return t(this.year())},isDST:function(){return this.zone()<this.clone().month(0).zone()||this.zone()<this.clone().month(5).zone()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=U(a,this.lang()),this.add({d:a-b})):b},month:function(a){var b,c=this._isUTC?"UTC":"";return null!=a?"string"==typeof a&&(a=this.lang().monthsParse(a),"number"!=typeof a)?this:(b=this.date(),this.date(1),this._d["set"+c+"Month"](a),this.date(Math.min(b,this.daysInMonth())),cb.updateOffset(this),this):this._d["get"+c+"Month"]()},startOf:function(a){switch(a=n(a)){case"year":this.month(0);case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a?this.weekday(0):"isoWeek"===a&&this.isoWeekday(1),this},endOf:function(a){return a=n(a),this.startOf(a).add("isoWeek"===a?"week":a,1).subtract("ms",1)},isAfter:function(a,b){return b="undefined"!=typeof b?b:"millisecond",+this.clone().startOf(b)>+cb(a).startOf(b)},isBefore:function(a,b){return b="undefined"!=typeof b?b:"millisecond",+this.clone().startOf(b)<+cb(a).startOf(b)},isSame:function(a,b){return b=b||"ms",+this.clone().startOf(b)===+y(a,this).startOf(b)},min:function(a){return a=cb.apply(null,arguments),this>a?this:a},max:function(a){return a=cb.apply(null,arguments),a>this?this:a},zone:function(a){var b=this._offset||0;return null==a?this._isUTC?b:this._d.getTimezoneOffset():("string"==typeof a&&(a=H(a)),Math.abs(a)<16&&(a=60*a),this._offset=a,this._isUTC=!0,b!==a&&j(this,cb.duration(b-a,"m"),1,!0),this)},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},parseZone:function(){return this._tzm?this.zone(this._tzm):"string"==typeof this._i&&this.zone(this._i),this},hasAlignedHourOffset:function(a){return a=a?cb(a).zone():0,(this.zone()-a)%60===0},daysInMonth:function(){return r(this.year(),this.month())},dayOfYear:function(a){var b=gb((cb(this).startOf("day")-cb(this).startOf("year"))/864e5)+1;return null==a?b:this.add("d",a-b)},quarter:function(){return Math.ceil((this.month()+1)/3)},weekYear:function(a){var b=X(this,this.lang()._week.dow,this.lang()._week.doy).year;return null==a?b:this.add("y",a-b)},isoWeekYear:function(a){var b=X(this,1,4).year;return null==a?b:this.add("y",a-b)},week:function(a){var b=this.lang().week(this);return null==a?b:this.add("d",7*(a-b))},isoWeek:function(a){var b=X(this,1,4).week;return null==a?b:this.add("d",7*(a-b))},weekday:function(a){var b=(this.day()+7-this.lang()._week.dow)%7;return null==a?b:this.add("d",a-b)},isoWeekday:function(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)},get:function(a){return a=n(a),this[a]()},set:function(a,b){return a=n(a),"function"==typeof this[a]&&this[a](b),this},lang:function(b){return b===a?this._lang:(this._lang=B(b),this)}}),db=0;db<Ob.length;db++)$(Ob[db].toLowerCase().replace(/s$/,""),Ob[db]);$("year","FullYear"),cb.fn.days=cb.fn.day,cb.fn.months=cb.fn.month,cb.fn.weeks=cb.fn.week,cb.fn.isoWeeks=cb.fn.isoWeek,cb.fn.toJSON=cb.fn.toISOString,g(cb.duration.fn=f.prototype,{_bubble:function(){var a,b,c,d,e=this._milliseconds,f=this._days,g=this._months,i=this._data;i.milliseconds=e%1e3,a=h(e/1e3),i.seconds=a%60,b=h(a/60),i.minutes=b%60,c=h(b/60),i.hours=c%24,f+=h(c/24),i.days=f%30,g+=h(f/30),i.months=g%12,d=h(g/12),i.years=d},weeks:function(){return h(this.days()/7)},valueOf:function(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*q(this._months/12)},humanize:function(a){var b=+this,c=W(b,!a,this.lang());return a&&(c=this.lang().pastFuture(b,c)),this.lang().postformat(c)},add:function(a,b){var c=cb.duration(a,b);return this._milliseconds+=c._milliseconds,this._days+=c._days,this._months+=c._months,this._bubble(),this},subtract:function(a,b){var c=cb.duration(a,b);return this._milliseconds-=c._milliseconds,this._days-=c._days,this._months-=c._months,this._bubble(),this},get:function(a){return a=n(a),this[a.toLowerCase()+"s"]()},as:function(a){return a=n(a),this["as"+a.charAt(0).toUpperCase()+a.slice(1)+"s"]()},lang:cb.fn.lang,toIsoString:function(){var a=Math.abs(this.years()),b=Math.abs(this.months()),c=Math.abs(this.days()),d=Math.abs(this.hours()),e=Math.abs(this.minutes()),f=Math.abs(this.seconds()+this.milliseconds()/1e3);return this.asSeconds()?(this.asSeconds()<0?"-":"")+"P"+(a?a+"Y":"")+(b?b+"M":"")+(c?c+"D":"")+(d||e||f?"T":"")+(d?d+"H":"")+(e?e+"M":"")+(f?f+"S":""):"P0D"}});for(db in Pb)Pb.hasOwnProperty(db)&&(ab(db,Pb[db]),_(db.toLowerCase()));ab("Weeks",6048e5),cb.duration.fn.asMonths=function(){return(+this-31536e6*this.years())/2592e6+12*this.years()},cb.lang("en",{ordinal:function(a){var b=a%10,c=1===q(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),pb?(module.exports=cb,bb(!0)):"function"==typeof define&&define.amd?define("moment",function(b,c,d){return d.config&&d.config()&&d.config().noGlobal!==!0&&bb(d.config().noGlobal===a),cb}):bb()}).call(this);

// StickyScroll Plugin (Docs & Licensing: https://github.com/rickharris/stickyscroll)
(function($) {
    $.fn.stickyScroll = function(options) {
        var methods = {
            init : function(options) {
                var settings;
                if (options.mode !== 'auto' && options.mode !== 'manual') {
                    if (options.container) {
                        options.mode = 'auto';
                    }
                    if (options.bottomBoundary) {
                        options.mode = 'manual';
                    }
                };
                settings = $.extend({
                    mode: 				'auto', // 'auto' or 'manual'
                    container: 			$('body'),
                    topBoundary: 		null,
                    bottomBoundary: 	null
                }, options);
                function bottomBoundary() {
					return settings.container.offset().top + isotopeHeightContainer;
                };
                function topBoundary() {
                    return settings.container.offset().top
                };
                function elHeight(el) {
                    return $(el).attr('offsetHeight');
                };
                // make sure user input is a jQuery object
                settings.container = $(settings.container);
                if(!settings.container.length) {
                    if(console) {
                        console.log('StickyScroll: the element ' + options.container + ' does not exist, we\'re throwing in the towel.');
                    };
                    return;
                };
                // calculate automatic bottomBoundary
                if(settings.mode === 'auto') {
                    settings.topBoundary 	= topBoundary();
                    settings.bottomBoundary = bottomBoundary();
                };
                return this.each(function(index) {
                    var el = $(this), win = $(window), id = moment() + index, height = elHeight(el);
                    el.data('sticky-id', id);
                    win.bind('scroll.stickyscroll-' + id, function() {
                        var top = $(document).scrollTop();
						var bottom = top - isotopeHeightContainer;
						//$("#PositionControl").html("Offset: " + settings.topBoundary + "</br></br>Container: " + isotopeHeightContainer + "</br></br>Limit: " + settings.bottomBoundary + "</br></br>Top: " + top + "</br></br>Bottom: " + (bottom - settings.topBoundary));
                        if (bottom - settings.topBoundary >= 0) {
							// Don't follow mouse further once bottom of container has been reached
                            el.offset({
                                top: $(document).height() - settings.bottomBoundary - height
                            }).removeClass('sticky-active').removeClass('sticky-inactive').addClass('sticky-stopped');
							//$(".Scroll_To_Top").show().css("marginLeft", "10px");
							$(".Scroll_To_Top").show();
                        } else if (top > settings.topBoundary) {
							// Follow mouse as long as container is still visible
                            el.offset({
                                top: $(window).scrollTop() + controlBarAdjust
                            }).removeClass('sticky-stopped').removeClass('sticky-inactive').addClass('sticky-active');
							//$(".Scroll_To_Top").show().css("marginLeft", "10px");
							$(".Scroll_To_Top").show();
                        } else if (top < settings.topBoundary) {
							// Return to original position as after page load
                            el.css({
                                position: 	'',
                                top: 		'',
                                bottom: 	''
                            })
                            .removeClass('sticky-stopped')
                            .removeClass('sticky-active')
                            .addClass('sticky-inactive');
							//$(".Scroll_To_Top").hide().css("marginLeft", "0px");
							$(".Scroll_To_Top").hide();
                        }
                    });
                    win.bind('resize.stickyscroll-' + id, function() {
                        if (settings.mode === 'auto') {
                            settings.topBoundary 		= topBoundary();
                            settings.bottomBoundary 	= bottomBoundary();
                        };
                        height = elHeight(el);
                        $(this).scroll();
                    });
                    el.addClass('sticky-processed').addClass('sticky-id-' + id);
                    // start it off
                    win.scroll();
                });
            },
            reset : function() {
                return this.each(function() {
                    var el = $(this), id = el.data('sticky-id');
                    el.css({
                        position: '',
                        top: '',
                        bottom: ''
                    }).removeClass('sticky-stopped').removeClass('sticky-active').removeClass('sticky-inactive').removeClass('sticky-processed');
                    $(window).unbind('.stickyscroll-' + id);
                });
            }
        };
        // if options is a valid method, execute it
        if (methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) {
            return methods.init.apply(this, arguments);
        } else if(console) {
            console.log('Method' + options + ' does not exist on jQuery.stickyScroll');
        };
    };
})(jQuery);

// jRumble v1.3 (Docs & Licensing: http://jackrugile.com/jrumble)
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
