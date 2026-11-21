import { Ionicons } from '@expo/vector-icons';

export interface SubjectStyle {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}

// Core Vibrant Style
const CORE_STYLES: Record<string, SubjectStyle> = {
  'data structure': { icon: 'git-network', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.2)' },
  'algorithm': { icon: 'git-network', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.2)' },
  'object oriented': { icon: 'code-slash', color: '#F472B6', bg: 'rgba(244, 114, 182, 0.2)' },
  'programming': { icon: 'code-slash', color: '#F472B6', bg: 'rgba(244, 114, 182, 0.2)' },
  'oop': { icon: 'code-slash', color: '#F472B6', bg: 'rgba(244, 114, 182, 0.2)' },
  'digital': { icon: 'hardware-chip', color: '#34D399', bg: 'rgba(52, 211, 153, 0.2)' },
  'system': { icon: 'hardware-chip', color: '#34D399', bg: 'rgba(52, 211, 153, 0.2)' },
  'math': { icon: 'calculator', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.2)' },
  'python': { icon: 'code-slash', color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.2)' }, // Fixed Python
  'network': { icon: 'globe', color: '#F87171', bg: 'rgba(248, 113, 113, 0.2)' },
  'operating': { icon: 'server', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.2)' },
  'artificial': { icon: 'sparkles', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' },
  'machine learning': { icon: 'analytics', color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' },
};

// Muted Style for Labs, Breaks, and Minor subjects
const MUTED_STYLE: SubjectStyle = { icon: 'book-outline', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.15)' };
const LAB_STYLE: SubjectStyle = { icon: 'flask-outline', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.15)' };
const BREAK_STYLE: SubjectStyle = { icon: 'cafe-outline', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)' };

export const getSubjectStyle = (subjectName: string, type: string): SubjectStyle => {
  const n = subjectName.toLowerCase();

  // 1. Check for Break
  if (type === 'Break' || n.includes('break')) return BREAK_STYLE;

  // 2. Check for Lab/Minor (Muted)
  if (type === 'Lab' || n.includes('lab') || n.includes('minor')) return LAB_STYLE;

  // 3. Check for Core Subjects (Vibrant)
  for (const [keyword, style] of Object.entries(CORE_STYLES)) {
    if (n.includes(keyword)) return style;
  }

  // 4. Default fallback
  return MUTED_STYLE;
};