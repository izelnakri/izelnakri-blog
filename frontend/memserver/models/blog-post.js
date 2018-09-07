import marked from 'marked';
import Model from 'memserver/model';
import Response from 'memserver/response';
import { dasherize } from '@ember/string';
import User from './user';
import BlogPostTag from './blog-post-tag';

// TODO: handle blog post tags

export default Model({
  defaultAttributes: {
    slug() {
      return dasherize(this.title);
    },
    meta_title() {
      return this.title;
    },
    meta_description() {
      return marked(this.markdown_content).slice(0, 500);
    }
  },
  embedReferences: {
    user: User
  },
  latest() {
    return this.findAll()
      .sort((a, b) => +(new Date(a.inserted_at)) > +(new Date(b.inserted_at)))
      .slice(-5);
  },
  create(params) { // TODO: also insert tags
    let errors = {};

    if (!params.title) {
      errors['title'] = ['is required'];
    } else if (params.title.length < 2) {
      errors['title'] = ['should be minimum 2 characters'];
    }

    if (!params.markdown_content) {
      errors['markdown_content'] = ['is required'];
    } else if (params.markdown_content.length < 2) {
      errors['markdown_content'] = ['should be minimum 2 characters'];
    }

    if (Object.keys(errors).length > 0) {
      return Response(422, { errors: errors });
    }

    params.slug = params.slug || dasherize(params.title);

    const blogPost = this.insert(params);

    return { blog_post: this.serializer(blogPost) };
  },
  tags(blogPost) {
    return BlogPostTag.findAll({ blog_post_id: blogPost.id });
  },
  serializer(modelOrArray) {
    if (Array.isArray(modelOrArray)) {
      return modelOrArray.map((model) => Object.assign({}, this.serialize(model), {
        tags: this.tags(model)
      }));
    }

    return Object.assign({}, this.serialize(modelOrArray), { tags: this.tags(modelOrArray) });
  }
});
