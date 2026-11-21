export interface ThemeColors {
  background: string;
  card: string;
  cardDarker: string;
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  accent: string; // Added for the Medical Screen icons
  success: string;
  warning: string;
  danger: string;
  border: string;
  tabBar: string;
  iconBg: string;
  heroCard: string; 
  heroText: string; 
}

export const colors: { dark: ThemeColors; light: ThemeColors } = {
  dark: {
    // Backgrounds
    background: '#0A0A0A', // Deep black
    card: '#141414',       // Dark grey for cards
    cardDarker: '#1F1F1F', // Inner elements
    
    // Text
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    
    // Vibrant Accents
    primary: '#8B5CF6',    // Vibrant Purple
    secondary: '#3B82F6',  // Bright Blue
    accent: '#F472B6',     // Vibrant Pink
    success: '#22C55E',    // Green
    warning: '#F59E0B',    // Orange/Yellow
    danger: '#EF4444',     // Red
    
    // UI Elements
    border: '#27272A',
    tabBar: '#000000',
    iconBg: '#1F1F1F',
    
    // Hero Card Specifics
    heroCard: '#6D28D9',   // Deep vibrant purple for the main card
    heroText: '#FFFFFF',
  },
  light: {
    // Backgrounds
    background: '#F4F4F5',
    card: '#FFFFFF',
    cardDarker: '#E4E4E7',
    
    // Text
    text: '#09090B',
    textSecondary: '#71717A',
    
    // Vibrant Accents
    primary: '#7B2CBF',
    secondary: '#2563EB',
    accent: '#DB2777',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    
    // UI Elements
    border: '#E4E4E7',
    tabBar: '#FFFFFF',
    iconBg: '#E4E4E7',
    
    // Hero Card Specifics
    heroCard: '#8B5CF6',
    heroText: '#FFFFFF',
  }
};