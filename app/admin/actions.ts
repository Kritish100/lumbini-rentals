'use server';
import { cookies } from 'next/headers';

export async function verifySecretKey(secretKey: string): Promise<boolean> {
    const correctKey = process.env.ADMIN_SECRET_KEY;
    if (correctKey !== secretKey) {
        console.error('ADMIN_SECRET_KEY is not set in the environment variables.');
        return false;
    }
    
    const cookieStore = await cookies();
    cookieStore.set('auth_session', 'true', { 
        path: '/admin',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // works both on prod and local env
        sameSite: 'strict',
    });

    return true
}


export const clearAuthorizationCookie = async () => {
    const cookieStore = await cookies();
    cookieStore.delete({
        name: 'auth_session',
        path: '/admin',
    });
}
