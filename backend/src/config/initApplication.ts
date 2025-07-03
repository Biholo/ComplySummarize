import { PrismaClient } from '@/config/client';
import { logger } from '@/utils';
import { applicationParameterRepository } from '../repositories/applicationParameterRepository';
import { defaultApplicationParameters, Key } from './defaultApplicationParameters';

/**
 * Classe responsable de l'initialisation des paramètres de l'application
 */
export class ApplicationInitializer {
    private logger = logger.child({
      module: '[CFR][INIT][APPLICATION]'
    });
  
    /**
     * Initialise l'application en chargeant les paramètres par défaut
     * Cette méthode doit être appelée au démarrage de l'application
     */
    public async initialize(): Promise<void> {
      try {
        this.logger.info('Initialisation des paramètres de l\'application...');
        
        // Initialiser les paramètres par défaut
        await this.initializeApplicationParameters(defaultApplicationParameters);
        
        this.logger.info(`${defaultApplicationParameters.length} paramètres initialisés avec succès.`);
      } catch (error) {
        this.logger.error('Erreur lors de l\'initialisation des paramètres de l\'application', error);
        throw error;
      }
    }

    /**
     * Initialise les paramètres de l'application en vérifiant s'ils existent déjà
     * Si un paramètre existe déjà, il ne sera pas modifié
     * @param parameters Liste des paramètres à initialiser
     */
    private async initializeApplicationParameters(parameters: typeof defaultApplicationParameters): Promise<void> {
      for (const param of parameters) {
        await this.ensureParameter(
          param.key,
          param.defaultValue,
          param.category,
          param.isSystem
        );
      }
    }

    /**
     * S'assure qu'un paramètre existe, le crée s'il n'existe pas
     * Ne modifie jamais les valeurs existantes
     * @param key Clé du paramètre
     * @param defaultValue Valeur par défaut
     * @param category Catégorie du paramètre
     * @param isSystem Indique si c'est un paramètre système
     */
    public async ensureParameter(
      key: Key,
      defaultValue: string,
      category: string,
      isSystem: boolean = false
    ): Promise<void> {
      const existing = await applicationParameterRepository.getParameterByKey(key);
      
      if (!existing) {
        this.logger.info(`Création du paramètre: ${key}`);
                             
        await applicationParameterRepository.createSafeParameter({
          key,
          value: defaultValue,
          category,
          isSystem
        });
      } else {
        this.logger.debug(`Paramètre ${key} existe déjà, aucune modification`);
      }
    }
  
    /**
     * Réinitialise tous les paramètres système aux valeurs par défaut
     * Utile pour les mises à jour de l'application
     */
    public async resetSystemParameters(): Promise<void> {
      try {
        this.logger.info('Réinitialisation des paramètres système...');
        
        // Filtre les paramètres système
        const systemParameters = defaultApplicationParameters.filter(param => param.isSystem);
        
        // Mise à jour forcée des paramètres système
        for (const param of systemParameters) {
          await this.ensureParameter(
            param.key,
            param.defaultValue,
            param.category,
            true
          );
        }
        
        this.logger.info(`${systemParameters.length} paramètres système réinitialisés avec succès.`);
      } catch (error) {
        this.logger.error('Erreur lors de la réinitialisation des paramètres système', error);
        throw error;
      }
    }

    /**
     * Récupère la valeur d'un paramètre
     * @param key Clé du paramètre
     * @returns Valeur du paramètre ou null si non trouvé
     */
    public async getParameterValue(key: Key): Promise<string | null> {
      const parameter = await applicationParameterRepository.getParameterByKey(key);
      return parameter?.value || null;
    }

    /**
     * Met à jour la valeur d'un paramètre
     * @param key Clé du paramètre
     * @param value Nouvelle valeur
     */
    public async updateParameterValue(key: Key, value: string): Promise<void> {
        await applicationParameterRepository.updateParameter(key, value);
      this.logger.info(`Paramètre ${key} mis à jour`);
    }
}

/**
 * Initialise l'application en créant et exécutant un initialisateur
 * Fonction utilitaire pour garder la compatibilité avec le code existant
 * @param prisma Instance du client Prisma
 */
export async function initializeApplication(prisma: PrismaClient): Promise<void> {
    const initializer = new ApplicationInitializer();
    await initializer.initialize();
}

// Export de l'instance pour utilisation dans d'autres parties de l'application
export const applicationInitializer = new ApplicationInitializer(); 
