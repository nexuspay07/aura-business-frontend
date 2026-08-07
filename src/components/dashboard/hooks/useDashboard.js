import { useEffect, useState } from "react";

import {

    loadDashboard,

    executeIntelligence

} from "../services/dashboardService";

export default function useDashboard() {

    const [

        dashboard,

        setDashboard

    ] = useState(null);

    const [

        intelligence,

        setIntelligence

    ] = useState(null);

    const [

        loading,

        setLoading

    ] = useState(true);

    const [

        running,

        setRunning

    ] = useState(false);

    const [

        error,

        setError

    ] = useState(null);

    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    useEffect(() => {

        async function initialize() {

            try {

                const data =
                    await loadDashboard();

                setDashboard(data);

            }

            catch (err) {

                console.error(err);

                setError(err);

            }

            finally {

                setLoading(false);

            }

        }

        initialize();

    }, []);

    // =====================================================
    // EXECUTE AURA INTELLIGENCE
    // =====================================================

    async function runAura({

        message,

        sessionId = null,

        organizationId = null,

        workspaceId = null

    }) {

        setRunning(true);

        setError(null);

        try {

            const result =
                await executeIntelligence({

                    message,

                    sessionId,

                    organizationId,

                    workspaceId

                });

            setIntelligence(result);

            return result;

        }

        catch (err) {

            console.error(err);

            setError(err);

            throw err;

        }

        finally {

            setRunning(false);

        }

    }

    // =====================================================
    // RETURN
    // =====================================================

    return {

        dashboard,

        intelligence,

        loading,

        running,

        error,

        runAura

    };

}