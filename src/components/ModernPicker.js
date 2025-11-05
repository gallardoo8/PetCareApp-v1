import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    TextInput,
    StyleSheet,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModernPicker = ({ 
    visible, 
    onClose, 
    items, 
    onSelect, 
    selectedValue, 
    title = "Seleccionar opción",
    searchPlaceholder = "Buscar...",
    showSearch = true 
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Filtrar items según búsqueda
    const filteredItems = items.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (item) => {
        onSelect(item.value);
        setSearchQuery('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Búsqueda */}
                    {showSearch && (
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#999" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="#999"
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Ionicons name="close-circle" size={20} color="#999" />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Lista de opciones */}
                    <FlatList
                        data={filteredItems}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.optionItem,
                                    selectedValue === item.value && styles.optionItemSelected
                                ]}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    selectedValue === item.value && styles.optionTextSelected
                                ]}>
                                    {item.label}
                                </Text>
                                {selectedValue === item.value && (
                                    <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
                                )}
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="search-outline" size={48} color="#ccc" />
                                <Text style={styles.emptyText}>No se encontraron resultados</Text>
                            </View>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
    },
    closeButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        margin: 16,
        marginBottom: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#2C3E50',
        marginLeft: 12,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    optionItemSelected: {
        backgroundColor: '#E8F9F7',
    },
    optionText: {
        fontSize: 16,
        color: '#2C3E50',
        flex: 1,
    },
    optionTextSelected: {
        fontWeight: '600',
        color: '#4ECDC4',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
    },
});

export default ModernPicker;