import { contactEmail, contactMailto, siteContent } from "../content";
import { SectionHeader } from "./SectionHeader";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="section-snap relative border-t border-white/10 px-4 py-24 sm:px-6"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeader
          eyebrow="Contact"
          title="Let's build what's next"
          subtitle={`Partnerships, product inquiries, or IT consulting — reach out and we'll connect you with the right team at ${siteContent.companyName}.`}
          titleId="contact-heading"
          className="mx-auto"
        />
        <a
          href={contactMailto()}
          className="mt-10 inline-flex min-h-[52px] items-center justify-center rounded-full bg-lors-accent px-10 py-3 text-base font-semibold text-white shadow-lg shadow-lors-accent/30 transition hover:bg-lors-glow hover:text-lors-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lors-glow"
        >
          Get in touch
        </a>
        <p className="mt-4">
          <a
            href={`mailto:${contactEmail()}`}
            className="text-sm text-lors-glow/90 transition hover:text-lors-glow hover:underline"
          >
            {contactEmail()}
          </a>
        </p>
      </div>
    </section>
  );
}
