export default function ProjectScope() {
  return (
    <section
      id="join-us"
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
        <div style={{ height: 36, background: 'var(--border)', borderRadius: 8, marginBottom: '2rem', width: '30%' }} />
        <div style={{ height: 16, background: 'var(--border)', borderRadius: 4, marginBottom: '0.75rem' }} />
        <div style={{ height: 16, background: 'var(--border)', borderRadius: 4, width: '65%', marginBottom: '2rem' }} />
        <div style={{ height: 44, background: 'var(--border)', borderRadius: 6, width: 160 }} />
      </div>
    </section>
  );
}