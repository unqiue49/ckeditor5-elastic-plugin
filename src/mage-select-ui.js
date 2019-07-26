import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {createDropdown} from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import ListView from '@ckeditor/ckeditor5-ui/src/list/listview';
import ListItemView from '@ckeditor/ckeditor5-ui/src/list/listitemview';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import Template from '@ckeditor/ckeditor5-ui/src/template';
import ImgView from "./img-view"
import ButtonImageView from "./button-image-view"
import './index.css';

export default class ImageSelectUI extends Plugin {
    constructor(editor) {
        super(editor);
        editor.config.define("imageSelect", {
            data: [
                {url: 'https://image.flaticon.com/icons/svg/1668/1668151.svg', name: 'test'},
            ]
        });
    }

    static get pluginName() {
        return 'ImageSelectUI';
    }

    get bindTemplate() {
        if (this._bindTemplate) {
            return this._bindTemplate;
        }
        return (this._bindTemplate = Template.bind(this, this));
    }

    init() {
        const editor = this.editor;
        const bind = this.bindTemplate;
        editor.ui.componentFactory.add('insertImage', locale => {
            const t = locale.t;
            const dropdown = createDropdown(locale);
            dropdown.on('cancel', () => closeUI());

            const listView = new ListView(locale);

            listView.extendTemplate({
                attributes: {
                    class: 'ck-list-image'
                }
            });

            const data = editor.config.get("imageSelect").data;
            console.log('options', data);
            data.forEach(img => {
                const viewItem = new ListItemView(locale);

                const buttonImageView = new ButtonImageView(locale);
                buttonImageView.set({
                    url: img.url,
                    label: img.name,
                    withText: true,
                    tooltip: true
                });
                viewItem.children.add(buttonImageView);

                buttonImageView.on('execute', () => {
                    const imageUrl = img.url;

                    editor.model.change(writer => {
                        const imageElement = writer.createElement('image', {
                            src: imageUrl
                        });

                        editor.model.insertContent(imageElement, editor.model.document.selection);
                    } )
                    ;
                } );

                listView.items.add(viewItem);
            });
            dropdown.panelView.children.add(listView);
            const button = dropdown.buttonView;

            button.set({
                label: t('Insert image'),
                icon: imageIcon,
                tooltip: true
            });

            function closeUI() {
                editor.editing.view.focus();
                dropdown.isOpen = false;
            }

            return dropdown;
        } );
    }
}