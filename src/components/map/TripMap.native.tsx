import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { CustomMarker } from './CustomMarker';
import { Step, VisitStep, isVisitStep } from '@/types';
import { Place } from '@/types/place';
import { colors, layout, spacing, typography } from '@/theme';

interface TripMapProps {
  steps: Step[];
  places: Map<string, Place>;
}

export function TripMap({ steps, places }: TripMapProps) {
  // Filter only visit steps with place data
  const visitSteps = steps.filter(isVisitStep) as VisitStep[];
  const stepsWithLocation = visitSteps.filter(step => {
    const place = places.get(step.place_id);
    return place?.lat && place?.lon;
  });

  if (stepsWithLocation.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Brak lokalizacji do wyświetlenia.</Text>
      </View>
    );
  }

  // Calculate region from places
  const coords = stepsWithLocation.map(step => {
    const place = places.get(step.place_id)!;
    return { lat: place.lat, lon: place.lon };
  });
  
  const lats = coords.map(c => c.lat);
  const lngs = coords.map(c => c.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  
  const deltaLat = (maxLat - minLat) * 1.5; // Add padding
  const deltaLng = (maxLng - minLng) * 1.5;

  const initialRegion = {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(0.05, deltaLat),
    longitudeDelta: Math.max(0.05, deltaLng),
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        initialRegion={initialRegion}
      >
        {stepsWithLocation.map((step, index) => {
          const place = places.get(step.place_id)!;
          return (
            <Marker
              key={step.step_id}
              coordinate={{
                latitude: place.lat,
                longitude: place.lon,
              }}
              title={place.name}
              description={step.notes ?? undefined}
            >
              <CustomMarker number={index + 1} />
              
              <Callout tooltip>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{place.name}</Text>
                  <Text style={styles.calloutTime}>{step.planned_start}</Text>
                  <View style={styles.calloutButton}>
                    <Text style={styles.calloutButtonText}>Nawiguj</Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
  },
  emptyText: {
    ...typography.styles.body,
    color: colors.text.tertiary,
  },
  callout: {
    backgroundColor: colors.background.secondary,
    padding: spacing[3],
    borderRadius: layout.radius.md,
    width: 200,
    borderColor: colors.border.default,
    borderWidth: 1,
  },
  calloutTitle: {
    ...typography.styles.body,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  calloutTime: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  calloutButton: {
      backgroundColor: colors.green.primary,
      paddingVertical: 6,
      borderRadius: 4,
      alignItems: 'center'
  },
  calloutButtonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold'
  }
});

