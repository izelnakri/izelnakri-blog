import Model from 'memserver/model';
import User from './user';
import BlogPostTag from './blog-post-tag';

export default Model({
  embedReferences: {
    user: User
  },
  latest() {
    return this.findAll()
      .sort((a, b) => +(new Date(a.inserted_at)) > +(new Date(b.inserted_at)))
      .slice(-5);
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
