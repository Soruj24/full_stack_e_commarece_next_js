"use client";

import { Cookie, Info, Settings, ShieldCheck, XCircle } from "lucide-react";
import { PolicyLayout } from "@/components/policies/PolicyLayout";

export default function CookiePolicyPage() {
  const sections = [
    {
      title: "What Are Cookies?",
      icon: Info,
      content: (
        <p>
          Cookies are small text files that are placed on your computer by
          websites that you visit. They are widely used in order to make
          websites work, or work more efficiently, as well as to provide
          information to the owners of the site.
        </p>
      ),
    },
    {
      title: "Essential Cookies",
      icon: ShieldCheck,
      content: (
        <p>
          These cookies are necessary for the website to function and cannot be
          switched off in our systems. They are usually only set in response to
          actions made by you which amount to a request for services, such as
          setting your privacy preferences, logging in or filling in forms.
        </p>
      ),
    },
    {
      title: "Performance Cookies",
      icon: Settings,
      content: (
        <p>
          These cookies allow us to count visits and traffic sources so we can
          measure and improve the performance of our site. They help us to know
          which pages are the most and least popular and see how visitors move
          around the site.
        </p>
      ),
    },
    {
      title: "Managing Cookies",
      icon: XCircle,
      content: (
        <p>
          Most web browsers allow some control of most cookies through the
          browser settings. To find out more about cookies, including how to see
          what cookies have been set, visit{" "}
          <a
            href="https://www.aboutcookies.org"
            className="text-primary hover:underline"
          >
            aboutcookies.org
          </a>
          .
        </p>
      ),
    },
  ];

  return (
    <PolicyLayout
      title="Cookie Policy"
      description="We use cookies to enhance your experience and analyze our traffic."
      icon={Cookie}
      sections={sections}
      lastUpdated="December 25, 2025"
    />
  );
}
