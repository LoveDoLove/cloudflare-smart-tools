<?php
/**
 * Uninstall Script for Cloudflare Smart Cache
 *
 * This file is executed when the plugin is uninstalled
 * It removes all plugin data from the database
 */

// If uninstall not called from WordPress, then exit
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// Delete plugin options
delete_option('cf_smart_cache_settings');

// Delete transients
delete_transient('cf_smart_cache_zone_list');
delete_transient('cf_smart_cache_rate_limit');

// Clean up user-specific notices (for all users)
global $wpdb;
$wpdb->query(
    "DELETE FROM {$wpdb->options} 
     WHERE option_name LIKE '_transient_cf_smart_cache_notice_%' 
     OR option_name LIKE '_transient_timeout_cf_smart_cache_notice_%'"
);

// Clear any cached data
wp_cache_flush();

// Log the uninstall (if logging is enabled)
if (defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
    error_log('[CF Smart Cache] Plugin uninstalled and all data removed');
}
