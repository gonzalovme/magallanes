export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--background)' }}>
      
      <div className="text-center max-w-2xl px-8">
        
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-2"
            style={{ color: 'var(--brand)' }}>
            Magallanes
          </h1>
          <p className="text-xl font-light tracking-widest uppercase"
            style={{ color: 'var(--accent)' }}>
            by IBS
          </p>
        </div>

        {/* Tagline */}
        <p className="text-lg mb-12"
          style={{ color: 'var(--text-secondary)' }}>
          Desarrolla tu pensamiento crítico
        </p>

        {/* Botón */}
        <button className="px-8 py-4 rounded-lg text-white font-medium text-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--brand)' }}>
          Comenzar exploración
        </button>

      </div>
    </main>
  );
}