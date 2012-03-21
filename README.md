
# bndlr-advanced

This is an example of a site that uses bndlr with more advanced requirements.

- Break things into 'areas'
- Make URLs remain simple (eg: "/common/js/global" instead of "/areas/common/static/js/global")
- Multiple Bundle.config.js files (one per area)
- Configs that reference other configs
- Nested common layouts that use 'areas'

## Fire it up...

    $ [sudo] node app.js