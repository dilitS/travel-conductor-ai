/**
 * TripMapBackground - Native-only map component
 * This file is only imported on native platforms
 */

import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { colors } from '@/theme';
import { Step } from '@/types/step';
import { Place } from '@/types/place';

// Dark map style for better integration with app theme
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#255763' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#023e58' }] },
];

interface TripMapBackgroundProps {
  region: Region;
  steps: Step[];
  places: Map<string, Place>;
}

export function TripMapBackground({ region, steps, places }: TripMapBackgroundProps) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mapRef.current && region) {
      mapRef.current.animateToRegion(region, 500);
    }
  }, [region]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={region}
      showsUserLocation
      showsMyLocationButton={false}
      showsCompass={false}
      customMapStyle={darkMapStyle}
    >
      {steps
        .filter(s => s.type === 'visit' && 'place_id' in s)
        .map((step) => {
          const placeId = (step as { place_id: string }).place_id;
          const place = places.get(placeId);
          if (!place) return null;
          return (
            <Marker
              key={step.step_id}
              coordinate={{ latitude: place.lat, longitude: place.lon }}
              title={place.name}
              pinColor={colors.green.primary}
            />
          );
        })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});

