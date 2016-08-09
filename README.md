# Angular Decorators

A set of TypeScript decorators to make working with Angular easier

## Using the library

Install it from npm:

    npm i @rightscale/ui-angular-decorators

### Setup

Tested with Node version 5.12.0 You also need Gulp installed.

Install dependencies with

    npm i

In your application, import the library in your `index.ts` to make it available globally

    import ngModule from '@rightscale/ui-angular-decorators'

Please see the [test fixtures](src/fixtures.ts) for usage details.

### Working with a dependent package

If you're working both on the library and a package that consumes it, you can make your local copy of
the library available:

    npm link

Then you can use this copy from the dependent package using

    npm link @rightscale/ui-angular-decorators

## Contributors

* [André Rieussec](https://github.com/ventajou)

## License

MIT (c) RightScale
