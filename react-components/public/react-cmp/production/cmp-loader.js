(async () => {
  const head = document.getElementsByTagName('head')[0];
  const scriptSrcRegexp = new RegExp('<script.*?src="(.*?)"', 'gmi');

  //get the exact script's src as defined in the src attribute
  const scriptSrc = scriptSrcRegexp.exec(document.currentScript.outerHTML);
  //all the resources should be relative to the path of this script
  const resourcesPath = (scriptSrc && scriptSrc.length > 1) ? scriptSrc[1].replace('cmp-loader.js', '') : '';

  //get the index content
  const indexHTML = await (await fetch(resourcesPath+'index.html', {cache:'reload'})).text();

  //assume that all the .js and .css files to load are in the "static" folder
  const reactCSSRegexp = new RegExp(`<link href="${resourcesPath}static\/css\/(.*?)\.css" rel="stylesheet">`, 'gm');
  const reactJSRegexp = new RegExp(`<script (.*?) src="${resourcesPath}static\/js\/(.*?)\.js"><\/script>`, 'gm');

  //grab all the css tags
  const ReactCSS = [].concat(indexHTML.match(reactCSSRegexp)).join('');
  //grab all the js tags
  const ReactJS = [].concat(indexHTML.match(reactJSRegexp)).join('');

  //parse and execute the scripts
  const scriptsDoc = new DOMParser().parseFromString(ReactJS, 'text/html');
  Array.from(scriptsDoc.getElementsByTagName('script')).forEach(item => {
    const script = document.createElement('script');
    [...item.attributes].forEach(attr => {
      script.setAttribute(attr.name, attr.value)
    })
    head.appendChild(script);
  });
  //inject the CSS
  head.insertAdjacentHTML('beforeend', ReactCSS);
})().catch(e => {
  console.log('fail to load react-cmp', e)
});