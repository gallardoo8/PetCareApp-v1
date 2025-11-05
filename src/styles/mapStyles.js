// src/styles/mapStyles.js
import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from './colors';

export const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  
  // Barra de búsqueda
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.medium,
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
  
  // Botón de ubicación actual
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  
  // Filtros
  filtersContainer: {
    position: 'absolute',
    top: 70,
    left: spacing.md,
    right: spacing.md,
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
  
  // Marcadores personalizados
  markerContainer: {
    alignItems: 'center',
  },
  markerIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
    ...shadows.medium,
  },
  markerIconEmergency: {
    backgroundColor: colors.secondary,
  },
  markerLabel: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    ...shadows.small,
  },
  markerLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  
  // Card de información flotante
  infoCard: {
    position: 'absolute',
    bottom: 80,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.large,
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
  },
  infoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.surface,
  },
  infoAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
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
    paddingVertical: spacing.sm,
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
    fontWeight: '600',
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