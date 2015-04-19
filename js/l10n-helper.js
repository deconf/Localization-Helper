"use strict";

var L10N_gotone = false;

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
			if (e.ctrlKey) {
				if (L10N_gotone == false) {
					var translation = jQuery(this).html();

					render_results(translation);

					if (typeof L10N_data[translation] == 'undefined') {
						translation = translation.replace(/(<([^>]+)>)/ig, "")
								.replace(/(\r\n|\n|\r|\t)/gm, "").trim();
						render_results(translation);
					}

					if (typeof L10N_data[translation] == 'undefined'
							&& typeof jQuery(this).val() != 'undefined') {
						translation = jQuery(this).val();
						render_results(translation);
					}
				}
			}

		});