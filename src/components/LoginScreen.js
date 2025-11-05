// src/components/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import SafeContainer from './SafeContainer';
import styles from '../styles/LoginScreenStyles';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    correo: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Validar campo individual
  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case 'correo':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.correo = 'El correo es requerido';
        } else if (!emailRegex.test(value)) {
          newErrors.correo = 'Ingresa un correo válido';
        } else {
          delete newErrors.correo;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'La contraseña es requerida';
        } else if (value.length < 6) {
          newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    setFocusedInput(null);
    validateField(name, formData[name]);
  };

  const handleFocus = (name) => {
    setFocusedInput(name);
  };

  const validateForm = () => {
    const newTouched = {};
    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
    });
    setTouched(newTouched);

    let isValid = true;
    Object.keys(formData).forEach((key) => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Alert.alert(
        'Error en el formulario',
        'Por favor, corrige los errores antes de continuar',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Intentando inicio de sesión...');

      await login(formData.correo, formData.password);

      console.log('✅ Login exitoso');

      setFormData({
        correo: '',
        password: '',
      });
      setTouched({});
    } catch (error) {
      console.error('Error en login:', error);
      let errorMessage = 'Ocurrió un error durante el inicio de sesión';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña';
          break;
        default:
          errorMessage = error.message || 'Error desconocido';
      }

      Alert.alert('Error de inicio de sesión', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    Object.keys(errors).length === 0 && formData.correo && formData.password;

  return (
    <SafeContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header con Logo */}
          <View style={styles.headerContainer}>
            <Image
              style={styles.logo}
              source={require('../../assets/LogoApp.png')}
              resizeMode="contain"
            />
            <Text style={styles.labelTitle}>¡Bienvenido!</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Campo Correo */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'correo' && styles.inputFocused,
                    touched.correo && errors.correo && styles.inputError,
                  ]}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="#BDC3C7"
                  value={formData.correo}
                  onChangeText={(text) => handleChange('correo', text)}
                  onBlur={() => handleBlur('correo')}
                  onFocus={() => handleFocus('correo')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {formData.correo && !errors.correo && (
                  <View style={styles.inputIcon}>
                    <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
                  </View>
                )}
              </View>
              {touched.correo && errors.correo && (
                <Text style={styles.errorText}>⚠️ {errors.correo}</Text>
              )}
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'password' && styles.inputFocused,
                    touched.password && errors.password && styles.inputError,
                    { paddingRight: 50 },
                  ]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#BDC3C7"
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  onBlur={() => handleBlur('password')}
                  onFocus={() => handleFocus('password')}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.inputIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#7F8C8D"
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>⚠️ {errors.password}</Text>
              )}
            </View>

            {/* Botón de Iniciar Sesión */}
            <TouchableOpacity
              style={[
                styles.button,
                (!isFormValid || loading) && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={!isFormValid || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            {/* Link a Registro */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.link}
            >
              <Text style={styles.linkText}>
                ¿No tienes cuenta? Regístrate aquí
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Al continuar, aceptas nuestros términos y condiciones
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};

export default LoginScreen;