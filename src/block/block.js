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

const {
    InspectorControls,
    PanelColorSettings
} = wp.editor;

const {
    DropdownMenu,
    MenuGroup,
    MenuItem,
    TextControl
} = wp.components;

// Make API Call
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

//Return a set of text boxes allowing an editor to set a name to appear for each field returned by the API call
function SetFieldNames(props) {
    if (!props.stats) {
        return 'Please enter a valid URL';
    }
        const fieldItems = Object.keys(props.stats).map( (key) =>
                <TextControl
                    label={key}
                    help='Text that will appear after this metric'
                    value={ props.fieldNames[key] }
                    onChange={(newValue) => props.onChange({newValue, key})}
                />
            );
        return fieldItems;
}

// Render the fields the user will see in the gutenblock
function RenderFields(props) {
    try {
        let rows;
        // stats are only passed in the editor setting
        // they are prepended by javascript in the user-facing site to ensure up-to-date results
        if (props.hasOwnProperty('stats')) {
            rows = Object.keys(props.fieldNames).map( (key) =>
                <div class="grid-item" id={key}>{props.stats[key]} {props.fieldNames[key]} </div>
                );
        } else {
            rows = Object.keys(props.fieldNames).map( (key) =>
                <div class="grid-item" id={key}>{props.fieldNames[key]} </div>
                );
        }
        return rows;
    } catch(e) {
        return 'Please enter a valid URL';
    }
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
        stats: {
            type: 'object'
        },
        fieldNames: {
            type: 'object',
            default: {}
        },
        bgColor: {
            type: 'string',
            default: ''
        },
        textColor: {
            type: 'string',
            default: ''
        }
    },


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
        function onChangeEndpointURL( newValue ) {
			props.setAttributes( { endpoint: newValue } );
			getRCMetrics(newValue).then((data) => {
                props.setAttributes( {stats : data[0] });
                });
		}

        function onChangeFieldName( obj ) {
            const key = obj.key;
            const newValue = obj.newValue;
            try {
                const fieldNames = {...props.attributes.fieldNames};
                if (newValue === '') {
                    delete fieldNames[key];
                } else {
                    fieldNames[key] = newValue;
                }
                props.setAttributes({fieldNames: fieldNames});
            } catch(e) {
                props.setAttributes( {fieldNames: {}} );
            }
        }

		return (
            [
            <InspectorControls>
                <TextControl
                    label="API endpoint"
                    help="The URL for your JSON data"
                    value = { props.attributes.endpoint }
                    onChange={ onChangeEndpointURL }
                />

                <PanelColorSettings 
                            title={ __('Background Color', 'tar') }
                            colorSettings={ [ 
                                {
                                value: props.attributes.bgColor,
                                onChange: (colorValue) => props.setAttributes ( { bgColor: colorValue } ),
                                label: __('Color', 'tar'),
                                },
                             ] }
                        />

                <PanelColorSettings 
                            title={ __('Text Color', 'tar') }
                            colorSettings={ [ 
                                {
                                value: props.attributes.textColor,
                                onChange: (colorValue) => props.setAttributes ( { textColor: colorValue } ),
                                label: __('Color', 'tar'),
                                },
                             ] }
                        />

                <SetFieldNames stats={props.attributes.stats} fieldNames={props.attributes.fieldNames} onChange={onChangeFieldName}/>

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
			<div className={ props.className } style={{backgroundColor: props.attributes.bgColor, color: props.attributes.textColor}} >
                <p hidden id="expose-endpoint-hack">{ props.attributes.endpoint }</p>
                <div id="rcmetrics">
                    <RenderFields fieldNames={props.attributes.fieldNames} stats={props.attributes.stats}/>
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
			<div className={ props.className } style={{backgroundColor: props.attributes.bgColor, color: props.attributes.textColor}} >
                <p hidden id="expose-endpoint-hack">{ props.attributes.endpoint }</p>
                <div id="rcmetrics">
                    <RenderFields fieldNames={props.attributes.fieldNames} />
                </div>
			</div>
            </React.Fragment>
		);
	},
} );
