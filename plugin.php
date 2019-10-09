<?php
/**
 * Plugin Name: Wordpress JSON Stats Grid
 * Plugin URI: https://github.com/ctsit/wordpress-json-stats-grid
 * Description: A gutenberg block to deliver data from an API to site visitors
 * Author: Kyle Chesney
 * Author URI: https://github.com/ChemiKyle
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
