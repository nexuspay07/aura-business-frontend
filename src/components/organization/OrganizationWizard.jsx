import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createOrganization } from "../../services/organizationService";
import { useSession } from "../../context/SessionContext";

export default function OrganizationWizard() {

    const navigate = useNavigate();

    const { refreshSession } = useSession();

    const [name, setName] = useState("");

    const [industry, setIndustry] = useState("Technology");

    const [companySize, setCompanySize] = useState("1-10");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");

        if (!name.trim()) {

            setError("Organization name is required.");

            return;

        }

        try {

            setLoading(true);

            await createOrganization({

                name,

                industry,

                company_size: companySize

            });

            await refreshSession();

            navigate("/dashboard", { replace: true });

        }

        catch (err) {

            console.error(err);

            setError(

                err?.response?.data?.detail ||

                "Unable to create organization."

            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="max-w-xl mx-auto mt-20 bg-white rounded-xl shadow-lg p-8">

            <h1 className="text-3xl font-bold mb-2">

                Welcome to Aura

            </h1>

            <p className="text-gray-600 mb-8">

                Build your Executive Intelligence Workspace.

            </p>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                <div>

                    <label className="block mb-2 font-medium">

                        Organization Name

                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded-lg p-3"
                        placeholder="Aura Platform"
                    />

                </div>

                <div>

                    <label className="block mb-2 font-medium">

                        Industry

                    </label>

                    <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full border rounded-lg p-3"
                    >

                        <option>Technology</option>
                        <option>Finance</option>
                        <option>Healthcare</option>
                        <option>Education</option>
                        <option>Retail</option>
                        <option>Manufacturing</option>
                        <option>Consulting</option>
                        <option>Other</option>

                    </select>

                </div>

                <div>

                    <label className="block mb-2 font-medium">

                        Company Size

                    </label>

                    <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full border rounded-lg p-3"
                    >

                        <option>1-10</option>
                        <option>11-50</option>
                        <option>51-200</option>
                        <option>201-500</option>
                        <option>500+</option>

                    </select>

                </div>

                {error && (

                    <div className="text-red-600">

                        {error}

                    </div>

                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white rounded-lg p-3 disabled:opacity-50"
                >

                    {loading

                        ? "Creating Organization..."

                        : "Create Organization"}

                </button>

            </form>

        </div>

    );

}
