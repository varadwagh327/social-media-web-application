import { LoginForm } from '@/components/Auth/LoginForm';

export const metadata = {
  title: 'Sign In | SocialHub',
  description: 'Sign in to your SocialHub account',
};

export default function LoginPage() {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen bg-white">
      {/* Left Side - Logo & Text (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-bold text-white mb-4 italic font-serif">SocialHub</h1>
          <p className="text-white text-lg font-light">Share moments. Connect with friends. Inspire the world.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold italic font-serif mb-2">SocialHub</h1>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
