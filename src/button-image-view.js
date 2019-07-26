import View from '@ckeditor/ckeditor5-ui/src/view';
import LabelView from '@ckeditor/ckeditor5-ui/src/label/labelview';
import TooltipView from '@ckeditor/ckeditor5-ui/src/tooltip/tooltipview';
import uid from '@ckeditor/ckeditor5-utils/src/uid';
import { getEnvKeystrokeText } from '@ckeditor/ckeditor5-utils/src/keyboard';
import ImgView from "./img-view"

export default class ButtonImageView extends View {

    constructor( locale ) {
        super( locale );

        const bind = this.bindTemplate;
        const ariaLabelUid = uid();

        this.set( 'class' );
        this.set( 'labelStyle' );
        this.set( 'url' );
        this.set( 'isEnabled', true );
        this.set( 'isOn', false );
        this.set( 'isVisible', true );
        this.set( 'keystroke' );
        this.set( 'label' );
        this.set( 'tabindex', -1 );
        this.set( 'tooltip' );
        this.set( 'tooltipPosition', 's' );
        this.set( 'type', 'button' );
        this.set( 'withText', false );

        this.children = this.createCollection();

        this.tooltipView = this._createTooltipView();

        this.labelView = this._createLabelView( ariaLabelUid );

        this.imgView = new ImgView();

        this.imgView.extendTemplate( {
            attributes: {
                class: 'ck-button__icon'
            }
        } );

        this.bind( '_tooltipString' ).to(
            this, 'tooltip',
            this, 'label',
            this, 'keystroke',
            this._getTooltipString.bind( this )
        );

        this.setTemplate( {
            tag: 'button',

            attributes: {
                class: [
                    'ck',
                    'ck-button',
                    bind.to( 'class' ),
                    bind.if( 'isEnabled', 'ck-disabled', value => !value ),
        bind.if( 'isVisible', 'ck-hidden', value => !value ),
        bind.to( 'isOn', value => value ? 'ck-on' : 'ck-off' ),
        bind.if( 'withText', 'ck-button_with-text' )
    ],
        type: bind.to( 'type', value => value ? value : 'button' ),
        tabindex: bind.to( 'tabindex' ),
            'aria-labelledby': `ck-editor__aria-label_${ ariaLabelUid }`,
            'aria-disabled': bind.if( 'isEnabled', true, value => !value ),
        'aria-pressed': bind.if( 'isOn', true )
    },

        children: this.children,

            on: {
            mousedown: bind.to( evt => {
                evt.preventDefault();
        } ),

            click: bind.to( evt => {
                if ( this.isEnabled ) {
                this.fire( 'execute' );
            } else {
                evt.preventDefault();
            }
        } )
        }
    } );
    }

    render() {
        super.render();

        if ( this.url ) {
            this.imgView.bind( 'url' ).to( this, 'url' );
            this.children.add( this.imgView );
        }

        this.children.add( this.tooltipView );
        this.children.add( this.labelView );
    }

    focus() {
        this.element.focus();
    }

    _createTooltipView() {
        const tooltipView = new TooltipView();

        tooltipView.bind( 'text' ).to( this, '_tooltipString' );
        tooltipView.bind( 'position' ).to( this, 'tooltipPosition' );

        return tooltipView;
    }

    _createLabelView( ariaLabelUid ) {
        const labelView = new View();
        const bind = this.bindTemplate;

        labelView.setTemplate( {
            tag: 'span',

            attributes: {
                class: [
                    'ck',
                    'ck-button__label'
                ],
                style: bind.to( 'labelStyle' ),
                id: `ck-editor__aria-label_${ ariaLabelUid }`,
            },

            children: [
                {
                    text: this.bindTemplate.to( 'label' )
                }
            ]
        } );

        return labelView;
    }

    _getTooltipString( tooltip, label, keystroke ) {
        if ( tooltip ) {
            if ( typeof tooltip == 'string' ) {
                return tooltip;
            } else {
                if ( keystroke ) {
                    keystroke = getEnvKeystrokeText( keystroke );
                }

                if ( tooltip instanceof Function ) {
                    return tooltip( label, keystroke );
                } else {
                    return `${ label }${ keystroke ? ` (${ keystroke })` : '' }`;
                }
            }
        }
        return '';
    }
}