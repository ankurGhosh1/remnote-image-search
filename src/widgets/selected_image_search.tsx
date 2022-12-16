import { renderWidget } from '@remnote/plugin-sdk';
import GoogleMapRender from './components/GoogleMapRender';

function GoogleMaps() {
  let location = {
    address: 'location',
    lat: 0,
    lng: 0,
  };
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <GoogleMapRender apiKey="AIzaSyAsJNkMJGun80q3GUAFQEzUPMD0Rpr6zlk" location={location} />
    </div>
  )
}

renderWidget(GoogleMaps);
