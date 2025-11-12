import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatePickerModal from './DatePickerModal';
import { vaccinationService } from '../services/vaccionationService';
import styles from '../styles/VaccinationScreenStyles'
import ModernPicker from './ModernPicker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { db } from '../config/firebase';

const VaccinationScreen = ({ route, navigation }) => {
    const { petId, petName, petSpecies } = route.params;
    
    // Estados
    const [vaccinations, setVaccinations] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedVaccine, setSelectedVaccine] = useState('');
    const [applicationDate, setApplicationDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [showVaccinePicker, setShowVaccinePicker] = useState(false);
    const [loadingList, setLoadingList] = useState(true);
    const [petData, setPetData] = useState(null);
    const [exportingPdf, setExportingPdf] = useState(false);

    // CATÁLOGO DE VACUNAS POR ESPECIE
    const vaccinesBySpecies = {
        'Perro': [
            { label: 'Seleccionar vacuna...', value: '' },
            { label: 'Parvovirus', value: 'parvovirus' },
            { label: 'Moquillo', value: 'moquillo' },
            { label: 'Rabia', value: 'rabia' },
            { label: 'Hepatitis Canina', value: 'hepatitis' },
            { label: 'Leptospirosis', value: 'leptospirosis' },
            { label: 'Bordetella (Tos de las perreras)', value: 'bordetella' },
            { label: 'Polivalente (DHPPL)', value: 'polivalente' },
            { label: 'Coronavirus Canino', value: 'coronavirus' }
        ],
        'Gato': [
            { label: 'Seleccionar vacuna...', value: '' },
            { label: 'Triple Felina (FVRCP)', value: 'triple_felina' },
            { label: 'Rabia', value: 'rabia' },
            { label: 'Leucemia Felina (FeLV)', value: 'leucemia' },
            { label: 'Panleucopenia Felina', value: 'panleucopenia' },
            { label: 'Rinotraqueitis Felina', value: 'rinotraqueitis' },
            { label: 'Calicivirus Felino', value: 'calicivirus' },
            { label: 'Clamidiosis Felina', value: 'clamidiosis' }
        ]
    };

    // Cargar vacunaciones y datos de mascota al montar el componente
    useEffect(() => {
        loadVaccinations();
        loadPetData();
    }, []);

    // FUNCIÓN: Cargar vacunaciones desde Firebase
    const loadVaccinations = async () => {
        try {
            setLoadingList(true);
            const data = await vaccinationService.getVaccinations(petId);
            setVaccinations(data);
        } catch (error) {
            console.error('Error cargando vacunaciones:', error);
            Alert.alert('Error', 'No se pudieron cargar las vacunas');
        } finally {
            setLoadingList(false);
        }
    };

    // FUNCIÓN: Cargar información de la mascota
    const loadPetData = async () => {
        try {
            const petDoc = await db.collection('mascotas').doc(petId).get();
            if (petDoc.exists) {
                setPetData(petDoc.data());
            }
        } catch (error) {
            console.error('Error cargando datos de la mascota:', error);
        }
    };

    // VALIDACIÓN: Obtener vacunas disponibles según la especie
    const getAvailableVaccines = () => {
        // Si la especie no existe en el catálogo, usar Perro por defecto
        return vaccinesBySpecies[petSpecies] || vaccinesBySpecies['Perro'];
    };

    // FUNCIÓN: Manejar cambio de fecha
    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setApplicationDate(selectedDate);
        }
    };

    // FUNCIÓN: Formatear fecha
    const formatDate = (date) => {
        const dateObj = date?.seconds 
            ? new Date(date.seconds * 1000) 
            : new Date(date);
        
        return dateObj.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // VALIDACIÓN: Validar formulario antes de guardar
    const validateForm = () => {
        if (!selectedVaccine) {
            Alert.alert('Error', 'Por favor selecciona una vacuna');
            return false;
        }
        if (!applicationDate) {
            Alert.alert('Error', 'Por favor selecciona la fecha de aplicación');
            return false;
        }
        // Validar que la fecha no sea futura
        if (applicationDate > new Date()) {
            Alert.alert('Error', 'La fecha de aplicación no puede ser futura');
            return false;
        }
        return true;
    };

    // FUNCIÓN: Guardar vacunación en Firebase
    const handleSaveVaccination = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Obtener el nombre de la vacuna seleccionada
            const vaccineName = getAvailableVaccines().find(
                v => v.value === selectedVaccine
            )?.label;

            // Datos de la vacunación
            const vaccinationData = {
                vaccine: selectedVaccine,
                vaccineName: vaccineName,
                applicationDate: applicationDate,
                description: description.trim(),
                petSpecies: petSpecies // Guardar la especie para referencia
            };

            // Guardar en Firebase
            await vaccinationService.saveVaccination(petId, vaccinationData);

            // Recargar la lista
            await loadVaccinations();
            
            // Limpiar formulario
            setSelectedVaccine('');
            setApplicationDate(new Date());
            setDescription('');
            setShowAddForm(false);

            Alert.alert('Éxito', 'Vacuna registrada correctamente');
        } catch (error) {
            console.error('Error al guardar vacuna:', error);
            Alert.alert('Error', 'No se pudo guardar la vacuna');
        } finally {
            setLoading(false);
        }
    };

    // FUNCIÓN: Eliminar vacunación
    const handleDeleteVaccination = (vaccinationId) => {
        Alert.alert(
            'Eliminar Vacuna',
            '¿Estás seguro de que deseas eliminar esta vacuna?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await vaccinationService.deleteVaccination(petId, vaccinationId);
                            await loadVaccinations();
                            Alert.alert('Éxito', 'Vacuna eliminada');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la vacuna');
                        }
                    }
                }
            ]
        );
    };

    // FUNCIÓN: Cancelar formulario
    const handleCancel = () => {
        setSelectedVaccine('');
        setApplicationDate(new Date());
        setDescription('');
        setShowAddForm(false);
    };

    // FUNCIÓN: Generar HTML para el PDF estilo cartilla
    const generateVaccinationCardHTML = () => {
        const currentDate = new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        // Calcular edad de la mascota
        const calculateAge = (birthDate) => {
            if (!birthDate) return 'N/A';
            const birth = birthDate.seconds ? new Date(birthDate.seconds * 1000) : new Date(birthDate);
            const today = new Date();
            const years = today.getFullYear() - birth.getFullYear();
            const months = today.getMonth() - birth.getMonth();
            
            if (years > 0) {
                return `${years} año${years > 1 ? 's' : ''}`;
            } else {
                return `${months} mes${months !== 1 ? 'es' : ''}`;
            }
        };

        const vaccineRows = vaccinations.map((vacc, index) => `
            <tr style="${index % 2 === 0 ? 'background-color: #F8F9FA;' : ''}">
                <td style="padding: 12px; border: 1px solid #E8EBED; text-align: center;">${index + 1}</td>
                <td style="padding: 12px; border: 1px solid #E8EBED; font-weight: 600; color: #2C3E50;">${vacc.vaccineName}</td>
                <td style="padding: 12px; border: 1px solid #E8EBED; text-align: center;">${formatDate(vacc.applicationDate)}</td>
                <td style="padding: 12px; border: 1px solid #E8EBED; font-size: 12px; color: #7F8C8D;">${vacc.description || '-'}</td>
            </tr>
        `).join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        padding: 40px;
                        background-color: #FFFFFF;
                        color: #2C3E50;
                    }
                    .header {
                        background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
                        padding: 30px;
                        border-radius: 16px;
                        margin-bottom: 30px;
                        text-align: center;
                        color: white;
                    }
                    .header h1 {
                        font-size: 32px;
                        font-weight: 700;
                        margin-bottom: 8px;
                    }
                    .header p {
                        font-size: 16px;
                        opacity: 0.95;
                    }
                    .pet-info {
                        background-color: #F5F7FA;
                        border-radius: 12px;
                        padding: 24px;
                        margin-bottom: 30px;
                        border-left: 4px solid #4ECDC4;
                    }
                    .pet-info h2 {
                        color: #2C3E50;
                        font-size: 22px;
                        margin-bottom: 16px;
                        font-weight: 700;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 16px;
                    }
                    .info-item {
                        padding: 12px;
                        background-color: white;
                        border-radius: 8px;
                        border: 1px solid #E8EBED;
                    }
                    .info-label {
                        font-size: 12px;
                        color: #7F8C8D;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 4px;
                    }
                    .info-value {
                        font-size: 16px;
                        color: #2C3E50;
                        font-weight: 600;
                    }
                    .vaccines-section h2 {
                        color: #2C3E50;
                        font-size: 22px;
                        margin-bottom: 20px;
                        font-weight: 700;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        background-color: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                    }
                    thead {
                        background-color: #4ECDC4;
                        color: white;
                    }
                    th {
                        padding: 16px 12px;
                        text-align: left;
                        font-weight: 700;
                        font-size: 14px;
                        letter-spacing: 0.3px;
                    }
                    td {
                        padding: 12px;
                        border: 1px solid #E8EBED;
                        font-size: 14px;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        color: #7F8C8D;
                        font-size: 12px;
                        padding-top: 20px;
                        border-top: 2px solid #E8EBED;
                    }
                    .empty-state {
                        text-align: center;
                        padding: 40px;
                        color: #7F8C8D;
                        font-style: italic;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1> Cartilla de Vacunación</h1>
                    <p>Registro médico veterinario</p>
                </div>

                <div class="pet-info">
                    <h2> Información de la Mascota</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Nombre</div>
                            <div class="info-value">${petData?.nombre || petName}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Especie</div>
                            <div class="info-value">${petData?.especie || petSpecies}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Raza</div>
                            <div class="info-value">${petData?.raza || 'No especificada'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Edad</div>
                            <div class="info-value">${petData?.fechaNacimiento ? calculateAge(petData.fechaNacimiento) : 'N/A'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Peso</div>
                            <div class="info-value">${petData?.peso ? petData.peso + ' kg' : 'No especificado'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Sexo</div>
                            <div class="info-value">${petData?.sexo || 'No especificado'}</div>
                        </div>
                    </div>
                </div>

                <div class="vaccines-section">
                    <h2> Historial de Vacunación</h2>
                    ${vaccinations.length > 0 ? `
                        <table>
                            <thead>
                                <tr>
                                    <th style="text-align: center; width: 60px;">#</th>
                                    <th>Vacuna</th>
                                    <th style="text-align: center; width: 140px;">Fecha Aplicación</th>
                                    <th style="width: 35%;">Observaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${vaccineRows}
                            </tbody>
                        </table>
                    ` : `
                        <div class="empty-state">
                            <p>No hay vacunas registradas para esta mascota.</p>
                        </div>
                    `}
                </div>

                <div class="footer">
                    <p>Documento generado el ${currentDate}</p>
                    <p style="margin-top: 8px; font-weight: 600; color: #4ECDC4;">PetCare App - Cuidado integral de tu mascota</p>
                </div>
            </body>
            </html>
        `;
    };

    // FUNCIÓN: Exportar PDF
    const handleExportPDF = async () => {
        if (exportingPdf) return;
        
        try {
            setExportingPdf(true);

            // Generar HTML
            const htmlContent = generateVaccinationCardHTML();

            // Generar PDF con expo-print
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                base64: false,
            });
            
            console.log(' PDF generado:', uri);

            // Compartir el PDF usando expo-sharing
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: `Cartilla de Vacunación - ${petName}`,
                    UTI: 'com.adobe.pdf',
                });
            } else {
                Alert.alert(
                    ' PDF Generado',
                    `La cartilla de vacunación de ${petName} se ha generado en: ${uri}`,
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Error generando PDF:', error);
            Alert.alert(
                ' Error',
                'No se pudo generar el PDF. Por favor intenta de nuevo.',
                [{ text: 'OK' }]
            );
        } finally {
            setExportingPdf(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Mejorado con Gradiente */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>💉 Vacunación</Text>
                    <Text style={styles.petName}>{petName}</Text>
                </View>
                
                <View style={styles.headerButtonsContainer}>
                    <TouchableOpacity 
                        style={[styles.addButton, { marginRight: 8 }]}
                        onPress={handleExportPDF}
                        disabled={exportingPdf}
                    >
                        {exportingPdf ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
                        )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => setShowAddForm(true)}
                    >
                        <Ionicons name="add" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>


            <ScrollView style={styles.content}>
                {/* FORMULARIO DE NUEVA VACUNACIÓN */}
                {showAddForm && (
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>Nueva Vacunación</Text>

{/* Selector de Vacuna Mejorado */}
<View style={styles.inputContainer}>
    <Text style={styles.label}>
        Tipo de Vacuna *
        <Text style={styles.speciesIndicator}>
            {' '}(Vacunas para {petSpecies})
        </Text>
    </Text>
    <TouchableOpacity
        style={styles.modernPickerButton}
        onPress={() => setShowVaccinePicker(true)}
    >
        <Text style={[
            styles.modernPickerText,
            !selectedVaccine && styles.modernPickerPlaceholder
        ]}>
            {selectedVaccine 
                ? getAvailableVaccines().find(v => v.value === selectedVaccine)?.label 
                : 'Seleccionar vacuna...'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
    </TouchableOpacity>
</View>

{/* Modal del Picker */}
<ModernPicker
    visible={showVaccinePicker}
    onClose={() => setShowVaccinePicker(false)}
    items={getAvailableVaccines().filter(v => v.value !== '')}
    onSelect={setSelectedVaccine}
    selectedValue={selectedVaccine}
    title={`Vacunas para ${petSpecies}`}
    searchPlaceholder="Buscar vacuna..."
/>

                        {/* 2️⃣ SELECTOR DE FECHA DE APLICACIÓN */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Fecha de Aplicación *</Text>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateButtonText}>
                                    {formatDate(applicationDate)}
                                </Text>
                                <Ionicons name="calendar-outline" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {showDatePicker && (
                        <DatePickerModal
                                    visible={showDatePicker}
                                    onClose={() => setShowDatePicker(false)}
                                    onSelect={(date) => setApplicationDate(date)}
                                    selectedDate={applicationDate}
                                    maximumDate={new Date()} // No permitir fechas futuras
                                />
                        )}

                        {/* 3️⃣ CAMPO DE DESCRIPCIÓN */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Descripción (Opcional)</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Ej: Primera dosis, refuerzo anual, veterinaria ABC..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                placeholderTextColor="#999"
                            />
                            <Text style={styles.characterCount}>
                                {description.length}/500
                            </Text>
                        </View>

                        {/* Botones de acción */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCancel}
                                disabled={loading}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, loading && styles.buttonDisabled]}
                                onPress={handleSaveVaccination}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Guardar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* LISTA DE VACUNACIONES */}
                {loadingList ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#4ECDC4" />
                    </View>
                ) : vaccinations.length > 0 ? (
                    vaccinations.map((vaccination) => (
                        <View key={vaccination.id} style={styles.vaccinationCard}>
                            <View style={styles.cardHeader}>
                                <Ionicons name="medical" size={24} color="#4ECDC4" />
                                <View style={styles.cardInfo}>
                                    <Text style={styles.vaccineName}>
                                        {vaccination.vaccineName}
                                    </Text>
                                    <Text style={styles.vaccineDate}>
                                        📅 {formatDate(vaccination.applicationDate)}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDeleteVaccination(vaccination.id)}
                                    style={styles.deleteButton}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                                </TouchableOpacity>
                            </View>
                            {vaccination.description && (
                                <Text style={styles.vaccineDescription}>
                                    {vaccination.description}
                                </Text>
                            )}
                        </View>
                    ))
                ) : (
                    !showAddForm && (
                        <View style={styles.emptyState}>
                            <Ionicons name="medkit-outline" size={64} color="#ccc" />
                            <Text style={styles.emptyStateTitle}>
                                Sin vacunaciones registradas
                            </Text>
                            <Text style={styles.emptyStateText}>
                                Agrega las vacunas de {petName} para llevar un control completo
                            </Text>
                        </View>
                    )
                )}
            </ScrollView>
        </View>
    );
};

export default VaccinationScreen;