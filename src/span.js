import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand';

const SPAN = 'span';

export default class Span extends Plugin {

    init() {
        const editor = this.editor;
        // Allow span attribute on text nodes.
        editor.model.schema.extend( '$text', { allowAttributes: SPAN } );
        editor.model.schema.setAttributeProperties( SPAN, {
            isFormatting: true,
            copyOnEnter: true
        } );

        editor.conversion.attributeToElement( {
            model: SPAN,
            view: 'span'
        } );

        editor.commands.add( SPAN, new AttributeCommand( editor, SPAN ) );
    }
}