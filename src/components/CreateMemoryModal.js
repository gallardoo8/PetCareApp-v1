import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/CreateMemoryModalStyles';

const CreateMemoryModal = ({ 
    visible, 
    onClose, 
    onSelectImage,
    onPublish,
    loading,
    // ✅ NUEVO: Recibir valores y setters desde el padre
    selectedImage,
    petName,
    setPetName,
    species,
    setSpecies,
    message,
    setMessage,
}) => {
    
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        onPress={onClose}
                        style={styles.headerButton}
                    >
                        <Ionicons name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Compartir Recuerdo</Text>
                    <TouchableOpacity 
                        onPress={onPublish}
                        disabled={loading || !selectedImage || !petName}
                        style={styles.headerButton}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons 
                                name="checkmark" 
                                size={28} 
                                color={(!selectedImage || !petName) ? 'rgba(255,255,255,0.4)' : '#fff'} 
                            />
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView 
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Selector de imagen */}
                    <TouchableOpacity 
                        style={styles.imageSelector}
                        onPress={onSelectImage}
                        activeOpacity={0.9}
                    >
                        {selectedImage ? (
                            <>
                                <Image 
                                    source={{ uri: selectedImage }} 
                                    style={styles.selectedImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.imageOverlay}>
                                    <View style={styles.changePhotoButton}>
                                        <Ionicons name="camera" size={20} color="#fff" />
                                        <Text style={styles.changePhotoText}>Cambiar foto</Text>
                                    </View>
                                </View>
                            </>
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <View style={styles.cameraIconContainer}>
                                    <Ionicons name="camera" size={48} color="#4ECDC4" />
                                </View>
                                <Text style={styles.imagePlaceholderTitle}>Agrega una foto</Text>
                                <Text style={styles.imagePlaceholderSubtitle}>
                                    Comparte un momento especial
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Formulario */}
                    <View style={styles.form}>
                        {/* Campo Nombre */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputIconContainer}>
                                <Ionicons name="paw" size={20} color="#4ECDC4" />
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>Nombre *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nombre de tu mascota"
                                    value={petName}
                                    onChangeText={setPetName}
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        {/* Campo Especie */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputIconContainer}>
                                <Ionicons name="heart" size={20} color="#4ECDC4" />
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>Especie</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: Perro, Gato, Conejo..."
                                    value={species}
                                    onChangeText={setSpecies}
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        {/* Campo Mensaje */}
                        <View style={[styles.inputContainer, styles.messageContainer]}>
                            <View style={[styles.inputIconContainer, styles.messageIconContainer]}>
                                <Ionicons name="create" size={20} color="#4ECDC4" />
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>Mensaje</Text>
                                <TextInput
                                    style={[styles.input, styles.messageInput]}
                                    placeholder="Comparte tus sentimientos y recuerdos..."
                                    value={message}
                                    onChangeText={setMessage}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        {/* 🧪 Debug Info */}
                        <View style={{
                            padding: 15,
                            backgroundColor: '#f0f9f8',
                            borderRadius: 10,
                            marginTop: 10,
                            borderLeftWidth: 3,
                            borderLeftColor: '#4ECDC4'
                        }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#4ECDC4' }}>
                                📋 Estado actual:
                            </Text>
                            <Text style={{ fontSize: 11, marginBottom: 3 }}>
                                {selectedImage ? '✅' : '❌'} Imagen: {selectedImage ? 'Seleccionada' : 'Falta'}
                            </Text>
                            <Text style={{ fontSize: 11, marginBottom: 3 }}>
                                {petName ? '✅' : '❌'} Nombre: {petName || 'Vacío'}
                            </Text>
                            <Text style={{ fontSize: 11, marginBottom: 3 }}>
                                {species ? '✅' : '⚪'} Especie: {species || 'Opcional'}
                            </Text>
                            <Text style={{ fontSize: 11 }}>
                                {message ? '✅' : '⚪'} Mensaje: {message ? 'Escrito' : 'Opcional'}
                            </Text>
                        </View>

                        {/* Botón de publicar */}
                        <TouchableOpacity
                            style={[
                                styles.publishButton,
                                (!selectedImage || !petName) && styles.publishButtonDisabled
                            ]}
                            onPress={onPublish}
                            disabled={loading || !selectedImage || !petName}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="send" size={20} color="#fff" />
                                    <Text style={styles.publishButtonText}>
                                        Compartir Recuerdo
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CreateMemoryModal;