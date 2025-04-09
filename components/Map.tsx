import React from 'react';
import { View, Text } from 'react-native';
import MapView, {PROVIDER_DEFAULT} from "react-native-maps";

const Map = () => {
  return (
      <MapView
          provider={PROVIDER_DEFAULT}
          className="w-full h-full rounded-2xl"

      >
      </MapView>
  );
};

export default Map;
