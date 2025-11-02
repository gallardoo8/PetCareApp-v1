// EmergencyFullScreen.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  FlatList,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  Image
} from 'react-native';

// Habilita animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function EmergencyFullScreen() {
  const [showList, setShowList] = useState(false);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    if (showList) {
      const fetchVets = async () => {
        try {
          const apiKey = 'b8399c69d26b475d94516ea032f155c2';
          const latitude = 20.6224429;
          const longitude = -100.4944135;
          const radius = 50000;

          const url = `https://api.geoapify.com/v2/places?categories=pet.veterinary&filter=circle:${longitude},${latitude},${radius}&limit=100&apiKey=${apiKey}`;
          const response = await fetch(url);
          const data = await response.json();

          const parsed = data.features.map((feature) => {
            const p = feature.properties || {};
            const raw = p.datasource?.raw || {};
            return {
              id: p.place_id || feature.id,
              name: p.name || 'Veterinaria sin nombre',
              address:
                p.formatted ||
                p.address_line1 ||
                p.street ||
                p.city ||
                raw.address ||
                'Dirección no disponible',
              city: p.city || '',
              phone: p.tel || raw.phone || raw.contact_phone || null,
              website: p.website || raw.website || raw.contact_website || null,
              openingHours: p.opening_hours || raw.opening_hours || 'No especificado',
              lat: p.lat || feature.geometry?.coordinates?.[1] || null,
              lon: p.lon || feature.geometry?.coordinates?.[0] || null,
              distance: p.distance ? `${p.distance} m` : null,
              formatted: p.formatted || '',
            };
          });

          setVets(parsed);
        } catch (error) {
          console.error('Error al obtener veterinarias:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchVets();
    }
  }, [showList]);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const goToMap = (lat, lon, name, address) => {
    if (!lat || !lon) {
      const fallback = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address || name
      )}`;
      Linking.openURL(fallback);
      return;
    }
    const url = `https://www.google.com/maps?q=${lat},${lon}`;
    Linking.openURL(url);
  };

  const renderItem = ({ item }) => {
    const expanded = expandedId === item.id;

    return (
      <TouchableOpacity
        onPress={() => toggleExpand(item.id)}
        activeOpacity={0.85}
        style={styles.cardTouchable}
      >
        <View style={styles.card}>
          <Text style={styles.name}>🐾 {item.name}</Text>

          {expanded && (
            <View style={styles.details}>
              <Text style={styles.label}>📍 Dirección:</Text>
              <Text style={styles.value}>{item.address}</Text>

              {item.city ? (
                <>
                  <Text style={styles.label}>🏙️ Ciudad:</Text>
                  <Text style={styles.value}>{item.city}</Text>
                </>
              ) : null}

              {item.phone ? (
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone}`)}>
                  <Text style={[styles.value, styles.link]}>📞 {item.phone}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.value}>📵 Teléfono no disponible</Text>
              )}

              {item.website ? (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(item.website.startsWith('http') ? item.website : `https://${item.website}`)
                  }
                >
                  <Text style={[styles.value, styles.link]}>🌐 {item.website}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.value}>🔗 Sitio web no disponible</Text>
              )}

              <Text style={styles.label}>⏰ Horarios:</Text>
              <Text style={styles.value}>{item.openingHours}</Text>

              {item.distance && (
                <>
                  <Text style={styles.label}>📏 Distancia:</Text>
                  <Text style={styles.value}>{item.distance}</Text>
                </>
              )}

              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => goToMap(item.lat, item.lon, item.name, item.address)}
              >
                <Text style={styles.mapButtonText}>📍 Ver ubicación</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // PANTALLA INICIAL
  if (!showList) {
    return (
      <View style={styles.initialContainer}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>✱</Text>
        </View>

        <Text style={styles.title}>Emergencia</Text>
        <Text style={styles.description}>
          Presiona el botón para localizar la clínica veterinaria 24/7 más cercana y obtener
          indicaciones rápidas.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowList(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>📍 Localizar clínica</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // LISTA DE VETERINARIAS
  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { marginTop: screenHeight * 0.05 }]}>
        <Text style={styles.header}>Veterinarias cercanas 🐶</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#006d5b" />
      ) : (
        <FlatList
          data={vets}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  initialContainer: {
    flex: 1,
    backgroundColor: '#f2f8f7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e6e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 60,
    color: '#808080',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  description: {
    textAlign: 'center',
    color: '#555',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#24c0a6',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  // --- Lista de veterinarias ---
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d40',
    textAlign: 'center',
  },
  cardTouchable: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#d6f5ec',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#00997a',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#006d5b',
  },
  details: {
    marginTop: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#004d40',
    marginTop: 8,
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  link: {
    color: '#00997a',
    textDecorationLine: 'underline',
  },
  mapButton: {
    marginTop: 12,
    backgroundColor: '#00997a',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
