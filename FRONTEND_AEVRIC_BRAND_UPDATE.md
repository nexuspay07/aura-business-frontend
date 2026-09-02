# Frontend Aevric AI Brand Update

## Outcome

- Public brand: `Aevric AI`
- Browser title: `Aevric AI`
- Old public `Aura`, `Aura AI`, `Aura Business`, `Aura Business Dashboard`, and `aura-business-frontend` labels: removed from rendered frontend copy
- User-visible Aura references remaining: 0
- Internal Aura references remaining: yes, expected (API helpers, component/function names, capabilities, storage keys, package/repository identifiers, and test fixtures)
- Backend files changed for branding: none
- API, authentication, database, and domain configuration: unchanged
- Logo/image redesign: none
- Deployment, commit, and push: none

## Scope

Updated browser metadata, landing and authentication surfaces, navigation, Personal experiences, business dashboard copy, organization/workspace surfaces, simulation/marketplace copy, accessibility labels, errors, empty states, and corresponding Playwright assertions.

The pre-existing edits in `index.html` and `src/components/navigation/Sidebar.jsx` were preserved; only their public brand presentation was adjusted.

## Manual Founder Verification Failure

The founder correctly reported that the instance they inspected still rendered the old Aura brand and the browser title `aura-business-frontend`. The earlier report was incomplete because it verified the modified source/build but did not prove that the founder's running URL was serving that working tree.

### Root cause

The screenshots match the repository's committed `HEAD`, not the current modified working tree:

- `git show HEAD:index.html` contains `<title>aura-business-frontend</title>`.
- `git show HEAD:src/pages/LandingVision.jsx` contains the screenshot strings `Aura`, `Ask Aura anything`, and `Try Aura`.
- `git show HEAD:src/pages/PersonalHome.jsx` contains `Talk to Aura` and `Use Aura for decisions`.
- `git show HEAD:src/components/navigation/Sidebar.jsx` contains the old application and navigation brand.

The Aevric AI changes are intentionally uncommitted and undeployed. Therefore, any pre-existing build, deployment, or process sourced from committed `HEAD` continues to show Aura. At investigation time no Aura/Aevric process was listening locally; ports 4173 and 4174 were both Bime preview processes from `K:\Bime\bime-user-dashboard`.

The Bime port collision explains why the earlier default-port Playwright run did not validate this frontend. It did not produce the founder's Aura screenshots; those came from a separate pre-brand/committed frontend instance.

### Runtime/component trace

| Observed old string | Source in committed HEAD | Component / route | User visible | Current working-tree repair |
| --- | --- | --- | --- | --- |
| `aura-business-frontend` | `index.html` | document title / all routes | Yes | `Aevric AI` |
| landing `Aura` / `AURA` labels | `src/pages/LandingVision.jsx` | `LandingVision` / `/` | Yes | `Aevric AI` |
| `Ask Aura anything` | `src/pages/LandingVision.jsx` | `LandingVision` / `/` | Yes | `Ask Aevric AI anything` |
| `Try Aura` | `src/pages/LandingVision.jsx` | `LandingVision` / `/` | Yes | `Try Aevric AI` |
| authenticated application brand | `src/components/navigation/Sidebar.jsx` | `Sidebar` / authenticated routes | Yes | `Aevric AI` |
| sidebar `Aura` item | `src/components/navigation/Sidebar.jsx` | `Sidebar` / authenticated routes | Yes | `Aevric AI` |
| `Talk to Aura` | `src/pages/PersonalHome.jsx` | `PersonalHome` / `/dashboard` | Yes | `Talk to Aevric AI` |
| `Use Aura for decisions` | `src/pages/PersonalHome.jsx` | `PersonalHome` / `/dashboard` | Yes | `Use Aevric AI for decisions` |

`src/App.jsx` imports `Landing` for `/`; `src/pages/Landing.jsx` exports `LandingVision` as its default. Authenticated routes use `DashboardLayout`, which renders `Sidebar`. No React effect, route metadata, manifest, environment setting, or runtime assignment overwrites `document.title`; `index.html` is authoritative.

### Final rendered verification

The verified repository was served with its actual `npm.cmd run dev` script at `http://127.0.0.1:43179/`. Playwright inspected the live DOM, not merely source text:

- `/`: title `Aevric AI`, visible brand `Aevric AI`, old whole-word `Aura` count 0, `Try Aura` absent, `Ask Aura anything` absent.
- `/dashboard` with a mocked Personal session: title `Aevric AI`, visible brand `Aevric AI`, old whole-word `Aura` count 0, `Talk to Aura` absent, `Use Aura for decisions` absent.
- Dedicated rendered-runtime assertion: 1 passed.

The founder-observed UI contained 13 old-brand occurrences when the browser title is included. The verified current runtime contains 0 user-visible Aura references.

## Validation

- `npm.cmd run lint`: PASS
- `npm.cmd run build`: PASS (Vite production build, 1,845 modules)
- Dedicated live-runtime public and authenticated branding verification: PASS (1 passed)
- Relevant landing/navigation checks against the verified runtime: PASS (2 passed)
- Three selected authenticated `aura-os.spec.js` scenarios remain FAIL because their legacy authentication/network mocks do not establish the expected Personal route state. These failures are reported separately and are not presented as branding passes.
- Full Playwright attempt on the repository's default port was invalid because ports 4173 and 4174 serve an unrelated Bime application.
- Earlier isolated full-suite result: 21 passed and 19 failed; no full-suite success is claimed.

## Files Changed

- `index.html`
- `src/App.jsx`
- `src/components/auth/AuthLayout.jsx`
- `src/components/dashboard/panels/ExecutiveBrief.jsx`
- `src/components/dashboard/panels/ExecutiveRecommendations.jsx`
- `src/components/dashboard/panels/IntelligenceTimeline.jsx`
- `src/components/dashboard/panels/QuickActions.jsx`
- `src/components/intelligence/AuraBrainCard.jsx`
- `src/components/intelligence/ExecutiveReport.jsx`
- `src/components/navigation/Sidebar.jsx`
- `src/components/navigation/Topbar.jsx`
- `src/components/organization/OrganizationWizard.jsx`
- `src/components/personal/PersonalAsk.jsx`
- `src/components/personal/PersonalAskExperience.jsx`
- `src/pages/AuraCommandCenter.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/Landing.jsx`
- `src/pages/LandingVision.jsx`
- `src/pages/MarketplacePage.jsx`
- `src/pages/OrganizationSetup.jsx`
- `src/pages/OrganizationsPage.jsx`
- `src/pages/PersonalConversationsPage.jsx`
- `src/pages/PersonalDecisionDetailExperience.jsx`
- `src/pages/PersonalDecisionDetailPage.jsx`
- `src/pages/PersonalDecisionsExperience.jsx`
- `src/pages/PersonalDecisionsPage.jsx`
- `src/pages/PersonalHome.jsx`
- `src/pages/SessionsPage.jsx`
- `src/pages/SimulationsPage.jsx`
- `src/pages/WorkspacesPage.jsx`
- `e2e/aura-os.spec.js`
- `e2e/landing-vision.spec.js`
- `e2e/personal-foundation.spec.js`
- `e2e/phase2-conversation.spec.js`
- `e2e/response-presentation.spec.js`
- `FRONTEND_AEVRIC_BRAND_UPDATE.md`
