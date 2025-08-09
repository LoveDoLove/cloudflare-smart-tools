=== CF Smart Cache ===
Contributors: (add contributors)
Tags: cache, cloudflare, performance
Requires at least: 5.0
Tested up to: 6.5
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

== Description ==
CF Smart Cache is a WordPress plugin designed to optimize caching and performance by integrating seamlessly with Cloudflare. The plugin now follows the latest WordPress-compliant folder structure for improved maintainability, modularity, and compatibility.

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

== Screenshots ==
1. Admin settings page for CF Smart Cache.

== Changelog ==
= 1.0.0 =
* Initial release with WordPress-compliant structure.

== Upgrade Notice ==
= 1.0.0 =
Initial release with new folder structure.