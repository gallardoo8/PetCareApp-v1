// src/styles/mapStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, shadows } from './colors';

const { width } = Dimensions.get('window');

export const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  
  // Barra de búsqueda CENTRADA
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  searchBar: {
    width: '100%',
    maxWidth: 400, // Ancho máximo para pantallas grandes
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...shadows.large,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
  },
  clearButton: {
    padding: spacing.xs,
  },
  
  // Botón de ubicación actual (SEPARADO)
  locationButtonContainer: {
    position: 'absolute',
    top: 50,
    right: spacing.md,
  },
  locationButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  
  // Filtros
  filtersContainer: {
    position: 'absolute',
    top: 115,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.small,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  filterTextActive: {
    color: colors.surface,
  },
  
  // Marcadores personalizados MÁS PEQUEÑOS
  markerContainer: {
    alignItems: 'center',
  },
  markerIcon: {
    width: 32, // Reducido de 40
    height: 32, // Reducido de 40
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5, // Reducido de 3
    borderColor: colors.surface,
    ...shadows.medium,
  },
  markerIconEmergency: {
    backgroundColor: colors.secondary,
  },
  markerLabel: {
    marginTop: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    ...shadows.small,
  },
  markerLabelText: {
    fontSize: 9, // Reducido de 10
    fontWeight: '600',
    color: colors.textPrimary,
  },
  
  // Card de información flotante (Más abajo para que no tape el centro)
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.large,
    maxHeight: '40%', // Máximo 40% de la pantalla
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  infoTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  infoBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.success,
    marginRight: spacing.xs,
  },
  infoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.surface,
  },
  infoAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  infoDetails: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  infoDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoDetailText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  infoActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  infoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  infoButtonPrimary: {
    backgroundColor: colors.primary,
  },
  infoButtonSecondary: {
    backgroundColor: colors.secondary,
  },
  infoButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
});