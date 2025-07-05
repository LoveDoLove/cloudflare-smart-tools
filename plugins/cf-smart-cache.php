<?php
/**
 * Plugin Name:       Cloudflare Smart Cache
 * Plugin Slug:       cf-smart-cache
 * Plugin URI:        https://github.com/LoveDoLove/cloudflare-smart-cache
 * Description:       Powerful all-in-one Cloudflare cache solution: edge HTML caching, automatic purging on post/category changes, and advanced admin controls for WordPress.
 * Version:           1.0.4
 * Author:            LoveDoLove
 * Author URI:        https://github.com/LoveDoLove
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       cf-smart-cache
 * Domain Path:       /languages
 * Replace:           cf-smart-cache/cf-smart-cache.php
 *
 */


defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

// ===================== Auto-Deactivate Old Plugin =====================
// Auto-deactivate old version of this plugin if present (Context7 best practice)
add_action('activated_plugin', function($plugin) {
    if (plugin_basename(__FILE__) === $plugin) {
        $old_plugin = 'cf-smart-cache/cf-smart-cache.php';
        if (is_plugin_active($old_plugin) && $old_plugin !== plugin_basename(__FILE__)) {
            deactivate_plugins($old_plugin);
        }
    }
});

// ===================== Edge Cache Headers & Event Hooks =====================
function cf_smart_cache_init_action() {
    static $done = false;
    if ( $done ) {
        return;
    }
    $done = true;

    // Add the edge-cache headers
    if ( !is_user_logged_in() ) {
        header( 'x-HTML-Edge-Cache: cache,bypass-cookies=wp-|wordpress|comment_|woocommerce_' );
    } else {
        header( 'x-HTML-Edge-Cache: nocache' );
    }

    // Post events
    add_action( 'wp_trash_post', 'cf_smart_cache_purge1', 0 );
    add_action( 'publish_post', 'cf_smart_cache_purge1', 0 );
    add_action( 'edit_post', 'cf_smart_cache_purge1', 0 );
    add_action( 'delete_post', 'cf_smart_cache_purge1', 0 );
    add_action( 'publish_phone', 'cf_smart_cache_purge1', 0 );
    // Comment events
    add_action( 'trackback_post', 'cf_smart_cache_purge2', 99 );
    add_action( 'pingback_post', 'cf_smart_cache_purge2', 99 );
    add_action( 'comment_post', 'cf_smart_cache_purge2', 99 );
    add_action( 'edit_comment', 'cf_smart_cache_purge2', 99 );
    add_action( 'wp_set_comment_status', 'cf_smart_cache_purge2', 99, 2 );
    // Other events
    add_action( 'switch_theme', 'cf_smart_cache_purge1', 99 );
    add_action( 'edit_user_profile_update', 'cf_smart_cache_purge1', 99 );
    add_action( 'wp_update_nav_menu', 'cf_smart_cache_purge0' );
    add_action( 'clean_post_cache', 'cf_smart_cache_purge1' );
    add_action( 'transition_post_status', 'cf_smart_cache_post_transition', 10, 3 );
}
add_action( 'init', 'cf_smart_cache_init_action' );

function cf_smart_cache_purge() {
    static $purged = false;
    if ( !$purged ) {
        $purged = true;
        header( 'x-HTML-Edge-Cache: purgeall' );
    }
}
function cf_smart_cache_purge0() { cf_smart_cache_purge(); }
function cf_smart_cache_purge1( $param1 ) { cf_smart_cache_purge(); }
function cf_smart_cache_purge2( $param1, $param2 = "" ) { cf_smart_cache_purge(); }
function cf_smart_cache_post_transition( $new_status, $old_status, $post ) {
    if ( $new_status != $old_status ) {
        cf_smart_cache_purge();
    }
}

// ===================== Admin Settings Page & API Integration =====================
function cf_smart_cache_add_admin_menu() {
    add_options_page(
        'Cloudflare Smart Cache',
        'CF Smart Cache',
        'manage_options',
        'cf_smart_cache',
        'cf_smart_cache_options_page_html'
    );
}
add_action( 'admin_menu', 'cf_smart_cache_add_admin_menu' );

// Update settings to use API Tokens instead of Global API Key
function cf_smart_cache_api_token_render() {
    $options = get_option( 'cf_smart_cache_settings' );
    echo "<input type='password' name='cf_smart_cache_settings[cf_smart_cache_api_token]' value='" . esc_attr( $options['cf_smart_cache_api_token'] ?? '' ) . "' class='regular-text'>";
}

// Update the settings initialization to include API Token
function cf_smart_cache_settings_init() {
    if ( isset( $_GET['page'] ) && $_GET['page'] === 'cf_smart_cache' && isset( $_GET['refresh_zones'] ) && $_GET['refresh_zones'] === 'true' ) {
        check_admin_referer( 'cf-smart-cache-refresh-zones' );
        delete_transient( 'cf_smart_cache_zone_list' );
        wp_safe_redirect( menu_page_url( 'cf_smart_cache', false ) );
        exit;
    }

    register_setting( 'cf_smart_cache_options_group', 'cf_smart_cache_settings' );
    add_settings_section('cf_smart_cache_api_section', 'Cloudflare API Credentials', null, 'cf_smart_cache');
    add_settings_field('cf_smart_cache_email', 'Cloudflare Account Email', 'cf_smart_cache_email_render', 'cf_smart_cache', 'cf_smart_cache_api_section');
    add_settings_field('cf_smart_cache_api_token', 'API Token', 'cf_smart_cache_api_token_render', 'cf_smart_cache', 'cf_smart_cache_api_section');
    add_settings_field('cf_smart_cache_zone_id', 'Zone', 'cf_smart_cache_zone_id_render', 'cf_smart_cache', 'cf_smart_cache_api_section');
}

// Add detailed error logging for API failures
function cf_smart_cache_log_error($message) {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[CF Smart Cache] ' . $message);
    }
}

// Update API call to include retry logic and user-friendly error messages
function cf_smart_cache_fetch_zones() {
    $cached_zones = get_transient('cf_smart_cache_zone_list');
    if (false !== $cached_zones) {
        return $cached_zones;
    }

    $settings = get_option('cf_smart_cache_settings');
    $email = $settings['cf_smart_cache_email'] ?? '';
    $api_token = $settings['cf_smart_cache_api_token'] ?? '';

    if (empty($email) || empty($api_token)) {
        cf_smart_cache_log_error('API credentials not set.');
        return new WP_Error('missing_creds', 'API credentials not set.');
    }

    $attempts = 3;
    while ($attempts > 0) {
        $response = wp_remote_get('https://api.cloudflare.com/client/v4/zones', [
            'headers' => [
                'Authorization' => 'Bearer ' . $api_token,
                'Content-Type' => 'application/json'
            ],
            'timeout' => 15,
        ]);

        if (!is_wp_error($response)) {
            $body = json_decode(wp_remote_retrieve_body($response), true);
            if (isset($body['success']) && $body['success']) {
                set_transient('cf_smart_cache_zone_list', $body['result'], HOUR_IN_SECONDS);
                return $body['result'];
            } else {
                $error_message = $body['errors'][0]['message'] ?? 'Unknown API error.';
                cf_smart_cache_log_error('API Error: ' . $error_message);
                return new WP_Error('api_error', $error_message);
            }
        } else {
            cf_smart_cache_log_error('Transient API Error: ' . $response->get_error_message());
        }

        $attempts--;
        sleep(1); // Wait before retrying
    }

    return new WP_Error('api_error', 'Failed to fetch zones after multiple attempts.');
}

function cf_smart_cache_email_render() {
    $options = get_option('cf_smart_cache_settings');
    echo "<input type='email' name='cf_smart_cache_settings[cf_smart_cache_email]' value='" . esc_attr($options['cf_smart_cache_email'] ?? '') . "' class='regular-text'>";
    echo "<p class='description'>" . esc_html(__('Enter the email associated with your Cloudflare account.', 'cf-smart-cache')) . "</p>";
}
function cf_smart_cache_global_api_key_render() {
    $options = get_option('cf_smart_cache_settings');
    echo "<input type='password' name='cf_smart_cache_settings[cf_smart_cache_global_api_key]' value='" . esc_attr($options['cf_smart_cache_global_api_key'] ?? '') . "' class='regular-text'>";
    echo "<p class='description'>" . esc_html(__('Enter your Cloudflare API key. This is required for API access.', 'cf-smart-cache')) . "</p>";
}
function cf_smart_cache_zone_id_render() {
    $options = get_option( 'cf_smart_cache_settings' );
    $selected_zone = $options['cf_smart_cache_zone_id'] ?? '';
    $zones_data = cf_smart_cache_fetch_zones();
    if ( is_wp_error( $zones_data ) ) {
        if ( $zones_data->get_error_code() === 'missing_creds' ) {
            echo '<p class="description">' . esc_html(__('Please enter and save your email and API token first. The available zone list will appear here after saving.', 'cf-smart-cache')) . '</p>';
        } else {
            echo '<p class="description" style="color: #d63638;"><strong>' . esc_html(__('Error:', 'cf-smart-cache')) . '</strong> ' . esc_html($zones_data->get_error_message()) . '</p>';
        }
        return;
    }
    if ( empty( $zones_data ) ) {
        echo '<p class="description">' . esc_html(__('No zones found for this account.', 'cf-smart-cache')) . '</p>';
        return;
    }
    echo "<select name='cf_smart_cache_settings[cf_smart_cache_zone_id]'>";
    echo "<option value=''>" . esc_html(__('-- Select a zone --', 'cf-smart-cache')) . "</option>";
    foreach ( $zones_data as $zone ) {
        printf(
            '<option value="%s" %s>%s</option>',
            esc_attr( $zone['id'] ),
            selected( $selected_zone, $zone['id'], false ),
            esc_html( $zone['name'] )
        );
    }
    echo "</select>";
    $refresh_url = wp_nonce_url( menu_page_url( 'cf_smart_cache', false ) . '&refresh_zones=true', 'cf-smart-cache-refresh-zones' );
    echo " <a href='" . esc_url( $refresh_url ) . "'>" . esc_html(__('Refresh List', 'cf-smart-cache')) . "</a>";
}
function cf_smart_cache_options_page_html() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        <form action='options.php' method='post'>
            <?php 
                settings_fields('cf_smart_cache_options_group'); 
                do_settings_sections('cf_smart_cache'); 
                submit_button('Save Settings'); 
            ?>
        </form>
    </div>
    <?php
}

// ===================== Core Purge Logic =====================
function cf_smart_cache_execute_purge( $urls_to_purge ) {
    if ( empty( $urls_to_purge ) ) {
        return;
    }
    $settings = get_option( 'cf_smart_cache_settings' );
    $email    = $settings['cf_smart_cache_email'] ?? '';
    $api_key  = $settings['cf_smart_cache_global_api_key'] ?? '';
    $zone_id  = $settings['cf_smart_cache_zone_id'] ?? '';
    if ( empty( $email ) || empty( $api_key ) || empty( $zone_id ) ) {
        return;
    }
    $urls_to_purge = array_values( array_unique( $urls_to_purge ) );
    $api_url = "https://api.cloudflare.com/client/v4/zones/{$zone_id}/purge_cache";
    $headers = [
        'X-Auth-Email' => $email,
        'X-Auth-Key' => $api_key,
        'Content-Type' => 'application/json'
    ];
    $response = wp_remote_post($api_url, [
        'method'  => 'POST',
        'headers' => $headers,
        'body'    => json_encode(['files' => $urls_to_purge]),
        'timeout' => 15
    ]);
    if ( is_wp_error( $response ) ) {
        $message = "CF API Error: " . $response->get_error_message();
    } else {
        $body = json_decode( wp_remote_retrieve_body( $response ), true );
        if (isset($body['success']) && $body['success']) {
            $message = sprintf('Success: Cloudflare purge request sent for %d URLs.', count($urls_to_purge));
        } else {
            $error_message = $body['errors'][0]['message'] ?? 'Unknown error.';
            $message = "CF API Error: " . $error_message;
        }
    }
    set_transient( 'cf_smart_cache_notice_'. get_current_user_id(), $message, 45 );
}

function cf_smart_cache_on_status_change( $new_status, $old_status, $post ) {
    if ( $new_status === 'publish' || $old_status === 'publish' ) {
        if ( ! in_array( $post->post_type, ['post'] ) ) return;
        $urls = [ home_url( '/' ) ];
        $urls[] = get_permalink( $post->ID );
        $categories = get_the_category( $post->ID );
        if ( ! empty( $categories ) ) {
            foreach ( $categories as $category ) {
                $urls[] = get_category_link( $category->term_id );
            }
        }
        $tags = get_the_tags( $post->ID );
        if ( ! empty( $tags ) ) {
            foreach ( $tags as $tag ) {
                $urls[] = get_tag_link( $tag->term_id );
            }
        }
        cf_smart_cache_execute_purge( $urls );
    }
}
add_action( 'transition_post_status', 'cf_smart_cache_on_status_change', 10, 3 );

function cf_smart_cache_on_delete_post( $post_id ) {
    $post = get_post($post_id);
    if ( ! in_array( $post->post_type, ['post'] ) ) return;
    $urls = [ home_url( '/' ) ];
    $categories = get_the_category( $post_id );
    if ( ! empty( $categories ) ) {
        foreach ( $categories as $category ) {
            $urls[] = get_category_link( $category->term_id );
        }
    }
    $tags = get_the_tags( $post_id );
    if ( ! empty( $tags ) ) {
        foreach ( $tags as $tag ) {
            $urls[] = get_tag_link( $tag->term_id );
        }
    }
    cf_smart_cache_execute_purge( $urls );
}
add_action( 'delete_post', 'cf_smart_cache_on_delete_post', 10, 1 );

function cf_smart_cache_on_term_change( $term_id ) {
    $urls = [ get_term_link( $term_id ), home_url( '/' ) ];
    cf_smart_cache_execute_purge( $urls );
}
add_action( 'edited_term', 'cf_smart_cache_on_term_change', 10, 1 );
add_action( 'delete_term', 'cf_smart_cache_on_term_change', 10, 1 );

function cf_smart_cache_display_admin_notice() {
    $notice = get_transient( 'cf_smart_cache_notice_'. get_current_user_id() );
    if ( $notice ) {
        $is_error = stripos( $notice, 'Error' ) !== false;
        $class = $is_error ? 'notice-error' : 'notice-success';
        printf( 
            '<div class="notice %s is-dismissible"><p><strong>CF Smart Cache:</strong> %s</p></div>', 
            esc_attr( $class ), 
            esc_html( $notice )
        );
        delete_transient( 'cf_smart_cache_notice_'. get_current_user_id() );
    }
}
add_action( 'admin_notices', 'cf_smart_cache_display_admin_notice' );

// Implement selective cache purging based on updated content
function cf_smart_cache_purge_specific_urls($urls_to_purge) {
    if (empty($urls_to_purge)) {
        return;
    }

    $settings = get_option('cf_smart_cache_settings');
    $api_token = $settings['cf_smart_cache_api_token'] ?? '';
    $zone_id = $settings['cf_smart_cache_zone_id'] ?? '';

    if (empty($api_token) || empty($zone_id)) {
        cf_smart_cache_log_error('API Token or Zone ID is missing.');
        return;
    }

    $urls_to_purge = array_values(array_unique($urls_to_purge));
    $api_url = "https://api.cloudflare.com/client/v4/zones/{$zone_id}/purge_cache";
    $headers = [
        'Authorization' => 'Bearer ' . $api_token,
        'Content-Type' => 'application/json'
    ];

    $response = wp_remote_post($api_url, [
        'method' => 'POST',
        'headers' => $headers,
        'body' => json_encode(['files' => $urls_to_purge]),
        'timeout' => 15
    ]);

    if (is_wp_error($response)) {
        cf_smart_cache_log_error('Purge API Error: ' . $response->get_error_message());
    } else {
        $body = json_decode(wp_remote_retrieve_body($response), true);
        if (isset($body['success']) && $body['success']) {
            cf_smart_cache_log_error('Successfully purged specific URLs.');
        } else {
            $error_message = $body['errors'][0]['message'] ?? 'Unknown API error.';
            cf_smart_cache_log_error('Purge API Error: ' . $error_message);
        }
    }
}

// Add an option for manual cache purging in the admin panel
function cf_smart_cache_manual_purge_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_POST['cf_smart_cache_manual_purge']) && check_admin_referer('cf_smart_cache_manual_purge_action')) {
        $urls = explode("\n", sanitize_textarea_field($_POST['cf_smart_cache_urls']));
        $urls = array_map('trim', $urls);
        cf_smart_cache_purge_specific_urls($urls);
        echo '<div class="updated"><p>Cache purged for the provided URLs.</p></div>';
    }

    echo '<div class="wrap">';
    echo '<h1>Manual Cache Purge</h1>';
    echo '<form method="post">';
    wp_nonce_field('cf_smart_cache_manual_purge_action');
    echo '<textarea name="cf_smart_cache_urls" rows="10" cols="50" class="large-text" placeholder="Enter one URL per line..."></textarea><br>'; 
    echo '<input type="submit" name="cf_smart_cache_manual_purge" class="button-primary" value="Purge Cache">';
    echo '</form>';
    echo '</div>';
}

function cf_smart_cache_add_manual_purge_menu() {
    add_submenu_page(
        'options-general.php',
        'Manual Cache Purge',
        'Manual Cache Purge',
        'manage_options',
        'cf_smart_cache_manual_purge',
        'cf_smart_cache_manual_purge_page'
    );
}
add_action('admin_menu', 'cf_smart_cache_add_manual_purge_menu');

// Include a 'Test API Connection' button
function cf_smart_cache_test_api_connection() {
    if (isset($_POST['cf_smart_cache_test_api']) && check_admin_referer('cf_smart_cache_test_api_action')) {
        $settings = get_option('cf_smart_cache_settings');
        $api_token = $settings['cf_smart_cache_api_token'] ?? '';
        $response = wp_remote_get('https://api.cloudflare.com/client/v4/user/tokens/verify', [
            'headers' => [
                'Authorization' => 'Bearer ' . $api_token,
                'Content-Type' => 'application/json'
            ],
            'timeout' => 15,
        ]);
        if (is_wp_error($response)) {
            echo '<div class="error"><p>' . esc_html(__('API connection failed: ', 'cf-smart-cache')) . esc_html($response->get_error_message()) . '</p></div>';
        } else {
            $body = json_decode(wp_remote_retrieve_body($response), true);
            if (isset($body['success']) && $body['success']) {
                echo '<div class="updated"><p>' . esc_html(__('API connection successful!', 'cf-smart-cache')) . '</p></div>';
            } else {
                echo '<div class="error"><p>' . esc_html(__('API connection failed: Invalid token.', 'cf-smart-cache')) . '</p></div>';
            }
        }
    }
}
add_action('admin_notices', 'cf_smart_cache_test_api_connection');

// Provide a dashboard widget to display cache statistics
function cf_smart_cache_dashboard_widget() {
    wp_add_dashboard_widget(
        'cf_smart_cache_widget',
        __('Cloudflare Smart Cache Statistics', 'cf-smart-cache'),
        'cf_smart_cache_dashboard_widget_display'
    );
}
add_action('wp_dashboard_setup', 'cf_smart_cache_dashboard_widget');

function cf_smart_cache_dashboard_widget_display() {
    echo '<p>' . esc_html(__('Cache statistics will be displayed here in future updates.', 'cf-smart-cache')) . '</p>';
}