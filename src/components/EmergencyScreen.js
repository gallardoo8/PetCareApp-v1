import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { placesService } from '../services/placesService';

export default function EmergencyScreen() {
  const [veterinaries, setVeterinaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);

  const handleLocateEmergencyVets = async () => {
    try {
      setLoading(true);
      setShowList(true);

      // Solicitar permisos
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesita permiso de ubicación');
        setLoading(false);
        return;
      }

      // Obtener ubicación actual
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // Buscar veterinarias 24/7
      const results = await placesService.search24HourVeterinaries(latitude, longitude);

      // Agregar distancia
      const vetsWithDistance = results.map((vet) => ({
        ...vet,
        distance: placesService.calculateDistance(
          latitude,
          longitude,
          vet.geometry.location.lat,
          vet.geometry.location.lng
        ),
      }));

      // Ordenar por distancia
      vetsWithDistance.sort((a, b) => a.distance - b.distance);

      setVeterinaries(vetsWithDistance);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudieron cargar las veterinarias');
    } finally {
      setLoading(false);
    }
  };

  const handleCallVet = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert('Información', 'No hay número de teléfono disponible');
    }
  };

  const handleNavigate = (lat, lng) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}`,
    });
    Linking.openURL(url);
  };

  const renderVeterinaryItem = ({ item }) => (
    <View style={styles.vetCard}>
      <View style={styles.vetHeader}>
        <Text style={styles.vetName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.opening_hours?.open_now && (
          <View style={styles.openBadge}>
            <Text style={styles.openText}>ABIERTO</Text>
          </View>
        )}
      </View>

      <Text style={styles.vetAddress} numberOfLines={2}>
        {item.formatted_address || item.vicinity}
      </Text>

      <View style={styles.vetInfo}>
        <Text style={styles.distance}>📍 {item.distance.toFixed(2)} km</Text>
        {item.rating && <Text style={styles.rating}>⭐ {item.rating}</Text>}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton]}
          onPress={() => handleCallVet(item.formatted_phone_number)}
        >
          <Text style={styles.buttonText}>📞 Llamar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.navigateButton]}
          onPress={() =>
            handleNavigate(item.geometry.location.lat, item.geometry.location.lng)
          }
        >
          <Text style={styles.buttonText}>🗺️ Ir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {!showList ? (
        <View style={styles.emergencyContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.emergencyIcon}>✱</Text>
          </View>

          <Text style={styles.title}>Emergencia</Text>

          <Text style={styles.description}>
            Presiona el botón para localizar la{'\n'}
            clínica veterinaria 24/7 más{'\n'}
            cercana y obtener indicaciones{'\n'}
            rápidas.
          </Text>

          <TouchableOpacity
            style={styles.locateButton}
            onPress={handleLocateEmergencyVets}
          >
            <Text style={styles.locateIcon}>➤</Text>
            <Text style={styles.locateText}>Localizar clínica</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Veterinarias de Emergencia</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowList(false)}
            >
              <Text style={styles.backText}>← Volver</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4ECDC4" />
              <Text style={styles.loadingText}>Buscando veterinarias...</Text>
            </View>
          ) : veterinaries.length > 0 ? (
            <FlatList
              data={veterinaries}
              keyExtractor={(item) => item.place_id}
              renderItem={renderVeterinaryItem}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No se encontraron veterinarias cercanas
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleLocateEmergencyVets}
              >
                <Text style={styles.retryText}>🔄 Intentar de nuevo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  emergencyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  emergencyIcon: {
    fontSize: 80,
    color: '#A0A0A0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  locateButton: {
    backgroundColor: '#4ECDC4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  locateIcon: {
    fontSize: 24,
    color: 'white',
    marginRight: 10,
    transform: [{ rotate: '45deg' }],
  },
  locateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  backButton: {
    padding: 5,
  },
  backText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 15,
  },
  vetCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  vetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  vetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  openBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  openText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  vetAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  vetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  distance: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  rating: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#4ECDC4',
  },
  navigateButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});