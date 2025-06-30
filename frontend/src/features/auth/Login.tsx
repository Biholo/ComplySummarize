import { useLogin } from '@/api/queries/authQueries';

import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoginDto, loginSchema } from '@shared/dto';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';
import { Input } from '@/components/ui/Input/Input';

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginDto>({
        resolver: zodResolver(loginSchema),
    });

    const { mutate: loginUser, isPending } = useLogin();

    const onSubmit = async (data: LoginDto) => {
        try {
            loginUser({
                ...data,
                rememberMe: data.rememberMe || false,
                });
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
                            <h2 className="mt-2 text-xl font-semibold text-gray-700">Connexion</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Accédez à votre tableau de bord d'analyse documentaire
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
                    />
                </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    {...register('rememberMe')}
                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Se souvenir de moi
                                </label>
                            </div>
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Mot de passe oublié ?
                            </Link>
                        </div>

                <Button
                    type="submit"
                            variant="primary"
                            className="w-full rounded-lg py-3 text-base font-semibold"
                    isLoading={isSubmitting || isPending}
                    disabled={isSubmitting || isPending}
                    loadingText="Connexion en cours..."
                >
                    Se connecter
                </Button>

                        <div className="text-center">
                            <span className="text-sm text-gray-600">Pas encore de compte ?</span>{' '}
                    <Link
                        to="/register"
                                className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                    >
                                Créer un compte
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
                        En vous connectant, vous acceptez nos{' '}
                        <Link to="/terms" className="text-emerald-600 hover:text-emerald-500">
                            conditions d'utilisation
                        </Link>{' '}
                        et notre{' '}
                        <Link to="/privacy" className="text-emerald-600 hover:text-emerald-500">
                            politique de confidentialité
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
