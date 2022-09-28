import { usePlugin, renderWidget, useTracker } from '@remnote/plugin-sdk';

export const ImageSearch = () => {
  return <h1 className="text-xl">Sample Plugin</h1>;
};

renderWidget(ImageSearch);
