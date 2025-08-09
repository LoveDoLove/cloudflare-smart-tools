=== CF Smart Cache ===
Contributors: LoveDoLove
Tags: cache, cloudflare, performance, html cache, cloudflare api, purge, admin tools, optimization, speed
Requires at least: 5.0
Tested up to: 6.5
Stable tag: 2.0.6
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

== Description ==
CF Smart Cache is a WordPress plugin that optimizes site performance by integrating advanced caching controls with Cloudflare. It provides seamless cache management, allowing administrators to purge cache, configure settings, and monitor cache status directly from the WordPress dashboard. The plugin is designed for maintainability, modularity, and compatibility with modern WordPress standards.

**Major Features & Benefits:**
- Integrates with Cloudflare for cache management and purging.
- Provides an intuitive admin interface for cache operations.
- Modular folder structure for easy maintenance and extension.
- Supports localization and translation.
- Improves site speed and performance by leveraging Cloudflare’s edge caching.
- No hardcoded credentials; uses secure API token authentication.
- Compatible with the latest WordPress versions.

== New Folder Structure ==
The plugin is organized as follows:
- `/includes` – Core logic and main functionality.
- `/admin` – Admin dashboard and settings components.
- `/assets` – Static assets such as images, CSS, and JavaScript.
- `/languages` – Translation files for localization.

This structure aligns with WordPress best practices, making the plugin easier to maintain, extend, and translate.

== Installation ==
1. Download the plugin and extract the `cf-smart-cache` folder.
2. Upload the entire `cf-smart-cache` directory to the `/wp-content/plugins/` directory on your WordPress site.
3. Activate the plugin through the 'Plugins' menu in WordPress.
4. Configure plugin settings via the WordPress admin dashboard under "CF Smart Cache".

== Usage ==
- All core caching logic is located in the [`/includes`](cf-smart-cache/includes/) directory.
- Admin settings and UI are managed in the [`/admin`](cf-smart-cache/admin/) directory.
- Assets such as images and scripts are in the [`/assets`](cf-smart-cache/assets/) directory.
- Translation files are in the [`/languages`](cf-smart-cache/languages/) directory.

Refer to the plugin settings page for configuration options.

== Frequently Asked Questions ==

= Why was the folder structure changed? =
To comply with WordPress plugin standards, improve maintainability, and support easier updates and localization.

= How do I update the plugin? =
Replace the plugin folder with the new version, ensuring you retain your settings.

= What Cloudflare API permissions are required? =
You need a Cloudflare API token with permissions to manage cache for your domain. Refer to the plugin settings for guidance on generating a suitable token.

= Is this plugin compatible with all WordPress themes and plugins? =
CF Smart Cache is designed to be compatible with most themes and plugins. If you encounter issues, please check for conflicts or reach out for support.

= Troubleshooting: Cache not purging or plugin not working? =
- Ensure your Cloudflare API token is correct and has the required permissions.
- Check your server’s connectivity to Cloudflare.
- Review the plugin’s admin page for error messages or logs.
- Make sure you are running a supported version of WordPress.

== Screenshots ==
1. Admin settings page for CF Smart Cache.
2. Cache purge confirmation dialog.
3. Cloudflare API token configuration screen.

== Changelog ==

= 2.0.6 =
* Major refactor to adopt a fully WordPress-compliant folder structure:
  * Core logic modularized into [`/includes`](cf-smart-cache/includes/) and admin components into [`/admin`](cf-smart-cache/admin/).
  * Assets reorganized under [`/assets`](cf-smart-cache/assets/) and translations under [`/languages`](cf-smart-cache/languages/).
* Improved code modularity and separation of concerns for easier maintenance and extension.
* Enhanced [`uninstall.php`](cf-smart-cache/uninstall.php) for more robust cleanup on plugin removal.
* Comprehensive documentation overhaul for clarity and compliance.
* Updated all references and internal logic to match new structure.
* Version bump to 2.0.6.

= 2.0.5 =
* Improved uninstall routine for cleaner database and option removal.
* Minor bug fixes and code cleanup.
* Updated documentation for uninstall process.

= 2.0.4 =
* Enhanced admin UI for better usability.
* Improved error handling and logging.
* Updated translation files.

= 2.0.3 =
* Fixed compatibility issues with latest WordPress versions.
* Minor performance improvements.
* Updated Cloudflare API integration logic.

= 2.0.2 =
* Added support for additional Cloudflare cache control headers.
* Improved settings validation and sanitization.
* Fixed minor UI bugs in admin panel.

= 2.0.1 =
* Bug fixes for settings page display.
* Improved plugin activation and deactivation hooks.
* Updated documentation.

= 2.0.0 =
* Major update: introduced modular code structure.
* Split core logic into separate files under [`/includes`](cf-smart-cache/includes/).
* Added dedicated admin interface under [`/admin`](cf-smart-cache/admin/).
* Improved compatibility with WordPress multisite.
* Enhanced uninstall process with [`uninstall.php`](cf-smart-cache/uninstall.php).
* Updated assets and translation support.

= 1.0.0 =
* Initial release with WordPress-compliant structure.

== Upgrade Notice ==
= 2.0.6 =
Major refactor: new WordPress-compliant folder structure and improved codebase maintainability. Please back up your settings before upgrading.

= 1.0.0 =
Initial release with new folder structure.