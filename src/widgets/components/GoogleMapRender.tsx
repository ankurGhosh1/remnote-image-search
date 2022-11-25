import React from 'react';
import GoogleMapReact from 'google-map-react';

interface LocationText {
  text: string;
}

interface LocationProps {
  address: string;
  lat: number;
  lng: number;
}

interface IProps {
  key: string;
  location: LocationProps;
  defaultZoom?: number;
}

export const LocationPin = function ({ text }: LocationText) {
  return <div>{text}</div>;
};

function GoogleMapRender(props: IProps) {
  const { key, location, defaultZoom = 13 } = props;
  return (
    <div>
      <h1>{key}</h1>
      <code>{location}</code>
      <h3>{defaultZoom}</h3>

      <GoogleMapReact
        bootstrapURLKeys={{ key: key }}
        defaultCenter={location}
        defaultZoom={defaultZoom}
      >
        <LocationPin text="location" />
      </GoogleMapReact>
    </div>
  );
}

export default GoogleMapRender;
