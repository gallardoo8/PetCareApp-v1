// src/styles/LoginScreenStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 24,
  },
  
  // Header con logo
  headerContainer: {
    alignItems: 'center',
    paddingTop: height * 0.08,
    paddingBottom: 40,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  
  // Títulos
  labelTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 32,
  },
  
  // Form Container
  formContainer: {
    flex: 1,
  },
  
  // Inputs
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E1E8ED',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2C3E50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputFocused: {
    borderColor: '#4ECDC4',
    borderWidth: 2,
  },
  inputError: {
    borderColor: '#E74C3C',
    borderWidth: 2,
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  
  // Mensajes de error
  errorText: {
    color: '#E74C3C',
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  
  // Botones principales
  button: {
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#BDC3C7',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // Links
  link: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 12,
  },
  linkText: {
    color: '#4ECDC4',
    fontSize: 15,
    fontWeight: '600',
  },
  
  // Divider con "O"
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E8ED',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#7F8C8D',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Social buttons (opcional)
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E1E8ED',
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  socialButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  
  // Floating labels (opcional)
  floatingLabel: {
    position: 'absolute',
    left: 20,
    top: -10,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  
  // Password strength indicator
  passwordStrengthContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 4,
  },
  passwordStrengthBar: {
    flex: 1,
    height: 3,
    backgroundColor: '#E1E8ED',
    borderRadius: 2,
  },
  passwordStrengthBarActive: {
    backgroundColor: '#4ECDC4',
  },
  
  // Footer
  footerContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 18,
  },
  
  // Loading overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
});

export default styles;