import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { placesService } from '../services/placesService';

export default function MapScreen() {
  const [region, setRegion] = useState(null);
  const [veterinaries, setVeterinaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Error', 'Permiso de ubicación denegado');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      const userLoc = { latitude, longitude };

      setUserLocation(userLoc);
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      searchVeterinaries(latitude, longitude);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación');
      setLoading(false);
    }
  };

  const searchVeterinaries = async (latitude, longitude) => {
    try {
      setLoading(true);
      const results = await placesService.searchNearbyVeterinaries(latitude, longitude);

      const veterinariesWithDistance = results.map((vet) => ({
        ...vet,
        distance: placesService.calculateDistance(
          latitude,
          longitude,
          vet.geometry.location.lat,
          vet.geometry.location.lng
        ),
      }));

      veterinariesWithDistance.sort((a, b) => a.distance - b.distance);
      setVeterinaries(veterinariesWithDistance);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las veterinarias');
    } finally {
      setLoading(false);
    }
  };

  const refreshLocation = () => {
    getCurrentLocation();
  };

  if (loading || !region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
        toolbarEnabled={false}
        loadingEnabled={true}
        loadingIndicatorColor="#4ECDC4"
        loadingBackgroundColor="#ffffff"
      >
        {/* Marcador de usuario */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Tu ubicación"
            pinColor="blue"
          />
        )}

        {/* Marcadores de veterinarias */}
        {veterinaries.map((vet) => (
          <Marker
            key={vet.place_id}
            coordinate={{
              latitude: vet.geometry.location.lat,
              longitude: vet.geometry.location.lng,
            }}
            title={vet.name}
            description={`${vet.distance.toFixed(2)} km • ${vet.vicinity}`}
          >
            <View style={styles.markerContainer}>
              <Text style={styles.markerEmoji}>🏥</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Botón de refrescar */}
      <TouchableOpacity style={styles.refreshButton} onPress={refreshLocation}>
        <Text style={styles.refreshText}>🔄</Text>
      </TouchableOpacity>

      {/* Contador de veterinarias */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {veterinaries.length} veterinarias encontradas
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  markerContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerEmoji: {
    fontSize: 24,
  },
  refreshButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4ECDC4',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshText: {
    color: 'white',
    fontSize: 24,
  },
  counterContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  counterText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
});
