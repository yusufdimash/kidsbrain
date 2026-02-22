import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { S } from '../constants/strings';
import { ANIMAL_PATHS } from '../data/animalPaths';
import { useGameProgress } from '../context/GameProgressContext';

interface ZooBookOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export default function ZooBookOverlay({ visible, onClose }: ZooBookOverlayProps) {
  const { state } = useGameProgress();
  const collected = state.zooCollection;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🦁 {S.zooBook.id}</Text>
            <Text style={styles.subtitle}>{S.zooBook.en}</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <Text style={styles.count}>
            {S.zooCollected.id}: {collected.length} / {ANIMAL_PATHS.length}
          </Text>

          {/* Animal Grid */}
          <ScrollView contentContainerStyle={styles.grid}>
            {ANIMAL_PATHS.map((animal) => {
              const isCollected = collected.includes(animal.id);
              return (
                <View
                  key={animal.id}
                  style={[
                    styles.animalCard,
                    !isCollected && styles.animalCardLocked,
                  ]}
                >
                  <Text style={styles.animalEmoji}>
                    {isCollected ? animal.emoji : '❓'}
                  </Text>
                  <Text style={styles.animalName}>
                    {isCollected ? animal.name : '???'}
                  </Text>
                  {isCollected && (
                    <Text style={styles.animalNameEn}>{animal.nameEn}</Text>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {collected.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{S.zooEmpty.id}</Text>
              <Text style={styles.emptySubtext}>{S.zooEmpty.en}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '85%',
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    position: 'absolute',
    bottom: -16,
    left: 0,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: COLORS.text,
  },
  count: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: SPACING.xl,
  },
  animalCard: {
    width: '33.33%',
    padding: SPACING.xs,
    alignItems: 'center',
  },
  animalCardLocked: {
    opacity: 0.4,
  },
  animalEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xs,
  },
  animalName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  animalNameEn: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});
