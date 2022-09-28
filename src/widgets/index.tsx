import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';

async function onActivate(plugin: ReactRNPlugin) {
  // Register settings
  await plugin.app.registerWidget('selected_image_search', WidgetLocation.SelectedTextMenu, {
    dimensions: {
      height: 'auto',
      width: '100%',
    },
    widgetTabIcon: 'https://cdn-icons-png.flaticon.com/512/2069/2069555.png',
    widgetTabTitle: 'Image Search',
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
