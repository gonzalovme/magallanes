export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0A0A0A',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '0 32px' }}>
        <h1 style={{ fontSize: '64px', fontWeight: 'bold', color: '#FFFFFF', margin: '0 0 8px 0' }}>
          Magallanes
        </h1>
        <p style={{ fontSize: '18px', letterSpacing: '4px', color: '#2E86AB', margin: '0 0 32px 0', textTransform: 'uppercase' }}>
          by IBS
        </p>
        <p style={{ fontSize: '18px', color: '#999999', margin: '0 0 48px 0' }}>
          Desarrolla tu pensamiento critico 15 minutos al dia
        </p>
        <button style={{
          padding: '16px 32px',
          backgroundColor: '#2E86AB',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: '500',
          cursor: 'pointer',
        }}>
          Comenzar exploracion
        </button>
      </div>
    </main>
  );
}
