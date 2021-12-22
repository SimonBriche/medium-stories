import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

//list here all the components that can be inserted in a web page
const apps = {
  'App': React.lazy(() => import('./App')),
  'TestComponent1': React.lazy(() => import('./TestComponent1')),
  'TestComponent2': React.lazy(() => import('./TestComponent2')),
}

//event manager to communicate between the components
const bridgeEvent = new EventTarget();
//common fallback for all the components
function Fallback() {
  return <div>Loading...</div>;
}
const renderAppInElement = (el) => {
  if(apps[el.dataset.reactComponent] && !el.dataset.rendered){
    //get the component's name stored in the data-react-component attribute
    const App = apps[el.dataset.reactComponent];
    //render the component, inject all the HTML attributes and the Event bridge
    ReactDOM.render(
      <Suspense fallback={<Fallback />}>
        <App  {...el.dataset} bridgeEvent={bridgeEvent}/>
      </Suspense>
    , el);
    el.dataset.rendered = true;
  }
  else if(el.dataset.rendered){
    console.log('el', el, 'is already rendered')
  }
}

//ONLY FOR THE DEV PHASE
const rootEl = document.getElementById('root');
//generate components without attributes
if(process.env.REACT_APP_RENDER_CMP){
  const components = process.env.REACT_APP_RENDER_CMP.split(',');
  
  components.forEach(item => {
    const componentEl = document.createElement('div');
    componentEl.setAttribute("data-react-component", item);
    componentEl.className = "__react-cmp";
    rootEl.append(componentEl);
  });
}
//generate components with attributes
if(process.env.REACT_APP_RENDER_CMP_WITH_ATTRS){
  let componentsWithAttrs;
  try{
    componentsWithAttrs = JSON.parse(process.env.REACT_APP_RENDER_CMP_WITH_ATTRS);
  }
  catch(e){
    console.log('fail to parse REACT_APP_RENDER_CMP_WITH_ATTRS', e);
  }
  if(componentsWithAttrs){
    componentsWithAttrs.forEach(cmp => {
      const componentEl = document.createElement('div');
      componentEl.setAttribute("data-react-component", cmp.class);
      componentEl.className = "__react-cmp";
      Object.keys(cmp.data).forEach(attrKey => {
        componentEl.setAttribute(attrKey, cmp.data[attrKey]);
      });
      rootEl.append(componentEl);
    });
  }
}

//the default name of the global object is ReactComponents, but it could be customized via the REACT_APP_NAMESPACE environment variable
const appNamespace = process.env.REACT_APP_NAMESPACE || "ReactComponents";
window[appNamespace] = {
  ready: false,
  parseComponents(container){
    //parse the container or the whole document and inject all the components in the containers that have a "__react-cmp" class
    (container || document)
    .querySelectorAll('.__react-cmp')
    .forEach(renderAppInElement);
  }
}
window[appNamespace].parseComponents();
window[appNamespace].ready = true;

//if dynamic parsing must be done via the window.ReactComponents.parseComponents() method
//check the availability of window.ReactComponents object via window.ReactComponents.ready property
//or define a window.ReactComponentsAsyncInit() method to be notified of the availability
if(typeof window[`${appNamespace}AsyncInit`] === 'function'){
  window[`${appNamespace}AsyncInit`]();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();