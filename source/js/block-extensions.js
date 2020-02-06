/**
 * Scripts for extending core WordPress blocks.
 */

const { PanelBody, TextControl } = wp.components;
const { createHigherOrderComponent } = wp.compose;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const { addFilter } = wp.hooks;

const bulldogCoreExtensions = {
  init: function() {
    addFilter( 'blocks.registerBlockType', 'custom/extend-paragraph-name', this.extendParagraphName );
    addFilter( 'editor.BlockEdit', 'custom/add-aria-label', this.addAriaLabel );
  },

  extendParagraphName: function( settings, name ) {
    if ( name === 'core/paragraph' ) {
      settings.title = 'New paragraph';
    }

    return settings;
  },

  // Function to add an ARIA label attribute to blocks.
  addAriaLabel: createHigherOrderComponent(
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
  )
};

bulldogCoreExtensions.init();
