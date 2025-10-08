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

const { InspectorControls } = wp.blockEditor;

const {
	ColorPalette,
	PanelBody,
	PanelRow,
	TextControl
} = wp.components;

const { Fragment } = wp.element;

// Preset colors available for ColorPalette
// built from https://design.webservices.ufhealth.org/docs/design/colors
const bgColors = [
	{name: 'slateDark', color: '#3F5379'},
	{name: 'grayLightest', color: '#F6FBFC'},
	{name: 'blueDarkest', color: '#072C55'},
	{name: 'blueNormal', color: '#0F5CB1'}
];

const textColors = [
	{name: 'whiteFull', color: '#FFFFFF'},
	{name: 'orangeDark', color: '#CF4B00'},
	{name: 'grayLight', color: '#C2CBD6'},
	{name: 'blackFull', color: '#000000'}
];

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

// Return a set of text boxes allowing an editor to set a name and icon to appear for each field returned by the API call
function SetFieldAttrs(props) {
	if (!props.stats) {
		return 'Please enter a valid URL';
	}
		const fieldItems = Object.keys(props.stats).map( (key) =>
				<Fragment>
				<TextControl
					label={key}
					help='Text that will appear after this metric'
					value={ props.fieldNames[key] }
					onChange={(newValue) => props.onChange('fieldNames', {newValue, key})}
				/>
				<TextControl
					label={`Icon for ${key}`}
					value={ props.fieldIcons[key] }
					onChange={(newValue) => props.onChange('fieldIcons', {newValue, key})}
				/>
				</Fragment>
			);
		return fieldItems;
}

// Render the fields the user will see in the gutenblock
function RenderFields(props) {
	try {
		let rows;
		rows = Object.keys(props.fieldNames).map( (key) =>
			<Fragment>
			{/* Force icon to align with text */}
			<style dangerouslySetInnerHTML={{__html:
				`#${key}::before{
					vertical-align: middle;
				}`}} />
			<div class={"grid-item dashicons-before " + props.icons[key]} id={key}>{props.stats[key]} {props.fieldNames[key]} </div>
			</Fragment>
			);
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
	title: __( 'JSON Stats Grid' ), // Block title.
	icon: 'chart-line', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
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
		fieldIcons: {
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
				props.setAttributes( { stats : data[0] } );
				});
		}

		function onChangeFieldAttr( fieldKey, obj ) {
			const key = obj.key;
			const newValue = obj.newValue;
			try {
				const fieldAttrs = {...props.attributes[`${fieldKey}`]};
				if (newValue === '') {
					delete fieldAttrs[key];
				} else {
					fieldAttrs[key] = newValue;
				}
				props.setAttributes( { [fieldKey]: fieldAttrs } );
			} catch(e) {
				console.log(e);
				props.setAttributes( { [fieldKey]: {} } );
			}
		}

		return (
			[
			<InspectorControls>

				<PanelBody
					title = "Set Block Color"
					icon="admin-appearance"
				>
					<ColorPalette
						label="label"
						colors = { bgColors }
						value={ props.attributes.bgColor }
						onChange={ ( color ) => props.setAttributes( { bgColor: color } ) }
					/>
				</PanelBody>

				<PanelBody
					title = "Set Text Color"
					icon="admin-customizer"
				>
					<ColorPalette
						colors = { textColors }
						value={ props.attributes.textColor }
						onChange={ ( color ) => props.setAttributes( { textColor: color } ) }
					/>
				</PanelBody>

				<PanelBody
					title = "Set Field Names & Icons"
					icon="edit"
				>
					<SetFieldAttrs stats={ props.attributes.stats } fieldNames={ props.attributes.fieldNames } fieldIcons={ props.attributes.fieldIcons } onChange={onChangeFieldAttr} />
				</PanelBody>
			</InspectorControls>
			,
			<Fragment>
				<TextControl
					label="API endpoint"
					help="The URL for your JSON data"
					value={ props.attributes.endpoint }
					onChange={ onChangeEndpointURL }
				/>

			<div className={ props.className } style={ {backgroundColor: props.attributes.bgColor, color: props.attributes.textColor} } >
				<div id="rcmetrics">
					<RenderFields fieldNames={ props.attributes.fieldNames } stats={ props.attributes.stats } icons={ props.attributes.fieldIcons }/>
				</div>
			</div>
			</Fragment>
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
			// Rendered server side
			null
		);
	},
} );
