// src/ui/components/RadarRecommendations.js - Top Picks Section (Full-Body)

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const RadarRecommendations = ({ radarData, onOpenRadar }) => {
  const theme = useTheme();
  
  // Logik für High-Score-Picks wandert hierher
  const recommendations = radarData?.watchlist_results?.filter(r => r.score >= 8) || [];

  if (recommendations.length === 0) return null;

  const styles = StyleSheet.create({
    sectionLabel: { 
      color: theme.colors.textSubtle, 
      fontSize: 10, 
      fontWeight: 'bold', 
      marginBottom: 8, 
      textTransform: 'uppercase' 
    },
    recommendationCard: {
      backgroundColor: theme.colors.surface, 
      padding: theme.spacing.md, 
      borderRadius: theme.radii.md,
      marginBottom: theme.spacing.md, 
      borderLeftWidth: 4, 
      borderLeftColor: theme.colors.success
    }
  });

  return (
    <View style={{ marginBottom: theme.spacing.sm }}>
      <Text style={styles.sectionLabel}>Top Radar Picks</Text>
      {recommendations.map((rec, i) => (
        <TouchableOpacity 
          key={i} 
          style={styles.recommendationCard} 
          onPress={() => onOpenRadar(rec.ticker)}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>{rec.ticker} – {rec.core_reason_short}</Text>
            <Text style={{ color: theme.colors.success, fontWeight: 'bold' }}>Score: {rec.score}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadarRecommendations;