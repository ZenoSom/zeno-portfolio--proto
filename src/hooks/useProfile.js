import { useState, useEffect } from 'react';

export default function useProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch("/assets/profile.json", { cache: "no-store" });
                if (!res.ok) throw new Error("profile.json not found");
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error("Failed to load profile:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    return { profile, loading };
}
