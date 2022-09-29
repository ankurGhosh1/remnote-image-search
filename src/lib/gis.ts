import cheerio from 'cheerio'

const imageFileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];

// Using a self-hosted CORS proxy server to get around CORS errors
// https://github.com/Rob--W/cors-anywhere

export const cors_api_host = "cors-s4vm.onrender.com"
export const cors_api_url = 'https://' + cors_api_host + '/';

(function() {
   var slice = [].slice;
   var origin = window.location.protocol + '//' + window.location.host;
   var open = XMLHttpRequest.prototype.open;
   XMLHttpRequest.prototype.open = function() {
   var args = slice.call(arguments);
   var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
   if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
       targetOrigin[1] !== cors_api_host) {
       args[1] = cors_api_url + args[1];
   }
   return open.apply(this, args);
 };
})();

/**
 * Async version of g-i-s module
 * Taken from: https://github.com/Akif9748/async-g-i-s/blob/master/index.js
 */
export async function gis(searchTerm: string, query = {}, filterOutDomains = ['gstatic.com'], disableDoubleHTTP = true) {

  if (!searchTerm) throw new TypeError("searchTerm is missing.");
  try {

    const url = `${cors_api_url}https://images.google.com/search?${new URLSearchParams({ ...query, tbm: "isch", q: searchTerm })}`
    console.log("req url", url)
    const body = await fetch(url, {
      headers: {
        // important: 403 forbidden unless you set this
        "X-Requested-With": "XMLHttpRequest",
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
      }
    }).then(res => res.text());

    const scripts = cheerio.load(body)('script');
    const scriptContents = [];

    for (const script of scripts)
      if (script.children?.length) {

        const content = script.children[0].data;

        if (imageFileExtensions.some(a => content.toLowerCase().includes(a)))
          scriptContents.push(content);
      }

    return scriptContents.map(content => {

      const results = [];
      const regex = /\["(http.+?)",(\d+),(\d+)\]/g;

      let result;

      while ((result = regex.exec(content)) !== null)
        if (result.length > 3 && filterOutDomains.every(skipDomain => !result[1].includes(skipDomain)))
          results.push({
            url: disableDoubleHTTP ? `http${result[1].split("http")[1]}` : result[1],
            height: +result[2],
            width: +result[3]
          });

      return results;

    }).flat();
  } catch (e) {
    console.error(e);
    return null;
  }

}
