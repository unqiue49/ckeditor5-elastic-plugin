import View from '@ckeditor/ckeditor5-ui/src/view';

export default class ImgView extends View {

    constructor() {
        super();

        const bind = this.bindTemplate;

        this.set( 'url', '' );

        this.setTemplate( {
            tag: 'img',
            attributes: {
                class: [
                    'ck',
                    'ck-image'
                ],
                src: bind.to( 'url' )
            }
        } );
    }

    render() {
        super.render();

    };
}