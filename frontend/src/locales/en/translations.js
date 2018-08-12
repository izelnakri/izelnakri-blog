export default {
  'global': {
  },
  'models': {
    'user': {
      'primary_email.address': 'Email',
      'password': 'Password'
    },
    'blog-post': {
      'title': 'Blog post title',
      'tags': 'Tags',
      'slug': 'Blog post link',
      'meta_title': 'Blog post meta title',
      'meta_description': 'Blog post meta description',
      'image_url': 'Blog post image URL'
    }
  },
  'components': {
    'in-form': {
      'failure': 'An error occured: {{error}}',
      'success': 'Saved successfully'
    }
  },
  'helpers': {
  },
  'flash_messages': {
    'save': 'Saved successfully',
    'save_error': 'Oops, something went wrong while saving this record',
    'blog-post': {
      'saved': 'Blog post saved successfully',
      'deleted': 'Blog post deleted successfully',
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
