import LegalPageLayout, { LegalSection } from "../components/legal/LegalPageLayout";

export default function PrivateAlphaNotice() {
  return <LegalPageLayout eyebrow="Program notice" title="Private Alpha" intro="Aevric AI is currently available to a small invited group for hands-on evaluation.">
    <LegalSection title="What Alpha means"><p>This is an early, changing version of Aevric AI. Some features may be incomplete, unavailable, or behave unexpectedly. Access may be changed or withdrawn as we learn and improve the product.</p></LegalSection>
    <LegalSection title="Use appropriate information"><p>Use sample, ordinary, or otherwise appropriate information wherever possible. Do not enter passwords, payment-card details, government identifiers, health records, trade secrets, or other highly sensitive information that is not necessary for testing.</p></LegalSection>
    <LegalSection title="Check important answers"><p>Aevric AI can make mistakes. Verify important information, calculations, sources, and recommendations before relying on them. Do not use Alpha output as a replacement for qualified legal, medical, financial, or other professional advice.</p></LegalSection>
    <LegalSection title="Feedback"><p>Please share bugs, confusing moments, helpful outcomes, and missing capabilities by replying through the invitation channel you received. Do not include another person’s sensitive information in feedback.</p></LegalSection>
    <LegalSection title="Privacy and terms"><p>Your use is governed by the Privacy Policy and Terms of Use. For privacy, legal, or account questions, contact aevricai@gmail.com.</p></LegalSection>
  </LegalPageLayout>;
}
