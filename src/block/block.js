//https://redcap.ctsi.ufl.edu/redcap/api/?type=module&prefix=redcap_webservices&page=plugins%2Fendpoint&NOAUTH&query_id=system_stats
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
const {
    TextControl,
    DropdownMenu,
    MenuGroup,
    MenuItem
} = wp.components;

var baseHTML = <div id='rcmetrics'><h1>HELLO WORLD</h1></div>;

function StatRow(props) {
    return <div class="grid-item" id={props.id}>{props.icon} {props.value} {props.text}</div>
}

// Define used functions
function displayStats(root, stats) {
    Object.keys(stats).forEach(function(key) {
            root.getElementById(key).prepend(`${stats[key]} `);
            });
}

function getRCMetrics(endpoint) {
    return fetch(endpoint)
        .then((resp) => resp.json())
        .then((stats) => {
            if (!stats.success || !stats.data || stats.data.length !== 1) {
                return;
            }
            return stats.data;
        });
}

//getRCMetrics('https://redcap.ctsi.ufl.edu/redcap/api/?type=module&prefix=redcap_webservices&page=plugins%2Fendpoint&NOAUTH&query_id=system_stats');

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
        stats: {
            type: 'object'
        },
        fieldNames: {
            type: 'object'
        }
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
        console.log('props', props);
        function onChangeEndpointURL( newValue ) {
			props.setAttributes( { endpoint: newValue } );
			getRCMetrics(newValue).then((data) => {
                props.setAttributes( {stats : data[0] });
                //const fieldItems = populateDataFields(props.attributes.stats);
                //ReactDOM.render(fieldItems, document.getElementsByClassName('components-base-control')[0]);
                });
            console.log('props update', props);
		}

        function populateDataFields(stats) {
            console.log('popDF called');
            console.log(stats);
            const fieldItems = Object.keys(stats).map( (key) =>
                <TextControl
                    label={key}
                    help='Name that will appear'
                />
            );
            return fieldItems;
        }

        //This also gets called every time a onChangeFieldName is called
        function SetFieldNames() {
            console.log('SetFieldNames called');
            const stats = props.attributes.stats;
            try {
                let fieldItems = [];
                for (const key of Object.keys(stats)) {
                    fieldItems.push(
                        <TextControl
                            label={key}
                            help='Name that will appear'
                            value={ props.attributes.fieldNames[key] }
                            onChange={ (newValue) => onChangeFieldName({newValue, key}) }
                        />
                    );
                }
                return fieldItems;
            } catch(e) {
                return 'Please enter a valid URL';
            };
        }

        function onChangeFieldName( obj ) {
            console.log('onchangefieldname');
            const key = obj.key;
            const value = obj.newValue;
            try {
                props.attributes.fieldNames[key] = value;
                const thisFieldName = props.attributes.fieldNames[key];
                //props.setAttributes( { fieldNames: props.attributes.fieldNames } );
            } catch(e) {
                console.log('error on fieldname');
                console.log(e);
                console.log(props.attributes);
                props.setAttributes( {fieldNames: {}} );
            }
        }

        function RenderFields() {
            console.log('render');
            console.log(props);
            try {
                const rows = Object.keys(props.attributes.fieldNames).map( (key) =>
                    <div class="grid-item" id={key}> {props.attributes.stats[key]} {props.attributes.fieldNames[key]} </div>
                    );
                return rows;
            } catch(e) {
                console.log('error on RenderFields');
                console.log(e);
                return 'Please enter a valid URL';
            }
        }

		return (
            [
            <InspectorControls>
                <TextControl
                    label="API endpoint"
                    help="Additional help text"
                    value = { props.attributes.endpoint }
                    onChange={ onChangeEndpointURL }
                />

                <SetFieldNames />

                <DropdownMenu
                    icon="move"
                    label="define some stuff"
                >
                    <MenuGroup>
                        <MenuItem
                            icon='arrow-up-alt'
                        >
                        up
                        </MenuItem>

                    </MenuGroup>
                </DropdownMenu>

            </InspectorControls>
            ,
            <React.Fragment>
			<div className={ props.className }>
                <p hidden id="expose-endpoint-hack">{ props.attributes.endpoint }</p>
                <div id="rcmetrics">
                <RenderFields />
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
        function RenderFields() {
            const rows = Object.keys(props.attributes.fieldNames).map( (key) =>
                <div class="grid-item" id={key}> {props.attributes.stats[key]} {props.attributes.fieldNames[key]} </div>
                );
            return rows;
        }
        console.log(props);
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
