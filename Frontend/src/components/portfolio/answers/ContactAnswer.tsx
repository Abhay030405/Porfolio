import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import type { ContactContent } from "@/portfolio/types";
import { Bullets, Divider, Heading, Label, Lead, Para, Quote, Stack } from "./primitives";

/* Contact: a copyable email card first (the thing people come for), then links and what I'm open to. */

const toHref = (value: string) => (/^(https?:|mailto:)/.test(value) ? value : `https://${value}`);

const EmailCard = ({ email, note }: { email: string; note: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked — the mailto link still works
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-orange-400/10">
          <Mail className="h-4 w-4 text-orange-300" />
        </div>
        <a href={`mailto:${email}`} className="min-w-0 flex-1 truncate font-serif text-[1.0625rem] text-foreground hover:underline underline-offset-4">
          {email}
        </a>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 font-sans text-[0.8125rem] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-2.5 py-1.5 font-sans text-[0.8125rem] font-medium text-background hover:bg-foreground/90 transition-colors"
          >
            Email me
          </a>
        </div>
      </div>
      {note && <p className="mt-3 font-sans text-[0.8125rem] text-muted-foreground">{note}</p>}
    </div>
  );
};

const ContactAnswer = ({ data, animate }: { data: ContactContent; animate: boolean }) => (
  <Stack animate={animate} gap="gap-6">
    <Lead text={data.opener} />
    <Quote text={data.quote} />

    <section className="space-y-3">
      <Heading>Get in touch</Heading>
      <Para text={data.pitch} />
      {data.email && <EmailCard email={data.email} note={data.emailNote} />}
    </section>

    {data.linkGroups.length > 0 && (
      <section className="space-y-4">
        <Heading>Online presence</Heading>
        <div className="grid gap-5 sm:grid-cols-2">
          {data.linkGroups.map((group) => (
            <div key={group.title}>
              <Label>{group.title}</Label>
              <div className="mt-1.5 flex flex-col">
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    href={toHref(link.value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 border-b border-white/[0.06] py-2 last:border-b-0"
                  >
                    <span className="font-serif text-[1rem] text-foreground">{link.label}</span>
                    <span className="flex min-w-0 items-center gap-1 font-sans text-[0.8125rem] text-muted-foreground group-hover:text-foreground transition-colors">
                      <span className="truncate">{link.value}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {data.openTo.length > 0 && (
      <>
        <Divider />
        <section className="space-y-3">
          <Heading>What I'm open to</Heading>
          <Bullets items={data.openTo} />
        </section>
      </>
    )}

    <Quote text={data.closingQuote} />
  </Stack>
);

export default ContactAnswer;
