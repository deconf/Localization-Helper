"use strict";

var L10N_gotone = false;

var L10N_data_placeholder = {};

var newmatch;

function escapeRegExp(str) {
	  return str.replace(/[\@\:\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

jQuery.each(L10N_data, function(key, value) {
	if (key.match(/%([s,d,f]|[1-9]\$[s,d,f])/)) {
		newmatch = escapeRegExp(key.replace(/%([s,d,f]|[1-9]\$[s,d,f])/g,'YYYYYY')).replace(/YYYYYY YYYYYY/g,'YYYYYY');
		L10N_data_placeholder[key] = new RegExp('^'+newmatch.replace(/YYYYYY/g,'.*')+'$');
	}
});

function htmlEncode(value) {
	if (value) {
		return jQuery('<div/>').text(value).html();
	} else {
		return '';
	}
}

function render_results(translation) {
	if (typeof L10N_data[translation] != 'undefined') {
		if (L10N_data[translation].length > 3) {
			jQuery('#l10n-data').html(
					'<strong>Original: </strong>'
							+ htmlEncode(L10N_data[translation][0])
							+ '<br><br>' + '<strong>Context: </strong>'
							+ L10N_data[translation][2] + '<br><br>'
							+ '<strong>Domain: </strong>'
							+ L10N_data[translation][1] + '<br><br>'
							+ '<strong>L10N Source: </strong>'
							+ L10N_data[translation][3]);
			L10N_gotone = true;
		} else {
			jQuery('#l10n-data').html(
					'<strong>Original: </strong>'
							+ htmlEncode(L10N_data[translation][0])
							+ '<br><br>' + '<strong>Domain: </strong>'
							+ L10N_data[translation][1] + '<br><br>'
							+ '<strong>L10N Source: </strong>'
							+ L10N_data[translation][2]);
			L10N_gotone = true;
		}
		if (!jQuery('#l10n-data').is(':visible')) {
			jQuery('#l10n-data').dialog({
				title : 'L10N Helper',
				width : 600,
				position : {
					my : 'right bottom',
					at : "right-10 bottom-30",
					of : window
				}
			});
		} else {
			jQuery('#l10n-data').dialog("close");
			jQuery('#l10n-data').dialog({
				title : 'L10N Helper',
				width : 600,
				position : {
					my : 'right bottom',
					at : "right-10 bottom-30",
					of : window
				}
			});
		}
	}
}

jQuery('*').mousemove(function(event) {
	L10N_gotone = false;
})

jQuery('*').hover(
		function(e) {
			if (e.altKey) {
				
				if (L10N_gotone == false) {

					var translation = jQuery(this).html();
					
					if (typeof translation == 'undefined') {
						return;
					}
					
					render_results(translation);

					if (typeof L10N_data[translation] == 'undefined') {
						render_results(translation.replace(/(<([^>]+)>)/ig, "")
								.replace(/(\r\n|\n|\r|\t)/gm, "").trim());
					}

					if (typeof L10N_data[translation] == 'undefined'
							&& typeof jQuery(this).val() != 'undefined') {
						render_results(jQuery(this).val());
					}
					
					if (typeof L10N_data[translation] == 'undefined') {
						jQuery.each(L10N_data_placeholder, function(key, value) {
							translation = translation.replace(/(\r\n|\n|\r|\t)/gm, "").trim();
							console.log(value)
							if (translation && translation.match(value)) {
								render_results(key);
							}
						});
					}

				}
			}

		});