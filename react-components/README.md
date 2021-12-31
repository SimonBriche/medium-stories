# How to add React components to an Express powered website using Create React App
If you want a complete step-by-step tutorial, check the related Medium article : https://medium.com/@briche.simon/dev-irl-how-to-add-react-components-to-an-express-powered-website-using-create-react-app-336670c9261a

## Express server
This is a minimal template for a website powered by Node 16.x, ExpressJS and Pug template engine. Don't use it in production!
This server is only meant to demonstrate the usage of the `react-cmp` framework.

You can set the `REACT_PUBLIC_URL` environment variable at the very beginning of the `server.js` file to set the path of the `cmp-loader.js` you want to load in the `index.pug` template. 
Typically, the `REACT_PUBLIC_URL` must be an exact match of the `PUBLIC_URL` defined in the `.env` or `.env.development` files of the CRA, depending on the environment you want to test.

You can also use a `.env` file with `node-foreman` or the `dotenv` NPM package to store it.

### Usage
Run `npm install`, then `node server.js` and visit `http://localhost:3000/` to see the components in action.

### Loading specific components in a HTML page
- Add the `cmp-loader.js` file in your HTML page, e.g. `<script src="PATH_TO_YOUR_SCRIPT/cmp-loader.js"></script>`
- Add as many `div` elements you want, with the `__react-cmp` class and the name of the wanted component in the `data-react-component` attribute, e.g `<div class="__react-cmp" data-react-component="TestComponent1"></div>`
- Note that all the HTML attributes that begin with `data-` will be injected in the `props` of the React component, and accessible with a camel-case notation, e.g. `data-my-attr` will be accessible through `props.myAttr`.
- All the `div` should be the container of the component whose name is defined in the `data-react-component` attribute

## Create React App Components
The `react-cmp` folder contains an almost default Create React App. The only updates are:
- `src/index.js`: completely revamped for the component framework
- `src/TestComponent1.js` and `src/TestComponent2.js`: test components to illustrate the usage
- `public/cmp-loader.js`: a new file that loads the components engine

You can set a `.env` file as follows:
- `BROWSER`: Set to `none` to avoid opening a new browser window at startup
- `PORT`: Choose the port of the CRA server
- `INLINE_RUNTIME_CHUNK`: Set to `false` to avoid inline javascript in the `index.html` built file
- `BUILD_PATH`: Path to the folder where the production files will be built
- `PUBLIC_URL`: Path of the production files, absolute or relative to the server that host them. **Must match** the `REACT_PUBLIC_URL` of the Express server to test the components in a `production` environment.

You can set a `.env.development` file as follows:
- `BUILD_PATH`: Path to the folder where the development files will be built
- `PUBLIC_URL`: Path of the development files, absolute or relative to the server that host them. **Must match** the `REACT_PUBLIC_URL` of the Express server to test the components in a `development` environment.

You can set a `.env.development.local` file as follows:
- `REACT_APP_RENDER_CMP`: Names of the components you want to test with the CRA server, comma separated. e.g. `"TestComponent1,TestComponent2"`
- `REACT_APP_RENDER_CMP_WITH_ATTRS`: Components you want to test with the CRA server, as a JSON representation of an array of objects like `{"class":"NAME_OF_THE_COMPONENT", "data":{"data-attribute-name-1":"DATA_ATTRIBUTE_VALUE_1","data-attribute-name-2":"DATA_ATTRIBUTE_VALUE_2"}}`. e.g. `"[{"class":"TestComponent1","data":{"data-test-attribute":"test attribute value"}}]"`

### Usage
Run `npm install` in the `react-cmp` folder, then `npm start` and visit `http://localhost:4200/` to see the components defined in the `.env.development.local` files.
If nothing is defined in the `REACT_APP_RENDER_CMP` or `REACT_APP_RENDER_CMP_WITH_ATTRS` variables, or if there is no `.env.development.local` file, **nothing will be shown**.

### Development
To add more components, create them in the `src` folder and add them in the `src/index.js` file, as lazy imported modules in the `apps` variable. 
Then, add their names in the `REACT_APP_RENDER_CMP` or `REACT_APP_RENDER_CMP_WITH_ATTRS` variables of the `.env.development.local` file, whether or not you need attributes to be injected.
Run `npm start` and visit `http://localhost:4200/` to see the components in action.

Once you have finished to develop your components, you can run `npm run build:development` to test them in a development environment within the Express server. Don't forget to update the `REACT_PUBLIC_URL` environment variable to match the development one!

Once everything is OK, you can run `npm run build` and the files will be available for the production environment.

### Bridge events
You can pass events across components with the `props.bridgeEvent` object:
- Create a new event in a component with the `CustomEvent` constructor
- Populate the `detail` property of the event with anything you want
- Dispatch the event with the `props.bridgeEvent` object

Example:
```
const someEvent = new CustomEvent("onSomeEvent", {
  detail: {
    my_prop: "my_val"
  }
});
props.bridgeEvent.dispatchEvent(someEvent);

```
In an other component, listen to the event with the `props.bridgeEvent` object, and handle it.

Example:
```
props.bridgeEvent.addEventListener("onSomeEvent", function(e){
  console.log('here is my_prop:', e.detail.my_prop);
});
```

### CDN Hosting
You can host your production components files in a CDN if you want to:
- Set the `PUBLIC_URL` of the CRA `.env` file to your CDN path, e.g. `PUBLIC_URL="https://your-cdn-solution.com/react-cmp/production"`
- Run `npm run build`
- Upload the whole folder defined in the `BUILD_PATH` variable to your CDN
- Load the CDN hosted `cmp-loader.js` script in your HTML page, e.g. `<script src="https://your-cdn-solution.com/react-cmp/production/cmp-loader.js"></script>` (check your CSP and your CORS!)
- All the components should load in the `div`s that have a `__react-cmp` class and a properly set `data-react-component` property