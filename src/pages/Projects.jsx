export default function Projects() {
  return (
    <section
      id="projects"
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
        <div style={{ height: 36, background: 'var(--border)', borderRadius: 8, marginBottom: '2rem', width: '35%' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: 140,
                background: 'var(--border)',
                borderRadius: 8,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
