"use strict";

var L10N_data_placeholder = {};

var newmatch;

var depth = 0;

function escapeRegExp(str) {
	  return str.replace(/[\@\:\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

jQuery.each(L10N_data, function(key, value) {
	if (key.match(/%([s,d,f]|[1-9]\$[s,d,f])/)) {
		newmatch = key.replace(/%([s]|[1-9]\$[s])/g,'YYYYYY'); // strings
		newmatch = newmatch.replace(/%([d]|[1-9]\$[d])/g,'ZZZZZZ'); // numbers
		newmatch = escapeRegExp(newmatch).replace(/YYYYYY YYYYYY/,'YYYYYY'); //escape and avoid regex infinite loop
		L10N_data_placeholder[key] = new RegExp('^'+newmatch.replace(/YYYYYY/g,'.*').replace(/ZZZZZZ/g,'[0-9999]')+'$');
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
		} else {
			jQuery('#l10n-data').html(
					'<strong>Original: </strong>'
							+ htmlEncode(L10N_data[translation][0])
							+ '<br><br>' + '<strong>Domain: </strong>'
							+ L10N_data[translation][1] + '<br><br>'
							+ '<strong>L10N Source: </strong>'
							+ L10N_data[translation][2]);
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
		return true;
	}else{
		return false;
	}
}

jQuery('*').mousemove(function(event) {
	depth = 0;
})

jQuery('*').hover(
		function(e) {
			if (e.altKey) {
				
				depth = depth + 1;
				
				if (depth < 2) {
					
					var gotone = false;

					var translation = jQuery(this).html();
					
					if (translation.length < 1500){	
						
						gotone = render_results(translation);

						if (!gotone) {
							gotone = render_results(translation.replace(/(\r\n|\n|\r|\t)/g, "").replace(/&nbsp;/g, "\u00a0").trim());
						}
	
						if (!gotone	&& typeof jQuery(this).val() != 'undefined') {
							gotone = render_results(jQuery(this).val());
						}
						
						if (!gotone) {
							jQuery.each(L10N_data_placeholder, function(key, value) {
								translation = translation.replace(/(\r\n|\n|\r|\t)/gm, "").replace(/&nbsp;/g, "\u00a0").trim();
								if (translation && translation.match(value)) {
									gotone = render_results(key);
								}
							});
						}

					}
				}
			}

		});