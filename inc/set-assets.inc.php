<?php
/**
 * Set up settings page in the admin.
 */

class GUBlockExtensions {
  private $packages;

  public function __construct() {
    add_action( 'enqueue_block_editor_assets', array( $this, 'set_js' ) );
  }

  /*
   * Enqueue Javascript assets to the editor.
   */
  public function set_js() {
    wp_enqueue_script(
      'gu-block-extensions-js',
      plugins_url( '../build/block-extensions.min.js', __FILE__ ),
      array( 'wp-blocks', 'wp-hooks' )
    );
  }
}

// Only call this class while in the WP admin.
if ( is_admin() ) {
  new GUBlockExtensions();
}
