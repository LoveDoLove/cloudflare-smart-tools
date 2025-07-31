<?php
/**
 * Plugin Name:       Cloudflare Smart Cache
 * Plugin Slug:       cf-smart-cache
 * Plugin URI:        https://github.com/LoveDoLove/cloudflare-smart-cache
 * Description:       Powerful all-in-one Cloudflare cache solution: edge HTML caching, automatic purging on post/category changes, advanced admin controls, API token support, and comprehensive logging for WordPress.
 * Version:           2.0.4
 * Author:            LoveDoLove
 * Author URI:        https://github.com/LoveDoLove
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       cf-smart-cache
 * Domain Path:       /languages
 * Replace:           cf-smart-cache/cf-smart-cache.php
 * Requires at least: 5.0
 * Tested up to:      6.4
 * Requires PHP:      7.4
 * Network:           false
 */


defined('ABSPATH') or die('No script kiddies please!');

// ===================== Plugin Initialization =====================

/**
 * Initialize plugin text domain for internationalization
 */
function cf_smart_cache_load_textdomain()
{
    load_plugin_textdomain(
        'cf-smart-cache',
        false,
        dirname(plugin_basename(__FILE__)) . '/languages'
    );
}
add_action('init', 'cf_smart_cache_load_textdomain');

/**
 * Initialize plugin
 */
function cf_smart_cache_init()
{
    // Ensure this only runs once
    static $initialized = false;
    if ($initialized) {
        return;
    }
    $initialized = true;

    // Load text domain
    cf_smart_cache_load_textdomain();

    // Initialize edge cache headers and event hooks
    cf_smart_cache_init_action();
}
add_action('plugins_loaded', 'cf_smart_cache_init');

// ===================== Plugin Activation & Deactivation =====================

/**
 * Plugin activation hook
 */
function cf_smart_cache_activate()
{
    // Set default options if they don't exist
    if (!get_option('cf_smart_cache_settings')) {
        $default_settings = [
            'cf_smart_cache_api_token' => '',
            'cf_smart_cache_zone_id'   => ''
        ];
        add_option('cf_smart_cache_settings', $default_settings);
    }

    // Clear any existing transients
    delete_transient('cf_smart_cache_zone_list');
    delete_transient('cf_smart_cache_rate_limit');

    cf_smart_cache_log('Plugin activated');
}
register_activation_hook(__FILE__, 'cf_smart_cache_activate');

/**
 * Plugin deactivation hook
 */
function cf_smart_cache_deactivate()
{
    // Clear transients
    delete_transient('cf_smart_cache_zone_list');
    delete_transient('cf_smart_cache_rate_limit');

    // Clear any pending admin notices
    global $wpdb;
    $wpdb->query(
        "DELETE FROM {$wpdb->options} 
         WHERE option_name LIKE '_transient_cf_smart_cache_notice_%' 
         OR option_name LIKE '_transient_timeout_cf_smart_cache_notice_%'"
    );

    cf_smart_cache_log('Plugin deactivated');
}
register_deactivation_hook(__FILE__, 'cf_smart_cache_deactivate');

// ===================== Auto-Deactivate Old Plugin =====================
// Auto-deactivate old version of this plugin if present (Context7 best practice)
add_action('activated_plugin', function ($plugin)
{
    if (plugin_basename(__FILE__) === $plugin) {
        $old_plugin = 'cf-smart-cache/cf-smart-cache.php';
        if (is_plugin_active($old_plugin) && $old_plugin !== plugin_basename(__FILE__)) {
            deactivate_plugins($old_plugin);
        }
    }
});

// ===================== Logging and Error Handling =====================

/**
 * Log CF Smart Cache events for debugging
 */
function cf_smart_cache_log($message, $level = 'info')
{
    if (defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
        error_log(sprintf('[CF Smart Cache] [%s] %s', strtoupper($level), $message));
    }
}

/**
 * Validate Cloudflare API response with enhanced error handling
 */
function cf_smart_cache_validate_api_response($response, $operation = 'API call')
{
    if (is_wp_error($response)) {
        $error_message = sprintf('WordPress HTTP error during %s: %s', $operation, $response->get_error_message());
        cf_smart_cache_log($error_message, 'error');
        return new WP_Error('http_error', $error_message);
    }

    $response_code    = wp_remote_retrieve_response_code($response);
    $response_message = wp_remote_retrieve_response_message($response);

    // Handle different HTTP status codes appropriately
    switch ($response_code) {
        case 200:
            // Success, continue processing
            break;
        case 400:
            $error_message = sprintf('Bad Request (400) during %s: Check your API credentials and request format', $operation);
            cf_smart_cache_log($error_message, 'error');
            return new WP_Error('bad_request', $error_message);
        case 401:
            $error_message = sprintf('Unauthorized (401) during %s: Invalid API token or credentials', $operation);
            cf_smart_cache_log($error_message, 'error');
            return new WP_Error('unauthorized', $error_message);
        case 403:
            $error_message = sprintf('Forbidden (403) during %s: Insufficient permissions for this operation', $operation);
            cf_smart_cache_log($error_message, 'error');
            return new WP_Error('forbidden', $error_message);
        case 429:
            $error_message = sprintf('Rate Limited (429) during %s: Too many requests, please wait before retrying', $operation);
            cf_smart_cache_log($error_message, 'warning');
            return new WP_Error('rate_limited', $error_message);
        case 500:
        case 502:
        case 503:
        case 504:
            $error_message = sprintf('Server Error (%d) during %s: Cloudflare service temporarily unavailable', $response_code, $operation);
            cf_smart_cache_log($error_message, 'warning');
            return new WP_Error('server_error', $error_message);
        default:
            $error_message = sprintf('HTTP %d error during %s: %s', $response_code, $operation, $response_message);
            cf_smart_cache_log($error_message, 'error');
            return new WP_Error('http_error', $error_message);
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        $error_message = sprintf('JSON decode error during %s: %s', $operation, json_last_error_msg());
        cf_smart_cache_log($error_message, 'error');
        return new WP_Error('json_error', $error_message);
    }

    if (!isset($body['success'])) {
        $error_message = sprintf('Invalid API response format during %s: Missing success field', $operation);
        cf_smart_cache_log($error_message, 'error');
        return new WP_Error('invalid_response', $error_message);
    }

    if (!$body['success']) {
        $error_details = '';
        if (isset($body['errors']) && is_array($body['errors']) && !empty($body['errors'])) {
            $error_details = $body['errors'][0]['message'] ?? 'Unknown error';
            if (isset($body['errors'][0]['code'])) {
                $error_details .= ' (Code: ' . $body['errors'][0]['code'] . ')';
            }
        } else {
            $error_details = 'Unknown Cloudflare API error';
        }

        cf_smart_cache_log(sprintf('Cloudflare API error during %s: %s', $operation, $error_details), 'error');
        return new WP_Error('cf_api_error', $error_details);
    }

    return $body;
}

// ===================== Edge Cache Headers & Event Hooks =====================
function cf_smart_cache_init_action()
{
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;

    // Enhanced edge cache headers with better logic
    cf_smart_cache_set_edge_headers();

    // Post events
    add_action('wp_trash_post', 'cf_smart_cache_purge1', 0);
    add_action('publish_post', 'cf_smart_cache_purge1', 0);
    add_action('edit_post', 'cf_smart_cache_purge1', 0);
    add_action('delete_post', 'cf_smart_cache_purge1', 0);
    add_action('publish_phone', 'cf_smart_cache_purge1', 0);
    // Comment events
    add_action('trackback_post', 'cf_smart_cache_purge2', 99);
    add_action('pingback_post', 'cf_smart_cache_purge2', 99);
    add_action('comment_post', 'cf_smart_cache_purge2', 99);
    add_action('edit_comment', 'cf_smart_cache_purge2', 99);
    add_action('wp_set_comment_status', 'cf_smart_cache_purge2', 99, 2);
    // Other events
    add_action('switch_theme', 'cf_smart_cache_purge1', 99);
    add_action('edit_user_profile_update', 'cf_smart_cache_purge1', 99);
    add_action('wp_update_nav_menu', 'cf_smart_cache_purge0');
    add_action('clean_post_cache', 'cf_smart_cache_purge1');
    add_action('transition_post_status', 'cf_smart_cache_post_transition', 10, 3);
}

/**
 * IMPORTANT: The Cloudflare Worker (cf-smart-cache-html-v2.js) will NEVER cache responses that have:
 *   - Set-Cookie header
 *   - Cache-Control: private, no-store, or no-cache
 *   - Any login/session/auth cookies in the request
 *
 * Therefore, this plugin MUST always set these headers for private, admin, or user-specific pages.
 * This ensures maximum security and prevents any private content from being cached at the edge.
 */

/**
 * Set appropriate edge cache headers based on page type and user status
 * Following Cloudflare best practices for edge caching and security
 */
function cf_smart_cache_set_edge_headers()
{
    // Don't cache if user is logged in
    if (is_user_logged_in()) {
        cf_smart_cache_add_security_headers();
        header('Cache-Control: private, no-store, no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Set-Cookie: cf_smart_cache_logged_in=1; Path=/; HttpOnly; Secure; SameSite=Lax');
        header('x-HTML-Edge-Cache: nocache');
        header('x-HTML-Edge-Cache-Plugin: active');
        header('x-HTML-Edge-Cache-Debug: bypass=logged-in');
        cf_smart_cache_log('Edge caching disabled for logged-in user');
        return;
    }

    // Don't cache admin, login, or WordPress core pages
    if (is_admin() || $GLOBALS['pagenow'] === 'wp-login.php') {
        cf_smart_cache_add_security_headers();
        header('Cache-Control: private, no-store, no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Set-Cookie: cf_smart_cache_admin=1; Path=/; HttpOnly; Secure; SameSite=Lax');
        header('x-HTML-Edge-Cache: nocache');
        header('x-HTML-Edge-Cache-Plugin: active');
        header('x-HTML-Edge-Cache-Debug: bypass=admin');
        cf_smart_cache_log('Edge caching disabled for admin/login page');
        return;
    }

    // REST API and AJAX endpoints: always no-cache
    if (defined('DOING_AJAX') && DOING_AJAX) {
        cf_smart_cache_add_security_headers();
        header('Cache-Control: private, no-store, no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Set-Cookie: cf_smart_cache_ajax=1; Path=/; HttpOnly; Secure; SameSite=Lax');
        header('x-HTML-Edge-Cache: nocache');
        header('x-HTML-Edge-Cache-Plugin: active');
        header('x-HTML-Edge-Cache-Debug: bypass=ajax');
        cf_smart_cache_log('Edge caching disabled for AJAX request');
        return;
    }
    if (defined('REST_REQUEST') && REST_REQUEST) {
        cf_smart_cache_add_security_headers();
        header('Cache-Control: private, no-store, no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Set-Cookie: cf_smart_cache_rest=1; Path=/; HttpOnly; Secure; SameSite=Lax');
        header('x-HTML-Edge-Cache: nocache');
        header('x-HTML-Edge-Cache-Plugin: active');
        header('x-HTML-Edge-Cache-Debug: bypass=rest');
        cf_smart_cache_log('Edge caching disabled for REST API request');
        return;
    }

    // Don't cache preview, password-protected, or WooCommerce cart/checkout/account pages
    if (function_exists('is_preview') && is_preview()) {
        cf_smart_cache_add_security_headers();
        header('Cache-Control: private, no-store, no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Set-Cookie: cf_smart_cache_preview=1; Path=/; HttpOnly; Secure; SameSite=Lax');
        header('x-HTML-Edge-Cache: nocache');
        header('x-HTML-Edge-Cache-Plugin: active');
        header('x-HTML-Edge-Cache-Debug: bypass=preview');
        cf_smart_cache_log('Edge caching disabled for preview page');
        return;
    }
    if (function_exists('post_password_required') && post_password_required()) {
        cf_smart_cache_add_security_headers();
        header('Cache-Control: private, no-store, no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Set-Cookie: cf_smart_cache_password=1; Path=/; HttpOnly; Secure; SameSite=Lax');
        header('x-HTML-Edge-Cache: nocache');
        header('x-HTML-Edge-Cache-Plugin: active');
        header('x-HTML-Edge-Cache-Debug: bypass=password');
        cf_smart_cache_log('Edge caching disabled for password-protected post');
        return;
    }
    if ((function_exists('is_cart') && is_cart()) || (function_exists('is_checkout') && is_checkout()) || (function_exists('is_account_page') && is_account_page())) {
        cf_smart_cache_add_security_headers();
        header('Cache-Control: private, no-store, no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Set-Cookie: cf_smart_cache_woo=1; Path=/; HttpOnly; Secure; SameSite=Lax');
        header('x-HTML-Edge-Cache: nocache');
        header('x-HTML-Edge-Cache-Plugin: active');
        header('x-HTML-Edge-Cache-Debug: bypass=woocommerce');
        cf_smart_cache_log('Edge caching disabled for WooCommerce cart/checkout/account page');
        return;
    }

    // Remove bypass cookie logic
    cf_smart_cache_add_security_headers();
    header('x-HTML-Edge-Cache-Plugin: active');
    header('x-HTML-Edge-Cache-Debug: cache=public');
    if (is_front_page() || is_home()) {
        header('x-HTML-Edge-Cache: cache');
        header('Cache-Control: public, max-age=3600, s-maxage=7200');
    } elseif (is_single() || is_page()) {
        header('x-HTML-Edge-Cache: cache');
        header('Cache-Control: public, max-age=7200, s-maxage=14400');
    } else {
        header('x-HTML-Edge-Cache: cache');
        header('Cache-Control: public, max-age=1800, s-maxage=3600');
    }

    cf_smart_cache_log('Edge caching enabled with security headers');
}

/**
 * Add security headers following Cloudflare best practices
 */
function cf_smart_cache_add_security_headers()
{
    // Only add headers if not already sent
    if (!headers_sent()) {
        // Security headers for better protection
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('X-XSS-Protection: 1; mode=block');
        header('Referrer-Policy: strict-origin-when-cross-origin');

        // Only add HSTS if we're on HTTPS
        if (is_ssl()) {
            header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
        }
    }
}
add_action('init', 'cf_smart_cache_init_action');

function cf_smart_cache_purge()
{
    static $purged = false;
    if (!$purged) {
        $purged = true;
        header('x-HTML-Edge-Cache: purgeall');
    }
}
function cf_smart_cache_purge0() { cf_smart_cache_purge(); }
function cf_smart_cache_purge1($param1) { cf_smart_cache_purge(); }
function cf_smart_cache_purge2($param1, $param2 = "") { cf_smart_cache_purge(); }
function cf_smart_cache_post_transition($new_status, $old_status, $post)
{
    if ($new_status != $old_status) {
        cf_smart_cache_purge();
    }
}

// ===================== Admin Settings Page & API Integration =====================
function cf_smart_cache_add_admin_menu()
{
    add_options_page(
        'Cloudflare Smart Cache',
        'CF Smart Cache',
        'manage_options',
        'cf_smart_cache',
        'cf_smart_cache_options_page_html'
    );
}
add_action('admin_menu', 'cf_smart_cache_add_admin_menu');

function cf_smart_cache_settings_init()
{
    // Handle zone refresh with proper capability check
    if (isset($_GET['page']) && $_GET['page'] === 'cf_smart_cache' && isset($_GET['refresh_zones']) && $_GET['refresh_zones'] === 'true') {
        // Check user capability first
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'cf-smart-cache'));
        }

        // Verify nonce
        if (!isset($_GET['_wpnonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_GET['_wpnonce'])), 'cf-smart-cache-refresh-zones')) {
            wp_die(__('Security check failed. Please try again.', 'cf-smart-cache'));
        }

        delete_transient('cf_smart_cache_zone_list');
        wp_safe_redirect(admin_url('options-general.php?page=cf_smart_cache'));
        exit;
    }

    register_setting('cf_smart_cache_options_group', 'cf_smart_cache_settings', [
        'sanitize_callback' => 'cf_smart_cache_sanitize_settings',
        'default'           => []
    ]);
    add_settings_section(
        'cf_smart_cache_api_section',
        __('Cloudflare API Credentials', 'cf-smart-cache'),
        null,
        'cf_smart_cache'
    );
    add_settings_field(
        'cf_smart_cache_api_token',
        __('API Token (Recommended)', 'cf-smart-cache'),
        'cf_smart_cache_api_token_render',
        'cf_smart_cache',
        'cf_smart_cache_api_section'
    );
    add_settings_field(
        'cf_smart_cache_zone_id',
        __('Zone', 'cf-smart-cache'),
        'cf_smart_cache_zone_id_render',
        'cf_smart_cache',
        'cf_smart_cache_api_section'
    );
}

/**
 * Sanitize plugin settings
 */
function cf_smart_cache_sanitize_settings($input)
{
    $sanitized = [];

    // Sanitize API token
    if (isset($input['cf_smart_cache_api_token'])) {
        $sanitized['cf_smart_cache_api_token'] = sanitize_text_field($input['cf_smart_cache_api_token']);
    }

    // Sanitize email
    if (isset($input['cf_smart_cache_email'])) {
        $sanitized['cf_smart_cache_email'] = sanitize_email($input['cf_smart_cache_email']);
    }

    // Sanitize API key
    if (isset($input['cf_smart_cache_global_api_key'])) {
        $sanitized['cf_smart_cache_global_api_key'] = sanitize_text_field($input['cf_smart_cache_global_api_key']);
    }

    // Sanitize zone ID
    if (isset($input['cf_smart_cache_zone_id'])) {
        $sanitized['cf_smart_cache_zone_id'] = sanitize_text_field($input['cf_smart_cache_zone_id']);
    }

    /**
     * Fires after plugin settings are sanitized and saved.
     *
     * @param array $sanitized The sanitized settings array.
     * @param array $raw The raw input array.
     */
    do_action('cf_smart_cache_after_settings_save', $sanitized, $input);
    return $sanitized;
}

add_action('admin_init', 'cf_smart_cache_settings_init');

function cf_smart_cache_fetch_zones()
{
    $cached_zones = get_transient('cf_smart_cache_zone_list');
    if (false !== $cached_zones) {
        return $cached_zones;
    }

    $settings  = get_option('cf_smart_cache_settings');
    $api_token = $settings['cf_smart_cache_api_token'] ?? '';
    if (!empty($api_token)) {
        $headers = [
            'Authorization' => 'Bearer ' . $api_token,
            'Content-Type'  => 'application/json'
        ];
        cf_smart_cache_log('Using API token authentication for zone fetching');
    } else {
        cf_smart_cache_log('No valid API credentials provided', 'error');
        return new WP_Error('missing_creds', 'API token not set. Please provide an API token.');
    }

    $retry_attempts = 3;
    $response       = null;

    for ($i = 0; $i < $retry_attempts; $i++) {
        $response = wp_remote_get('https://api.cloudflare.com/client/v4/zones', [
            'headers' => $headers,
            'timeout' => 15,
        ]);

        if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) < 500) {
            break;
        }

        cf_smart_cache_log(sprintf('Retrying zone fetch due to transient error (Attempt %d/%d)', $i + 1, $retry_attempts), 'warning');
        sleep(2); // Wait before retrying
    }

    $validated_response = cf_smart_cache_validate_api_response($response, 'zone fetching');
    if (is_wp_error($validated_response)) {
        return $validated_response;
    }

    cf_smart_cache_log(sprintf('Successfully fetched %d zones from Cloudflare API', count($validated_response['result'])));
    set_transient('cf_smart_cache_zone_list', $validated_response['result'], HOUR_IN_SECONDS);
    return $validated_response['result'];
}

function cf_smart_cache_api_token_render()
{
    $options = get_option('cf_smart_cache_settings', []);
    $value   = isset($options['cf_smart_cache_api_token']) ? esc_attr($options['cf_smart_cache_api_token']) : '';
    printf(
        '<input type="text" name="cf_smart_cache_settings[cf_smart_cache_api_token]" value="%s" class="regular-text" autocomplete="off">',
        $value
    );
    printf(
        '<p class="description">%s <a href="%s" target="_blank" rel="noopener noreferrer">%s</a></p>',
        esc_html__('Recommended: Use API tokens for better security.', 'cf-smart-cache'),
        esc_url('https://dash.cloudflare.com/profile/api-tokens'),
        esc_html__('Create API Token', 'cf-smart-cache')
    );
}

function cf_smart_cache_zone_id_render()
{
    $options       = get_option('cf_smart_cache_settings', []);
    $selected_zone = isset($options['cf_smart_cache_zone_id']) ? $options['cf_smart_cache_zone_id'] : '';
    $zones_data    = cf_smart_cache_fetch_zones();

    if (is_wp_error($zones_data)) {
        if ($zones_data->get_error_code() === 'missing_creds') {
            printf(
                '<p class="description">%s</p>',
                esc_html__('Please enter and save your API credentials first. The available zone list will appear here after saving.', 'cf-smart-cache')
            );
        } else {
            printf(
                '<p class="description" style="color: #d63638;"><strong>%s:</strong> %s %s</p>',
                esc_html__('Error', 'cf-smart-cache'),
                esc_html__('Failed to fetch zone list.', 'cf-smart-cache'),
                esc_html($zones_data->get_error_message())
            );
        }
        return;
    }

    if (empty($zones_data)) {
        printf(
            '<p class="description">%s</p>',
            esc_html__('No zones found for this account.', 'cf-smart-cache')
        );
        return;
    }

    echo '<select name="cf_smart_cache_settings[cf_smart_cache_zone_id]">';
    printf(
        '<option value="">%s</option>',
        esc_html__('-- Select a zone --', 'cf-smart-cache')
    );

    foreach ($zones_data as $zone) {
        printf(
            '<option value="%s" %s>%s</option>',
            esc_attr($zone['id']),
            selected($selected_zone, $zone['id'], false),
            esc_html($zone['name'])
        );
    }
    echo "</select>";

    $refresh_url = wp_nonce_url(
        admin_url('options-general.php?page=cf_smart_cache&refresh_zones=true'),
        'cf-smart-cache-refresh-zones'
    );
    printf(
        ' <a href="%s">%s</a>',
        esc_url($refresh_url),
        esc_html__('Refresh List', 'cf-smart-cache')
    );
}
function cf_smart_cache_options_page_html()
{
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have sufficient permissions to access this page.', 'cf-smart-cache'));
    }

    // Handle manual purge actions with proper nonce verification
    if (isset($_POST['cf_smart_cache_purge_all'])) {
        if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_wpnonce'])), 'cf-smart-cache-purge-all')) {
            wp_die(__('Security check failed. Please try again.', 'cf-smart-cache'));
        }
        cf_smart_cache_purge_all_cache();
    }

    if (isset($_POST['cf_smart_cache_purge_home'])) {
        if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_wpnonce'])), 'cf-smart-cache-purge-home')) {
            wp_die(__('Security check failed. Please try again.', 'cf-smart-cache'));
        }
        cf_smart_cache_batch_purge([home_url('/')]);
    }

    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

        <!-- API Configuration -->
        <form action='options.php' method='post'>
            <?php
            settings_fields('cf_smart_cache_options_group');
            do_settings_sections('cf_smart_cache');
            submit_button(__('Save Settings', 'cf-smart-cache'));
            ?>
        </form>

        <hr>

        <!-- Manual Cache Controls -->
        <h2><?php esc_html_e('Manual Cache Controls', 'cf-smart-cache'); ?></h2>
        <div class="cf-cache-controls">
            <form method="post" style="display: inline-block; margin-right: 10px;">
                <?php wp_nonce_field('cf-smart-cache-purge-all'); ?>
                <input type="submit" name="cf_smart_cache_purge_all" class="button button-secondary"
                    value="<?php esc_attr_e('Purge All Cache', 'cf-smart-cache'); ?>"
                    onclick="return confirm('<?php echo esc_js(__('Are you sure you want to purge all cached content?', 'cf-smart-cache')); ?>');">
            </form>

            <form method="post" style="display: inline-block;">
                <?php wp_nonce_field('cf-smart-cache-purge-home'); ?>
                <input type="submit" name="cf_smart_cache_purge_home" class="button button-secondary"
                    value="<?php esc_attr_e('Purge Homepage', 'cf-smart-cache'); ?>">
            </form>
        </div>

        <hr>

        <!-- Cache Status and Statistics -->
        <h2><?php esc_html_e('Cache Status', 'cf-smart-cache'); ?></h2>
        <?php cf_smart_cache_display_cache_status(); ?>
    </div>
    <?php
}

/**
 * Purge all cache from Cloudflare
 */
function cf_smart_cache_purge_all_cache()
{
    $settings  = get_option('cf_smart_cache_settings');
    $api_token = $settings['cf_smart_cache_api_token'] ?? '';
    $zone_id   = $settings['cf_smart_cache_zone_id'] ?? '';

    // Determine authentication method
    if (!empty($api_token)) {
        $headers = [
            'Authorization' => 'Bearer ' . $api_token,
            'Content-Type'  => 'application/json'
        ];
    } elseif (!empty($email) && !empty($api_key)) {
        $headers = [
            'X-Auth-Email' => $email,
            'X-Auth-Key'   => $api_key,
            'Content-Type' => 'application/json'
        ];
    } else {
        set_transient('cf_smart_cache_notice_' . get_current_user_id(), 'Error: API credentials not configured.', 45);
        return;
    }

    if (empty($zone_id)) {
        set_transient('cf_smart_cache_notice_' . get_current_user_id(), 'Error: Zone ID not configured.', 45);
        return;
    }

    $api_url = "https://api.cloudflare.com/client/v4/zones/{$zone_id}/purge_cache";

    $response = wp_remote_post($api_url, [
        'method'  => 'POST',
        'headers' => $headers,
        'body'    => json_encode(['purge_everything' => true]),
        'timeout' => 15
    ]);

    $validated_response = cf_smart_cache_validate_api_response($response, 'purge all cache');
    if (is_wp_error($validated_response)) {
        $message = 'Error: ' . $validated_response->get_error_message();
    } else {
        $message = 'Success: All cache purged from Cloudflare.';
        cf_smart_cache_log('Manual purge all cache executed');
        /**
         * Fires after a successful full cache purge via the admin UI.
         *
         * @param array $response The Cloudflare API response.
         */
        do_action('cf_smart_cache_after_purge_all', $validated_response);
    }

    set_transient('cf_smart_cache_notice_' . get_current_user_id(), $message, 45);
}

/**
 * Display cache status and statistics with improved security and i18n
 */
function cf_smart_cache_display_cache_status()
{
    $settings = get_option('cf_smart_cache_settings', []);
    $zone_id  = isset($settings['cf_smart_cache_zone_id']) ? $settings['cf_smart_cache_zone_id'] : '';

    echo '<div class="cf-cache-status">';
    if (empty($zone_id)) {
        printf(
            '<p><span class="dashicons dashicons-warning" style="color: #f56e28;"></span> %s</p>',
            esc_html__('Please configure your Cloudflare API credentials and select a zone.', 'cf-smart-cache')
        );
    } else {
        printf(
            '<p><span class="dashicons dashicons-yes-alt" style="color: #00a32a;"></span> %s <code>%s</code></p>',
            esc_html__('Cloudflare Smart Cache is active for zone:', 'cf-smart-cache'),
            esc_html($zone_id)
        );

        // Show recent activity
        $rate_limit_key = 'cf_smart_cache_rate_limit';
        $requests_count = get_transient($rate_limit_key) ?: 0;
        printf(
            '<p>%s %d/1000</p>',
            esc_html__('API requests in last 5 minutes:', 'cf-smart-cache'),
            absint($requests_count)
        );
    }
    echo '</div>';
}

// ===================== Rate Limiting and Batch Processing =====================

/**
 * Check if we're hitting rate limits and need to delay requests
 * Based on current Cloudflare API rate limits: 1200 requests per 5 minutes
 */
function cf_smart_cache_check_rate_limit()
{
    $rate_limit_key  = 'cf_smart_cache_rate_limit';
    $rate_limit_data = get_transient($rate_limit_key);

    // Initialize rate limit data if not exists
    if (!$rate_limit_data) {
        $rate_limit_data = [
            'requests'     => 0,
            'reset_time'   => time() + 300, // 5 minutes from now
            'window_start' => time()
        ];
    }

    $current_time = time();

    // Reset counter if we're in a new 5-minute window
    if ($current_time >= $rate_limit_data['reset_time']) {
        $rate_limit_data = [
            'requests'     => 0,
            'reset_time'   => $current_time + 300,
            'window_start' => $current_time
        ];
    }

    // Check if we're approaching the limit (use 1000 to leave buffer)
    if ($rate_limit_data['requests'] >= 1000) {
        $wait_time = $rate_limit_data['reset_time'] - $current_time;
        cf_smart_cache_log(sprintf('Rate limit approaching (%d/1200), waiting %d seconds', $rate_limit_data['requests'], $wait_time), 'warning');
        return false;
    }

    // Increment counter and save
    $rate_limit_data['requests']++;
    set_transient($rate_limit_key, $rate_limit_data, 300);

    cf_smart_cache_log(sprintf('API request %d/1200 in current window', $rate_limit_data['requests']), 'debug');
    return true;
}

/**
 * Batch purge URLs to avoid hitting API limits
 */
function cf_smart_cache_batch_purge($urls_to_purge)
{
    $settings  = get_option('cf_smart_cache_settings');
    $api_token = $settings['cf_smart_cache_api_token'] ?? '';
    $zone_id   = $settings['cf_smart_cache_zone_id'] ?? '';
    if (empty($zone_id)) {
        return new WP_Error('missing_zone', 'Cloudflare zone ID is not set');
    }
    $api_url = "https://api.cloudflare.com/client/v4/zones/{$zone_id}/purge_cache";
    $chunks  = array_chunk($urls_to_purge, 30); // Cloudflare API allows up to 30 URLs per request
    $results = [];
    foreach ($chunks as $chunk) {
        $headers                  = [
            'Content-Type' => 'application/json',
        ];
        $headers['Authorization'] = 'Bearer ' . $api_token;
        $body                     = json_encode(['files' => $chunk]);
        $response                 = wp_remote_post($api_url, [
            'headers' => $headers,
            'body'    => $body,
            'timeout' => 15
        ]);
        $validated                = cf_smart_cache_validate_api_response($response, 'batch purge');
        $results[]                = $validated;
        if (!is_wp_error($validated)) {
            /**
             * Fires after a successful batch cache purge.
             *
             * @param array $purged_urls The URLs that were purged.
             * @param array $response The Cloudflare API response.
             */
            do_action('cf_smart_cache_after_batch_purge', $chunk, $validated);
        }
        // Optional: add delay to avoid rate limits
        sleep(1);
    }
    return $results;
}

// ===================== Core Purge Logic =====================
function cf_smart_cache_execute_purge($urls_to_purge)
{
    if (empty($urls_to_purge)) {
        return;
    }

    $settings  = get_option('cf_smart_cache_settings');
    $api_token = $settings['cf_smart_cache_api_token'] ?? '';
    $zone_id   = $settings['cf_smart_cache_zone_id'] ?? '';

    // Only API token authentication is supported
    if (!empty($api_token)) {
        $headers = [
            'Authorization' => 'Bearer ' . $api_token,
            'Content-Type'  => 'application/json'
        ];
    } else {
        cf_smart_cache_log('API token not configured for purge operation', 'error');
        return;
    }

    if (empty($zone_id)) {
        cf_smart_cache_log('Zone ID not configured for purge operation', 'error');
        return;
    }

    $urls_to_purge = array_values(array_unique($urls_to_purge));
    $api_url       = "https://api.cloudflare.com/client/v4/zones/{$zone_id}/purge_cache";

    cf_smart_cache_log(sprintf('Executing purge for %d URLs: %s', count($urls_to_purge), implode(', ', $urls_to_purge)));

    $response = wp_remote_post($api_url, [
        'method'  => 'POST',
        'headers' => $headers,
        'body'    => json_encode(['files' => $urls_to_purge]),
        'timeout' => 15
    ]);

    $validated_response = cf_smart_cache_validate_api_response($response, 'cache purge');
    if (is_wp_error($validated_response)) {
        $message = "CF API Error: " . $validated_response->get_error_message();
        cf_smart_cache_log($message, 'error');
    } else {
        $message = sprintf('Success: Cloudflare purge request sent for %d URLs.', count($urls_to_purge));
        cf_smart_cache_log($message);
    }

    set_transient('cf_smart_cache_notice_' . get_current_user_id(), $message, 45);
}

// ===================== Enhanced Content Type Support =====================

/**
 * Get all supported post types for cache purging
 */
function cf_smart_cache_get_supported_post_types()
{
    $default_types   = ['post', 'page'];
    $custom_types    = get_post_types(['public' => true, '_builtin' => false], 'names');
    $supported_types = array_merge($default_types, $custom_types);

    return apply_filters('cf_smart_cache_supported_post_types', $supported_types);
}

/**
 * Get URLs to purge for a specific post
 */
function cf_smart_cache_get_post_purge_urls($post_id)
{
    $post = get_post($post_id);
    if (!$post || !in_array($post->post_type, cf_smart_cache_get_supported_post_types())) {
        return [];
    }

    $urls = [
        home_url('/'), // Homepage
        get_permalink($post_id) // Post/page URL
    ];

    // Add archive URLs for posts
    if ($post->post_type === 'post') {
        // Add category URLs
        $categories = get_the_category($post_id);
        if (!empty($categories)) {
            foreach ($categories as $category) {
                $urls[] = get_category_link($category->term_id);
            }
        }

        // Add tag URLs
        $tags = get_the_tags($post_id);
        if (!empty($tags)) {
            foreach ($tags as $tag) {
                $urls[] = get_tag_link($tag->term_id);
            }
        }

        // Add date archives
        $year   = get_the_time('Y', $post_id);
        $month  = get_the_time('m', $post_id);
        $urls[] = get_year_link($year);
        $urls[] = get_month_link($year, $month);

        // Add author archive
        $urls[] = get_author_posts_url($post->post_author);
    }

    // Add custom taxonomy URLs for custom post types
    $taxonomies = get_object_taxonomies($post->post_type, 'objects');
    foreach ($taxonomies as $taxonomy) {
        if ($taxonomy->public) {
            $terms = get_the_terms($post_id, $taxonomy->name);
            if (!empty($terms) && !is_wp_error($terms)) {
                foreach ($terms as $term) {
                    $urls[] = get_term_link($term);
                }
            }
        }
    }

    // Add post type archive URL
    if ($post->post_type !== 'post' && $post->post_type !== 'page') {
        $archive_url = get_post_type_archive_link($post->post_type);
        if ($archive_url) {
            $urls[] = $archive_url;
        }
    }

    return apply_filters('cf_smart_cache_post_purge_urls', array_unique($urls), $post_id, $post);
}

function cf_smart_cache_on_status_change($new_status, $old_status, $post)
{
    if ($new_status === 'publish' || $old_status === 'publish') {
        $urls = cf_smart_cache_get_post_purge_urls($post->ID);
        if (!empty($urls)) {
            cf_smart_cache_log(sprintf('Post %d status changed from %s to %s, purging %d URLs', $post->ID, $old_status, $new_status, count($urls)));
            cf_smart_cache_batch_purge($urls);
        }
    }
}
add_action('transition_post_status', 'cf_smart_cache_on_status_change', 10, 3);

function cf_smart_cache_on_delete_post($post_id)
{
    $urls = cf_smart_cache_get_post_purge_urls($post_id);
    if (!empty($urls)) {
        cf_smart_cache_log(sprintf('Post %d deleted, purging %d URLs', $post_id, count($urls)));
        cf_smart_cache_batch_purge($urls);
    }
}
add_action('delete_post', 'cf_smart_cache_on_delete_post', 10, 1);

function cf_smart_cache_on_term_change($term_id)
{
    $urls = [get_term_link($term_id), home_url('/')];
    cf_smart_cache_batch_purge($urls);
}
add_action('edited_term', 'cf_smart_cache_on_term_change', 10, 1);
add_action('delete_term', 'cf_smart_cache_on_term_change', 10, 1);

function cf_smart_cache_display_admin_notice()
{
    // Check if user can see admin notices
    if (!current_user_can('manage_options')) {
        return;
    }

    $user_id = get_current_user_id();
    $notice  = get_transient('cf_smart_cache_notice_' . $user_id);

    if ($notice) {
        $is_error = strpos($notice, 'Error') !== false;
        $class    = $is_error ? 'notice-error' : 'notice-success';

        printf(
            '<div class="notice %s is-dismissible"><p><strong>%s:</strong> %s</p></div>',
            esc_attr($class),
            esc_html__('CF Smart Cache', 'cf-smart-cache'),
            esc_html($notice)
        );

        delete_transient('cf_smart_cache_notice_' . $user_id);
    }
}
add_action('admin_notices', 'cf_smart_cache_display_admin_notice');

// ===================== Cache Performance Insights =====================

/**
 * Get cache performance metrics from Cloudflare Analytics API
 * Based on current Cloudflare API best practices
 */
function cf_smart_cache_get_performance_metrics()
{
    $settings = get_option('cf_smart_cache_settings', []);
    $zone_id  = $settings['cf_smart_cache_zone_id'] ?? '';

    if (empty($zone_id)) {
        return new WP_Error('missing_zone', 'Zone ID not configured');
    }

    // Check rate limit before making API call
    if (!cf_smart_cache_check_rate_limit()) {
        return new WP_Error('rate_limited', 'API rate limit reached, please try again later');
    }

    $api_token      = $settings['cf_smart_cache_api_token'] ?? '';
    $email          = $settings['cf_smart_cache_email'] ?? '';
    $global_api_key = $settings['cf_smart_cache_global_api_key'] ?? '';

    $headers = [
        'Content-Type' => 'application/json',
        'User-Agent'   => 'CF-Smart-Cache-WordPress/' . get_bloginfo('version'),
    ];

    // Use API token if available (recommended method)
    if (!empty($api_token)) {
        $headers['Authorization'] = 'Bearer ' . $api_token;
    } elseif (!empty($email) && !empty($global_api_key)) {
        $headers['X-Auth-Email'] = $email;
        $headers['X-Auth-Key']   = $global_api_key;
    } else {
        return new WP_Error('missing_credentials', 'API credentials not configured');
    }

    // Get cache analytics for the last 24 hours
    $end_time   = current_time('timestamp');
    $start_time = $end_time - (24 * 60 * 60); // 24 hours ago

    $url = sprintf(
        'https://api.cloudflare.com/client/v4/zones/%s/analytics/dashboard?since=%s&until=%s',
        $zone_id,
        gmdate('Y-m-d\TH:i:s\Z', $start_time),
        gmdate('Y-m-d\TH:i:s\Z', $end_time)
    );

    $response = wp_remote_get($url, [
        'headers' => $headers,
        'timeout' => 30
    ]);

    $validated_response = cf_smart_cache_validate_api_response($response, 'analytics fetch');

    if (is_wp_error($validated_response)) {
        return $validated_response;
    }

    return $validated_response['result'] ?? [];
}

/**
 * Get cache status and recommendations
 */
function cf_smart_cache_get_cache_status()
{
    $status = [
        'configured'      => false,
        'api_working'     => false,
        'edge_caching'    => false,
        'recommendations' => []
    ];

    $settings = get_option('cf_smart_cache_settings', []);

    // Check if basic configuration is complete
    $zone_id        = $settings['cf_smart_cache_zone_id'] ?? '';
    $api_token      = $settings['cf_smart_cache_api_token'] ?? '';
    $email          = $settings['cf_smart_cache_email'] ?? '';
    $global_api_key = $settings['cf_smart_cache_global_api_key'] ?? '';

    if (!empty($zone_id) && (!empty($api_token) || (!empty($email) && !empty($global_api_key)))) {
        $status['configured'] = true;

        // Test API connectivity
        if (cf_smart_cache_check_rate_limit()) {
            $zones = cf_smart_cache_fetch_zones();
            if (!is_wp_error($zones)) {
                $status['api_working'] = true;
            }
        }
    } else {
        $status['recommendations'][] = 'Configure your Cloudflare API credentials and select a zone.';
    }

    // Check if edge caching headers are being sent
    if (function_exists('headers_list')) {
        $headers = headers_list();
        foreach ($headers as $header) {
            if (strpos($header, 'x-HTML-Edge-Cache:') !== false) {
                $status['edge_caching'] = true;
                break;
            }
        }
    }

    // Add recommendations based on configuration
    if ($status['configured'] && !$status['api_working']) {
        $status['recommendations'][] = 'API credentials appear to be invalid. Please check your API token or Global API Key.';
    }

    if ($status['configured'] && empty($api_token)) {
        $status['recommendations'][] = 'Consider upgrading to API Token authentication for better security.';
    }

    if (!$status['edge_caching']) {
        $status['recommendations'][] = 'Edge caching headers are not being sent. Make sure the plugin is active and check for conflicts.';
    }

    return $status;
}

/**
 * Add admin toolbar cache controls for quick access
 */
function cf_smart_cache_admin_bar_menu($wp_admin_bar)
{
    if (!is_admin() && !is_user_logged_in()) return;
    $status = 'Edge Cache: '; // Default
    if (defined('DOING_AJAX') && DOING_AJAX) {
        $status .= 'AJAX (Bypass)';
    } elseif (defined('REST_REQUEST') && REST_REQUEST) {
        $status .= 'REST (Bypass)';
    } elseif (is_admin()) {
        $status .= 'Admin (Bypass)';
    } else {
        $status .= 'Public';
    }
    $wp_admin_bar->add_node([
        'id'    => 'cf_smart_cache_status',
        'title' => $status,
        'meta'  => [
            'title' => 'Cloudflare Smart Cache Status',
        ],
    ]);
}
add_action('admin_bar_menu', 'cf_smart_cache_admin_bar_menu', 999);

/**
 * Handle admin toolbar cache actions with improved security
 */
function cf_smart_cache_handle_admin_actions()
{
    // Check user capabilities first
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have sufficient permissions to perform this action.', 'cf-smart-cache'));
    }

    // Purge current page
    if (isset($_GET['action']) && $_GET['action'] === 'cf_smart_cache_purge_current') {
        // Verify nonce
        if (!isset($_GET['_wpnonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_GET['_wpnonce'])), 'cf-smart-cache-purge-current')) {
            wp_die(__('Security check failed. Please try again.', 'cf-smart-cache'));
        }

        $post_id = isset($_GET['post_id']) ? absint($_GET['post_id']) : 0;
        if ($post_id > 0) {
            $urls = cf_smart_cache_get_post_purge_urls($post_id);
            if (!empty($urls)) {
                cf_smart_cache_batch_purge($urls);

                $user_id = get_current_user_id();
                $message = sprintf(
                    /* translators: %d: number of URLs purged */
                    __('Cache purged for current page and related URLs (%d URLs)', 'cf-smart-cache'),
                    count($urls)
                );
                set_transient("cf_smart_cache_notice_{$user_id}", $message, 30);
            }
        }

        wp_safe_redirect(wp_get_referer() ?: home_url());
        exit;
    }

    // Purge all cache
    if (isset($_GET['action']) && $_GET['action'] === 'cf_smart_cache_purge_all') {
        // Verify nonce
        if (!isset($_GET['_wpnonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_GET['_wpnonce'])), 'cf-smart-cache-purge-all')) {
            wp_die(__('Security check failed. Please try again.', 'cf-smart-cache'));
        }

        cf_smart_cache_purge_all_cache();

        $user_id = get_current_user_id();
        set_transient("cf_smart_cache_notice_{$user_id}", __('All cache purged successfully', 'cf-smart-cache'), 30);

        wp_safe_redirect(wp_get_referer() ?: admin_url());
        exit;
    }
}
add_action('admin_post_cf_smart_cache_purge_current', 'cf_smart_cache_handle_admin_actions');
add_action('admin_post_cf_smart_cache_purge_all', 'cf_smart_cache_handle_admin_actions');

/**
 * Display admin notices for cache operations
 */
function cf_smart_cache_admin_notices()
{
    $user_id = get_current_user_id();
    $notice  = get_transient("cf_smart_cache_notice_{$user_id}");

    if ($notice) {
        delete_transient("cf_smart_cache_notice_{$user_id}");
        echo '<div class="notice notice-success is-dismissible"><p>' . esc_html($notice) . '</p></div>';
    }
}
add_action('admin_notices', 'cf_smart_cache_admin_notices');

/**
 * Enhanced logging with different log levels and better formatting
 */
function cf_smart_cache_enhanced_log($message, $level = 'info', $context = [])
{
    if (!defined('WP_DEBUG') || !WP_DEBUG || !defined('WP_DEBUG_LOG') || !WP_DEBUG_LOG) {
        return;
    }

    $timestamp         = current_time('Y-m-d H:i:s T');
    $formatted_message = sprintf(
        '[%s] [CF Smart Cache] [%s] %s',
        $timestamp,
        strtoupper($level),
        $message
    );

    if (!empty($context)) {
        $formatted_message .= ' Context: ' . wp_json_encode($context);
    }

    error_log($formatted_message);

    // Also store recent logs in transient for admin display
    $recent_logs   = get_transient('cf_smart_cache_recent_logs') ?: [];
    $recent_logs[] = [
        'timestamp' => time(),
        'level'     => $level,
        'message'   => $message,
        'context'   => $context
    ];

    // Keep only last 50 log entries
    if (count($recent_logs) > 50) {
        $recent_logs = array_slice($recent_logs, -50);
    }

    set_transient('cf_smart_cache_recent_logs', $recent_logs, 3600); // 1 hour
}

// ===================== Modern WordPress Hooks & Compatibility =====================

/**
 * Enhanced post status transition handling for better cache invalidation
 */
function cf_smart_cache_enhanced_post_transition($new_status, $old_status, $post)
{
    // Only process supported post types
    if (!in_array($post->post_type, cf_smart_cache_get_supported_post_types())) {
        return;
    }

    // Log the transition for debugging
    cf_smart_cache_enhanced_log(
        sprintf('Post transition: %s -> %s for post %d (%s)', $old_status, $new_status, $post->ID, $post->post_type),
        'debug',
        ['post_id' => $post->ID, 'post_type' => $post->post_type, 'old_status' => $old_status, 'new_status' => $new_status]
    );

    // Determine if cache purge is needed
    $should_purge = false;

    if ($new_status === 'publish' && $old_status !== 'publish') {
        // Post was published
        $should_purge = true;
    } elseif ($old_status === 'publish' && $new_status !== 'publish') {
        // Post was unpublished
        $should_purge = true;
    } elseif ($new_status === 'publish' && $old_status === 'publish') {
        // Published post was updated
        $should_purge = true;
    }

    if ($should_purge) {
        // Use enhanced batch purging
        $urls = cf_smart_cache_get_post_purge_urls($post->ID);
        if (!empty($urls)) {
            cf_smart_cache_batch_purge($urls);

            cf_smart_cache_enhanced_log(
                sprintf('Cache purged for post %d: %d URLs', $post->ID, count($urls)),
                'info',
                ['urls' => $urls]
            );
        }
    }
}
add_action('transition_post_status', 'cf_smart_cache_enhanced_post_transition', 10, 3);

/**
 * Handle comment status changes for cache invalidation
 */
function cf_smart_cache_comment_status_change($comment_id, $comment_status)
{
    $comment = get_comment($comment_id);
    if ($comment && $comment->comment_post_ID) {
        $post = get_post($comment->comment_post_ID);
        if ($post && $post->post_status === 'publish') {
            $urls = cf_smart_cache_get_post_purge_urls($post->ID);
            if (!empty($urls)) {
                cf_smart_cache_batch_purge($urls);

                cf_smart_cache_enhanced_log(
                    sprintf('Cache purged due to comment status change on post %d', $post->ID),
                    'info',
                    ['comment_id' => $comment_id, 'comment_status' => $comment_status]
                );
            }
        }
    }
}
add_action('wp_set_comment_status', 'cf_smart_cache_comment_status_change', 10, 2);

/**
 * Add cache headers for REST API responses
 */
function cf_smart_cache_rest_api_headers()
{
    // Add cache headers for public REST API endpoints
    if (is_user_logged_in()) {
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('x-HTML-Edge-Cache: nocache');
    } else {
        header('Cache-Control: public, max-age=300, s-maxage=600');
        header('x-HTML-Edge-Cache: cache');
    }
}
add_action('rest_api_init', function ()
{
    add_action('rest_pre_serve_request', 'cf_smart_cache_rest_api_headers');
});

// ===================== Final Plugin Information =====================

/**
 * Plugin version and compatibility information
 */
function cf_smart_cache_get_plugin_info()
{
    return [
        'version'           => '2.0.2',
        'min_wp_version'    => '5.0',
        'tested_wp_version' => '6.4',
        'min_php_version'   => '7.4',
        'features'          => [
            'API Token Authentication',
            'Enhanced Security Headers',
            'Batch Cache Purging',
            'Rate Limiting',
            'Multi Post Type Support',
            'Admin Toolbar Integration',
            'Performance Analytics',
            'Advanced Error Handling',
            'Developer Hooks',
            'REST API Caching'
        ],
        'hooks'             => [
            'cf_smart_cache_bypass_cookies',
            'cf_smart_cache_supported_post_types',
            'cf_smart_cache_purge_urls',
            'cf_smart_cache_post_purge_urls'
        ]
    ];
}

// ===================== Admin Notice for Missing Config =====================
add_action('admin_notices', function ()
{
    $settings  = get_option('cf_smart_cache_settings');
    $api_token = $settings['cf_smart_cache_api_token'] ?? '';
    $email     = $settings['cf_smart_cache_email'] ?? '';
    $api_key   = $settings['cf_smart_cache_global_api_key'] ?? '';
    $zone_id   = $settings['cf_smart_cache_zone_id'] ?? '';
    if (empty($api_token) && (empty($email) || empty($api_key))) {
        echo '<div class="notice notice-error"><p><strong>Cloudflare Smart Cache:</strong> ' . esc_html__('Cloudflare API credentials are missing. Please set an API token or email/key in the plugin settings.', 'cf-smart-cache') . '</p></div>';
    }
    if (empty($zone_id)) {
        echo '<div class="notice notice-error"><p><strong>Cloudflare Smart Cache:</strong> ' . esc_html__('Cloudflare Zone ID is missing. Please select a zone in the plugin settings.', 'cf-smart-cache') . '</p></div>';
    }
});
/**
 * == Cloudflare Worker Integration ==
 *
 * To use this plugin with the Cloudflare Worker (cf-smart-cache-html.js):
 * 1. Deploy the Worker and set the following environment variables (in wrangler.toml or Cloudflare dashboard):
 *    - CLOUDFLARE_EMAIL (if using legacy API key)
 *    - CLOUDFLARE_API_KEY (if using legacy API key)
 *    - CLOUDFLARE_ZONE_ID (required)
 *    - Or CLOUDFLARE_API_TOKEN (recommended)
 * 2. In the plugin settings, enter the same API token (recommended) or email/key and zone ID.
 * 3. The plugin will automatically use the most secure method available.
 * 4. For best security, use an API token with only the permissions needed for cache purging.
 *
 * See the Worker and wrangler.toml for more details.
 */
?>
