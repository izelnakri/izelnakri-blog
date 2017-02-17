export default {
  'global': {
  },
  'models': {
    'user': {
      'email.address': 'Email',
      'password': 'Password'
    },
    'blog-post': {
      'title': 'Blog post title',
      'tag': 'Tag',
      'slug': 'Blog post link'
    }
  },
  'pages': {
    'public.blog-post': {
      'title': '{{model.title}}',
      'description': '{{model.description}}'
    }
  }
};
