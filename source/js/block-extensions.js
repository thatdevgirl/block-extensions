/**
 * Scripts for extending core WordPress blocks.
 */

const { PanelBody, TextControl } = wp.components;
const { createHigherOrderComponent } = wp.compose;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const { addFilter } = wp.hooks;

const bulldogCoreExtensions = {
  ariaLabelBlocks: [
    'core/paragraph',
    'core/heading'
  ],

  /*
   * The init() function adds all of the filters to the blocks and editor.
   */
  init: function() {
    // POC extension to change the name of the core paragraph block.
    addFilter( 'blocks.registerBlockType', 'custom/extend-paragraph-name', this.extendParagraphName );

    // Extension for ARIA label.
    addFilter( 'blocks.registerBlockType', 'custom/add-aria-label',  this.addAriaLabel );
    addFilter( 'editor.BlockEdit',         'custom/edit-aria-label', this.editAriaLabel );
    addFilter( 'blocks.getSaveElement',    'custom/save-aria-label', this.saveAriaLabel );
  },

  /*
   * Function to change the name of the core paragraph block.
   */
  extendParagraphName: function( settings, name ) {
    if ( name === 'core/paragraph' ) {
      settings.title = 'New paragraph';
    }

    return settings;
  },

  /*
   * Function to add a new ariaLabel attribute to specific blocks.
   */
  addAriaLabel: function( settings, name ) {
    settings.attributes = lodash.assign( settings.attributes, {
      ariaLabel: {
        type: 'string',
        default: ''
      }
    } );

    return settings;
  },

  /*
   * Function to edit the an ariaLabel attribute on specific blocks.
   */
  editAriaLabel: createHigherOrderComponent(
    ( BlockEdit ) => {
      return ( props ) => {
        // Change function for the new ARIA label field.
        props.changeAriaLabel = ( value ) => {
          props.setAttributes({ ariaLabel: value });
        }

        return (
          <Fragment>
            { /* Return the original edit function */ }
            <BlockEdit { ...props } />

            { /* Add a new inspector panel with the ARIA label field. */}
            <InspectorControls>
              <PanelBody title="Accessibility" initialOpen={ false } >

                { /* New ARIA label field. */}
                <TextControl
                  label='ARIA Label'
                  value={ props.attributes.ariaLabel }
                  onChange={ props.changeAriaLabel }
                />

              </PanelBody>
            </InspectorControls>
          </Fragment>
        );
      }
    }, 'extendParagraphEdit'
  ),

  /*
   * Function to save the ariaLabel attribute on specific blocks.
   */
  saveAriaLabel: function( element, blockType, attributes ) {
    const ariaLabel = attributes.ariaLabel;

    // Only add an ARIA label attribute to the element if it exists.
    if ( ariaLabel !== '' ) {
      element = wp.element.cloneElement( element, { 'aria-label': ariaLabel } )
    }

    return (
      <Fragment>
        { element }
      </Fragment>
    );
  }
};

bulldogCoreExtensions.init();
