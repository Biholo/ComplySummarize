/**
 * Configuration par défaut des paramètres d'application
 * Ces valeurs seront chargées au démarrage de l'application si les paramètres n'existent pas encore
 */

// Enum Key défini selon le schéma Prisma
enum Key {
  CLAUDE_API_KEY = 'CLAUDE_API_KEY',
  MISTRAL_API_KEY = 'MISTRAL_API_KEY',
  GEMINI_API_KEY = 'GEMINI_API_KEY',
  AI_MODEL = 'AI_MODEL'
}

export interface DefaultParameterConfig {
key: Key;
defaultValue: string;
description: string;
category: string;
isSystem: boolean;
}

/**
* Paramètres par défaut à initialiser dans l'application
*/
export const defaultApplicationParameters: DefaultParameterConfig[] = [
// Paramètres des services d'IA
{
  key: Key.CLAUDE_API_KEY,
  defaultValue: '',
  description: 'Clé API pour le service Claude AI d\'Anthropic',
  category: 'ai_services',
  isSystem: true
},
{
  key: Key.MISTRAL_API_KEY,
  defaultValue: '',
  description: 'Clé API pour le service Mistral AI',
  category: 'ai_services',
  isSystem: true
},
{
  key: Key.GEMINI_API_KEY,
  defaultValue: '',
  description: 'Clé API pour le service Gemini AI de Google',
  category: 'ai_services',
  isSystem: true
},
{
  key: Key.AI_MODEL,
  defaultValue: 'claude',
  description: 'Modèle d\'IA par défaut à utiliser pour les requêtes',
  category: 'ai_configuration',
  isSystem: true
}
];

// Export du type Key pour utilisation dans d'autres fichiers
export { Key }; 