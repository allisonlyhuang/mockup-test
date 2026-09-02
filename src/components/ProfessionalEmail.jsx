import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Img,
  Text,
  Heading,
  Button,
  Hr,
  Link,
} from 'react-email';

// ── Design tokens ───────────────────────────────────────────
const colors = {
  background: '#f4f4f5',
  card: '#ffffff',
  text: '#18181b',
  muted: '#71717a',
  border: '#e4e4e7',
  brand: '#111827',
  brandText: '#ffffff',
};

const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// ── Template ─────────────────────────────────────────────────
export function ProfessionalEmail({
  recipientName = 'name',
  heading = 'Your application has been received.',
  bodyText = "Thank you so much for your interest in our program! We're so excited for what's in store. View the program timeline and make sure you can attend all necessary events. Decisions will be released October 4th. Keep an eye out!",
  ctaLabel = 'View Timeline',
  ctaUrl = 'https://example.com/timeline',
  contactEmail = 'design+mockup@uci.edu',
  orgLine = 'Design @ UCI · Mockup x Roblox · Fall 2026',
  websiteUrl = 'https://example.com',
  instagramUrl = 'https://instagram.com/example',
  emailUrl = 'mailto:design+mockup@uci.edu',
  logoSrc = 'https://mockup-test-six.vercel.app/top_logo.png',
}) {
  return (
    <Html>
      <Head />
      <Preview>{heading}</Preview>
      <Body style={{ backgroundColor: colors.background, fontFamily, margin: 0, padding: '32px 0' }}>
        <Container
          style={{
            backgroundColor: colors.card,
            maxWidth: '560px',
            margin: '0 auto',
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Section style={{ padding: '32px 40px 0' }}>
            <Img src={logoSrc} width="111" height="41" alt="Design @ UCI" style={{ display: 'block' }} />
          </Section>

          <Hr style={{ borderColor: colors.border, margin: '24px 0 0' }} />

          {/* Body */}
          <Section style={{ padding: '32px 40px' }}>
            <Heading
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: colors.text,
                margin: '0 0 16px',
                lineHeight: 1.4,
              }}
            >
              {heading}
            </Heading>

            <Text style={{ fontSize: '15px', color: colors.text, lineHeight: 1.6, margin: '0 0 8px' }}>
              Hi {recipientName},
            </Text>
            <Text style={{ fontSize: '15px', color: colors.text, lineHeight: 1.6, margin: '0 0 28px' }}>
              {bodyText}
            </Text>

            <Button
              href={ctaUrl}
              style={{
                backgroundColor: colors.brand,
                color: colors.brandText,
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                display: 'inline-block',
              }}
            >
              {ctaLabel}
            </Button>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: 0 }} />

          {/* Footer */}
          <Section style={{ padding: '24px 40px' }}>
            <Text style={{ fontSize: '12px', color: colors.muted, lineHeight: 1.6, margin: '0 0 8px' }}>
              Do not reply to this email. For any questions, reach out to{' '}
              <Link href={`mailto:${contactEmail}`} style={{ color: colors.muted, textDecoration: 'underline' }}>
                {contactEmail}
              </Link>
              .
            </Text>
            <Hr style={{ borderColor: colors.border, margin: '16px 0' }} />
            <Text style={{ fontSize: '12px', color: colors.muted, lineHeight: 1.6, margin: '0 0 4px' }}>
              {orgLine}
            </Text>
            <Text style={{ fontSize: '12px', color: colors.muted, margin: 0 }}>
              <Link href={websiteUrl} style={{ color: colors.muted, textDecoration: 'underline' }}>
                Website
              </Link>
              {'  ·  '}
              <Link href={instagramUrl} style={{ color: colors.muted, textDecoration: 'underline' }}>
                Instagram
              </Link>
              {'  ·  '}
              <Link href={emailUrl} style={{ color: colors.muted, textDecoration: 'underline' }}>
                Email
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
