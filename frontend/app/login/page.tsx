
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-neutral-200">
        <div className="flex flex-col">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            ImobAI
          </Link>
          <div className="text-sm text-neutral-500">IMOBAI - você no comando.</div>
        </div>

        <nav className="flex gap-8 text-sm text-neutral-600">
          <Link className="hover:text-black transition" href="/marketplace">
            Marketplace
          </Link>
          <Link className="hover:text-black transition" href="/vender">
            Vender imóvel
          </Link>
          <Link className="hover:text-black transition" href="/como-funciona">
            Como funciona
          </Link>
          <Link className="hover:text-black transition" href="/login">
            Login
          </Link>
        </nav>
      </header>

      {/* CONTENT */}
      <section className="px-10 py-16 max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold tracking-tight">Login</h1>
        <p className="mt-4 text-lg text-neutral-600 max-w-3xl">
          Entre para acompanhar seus imóveis, status de diligência, propostas e transações.
        </p>

        <div className="mt-10 max-w-xl border border-neutral-200 rounded-lg p-6">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm text-neutral-600">E-mail</label>
              <input
                className="mt-2 w-full border border-neutral-300 rounded px-3 py-2"
                placeholder="seuemail@dominio.com"
                type="email"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-600">Senha</label>
              <input
                className="mt-2 w-full border border-neutral-300 rounded px-3 py-2"
                placeholder="••••••••"
                type="password"
              />
            </div>

            <button className="bg-black text-white rounded px-4 py-2">
              Entrar (MVP)
            </button>

            <div className="text-sm text-neutral-600">
              Ainda não tem conta?{" "}
              <span className="text-neutral-900 font-medium">
                (vamos criar cadastro depois)
              </span>
            </div>

            <div className="text-xs text-neutral-500">
              * No MVP, esta tela é apenas visual. Depois integraremos autenticação e permissões.
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-sm text-neutral-700 hover:text-black">
            ← Voltar para a home
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-10 py-10 border-t border-neutral-200 text-neutral-600">
        © 2026 ImobAI. Todos os direitos reservados.
      </footer>
    </main>
  );
}