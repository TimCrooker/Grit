# <%= name %>

> <%= description %>

## License

MIT <%= username %>

## Scripts

`yarn build`

`yarn start` will run the project from index.ts using ts-node

`yarn start:js` will run `yarn build` to transpile the project and then run the project from dist/index.js node
<% if(jest) { %>
`yarn test` will run jest on all test files in the project
<% } %>
