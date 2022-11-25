const searchScript = () => {
  const script = document.createElement('script');
  script.src = 'https://cse.google.com/cse.js?cx=001279009512387798921:dgxbby1t0ge';
  script.id = 'searchScript';
  script.async = true;
  script.type = 'text/javascript';
  document.head.appendChild(script);
  console.log(script);
  script.onload = async () => {
    window.__gcse.searchCallbacks = {
      web: {
        rendered: 'myWebResultsRenderedCallback',
      },
      image: {
        rendered: 'myWebResultsRenderedCallback',
      },
    };
    // console.log(window.__gcse.searchCallbacks.web);
  };
};

export default searchScript;
