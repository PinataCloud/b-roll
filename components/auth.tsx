import {SignInButton, useProfile} from '@farcaster/auth-kit';
import {UploadForm} from "@/components/upload-form";

export function Auth () {
    const {
        isAuthenticated,
    } = useProfile();
    if (isAuthenticated) {
        return <div>
            <UploadForm />
        </div>
    } else {
        return <div>
            <SignInButton />
        </div>
    }
}