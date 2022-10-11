const searchScript = () => {
  const script = document.createElement('script');
  script.src = 'https://cse.google.com/cse.js?cx=001279009512387798921:dgxbby1t0ge';
  script.id = 'searchScript';
  document.body.appendChild(script);

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
