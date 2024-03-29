# paatokset-search

First, make sure you have installed the helfi-paatokset project and have set it up properly.

## Getting started

```console
foo@bar:~$ npm i
foo@bar:~$ npm start

# In case of ERR_OSSL_EVP_UNSUPPOERTED error, instead of 'npm start' run:
NODE_OPTIONS=--openssl-legacy-provider npm start
```

Make sure your elastic container is up and running.

Since this app is used as an embedded app inside Drupal, some settings for the standalone app are set in the `public/index.html` file. Edit the div with id `paatokset_search` to modify these settings:

- The data-url -attribute should be the URL for your elastic cluster. You can also change this to point to the proxy app server in test/prod environments to test the app with real data.
- Data-type -attribute determines if the app is used for searching policymakers or decisions. Naturally the available options for this attribute are `decisions` and `policymakers`.

## Creating new releases

Switch to develop branch and stash any uncommitted files. Then do a clean install and build a release `.zip` file.

```sh
git checkout develop
git pull
git stash --include-untracked
nvm use
npm i
NODE_OPTIONS=--openssl-legacy-provider npm run create-release
git stash pop
```

Draft new release from Github: [City-of-Helsinki/paatokset-search/releases/new](https://github.com/City-of-Helsinki/paatokset-search/releases/new). Remember to include the generated `.zip` file from `dist/paatokset_search.zip`. Once the release is published, edit the [`composer.json`](https://github.com/City-of-Helsinki/helsinki-paatokset/blob/develop/composer.json) file of the paatokset drupal project to update the search app.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run create-release`

Creates a new release zip file in the `/dist` directory, which can be uploaded to github as a binary asset.

### `npm run dist`

Creates a release-ready bundle from from the project.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
