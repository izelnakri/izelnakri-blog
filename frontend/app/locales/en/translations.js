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
      'slug': 'Blog post link',
      'meta_title': 'Blog post meta title',
      'meta_description': 'Blog post meta description',
      'image_url': 'Blog post image URL'
    }
  },
  'components': {
  },
  'helpers': {
    'percentage': {
      'format': '{{percentage}}%'
    }
  },
  'flash_messages': {
    'save': 'Saved successfully',
    'save_error': 'Something went wrong while saving this record',
    'blog-post': {
      'saved': '',
      'deleted': '',
      'unpublished': 'Blog post unpublished successfully'
    }
  },
  'pages': {
    'public.blog-post': {
      'title': '{{model.blogPost.metaTitle}}',
      'description': '{{model.blogPost.metaDescription}}'
    }
  }
};
