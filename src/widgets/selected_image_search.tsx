import { usePlugin, renderWidget, useTracker, SelectionType } from '@remnote/plugin-sdk';
import React from 'react';
import GoogleMapReact from 'google-map-react';
import GoogleMapRender from './components/GoogleMapRender';

function cleanSelectedText(s?: string) {
  return (
    s
      // Remove leading and trailing whitespace
      ?.trim()
      // Split on whitespace and take the first word
      ?.split(/(\s+)/)[0]
      // This removes non-alphabetic characters
      // including Chinese characters, Cyrillic etc.
      // But the Dictionary API in this plugin only
      // works with English, so this is okay.
      ?.replaceAll(/[^a-zA-Z]/g, '')
  );
}

// We use the `useDebounce` hook to limit the number of API calls
// made to the dictionary API to avoid getting rate limited by the API
export function useDebounce<T>(value: T, msDelay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, msDelay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, msDelay]);
  return debouncedValue;
}
export const AnyReactComponent = ({ text }: any) => <div>{text}</div>;

function GoogleMaps() {
  const plugin = usePlugin();

  // This stores the response from the dictionary API.
  const [wordData, setWordData] = React.useState<string>();
  let location = {
    address: 'location',
    lat: 0,
    lng: 0,
  };
  // By wrapping the call to `useTracker` in
  // `useDebounce`, the `selTextRichText` value will only get set
  // *after* the user has stopped changing the selected text for 0.5 seconds.
  // Since the API gets called every time the value of `selTextRichText` /
  // `selText` change, debouncing limits unnecessary API calls.
  // API key: AIzaSyAsJNkMJGun80q3GUAFQEzUPMD0Rpr6zlk
  const searchTerm = useDebounce(
    useTracker(async (reactivePlugin) => {
      const sel = await reactivePlugin.editor.getSelection();
      if (sel?.type == SelectionType.Text) {
        plugin.richText.toString(sel.richText).then((data) => {
          const [lat, lng] = data.split(' ');
          console.log(lat, lng);
          location.lat = +lat;
          location.lng = +lng;
          console.log(location);
        });

        // return cleanSelectedText(await plugin.richText.toString(sel.richText));
        return (
          <div style={{ height: '100%', width: '100%' }}>
            <GoogleMapRender key="AIzaSyAsJNkMJGun80q3GUAFQEzUPMD0Rpr6zlk" location={location} />
          </div>
        );
      } else {
        return undefined;
      }
    }),
    500
  );

  // When the selText value changes, and it is not null or undefined,
  // call the dictionary API to get the definition of the selText.

  // React.useEffect(() => {
  //   const getAndSetData = async () => {
  //     if (!searchTerm) {
  //       return;
  //     }
  //     try {
  //       const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
  //       const response = await fetch(url + searchTerm);
  //       const json = await response.json();
  //       setWordData(Array.isArray(json) ? json[0] : undefined);
  //     } catch (e) {
  //       console.log('Error getting dictionary info: ', e);
  //     }
  //   };

  //   getAndSetData();
  // }, [searchTerm]);

  return <pre>{JSON.stringify(wordData, null, 2)}</pre>;
}

renderWidget(GoogleMaps);
