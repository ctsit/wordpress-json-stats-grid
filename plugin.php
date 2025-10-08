<?php
/**
 * Plugin Name: Wordpress JSON Stats Grid
 * Plugin URI: https://github.com/ctsit/wordpress-json-stats-grid
 * Description: A gutenberg block to format and display data provided by an API to site visitors
 * Author: Kyle Chesney, Taeber Rapczak, Philip Chase
 * Author URI: https://github.com/ctsit
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
