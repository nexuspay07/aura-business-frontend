# Founder private Alpha smoke test

Run this check against the intended release before inviting testers.

## Public experience

- [ ] Homepage loads over HTTPS with the Aevric AI title and no visible legacy Aura branding.
- [ ] Footer shows © 2026 Aevric and working links for Aevric, Privacy, Terms, and Private Alpha.
- [ ] `/privacy`, `/terms`, and `/alpha` load directly and remain readable on phone and desktop widths.
- [ ] Effective date is September 2026 on all three pages.
- [ ] Public contact and jurisdiction details match the founder-approved values.

## Account flow

- [ ] Registration requires legal acknowledgement.
- [ ] Terms and Privacy links open the correct public pages without losing entered signup data unexpectedly.
- [ ] A new invited-user account can register, log in, log out, and log back in.
- [ ] Authentication failures show a useful message without exposing technical details.

## Core Alpha flow

- [ ] A normal prompt receives a response.
- [ ] The composer displays the AI accuracy disclaimer.
- [ ] A current-information request either provides inspectable sources or clearly says live retrieval is unavailable.
- [ ] An important decision can be worked through and, only when chosen, saved and revisited.
- [ ] Starting a new conversation does not unexpectedly convert prior conversation content into saved context.

## Operations and invite readiness

- [ ] Production frontend points to the intended production API.
- [ ] API health and browser CORS checks pass from the production origin.
- [ ] No secrets, local test configuration, test artifacts, or environment files are included in the release commit.
- [ ] Founder has selected the invitation/feedback channel and can receive replies.
- [ ] Invite and tester-guide wording matches the deployed product.
