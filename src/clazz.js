import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

const CLAZZ = 'clazz';

export default class Clazz extends Plugin {

    init() {
        const editor = this.editor;

        editor.model.schema.extend( '$text', { allowAttributes: CLAZZ } );
        editor.model.schema.extend( '$block', { allowAttributes: CLAZZ } );
        editor.model.schema.extend( '$root', { allowAttributes: CLAZZ } );

        editor.model.schema.setAttributeProperties( CLAZZ, {
            isFormatting: true,
            copyOnEnter: true
        } );

        editor.conversion.for( 'upcast' ).attributeToAttribute( {
            view: {
                key: 'class',
            },
            model: {
                key: CLAZZ,
                value: viewElement => {
                    const cls = viewElement.getAttribute( 'class' );
                    return cls;
                }
            }
        } );

        editor.conversion.for( 'downcast' ).attributeToAttribute( {
            model: CLAZZ,
            view: modelAttributeValue => {
                return { key: 'class', value: modelAttributeValue };
            }
        } );
    }
}