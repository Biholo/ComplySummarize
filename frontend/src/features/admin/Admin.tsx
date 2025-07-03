import { useGetAllParameters, useUpdateParameter } from '@/api/queries/applicationParameterQueries';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Loader from '@/components/ui/Loader/Loader';
import { ApplicationParameterDto } from '@shared/dto';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Eye, EyeOff, Save, Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface AIModelConfig {
  claudeApiKey: string;
  mistralApiKey: string;
  geminiApiKey: string;
  aiModel: string;
}

interface ParameterIds {
  claudeApiKeyId: string;
  mistralApiKeyId: string;
  geminiApiKeyId: string;
  aiModelId: string;
}

interface ShowKeys {
  claude: boolean;
  mistral: boolean;
  gemini: boolean;
}

interface SavingKeys {
  claude: boolean;
  mistral: boolean;
  gemini: boolean;
  aiModel: boolean;
}

const AI_MODELS = [
  { value: 'claude', label: 'Claude 3.5 Sonnet' },
  { value: 'mistral', label: 'Mistral Large' },
  { value: 'gemini', label: 'Gemini Pro' },

];

const Admin: React.FC = () => {
  const [config, setConfig] = useState<AIModelConfig>({
    claudeApiKey: '',
    mistralApiKey: '',
    geminiApiKey: '',
    aiModel: '',
  });

  const [parameterIds, setParameterIds] = useState<ParameterIds>({
    claudeApiKeyId: '',
    mistralApiKeyId: '',
    geminiApiKeyId: '',
    aiModelId: '',
  });
  
  const [showKeys, setShowKeys] = useState<ShowKeys>({
    claude: false,
    mistral: false,
    gemini: false,
  });
  
  const [savingKeys, setSavingKeys] = useState<SavingKeys>({
    claude: false,
    mistral: false,
    gemini: false,
    aiModel: false,
  });

  // Utilisation des queries React Query
  const { data: parameters, isLoading, error } = useGetAllParameters();
  const updateParameterMutation = useUpdateParameter();

  useEffect(() => {
    if (parameters) {
      const configData = parameters.reduce((acc: Partial<AIModelConfig>, param: ApplicationParameterDto) => {
        switch (param.key) {
          case 'CLAUDE_API_KEY':
            acc.claudeApiKey = param.value;
            break;
          case 'MISTRAL_API_KEY':
            acc.mistralApiKey = param.value;
            break;
          case 'GEMINI_API_KEY':
            acc.geminiApiKey = param.value;
            break;
          case 'AI_MODEL':
            acc.aiModel = param.value;
            break;
        }
        return acc;
      }, {});

      const idsData = parameters.reduce((acc: Partial<ParameterIds>, param: ApplicationParameterDto) => {
        switch (param.key) {
          case 'CLAUDE_API_KEY':
            acc.claudeApiKeyId = param.id;
            break;
          case 'MISTRAL_API_KEY':
            acc.mistralApiKeyId = param.id;
            break;
          case 'GEMINI_API_KEY':
            acc.geminiApiKeyId = param.id;
            break;
          case 'AI_MODEL':
            acc.aiModelId = param.id;
            break;
        }
        return acc;
      }, {});
      
      setConfig(prevConfig => ({ ...prevConfig, ...configData }));
      setParameterIds(prevIds => ({ ...prevIds, ...idsData }));
    }
  }, [parameters]);

  const saveParameter = async (id: string, value: string, savingKey: keyof SavingKeys) => {
    if (!value.trim()) {
      return;
    }
    
    try {
      setSavingKeys(prev => ({ ...prev, [savingKey]: true }));
      
      await updateParameterMutation.mutateAsync({ id, value });
      
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de ${id}:`, error);
    } finally {
      setSavingKeys(prev => ({ ...prev, [savingKey]: false }));
    }
  };

  const toggleKeyVisibility = (service: 'claude' | 'mistral' | 'gemini') => {
    setShowKeys(prev => ({ ...prev, [service]: !prev[service] }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-red-500 text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Erreur lors du chargement des paramètres</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-emerald-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Administration
              </h1>
              <p className="text-gray-600 mt-2">
                Configurez les paramètres des modèles d'intelligence artificielle
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Espace réservé pour les actions futures */}
          </div>
        </motion.div>

        <div className="grid gap-6">
          {/* Configuration des clés API */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                  <h2 className="text-xl font-semibold text-gray-900">Clés API</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Claude API Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clé API Claude (Anthropic)
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={showKeys.claude ? "text" : "password"}
                          value={config.claudeApiKey}
                          onChange={(e) => setConfig(prev => ({ ...prev, claudeApiKey: e.target.value }))}
                          placeholder="sk-ant-api..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => toggleKeyVisibility('claude')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showKeys.claude ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => saveParameter(parameterIds.claudeApiKeyId, config.claudeApiKey, 'claude')}
                        disabled={savingKeys.claude}
                        className="flex items-center gap-2"
                      >
                        {savingKeys.claude ? (
                          'Enregistrement...'
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    </div>
                    {config.claudeApiKey && (
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">Clé API configurée</span>
                      </div>
                    )}
                  </div>

                  {/* Mistral API Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clé API Mistral
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={showKeys.mistral ? "text" : "password"}
                          value={config.mistralApiKey}
                          onChange={(e) => setConfig(prev => ({ ...prev, mistralApiKey: e.target.value }))}
                          placeholder="Mistral API Key..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => toggleKeyVisibility('mistral')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showKeys.mistral ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => saveParameter(parameterIds.mistralApiKeyId, config.mistralApiKey, 'mistral')}
                        disabled={savingKeys.mistral}
                        className="flex items-center gap-2"
                      >
                        {savingKeys.mistral ? (
                          'Enregistrement...'
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    </div>
                    {config.mistralApiKey && (
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">Clé API configurée</span>
                      </div>
                    )}
                  </div>

                  {/* Gemini API Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clé API Gemini (Google)
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={showKeys.gemini ? "text" : "password"}
                          value={config.geminiApiKey}
                          onChange={(e) => setConfig(prev => ({ ...prev, geminiApiKey: e.target.value }))}
                          placeholder="Google API Key..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => toggleKeyVisibility('gemini')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showKeys.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => saveParameter(parameterIds.geminiApiKeyId, config.geminiApiKey, 'gemini')}
                        disabled={savingKeys.gemini}
                        className="flex items-center gap-2"
                      >
                        {savingKeys.gemini ? (
                          'Enregistrement...'
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    </div>
                    {config.geminiApiKey && (
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">Clé API configurée</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Sélection du modèle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Modèle d'IA actuel</h2>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Modèle par défaut
                      </label>
                      <select
                        value={config.aiModel}
                        onChange={(e) => setConfig(prev => ({ ...prev, aiModel: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Sélectionnez un modèle</option>
                        {AI_MODELS.map(model => (
                          <option key={model.value} value={model.value}>
                            {model.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={() => saveParameter(parameterIds.aiModelId, config.aiModel, 'aiModel')}
                        disabled={savingKeys.aiModel || !config.aiModel}
                        className="flex items-center gap-2"
                      >
                        {savingKeys.aiModel ? (
                          'Enregistrement...'
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {config.aiModel && (
                    <div className="mt-4">
                      <Badge variant="success">
                        Modèle actuel: {AI_MODELS.find(m => m.value === config.aiModel)?.label}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
