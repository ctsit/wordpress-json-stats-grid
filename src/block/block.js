//const endpoint = "https://redcap.ctsi.ufl.edu/redcap/api/?type=module&prefix=redcap_webservices&page=plugins%2Fendpoint&NOAUTH&query_id=system_stats";
/**
 * BLOCK: redcap-stats-plugin
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

const { InspectorControls } = wp.editor;
const { TextControl } = wp.components;

// Define used functions
function displayStats(root, stats) {
    console.log(Object.keys(stats));

    Object.keys(stats).forEach(function(key) {
            document.getElementById(key).prepend(`${stats[key]} `);
            });
}

function getRCMetrics(endpoint) {
    const root = document.getElementById("rcmetrics");
    console.log('called');
    fetch(endpoint)
        .then(function (resp) {
            return resp.json();
        })
        .then(function (stats) {
            if (!stats.success || !stats.data || stats.data.length !== 1) {
                return;
            }
            displayStats(root, stats);
        });
}

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-redcap-stats-plugin', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'redcap-stats-plugin - CGB Block' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'redcap-stats-plugin — CGB Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],

    attributes: {
        endpoint: {
            type: 'string',
            default: '',
        },
    },

    // { 'endpoint':"https://redcap.ctsi.ufl.edu/redcap/api/?type=module&prefix=redcap_webservices&page=plugins%2Fendpoint&NOAUTH&query_id=system_stats" }


	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
	edit: ( props ) => {
		// Creates a <p class='wp-block-cgb-block-redcap-stats-plugin'></p>.
        function onChangeTextField( newValue ) {
			props.setAttributes( { endpoint: newValue } );
		}
		return (
            [
            <InspectorControls>
                <TextControl
						label="API endpoint"
						help="Additional help text"
                        value = { props.attributes.endpoint }
						onChange={ onChangeTextField }
					/>
            </InspectorControls>
            ,
            <React.Fragment>
			<div className={ props.className }>
                <p hidden id="expose-endpoint-hack">{ props.attributes.endpoint }</p>
                <div id="rcmetrics">
                    <div class="grid-item" id="count_of_existing_projects">Existing Projects</div>
                    <div class="grid-item" id="count_of_projects_created_in_the_past_30_days">Projects Created This Month</div>
                    <div class="grid-item" id="count_of_projects_moved_to_production_in_the_past_30_days">Projects Moved to Production This Month</div>
                    <div class="grid-item" id="count_of_users_active_in_the_past_30_days">Active Users This Month</div>
                </div>
			</div>
            </React.Fragment>
            ]
		);

	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: ( props ) => {
		return (
            <React.Fragment>
			<div className={ props.className }>
                <p hidden id="expose-endpoint-hack">{ props.attributes.endpoint }</p>
                <div id="rcmetrics">
                    <div class="grid-item" id="count_of_existing_projects">Existing Projects</div>
                    <div class="grid-item" id="count_of_projects_created_in_the_past_30_days">Projects Created This Month</div>
                    <div class="grid-item" id="count_of_projects_moved_to_production_in_the_past_30_days">Projects Moved to Production This Month</div>
                    <div class="grid-item" id="count_of_users_active_in_the_past_30_days">Active Users This Month</div>
                </div>
			</div>
            </React.Fragment>
		);
	},
} );
