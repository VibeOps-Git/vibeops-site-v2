// src/pages/PrivacyPolicy.tsx

import AnimatedContent from "../components/AnimatedContent";
import { Section } from "../components/ui/Section";

export default function PrivacyPolicy() {
  return (
    <div className="pt-24 pb-16">
      <Section>
        <AnimatedContent
          distance={60}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="container mx-auto max-w-4xl">
            <div className="mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">
                Legal
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Privacy Policy
              </h1>
              <p className="text-gray-400">Last Updated: 01/05/26</p>
            </div>

            <div className="prose prose-invert prose-gray max-w-none">
              <div className="space-y-8 text-gray-300">
                <div>
                  <p className="mb-4">
                    This Privacy Policy describes how <strong>VibeOps Technologies Inc.</strong> ("VibeOps", "we", "us", or "our") collects, uses, discloses, and protects personal information in connection with our websites, applications, and services, including the <strong>Reportly</strong> platform (collectively, the "Services").
                  </p>
                  <p>
                    This Privacy Policy forms part of, and should be read together with, the <a href="/terms" className="text-[#00ffcc] hover:text-[#00ffcc]/80 transition-colors">VibeOps Subscription Agreement / Terms and Conditions</a>.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">1. Scope and Application</h2>
                  <p className="mb-4">This Privacy Policy applies to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Visitors to our website(s)</li>
                    <li>Users of our Services</li>
                    <li>Customers, trial users, and authorized users acting on behalf of a Customer</li>
                  </ul>
                  <p className="mt-4">
                    It does <strong>not</strong> apply to information processed by Customers outside of the Services or to third-party services not controlled by VibeOps.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.1 Information You Provide Directly</h3>
                  <p className="mb-4">We may collect personal information that you voluntarily provide, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Company name</li>
                    <li>Billing and payment information</li>
                    <li>Account credentials</li>
                    <li>Support communications</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Information Processed Through the Services</h3>
                  <p className="mb-4">When you use the Services, we may process:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Report content, templates, and project data uploaded by you</li>
                    <li>Metadata related to usage (e.g., timestamps, feature usage)</li>
                  </ul>
                  <p className="mt-4">
                    <strong>Important:</strong> VibeOps does <strong>not</strong> require access to personal information contained within Customer reports to operate the Services. Any such information is processed only as directed by the Customer.
                  </p>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Automatically Collected Information</h3>
                  <p className="mb-4">We may collect limited technical information such as:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>IP address</li>
                    <li>Browser type</li>
                    <li>Device information</li>
                    <li>Log data related to system performance and security</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Information</h2>
                  <p className="mb-4">
                    We use personal information only for purposes consistent with providing and improving the Services, including to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Create and manage user accounts</li>
                    <li>Provide access to the Services</li>
                    <li>Process payments and subscriptions</li>
                    <li>Provide customer support</li>
                    <li>Maintain security and prevent misuse</li>
                    <li>Improve functionality and performance</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                  <p className="mt-4">
                    We do <strong>not</strong> sell personal information.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">4. AI Processing and Data Handling</h2>
                  <p className="mb-4">The Services may include AI-assisted features. When such features are used:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Inputs are processed solely to deliver the requested functionality</li>
                    <li>Customer Data is not used to train general-purpose AI models</li>
                    <li>Where feasible, inputs are scrubbed or minimized before processing</li>
                    <li>Parsed templates and structured outputs may be stored to support product functionality</li>
                  </ul>
                  <p className="mt-4">
                    Customers remain responsible for reviewing and validating all AI-generated outputs.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">5. Access to Customer Data</h2>
                  <p className="mb-4">VibeOps personnel may access Customer Data only:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To provide support or troubleshooting requested by the Customer</li>
                    <li>To maintain or secure the Services</li>
                    <li>As required by law</li>
                  </ul>
                  <p className="mt-4">
                    We do <strong>not</strong> access Customer reports or content for unrelated purposes, and we do <strong>not</strong> review historical reports except as necessary for support.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">6. Anonymized and Aggregated Data</h2>
                  <p className="mb-4">
                    We may use aggregated, anonymized, or de-identified data derived from use of the Services to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Analyze usage trends</li>
                    <li>Improve product features</li>
                    <li>Develop new functionality</li>
                  </ul>
                  <p className="mt-4">
                    Such data does not identify individual users or Customers.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">7. Disclosure of Information</h2>
                  <p className="mb-4">We may disclose personal information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To service providers acting on our behalf (e.g., hosting, payment processing), subject to confidentiality obligations</li>
                    <li>To comply with applicable laws, regulations, or legal processes</li>
                    <li>In connection with a merger, acquisition, financing, or sale of assets</li>
                  </ul>
                  <p className="mt-4">
                    We do not disclose personal information for advertising or resale purposes.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">8. Data Storage and Security</h2>
                  <p className="mb-4">
                    We implement reasonable administrative, technical, and organizational safeguards designed to protect personal information against unauthorized access, loss, or misuse.
                  </p>
                  <p>
                    However, no system can be guaranteed to be 100% secure. Customers are responsible for maintaining the security of their access credentials.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">9. Data Retention</h2>
                  <p className="mb-4">We retain personal information only as long as necessary to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide the Services</li>
                    <li>Meet legal, accounting, or regulatory requirements</li>
                  </ul>
                  <p className="mt-4">
                    Upon termination of a Customer's subscription, Customer Data may be retained temporarily to allow export, after which it may be deleted in accordance with our data retention practices, unless legally required to retain it longer.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">10. International Data Transfers</h2>
                  <p>
                    The Services may be hosted or supported using infrastructure located outside Canada. Where personal information is transferred across borders, we take reasonable steps to ensure appropriate safeguards are in place.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">11. Your Rights</h2>
                  <p className="mb-4">Depending on applicable law, you may have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access personal information we hold about you</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Withdraw consent where applicable</li>
                  </ul>
                  <p className="mt-4">
                    Requests may be submitted using the contact information below.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">12. Children's Privacy</h2>
                  <p>
                    The Services are not intended for children under the age of 16. We do not knowingly collect personal information from children.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">13. Data Processing Agreements</h2>
                  <p>
                    Enterprise customers may request a <strong>Data Processing Agreement (DPA)</strong> governing the processing of personal information on their behalf. DPAs are provided upon request and may be required where personal information is processed at scale.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">14. Changes to This Privacy Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. Material changes will be communicated via the Services or by email. Continued use of the Services after an update constitutes acceptance of the revised Privacy Policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">15. Contact Us</h2>
                  <p className="mb-2">
                    If you have questions or concerns about this Privacy Policy or our data practices, contact:
                  </p>
                  <p className="font-semibold text-white">VibeOps Technologies Inc.</p>
                  <p>
                    Email: <a href="mailto:zander@vibeops.ca" className="text-[#00ffcc] hover:text-[#00ffcc]/80 transition-colors">zander@vibeops.ca</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContent>
      </Section>
    </div>
  );
}
