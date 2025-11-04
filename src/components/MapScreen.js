    //MAPSCREEN
    import React, { useEffect, useState, useRef } from 'react';
    import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Dimensions,
    Image,
    Linking,
    } from 'react-native';
    import MapView, { Marker } from 'react-native-maps';
    import * as Location from 'expo-location';
    import { useRoute } from '@react-navigation/native';
    import { Provider as PaperProvider } from 'react-native-paper';
    import ping from '../../assets/ping.png';    // Pin normal
    import ping2 from '../../assets/ping2.png';  // Pin distintivo para seleccionado

    export default function MapScreen() {
    const route = useRoute();
    const mapRef = useRef(null);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [vets, setVets] = useState([]);
    const [selectedVet, setSelectedVet] = useState(null);
    const [coordsFromParams, setCoordsFromParams] = useState(null);

    const screen = Dimensions.get('window');
    const buttonSize = Math.min(screen.width, screen.height) * 0.12;

    useEffect(() => {
        if (route.params) {
        const { latitude, longitude, name, address } = route.params;
        setCoordsFromParams({ latitude, longitude, name, description: address });
        setSelectedVet({ latitude, longitude, name, description: address });
        }
    }, [route.params]);

    useEffect(() => {
        let locationSubscription = null;

        const fetchVets = async (coords) => {
        try {
            const apiKey = 'b8399c69d26b475d94516ea032f155c2';
            const { latitude, longitude } = coords;
            const radius = 50000;

            const url = `https://api.geoapify.com/v2/places?categories=pet.veterinary&filter=circle:${longitude},${latitude},${radius}&bias=proximity:${longitude},${latitude}&limit=100&apiKey=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            const parsedVets = data.features.map((feature) => ({
            id: feature.properties.place_id,
            name: feature.properties.name || 'Veterinaria sin nombre',
            description:
                feature.properties.street ||
                feature.properties.address_line1 ||
                feature.properties.city ||
                'Ubicación no disponible',
            latitude: feature.geometry.coordinates[1],
            longitude: feature.geometry.coordinates[0],
            }));

            setVets(parsedVets);
        } catch (error) {
            console.error('Error al obtener veterinarias:', error);
            Alert.alert('Error', 'No se pudieron cargar las veterinarias cercanas.');
        }
        };

        if (!coordsFromParams) {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
            setErrorMsg('Permiso de ubicación denegado');
            return;
            }

            locationSubscription = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 10000,
                distanceInterval: 50,
            },
            (loc) => {
                setLocation(loc.coords);
                fetchVets(loc.coords);
            }
            );
        })();
        }

        return () => {
        if (locationSubscription) locationSubscription.remove();
        };
    }, [coordsFromParams]);

    const recenterMap = () => {
        const target = selectedVet || location;
        if (mapRef.current && target) {
        mapRef.current.animateToRegion({
            latitude: target.latitude,
            longitude: target.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        });
        }
    };

    if (errorMsg) {
        return (
        <View style={styles.container}>
            <Text style={styles.text}>{errorMsg}</Text>
        </View>
        );
    }

    if (!location && !coordsFromParams) {
        return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#006d5b" />
            <Text style={styles.text}>Cargando mapa...</Text>
        </View>
        );
    }

    return (
        <PaperProvider>
        <View style={styles.container}>
            <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            region={{
                latitude: selectedVet ? selectedVet.latitude : location.latitude,
                longitude: selectedVet ? selectedVet.longitude : location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}
            showsUserLocation
            showsMyLocationButton={false}
            >
            {vets.map((vet) => {
                const isSelected =
                selectedVet &&
                selectedVet.latitude === vet.latitude &&
                selectedVet.longitude === vet.longitude;

                return (
                <Marker
                    key={vet.id}
                    coordinate={{ latitude: vet.latitude, longitude: vet.longitude }}
                    onPress={() => setSelectedVet(vet)}
                    title={`🐾 ${vet.name}`}
                    description={vet.description}
                >
                    <Image
                    source={isSelected ? ping2 : ping}
                    style={styles.markerImage}
                    resizeMode="contain"
                    />
                </Marker>
                );
            })}
            </MapView>

            <TouchableOpacity
            style={[
                styles.recenterButton,
                {
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonSize / 2,
                bottom: screen.height * 0.15,
                right: screen.width * 0.05,
                },
            ]}
            onPress={recenterMap}
            >
            <Text style={styles.recenterText}>📍</Text>
            </TouchableOpacity>

            {selectedVet && (
            <TouchableOpacity
                style={styles.infoCard}
                activeOpacity={0.9}
                onPress={() =>
                Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${selectedVet.latitude},${selectedVet.longitude}`
                )
                }
            >
                <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedVet(null)}
                >
                <Text style={styles.closeText}>❌</Text>
                </TouchableOpacity>

                <View style={styles.cardHeader}>
                <Image source={ping} style={styles.cardIcon} />
                <Text style={styles.vetName}>{selectedVet.name}</Text>
                </View>

                <View style={styles.cardDivider} />

                <Text style={styles.vetDescription}>{selectedVet.description}</Text>
                <Text style={styles.link}>🗺️ Abrir en Google Maps</Text>

                <TouchableOpacity
                style={styles.hiddenRedirect}
                onPress={() =>
                    Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${selectedVet.latitude},${selectedVet.longitude}`
                    )
                }
                />
            </TouchableOpacity>
            )}
        </View>
        </PaperProvider>
    );
  }

  if (!location && !coordsFromParams) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#006d5b" />
        <Text style={styles.text}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          region={{
            latitude: selectedVet ? selectedVet.latitude : location.latitude,
            longitude: selectedVet ? selectedVet.longitude : location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {vets.map((vet) => {
            const isSelected =
              selectedVet &&
              selectedVet.latitude === vet.latitude &&
              selectedVet.longitude === vet.longitude;

            return (
              <Marker
                key={vet.id}
                coordinate={{ latitude: vet.latitude, longitude: vet.longitude }}
                onPress={() => setSelectedVet(vet)}
                title={`🐾 ${vet.name}`}
                description={vet.description}
              >
                <Image
                  source={isSelected ? ping2 : ping}
                  style={styles.markerImage}
                  resizeMode="contain"
                />
              </Marker>
            );
          })}
        </MapView>

        <TouchableOpacity
          style={[
            styles.recenterButton,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
              bottom: screen.height * 0.15,
              right: screen.width * 0.05,
            },
          ]}
          onPress={recenterMap}
        >
          <Text style={styles.recenterText}>📍</Text>
        </TouchableOpacity>

        {selectedVet && (
          <TouchableOpacity
            style={styles.infoCard}
            activeOpacity={0.9}
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${selectedVet.latitude},${selectedVet.longitude}`
              )
            }
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedVet(null)}
            >
              <Text style={styles.closeText}>❌</Text>
            </TouchableOpacity>

            <View style={styles.cardHeader}>
              <Image source={ping} style={styles.cardIcon} />
              <Text style={styles.vetName}>{selectedVet.name}</Text>
            </View>

            <View style={styles.cardDivider} />

            <Text style={styles.vetDescription}>{selectedVet.description}</Text>
            <Text style={styles.link}>🗺️ Abrir en Google Maps</Text>

            <TouchableOpacity
              style={styles.hiddenRedirect}
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${selectedVet.latitude},${selectedVet.longitude}`
                )
              }
            />
          </TouchableOpacity>
        )}
      </View>
    </PaperProvider>
  );
}

    const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    text: { fontSize: 20, color: '#666', textAlign: 'center', marginTop: 20 },
    recenterButton: {
        position: 'absolute',
        backgroundColor: '#007A63',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    recenterText: { fontSize: 24, color: '#fff' },
    markerImage: { width: 40, height: 40 },
    infoCard: {
        position: 'absolute',
        bottom: 60,
        left: 20,
        right: 20,
        padding: 20,
        borderRadius: 20,
        elevation: 6,
        backgroundColor: '#d6f5ec',
        borderWidth: 1,
        borderColor: '#00997a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    cardIcon: { width: 30, height: 30, marginRight: 10 },
    cardDivider: { height: 1, backgroundColor: '#00997a', marginVertical: 10 },
    vetName: { fontWeight: 'bold', fontSize: 20, color: '#004d40' },
    vetDescription: { fontSize: 15, color: '#333' },
    link: { marginTop: 12, fontSize: 14, color: '#007A63', fontWeight: '600' },
    closeButton: { position: 'absolute', top: 10, right: 10, zIndex: 10 },
    closeText: { fontSize: 18, color: '#999' },
    hiddenRedirect: { position: 'absolute', width: '100%', height: '100%', opacity: 0, pointerEvents: 'none' },
    });
