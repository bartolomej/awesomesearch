const router = require('express').Router();

function OtherRoutes () {

  // root endpoint
  router.get('/', (req, res, next) => {
    res.render('root', {
      host: 'https://api.awesomesearch.in',
      endpoints: [
        {
          path: '/stats',
          examplePath: '/stats',
          description: 'Returns data statistics.'
        },
        {
          path: '/random',
          examplePath: '/random',
          description: 'Returns random indexed links.'
        },
        {
          path: '/list?limit={objects_per_page}&page={page_index}',
          examplePath: '/list',
          description: 'Returns indexed lists.'
        },
        {
          path: '/list/{list_uid}',
          examplePath: '/list/amnashanwar.awesome-portfolios',
          description: 'Returns information about list object.'
        },
        {
          path: '/link/{link_uid}',
          examplePath: '/link/shewolfe.co',
          description: 'Returns information about link object.'
        },
        {
          path: '/search?q={query_string}&p={page_index}&limit={items_per_page}',
          examplePath: '/search?q=Awesome',
          description: 'Returns search results sorted by relevance.',
        },
        {
          path: '/meta?url={website_url}',
          examplePath: '/meta?url=https://www.github.com',
          description: 'Returns website metadata.'
        },
      ]
    })
  });

  router.get('/dashboard', async (req, res, next) => {
    res.render('dash');
  });

  return router;
}

module.exports = OtherRoutes;
