import React, { useState } from 'react';
import { updateProfile } from '@/services/apiProfiles';
import { Settings, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function ProfileSettings ( { profile, onUpdate } )
{
    const [ loading, setLoading ] = useState( false );
    const [ formData, setFormData ] = useState( {
        username: profile?.username || '',
        bio: profile?.bio || '',
        avatar_url: profile?.avatar_url || ''
    } );

    const handleChange = ( e ) =>
    {
        const { name, value } = e.target;
        setFormData( prev => ( { ...prev, [ name ]: value } ) );
    };

    const handleSave = async ( e ) =>
    {
        e.preventDefault();
        if ( !profile?.id ) return;

        // Basic validation
        if ( formData.username && formData.username.length < 3 )
        {
            toast.error( "Username must be at least 3 characters" );
            return;
        }

        setLoading( true );
        try
        {
            const updated = await updateProfile( profile.id, {
                username: formData.username.trim(),
                bio: formData.bio.trim(),
                avatar_url: formData.avatar_url.trim(),
                updated_at: new Date().toISOString()
            } );
            onUpdate( updated );
            toast.success( "Profile updated successfully" );
        } catch ( error )
        {
            console.error( error );
            if ( error.code === '23505' )
            { // PostgreSQL unique violation code
                toast.error( "That username is already taken" );
            } else
            {
                toast.error( "Failed to update settings. Please try again." );
            }
        } finally
        {
            setLoading( false );
        }
    };

    return (
        <Card className="mt-12 bg-bg-surface/30">
            <Card.Header className="flex items-center gap-3">
                <Settings className="text-brand shrink-0" size={ 20 } />
                <h3 className="text-h4 font-bold tracking-tight mb-0">Profile Settings</h3>
            </Card.Header>
            <Card.Body>
                <form onSubmit={ handleSave } className="space-y-6">
                    {/* Username */ }
                    <Input
                        id="username"
                        name="username"
                        label="Username"
                        placeholder="e.g. tech_guru99"
                        value={ formData.username }
                        onChange={ handleChange }
                        helperText="Used for your public URL (/u/username)"
                        leftIcon={ <span className="text-text-muted font-mono leading-none flex pb-1">@</span> }
                    />

                    {/* Bio */ }
                    <div className="flex flex-col gap-1.5 w-full">
                        <label htmlFor="bio" className="text-sm font-medium text-text-secondary">Bio / Tagline</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={ formData.bio }
                            onChange={ handleChange }
                            rows="3"
                            maxLength="160"
                            className="w-full bg-glass-bg border border-border-subtle rounded-xl text-text-primary p-4 focus:outline-none focus:border-brand focus:shadow-[0_0_12px_2px_var(--color-brand-glow)] focus:bg-transparent resize-none transition-all duration-300 ease-out"
                            placeholder="Tell the community about your setup and tech interests..."
                        />
                        <div className="flex justify-end text-xs text-text-muted mt-1">
                            { formData.bio.length } / 160
                        </div>
                    </div>

                    {/* Avatar URL (simple fallback until storage is required) */ }
                    <Input
                        id="avatar_url"
                        name="avatar_url"
                        label="Avatar Image URL (Optional)"
                        placeholder="https://example.com/my-photo.jpg"
                        value={ formData.avatar_url }
                        onChange={ handleChange }
                        leftIcon={ <ImageIcon size={ 18 } /> }
                        helperText="Paste a direct link to an image. (Storage uploads coming soon)"
                    />

                    <div className="flex flex-wrap gap-4 items-center justify-between border-t border-border-subtle pt-6">
                        <p className="text-sm text-text-muted">
                            Changes will affect all your public contributions.
                        </p>
                        <Button type="submit" loading={ loading } leftIcon={ <Save size={ 18 } /> }>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
}
