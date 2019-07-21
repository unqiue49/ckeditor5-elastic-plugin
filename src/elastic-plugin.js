import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import Clazz from './clazz';
import Span from './span';

export default class ElasticPlugin extends Plugin {

    static get requires() {
        return [ Clazz, Span ];
    }

    static get pluginName() {
        return 'elasticPlugin';
    }
}