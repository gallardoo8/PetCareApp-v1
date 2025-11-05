import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
  Platform,
  Linking,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { placesService } from '../services/placesService';
import { mapStyles } from '../styles/mapStyles';
import { colors } from '../styles/colors';

export default function MapScreen() {
  const [region, setRegion] = useState(null);
  const [veterinaries, setVeterinaries] = useState([]);
  const [filteredVets, setFilteredVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVet, setSelectedVet] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const mapRef = useRef(null);
  const cardAnimation = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    filterVeterinaries();
  }, [searchQuery, activeFilter, veterinaries]);

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
      setFilteredVets(veterinariesWithDistance);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las veterinarias');
    } finally {
      setLoading(false);
    }
  };

  const filterVeterinaries = () => {
    let filtered = [...veterinaries];

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter((vet) =>
        vet.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (activeFilter === 'emergency') {
      filtered = filtered.filter((vet) => vet.opening_hours?.open_now);
    } else if (activeFilter === 'near') {
      filtered = filtered.filter((vet) => vet.distance <= 2);
    }

    setFilteredVets(filtered);
  };

  const handleMarkerPress = (vet) => {
    setSelectedVet(vet);
    
    // Animar aparición de la card
    Animated.spring(cardAnimation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    // Centrar mapa en el marcador
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: vet.geometry.location.lat,
        longitude: vet.geometry.location.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const handleCloseCard = () => {
    Animated.timing(cardAnimation, {
      toValue: -200,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedVet(null));
  };

  const handleCall = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Información', 'No hay número disponible');
    }
  };

  const handleNavigate = (lat, lng) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}`,
    });
    Linking.openURL(url);
  };

  const centerToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  if (loading || !region) {
    return (
      <View style={mapStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={mapStyles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={mapStyles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={mapStyles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
        toolbarEnabled={false}
      >
        {filteredVets.map((vet) => (
          <Marker
            key={vet.place_id}
            coordinate={{
              latitude: vet.geometry.location.lat,
              longitude: vet.geometry.location.lng,
            }}
            onPress={() => handleMarkerPress(vet)}
          >
            <View style={mapStyles.markerContainer}>
              <View style={[
                mapStyles.markerIcon,
                vet.opening_hours?.open_now && mapStyles.markerIconEmergency
              ]}>
                <Ionicons 
                  name="medical" 
                  size={20} 
                  color={colors.surface} 
                />
              </View>
              {vet.distance <= 1 && (
                <View style={mapStyles.markerLabel}>
                  <Text style={mapStyles.markerLabelText}>
                    {vet.distance.toFixed(1)} km
                  </Text>
                </View>
              )}
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Barra de búsqueda */}
      <View style={mapStyles.searchContainer}>
        <View style={mapStyles.searchBar}>
          <Ionicons 
            name="search" 
            size={20} 
            color={colors.textSecondary} 
            style={mapStyles.searchIcon}
          />
          <TextInput
            style={mapStyles.searchInput}
            placeholder="Buscar veterinaria..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity 
              style={mapStyles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={mapStyles.locationButton}
          onPress={centerToUserLocation}
        >
          <Ionicons name="locate" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={mapStyles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={mapStyles.filterScroll}
        >
          <TouchableOpacity
            style={[
              mapStyles.filterChip,
              activeFilter === 'all' && mapStyles.filterChipActive
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Ionicons 
              name="grid" 
              size={16} 
              color={activeFilter === 'all' ? colors.surface : colors.textPrimary}
            />
            <Text style={[
              mapStyles.filterText,
              activeFilter === 'all' && mapStyles.filterTextActive
            ]}>
              Todas ({veterinaries.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              mapStyles.filterChip,
              activeFilter === 'emergency' && mapStyles.filterChipActive
            ]}
            onPress={() => setActiveFilter('emergency')}
          >
            <Ionicons 
              name="alert-circle" 
              size={16} 
              color={activeFilter === 'emergency' ? colors.surface : colors.secondary}
            />
            <Text style={[
              mapStyles.filterText,
              activeFilter === 'emergency' && mapStyles.filterTextActive
            ]}>
              Emergencia
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              mapStyles.filterChip,
              activeFilter === 'near' && mapStyles.filterChipActive
            ]}
            onPress={() => setActiveFilter('near')}
          >
            <Ionicons 
              name="location" 
              size={16} 
              color={activeFilter === 'near' ? colors.surface : colors.primary}
            />
            <Text style={[
              mapStyles.filterText,
              activeFilter === 'near' && mapStyles.filterTextActive
            ]}>
              Cercanas
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Card de información */}
      {selectedVet && (
        <Animated.View 
          style={[
            mapStyles.infoCard,
            { transform: [{ translateY: cardAnimation }] }
          ]}
        >
          <View style={mapStyles.infoHeader}>
            <Text style={mapStyles.infoTitle}>{selectedVet.name}</Text>
            {selectedVet.opening_hours?.open_now && (
              <View style={mapStyles.infoBadge}>
                <Text style={mapStyles.infoBadgeText}>ABIERTO</Text>
              </View>
            )}
            <TouchableOpacity onPress={handleCloseCard}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={mapStyles.infoAddress} numberOfLines={2}>
            {selectedVet.vicinity}
          </Text>

          <View style={mapStyles.infoDetails}>
            <View style={mapStyles.infoDetail}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <Text style={mapStyles.infoDetailText}>
                {selectedVet.distance.toFixed(2)} km
              </Text>
            </View>
            {selectedVet.rating && (
              <View style={mapStyles.infoDetail}>
                <Ionicons name="star" size={16} color={colors.warning} />
                <Text style={mapStyles.infoDetailText}>
                  {selectedVet.rating}
                </Text>
              </View>
            )}
          </View>

          <View style={mapStyles.infoActions}>
            <TouchableOpacity
              style={[mapStyles.infoButton, mapStyles.infoButtonPrimary]}
              onPress={() => handleCall(selectedVet.formatted_phone_number)}
            >
              <Ionicons name="call" size={18} color={colors.surface} />
              <Text style={mapStyles.infoButtonText}>Llamar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[mapStyles.infoButton, mapStyles.infoButtonSecondary]}
              onPress={() => handleNavigate(
                selectedVet.geometry.location.lat,
                selectedVet.geometry.location.lng
              )}
            >
              <Ionicons name="navigate" size={18} color={colors.surface} />
              <Text style={mapStyles.infoButtonText}>Ir</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}