export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem 2rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: 600 }}>
        <div style={{ height: 56, background: 'var(--border)', borderRadius: 8, marginBottom: '1.5rem' }} />
        <div style={{ height: 20, background: 'var(--border)', borderRadius: 4, marginBottom: '0.75rem' }} />
        <div style={{ height: 20, background: 'var(--border)', borderRadius: 4, width: '70%' }} />
      </div>
    </section>
  );
}
