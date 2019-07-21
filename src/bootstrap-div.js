import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import Command from '@ckeditor/ckeditor5-core/src/command';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';

export default class BootstrapDiv extends Plugin {

    static get requires() {
        return [ Widget ];
    }

    static get pluginName() {
        return 'bootstrapDiv';
    }

    init() {
        this._defineSchema();
        this._defineConverters();
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register( 'divRow', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: true,
            allowWhere: '$block',
            allowAttributes: [ 'clazz' ],
        } );

        schema.register( 'divCol', {
            // Cannot be split or left by the caret.
            isLimit: true,
            isObject: true,
            allowIn: 'divRow',

            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$root',
            allowAttributes: [ 'clazz' ],
        } );

        // schema.register( 'divOther', { inheritAllFrom: '$block' } );

        schema.register( 'divOther', {
            // Cannot be split or left by the caret.
            isLimit: true,
            allowWhere: ['$block','$root'],

            allowContentOf: '$root',
            allowAttributes: [ 'clazz' ],
        } );
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        // converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'divRow',
            view: {
                name: 'div',
                classes: 'row'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'divRow',
            view: {
                name: 'div',
                classes: 'row'
            }
        } );

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'divRow',
            view: ( modelElement, viewWriter ) => {
                const div = viewWriter.createContainerElement( 'div', {});

                return toWidget( div, viewWriter, { label: 'Div row widget' } );
            }
        } );

        // upcast = html -> view
        // downcast = view -> html
        conversion.for( 'upcast' ).elementToElement( {
            model: 'divCol',
            view: {
                name: 'div',
                classes: /col-[\S]+/
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'divCol',
            view: {
                name: 'div',
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'divCol',
            view: ( modelElement, viewWriter ) => {
                const div = viewWriter.createEditableElement( 'div', {} );

                return toWidgetEditable( div, viewWriter );
            }
        } );

        // conversion.for( 'upcast' ).elementToElement( {
        //     model: 'divOther',
        //     view: {
        //         name: 'div',
        //         // classes: /alert-[\S]+/
        //     },
        //     // converterPriority: 'low',
        // } );
        // conversion.for( 'dataDowncast' ).elementToElement( {
        //     model: 'divOther',
        //     view: {
        //         name: 'div',
        //     }
        // } );
        //
        // conversion.for( 'editingDowncast' ).elementToElement( {
        //     model: 'divOther',
        //     view: ( modelElement, viewWriter ) => {
        //         const div = viewWriter.createContainerElement( 'div', {});
        //
        //         return toWidget( div, viewWriter );
        //     }
        // } );


        conversion.elementToElement( { model: 'divOther', view: 'div' } );
    }
}
