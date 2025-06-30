import { useRegister } from '@/api/queries/authQueries';

import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterDto, registerSchema } from '@shared/dto';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';
import { Input } from '@/components/ui/Input/Input';

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<RegisterDto>({
        resolver: zodResolver(registerSchema),
    });

    const { mutate: registerUser, isPending } = useRegister();
    
    const watchPassword = watch('password', '');
    const acceptTerms = watch('acceptTerms', false);
    const acceptPrivacy = watch('acceptPrivacy', false);

    const onSubmit = async (data: RegisterDto) => {
        try {
            registerUser(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center relative bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-200/30 to-emerald-300/30 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-200/30 to-blue-300/30 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-100/20 to-purple-100/20 blur-3xl"></div>
            </div>

            {/* Floating Elements */}
            <motion.div 
                className="absolute top-20 left-20 w-4 h-4 bg-emerald-400/30 rounded-full"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
                className="absolute top-40 right-32 w-3 h-3 bg-blue-400/30 rounded-full"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
                className="absolute bottom-32 left-1/4 w-5 h-5 bg-indigo-400/30 rounded-full"
                animate={{ y: [0, -25, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            <div className="relative z-10 w-full max-w-md px-4">
                <Card className="p-8 backdrop-blur-sm bg-white/90 border-white/20 shadow-2xl">
            <div className="text-center">
                <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg"
                >
                            <Sparkles className="h-8 w-8 text-white" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h1 className="mt-4 text-2xl font-bold text-gray-900">ComplySummarize IA</h1>
                            <h2 className="mt-2 text-xl font-semibold text-gray-700">Créer un compte</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Commencez à analyser vos documents réglementaires dès aujourd'hui
                            </p>
                </motion.div>
            </div>
                    
                    <motion.form 
                        className="mt-8 space-y-6" 
                        onSubmit={handleSubmit(onSubmit)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Nom"
                            {...register('lastName')}
                            error={errors.lastName?.message}
                            placeholder="Dupont"
                                    className="rounded-lg"
                            required
                        />
                        <Input
                            label="Prénom"
                            {...register('firstName')}
                            error={errors.firstName?.message}
                            placeholder="Jean"
                                    className="rounded-lg"
                            required
                        />
                    </div>
                            
                    <Input
                                label="Adresse email"
                        type="email"
                        {...register('email')}
                        error={errors.email?.message}
                        placeholder="votre@email.com"
                                className="rounded-lg"
                    />

                    <Input
                        label="Mot de passe"
                        type="password"
                        {...register('password')}
                        error={errors.password?.message}
                        placeholder="••••••••"
                                className="rounded-lg"
                        required
                    />
                            
                            {watchPassword && (
                                <motion.div 
                                    className="text-xs space-y-1"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                >
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className={`h-3 w-3 ${watchPassword.length >= 8 ? 'text-emerald-500' : 'text-gray-300'}`} />
                                        <span className={watchPassword.length >= 8 ? 'text-emerald-600' : 'text-gray-400'}>
                                            Au moins 8 caractères
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className={`h-3 w-3 ${/[A-Z]/.test(watchPassword) ? 'text-emerald-500' : 'text-gray-300'}`} />
                                        <span className={/[A-Z]/.test(watchPassword) ? 'text-emerald-600' : 'text-gray-400'}>
                                            Une majuscule
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className={`h-3 w-3 ${/[0-9]/.test(watchPassword) ? 'text-emerald-500' : 'text-gray-300'}`} />
                                        <span className={/[0-9]/.test(watchPassword) ? 'text-emerald-600' : 'text-gray-400'}>
                                            Un chiffre
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                            
                    <Input
                        label="Confirmer le mot de passe"
                        type="password"
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                        placeholder="••••••••"
                                className="rounded-lg"
                        required
                    />
                </div>

                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <input 
                                    type="checkbox" 
                                    {...register('acceptTerms')} 
                                    className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                />
                                <label className="text-sm text-gray-700 leading-5">
                                    J'accepte les{' '}
                                    <Link to="/terms" className="text-emerald-600 hover:text-emerald-500 font-medium">
                                        conditions d'utilisation
                                    </Link>
                                    {' '}et je comprends que mes données seront traitées avec le plus grand soin.
                                    <span className="text-red-500 ml-1">*</span>
                        </label>
                    </div>
                            
                            <div className="flex items-start space-x-3">
                                <input 
                                    type="checkbox" 
                                    {...register('acceptPrivacy')} 
                                    className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                />
                                <label className="text-sm text-gray-700 leading-5">
                                    Je consens à la{' '}
                                    <Link to="/privacy" className="text-emerald-600 hover:text-emerald-500 font-medium">
                                        politique de confidentialité
                                    </Link>
                                    {' '}et au traitement de mes données personnelles.
                                    <span className="text-red-500 ml-1">*</span>
                        </label>
                    </div>
                </div>

                <Button
                    type="submit"
                            variant="primary"
                            className="w-full rounded-lg py-3 text-base font-semibold"
                    isLoading={isSubmitting || isPending}
                            disabled={isSubmitting || isPending || !acceptTerms || !acceptPrivacy}
                            loadingText="Création du compte..."
                >
                            Créer mon compte
                </Button>

                        <div className="text-center">
                            <span className="text-sm text-gray-600">Déjà un compte ?</span>{' '}
                    <Link
                        to="/login"
                                className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                    >
                                Se connecter
                    </Link>
                </div>
                    </motion.form>
        </Card>
                
                <motion.div 
                    className="text-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <p className="text-xs text-gray-600/80">
                        En créant un compte, vous rejoignez des milliers d'entreprises qui font confiance à ComplySummarize IA pour leur conformité réglementaire.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
