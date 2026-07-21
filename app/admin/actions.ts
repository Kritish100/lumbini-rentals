'use server';

export async function verifySecretKey(secretKey: string): Promise<boolean> {
    const correctKey = process.env.ADMIN_SECRET_KEY;
    if (!correctKey) {
        console.error('ADMIN_SECRET_KEY is not set in the environment variables.');
        return false;
    }
    return secretKey === correctKey;
}
