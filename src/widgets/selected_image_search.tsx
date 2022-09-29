import { usePlugin, renderWidget, useTracker, SelectionType } from '@remnote/plugin-sdk';
import React from 'react';
import {gis} from '../lib/gis';

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

function ImageSearch() {
  const plugin = usePlugin();

  // This stores the response from the dictionary API.
  const [wordData, setWordData] = React.useState<string>();

  // By wrapping the call to `useTracker` in
  // `useDebounce`, the `selTextRichText` value will only get set
  // *after* the user has stopped changing the selected text for 1.5 seconds.
  // Since the API gets called every time the value of `selTextRichText` /
  // `selText` change, debouncing limits unnecessary API calls and hopefully
  // prevents us from getting rate limited.
  const searchTerm = useDebounce(
    useTracker(async (reactivePlugin) => {
      const sel = await reactivePlugin.editor.getSelection();
      if (sel?.type == SelectionType.Text) {
        return cleanSelectedText(await plugin.richText.toString(sel.richText));
      } else {
        return undefined;
      }
    }),
    1500
  );

  // When the selText value changes, and it is not null or undefined,
  // call the dictionary API to get the definition of the selText.
  React.useEffect(() => {
    const getAndSetData = async () => {
      try {
        if (!searchTerm) {
          return;
        }
        const results = await gis(searchTerm)
        if (!results) {
          return
        }
        console.log(results);
      } catch (e) {
        console.log('Error getting images', e)
      }
    }

    getAndSetData();
  }, [searchTerm]);

  return <pre>{JSON.stringify(wordData, null, 2)}</pre>;
}

renderWidget(ImageSearch);
