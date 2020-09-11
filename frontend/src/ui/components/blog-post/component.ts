import marked from 'marked';
// import Prism from 'prismjs';
import Component from '@glimmer/component';

export default class BlogPost extends Component<{ model: any }> {
  get content() {
    return this.args.model.markdownContent ? marked(this.args.model.markdownContent) : null;
  }
  // didRender() {
  //   window.Prism.highlightAll();
  // }
}
