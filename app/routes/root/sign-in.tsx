import { Button, ButtonComponent } from "@syncfusion/ej2-react-buttons"
import { Link, redirect, useNavigate } from "react-router"
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";
import { useState, useEffect } from "react";

export async function clientLoader(){
    try{
        const user = await account.get();
        if(user.$id) {
            console.log("User already logged in, redirecting to home");
            return redirect('/');
        }
    }catch(e){
        console.log('Error fetching user', e)
    }
}

const SignIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await loginWithGoogle();
            // The OAuth2 flow will handle the redirect
        } catch (err) {
            console.error('Sign in error:', err);
            setError('Failed to sign in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Check authentication status on component mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await account.get();
                if (user.$id) {
                    console.log("User authenticated, redirecting to home");
                    navigate('/');
                }
            } catch (e) {
                console.log('Error checking auth status:', e);
            }
        };
        checkAuth();
    }, [navigate]);
   
    return (
        <main className="auth">
            <section className="size-full glassmorphism flex-center px-6">
                <div className="sign-in-card">
                    <header className="header">
                        <Link to="/">
                            <img 
                                src="/assets/icons/logo.svg"
                                alt="logo"
                                className="size-[30px]"
                            />
                        </Link>
                        <h1 className="p-28-bold text-dark-100">Tourvisto</h1>
                    </header>
                    <article>
                        <h2 className="p-28-semibold text-dark-100 text-center">Start Your Travel Journey</h2>
                        <p className="p-18-regular text-center text-gray-100 !leading-7">Sign in with Google to manage destinations, itineraries, and user activitiy with ease. </p>
                    </article>
                    {error && <p className="error">{error}</p>}
                    <ButtonComponent
                        type="button"
                        iconCss="e-search-icon"
                        className="button-class !h-11 !w-full"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                    >
                        <img
                            src="/assets/icons/google.svg"
                            className="size-5"
                            alt="google"
                        />
                        <span className="p-18-semibold text-white">
                            {isLoading ? 'Signing in...' : 'Sign in with Google'}
                        </span>
                    </ButtonComponent>
                </div>
            </section>
        </main>
    )
}

export default SignIn