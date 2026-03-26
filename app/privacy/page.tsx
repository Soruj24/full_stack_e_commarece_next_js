"use client";

import { PolicyLayout } from "@/components/policies/PolicyLayout";
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  UserCheck, 
  Globe, 
  Mail,
  FileText,
  Cookie,
  UserMinus
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: Eye,
      content: (
        <div className="space-y-4">
          <p>We collect information that you provide directly to us when you create an account, make a purchase, or communicate with us. This includes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name, email address, and password</li>
            <li>Shipping and billing addresses</li>
            <li>Phone number</li>
            <li>Payment information (processed securely via Stripe/PayPal)</li>
            <li>Communication preferences</li>
          </ul>
        </div>
      ),
    },
    {
      title: "2. How We Use Your Information",
      icon: Database,
      content: (
        <div className="space-y-4">
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process your orders and provide customer support</li>
            <li>Personalize your shopping experience</li>
            <li>Send order updates and marketing communications (if opted-in)</li>
            <li>Improve our website and services</li>
            <li>Ensure the security of our platform</li>
          </ul>
        </div>
      ),
    },
    {
      title: "3. Data Protection & Security",
      icon: Lock,
      content: (
        <p>We implement industry-standard security measures to protect your personal information. This includes SSL encryption, secure password hashing, and regular security audits. Your payment information is never stored directly on our servers.</p>
      ),
    },
    {
      title: "4. Cookies and Tracking",
      icon: Cookie,
      content: (
        <p>We use cookies to enhance your experience, remember your preferences, and analyze our traffic. You can manage your cookie preferences through the consent banner on our site or your browser settings.</p>
      ),
    },
    {
      title: "5. Your Rights (GDPR/CCPA)",
      icon: UserCheck,
      content: (
        <div className="space-y-4">
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Right to access your personal data</li>
            <li>Right to rectify inaccurate data</li>
            <li>Right to erasure (the &ldquo;right to be forgotten&rdquo;)</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
          </ul>
        </div>
      ),
    },
    {
      title: "6. Data Deletion",
      icon: UserMinus,
      content: (
        <p>If you wish to delete your account and all associated data, you can do so through your profile settings or by contacting our support team. Once requested, your data will be permanently removed from our active databases within 30 days.</p>
      ),
    },
    {
      title: "7. Contact Us",
      icon: Mail,
      content: (
        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@example.com" className="text-primary font-bold">privacy@example.com</a>.</p>
      ),
    },
  ];

  return (
    <PolicyLayout
      title="Privacy Policy"
      description="Learn how we collect, use, and protect your personal information."
      icon={Shield}
      sections={sections}
      lastUpdated="January 22, 2026"
    />
  );
}
