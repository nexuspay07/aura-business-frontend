import {

    createContext,

    useContext,

    useEffect,

    useState,

    useCallback

} from "react";

import {

    getCurrentSession

} from "../services/api";

import {

    useAuth

} from "./AuthContext";

const SessionContext = createContext(null);

export function SessionProvider({

    children

}) {

    const {

        isAuthenticated,

        loading: authLoading

    } = useAuth();

    const [session, setSession] = useState({ user: null, organization: null, workspace: null });
    const { user, organization, workspace } = session;

    const [

        loading,

        setLoading

    ] = useState(true);

    const refreshSession = useCallback(async () => {

        // Authentication restoration is asynchronous.  Do not resolve the
        // session as anonymous while AuthContext is still validating a stored
        // token, otherwise protected routes can redirect before /auth/me has
        // established the organization context.
        if (authLoading) {

            return null;

        }

        if (!isAuthenticated) {

            setSession({ user: null, organization: null, workspace: null });

            setLoading(false);

            return null;

        }

        setLoading(true);

        try {

            const data = await getCurrentSession();

            setSession({ user: data.user || null, organization: data.organization || null, workspace: data.workspace || null });

            return data;

        }

        catch (error) {

            console.error(

                "Failed to load session",

                error

            );

            setSession({ user: null, organization: null, workspace: null });

            return null;

        }

        finally {

            setLoading(false);

        }

    }, [authLoading, isAuthenticated]);

    useEffect(() => {

        void Promise.resolve().then(refreshSession);

    }, [refreshSession]);

    return (

        <SessionContext.Provider

            value={{

                user,

                organization,

                workspace,

                loading,

                refreshSession,

                setSession

            }}

        >

            {children}

        </SessionContext.Provider>

    );

}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession() {

    return useContext(SessionContext);

}
