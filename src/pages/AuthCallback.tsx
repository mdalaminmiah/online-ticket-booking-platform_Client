import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { FullScreenLoader } from '@/components/ui/Spinner';

export default function AuthCallback() {
  const { status } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError) {
      toast.error('Google sign-in was cancelled or failed. Please try again.');
      navigate('/login', { replace: true });
      return;
    }
    if (status === 'authenticated') navigate('/dashboard', { replace: true });
    else if (status === 'unauthenticated') navigate('/login', { replace: true });
  }, [status, navigate, searchParams]);

  return <FullScreenLoader />;
}
