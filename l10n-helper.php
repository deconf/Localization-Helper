<?php
/**
* Plugin Name: Localization Helper
* Plugin URI: https://deconf.com
* Description: Shows the originals, domain, context and L10N source file while hovering translated strings (while ALT keypressed)
* Author: Alin Marcu
* Version: 0.1
* Author URI: https://deconf.com
*/

add_filter( 'gettext', 'L10N_Helper_Collector',10,3 );
add_filter( 'gettext_with_context', 'L10N_Helper_Collector_Context',10,4 );

add_filter( 'load_textdomain_mofile', 'L10N_Helper_MOFiles',10,2 );

function L10N_Helper_MOFiles($mofile, $domain){
	global $L10N_Helper_MOFiles;
	global $l10n;
	$L10N_Helper_MOFiles[$domain][] = array($mofile, isset($l10n[$domain]->entries) ? count($l10n[$domain]->entries) : 0);
	return $mofile;
}

function L10N_Helper_getsource($domain,$text){
	global $L10N_Helper_MOFiles;
	global $l10n;
	
	$filepath = '';
	
	if (isset($L10N_Helper_MOFiles[$domain])){
	
	if (isset($l10n[$domain]->entries)){
		$index = array_search($text,array_keys($l10n[$domain]->entries));
		foreach ($L10N_Helper_MOFiles[$domain] as $data){
			if ($index >= $data[1]){
				$filepath = $data[0];
			}
		}
	}

	$filepath = str_replace(ABSPATH,'',$filepath);
	}
	
	return $filepath;
}
	
function L10N_Helper_Collector_Context( $translated_text, $text, $context, $domain ) {

	global $L10N_Helper_Collection;

	$L10N_Helper_Collection[html_entity_decode($translated_text)] = array($text, $domain, $context, L10N_Helper_getsource($domain,$text));

	return($translated_text);

}

function L10N_Helper_Collector( $translated_text, $text, $domain ) {

	global $L10N_Helper_Collection;

	$L10N_Helper_Collection[html_entity_decode($translated_text)] = array($text, $domain, L10N_Helper_getsource($domain,$text));

	return($translated_text);

}

add_action('wp_enqueue_scripts', 'L10N_Helper_enqueue' );
add_action('admin_enqueue_scripts', 'L10N_Helper_enqueue' );

add_action('wp_footer', 'L10N_Helper_Collection_output' );
add_action('admin_footer', 'L10N_Helper_Collection_output' );

function L10N_Helper_enqueue(){

	wp_register_script( 'L10N-data', plugins_url( 'js/l10n-helper.js', __FILE__ ), array('jquery','jquery-ui-dialog'), '0.1');
	wp_enqueue_style("wp-jquery-ui-dialog");
	
}

function L10N_Helper_Collection_output(){

	global $L10N_Helper_Collection;
	global $L10N_Helper_MOFiles;
	wp_localize_script( 'L10N-data', 'L10N_data', $L10N_Helper_Collection );
	wp_localize_script( 'L10N-data', 'L10N_momap', $L10N_Helper_MOFiles );
	wp_enqueue_script( 'L10N-data' );
    ?><div id="l10n-data" style="display:none;"></div><?php 	
}