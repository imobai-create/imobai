
import Link from "next/link";

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <header className="px-10 py-6 border-b border-neutral-200 flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold">ImobAI</div>
          <div className="text-sm text-neutral-500">IMOBAI — você no comando.</div>
        </div>
        <nav className="flex gap-8 text-sm text-neutral-600">
          <Link className="hover:text-black" href="/marketplace">Marketplace</Link>
          <Link className="hover:text-black" href="/vender">Vender imóvel</Link>
          <Link className="hover:text-black" href="/diligencia">Diligência</Link>
          <Link className="hover:text-black" href="/planos">Planos</Link>
        </nav>
      </header>

      <section className="px-10 py-12 max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold">Como funciona</h1>
        <p className="text-neutral-600 mt-2">
          Um fluxo simples, sem enrolação e com segurança. Sem corretor “picareta”, sem burocracia infinita.
        </p>

        <div className="mt-10 space-y-6">
          <div className="border border-neutral-200 rounded-xl p-6">
            <div className="text-sm text-neutral-500">Passo 1</div>
            <div className="text-xl font-semibold mt-1">O vendedor cadastra o imóvel</div>
            <div className="mt-2 text-neutral-700">
              O imóvel entra como <b>PENDENTE</b> para revisão e diligência básica.
            </div>
          </div>

          <div className="border border-neutral-200 rounded-xl p-6">
            <div className="text-sm text-neutral-500">Passo 2</div>
            <div className="text-xl font-semibold mt-1">O comprador encontra e abre negociação</div>
            <div className="mt-2 text-neutral-700">
              Clique em <b>Tenho interesse</b> e a negociação é criada com chat interno.
            </div>
          </div>

          <div className="border border-neutral-200 rounded-xl p-6">
            <div className="text-sm text-neutral-500">Passo 3</div>
            <div className="text-xl font-semibold mt-1">Chat sem troca de contato</div>
            <div className="mt-2 text-neutral-700">
              Até assinar o contrato de indicação, o sistema bloqueia troca de telefone/e-mail.
            </div>
          </div>

          <div className="border border-neutral-200 rounded-xl p-6">
            <div className="text-sm text-neutral-500">Passo 4</div>
            <div className="text-xl font-semibold mt-1">Fechamento com escrow</div>
            <div className="mt-2 text-neutral-700">
              No fechamento, pagamento entra no escrow e é liberado ao vendedor.
              A taxa de 1% é aplicada automaticamente no release.
            </div>
          </div>
        </div>
      </section>

      <footer className="px-10 py-10 border-t border-neutral-200 text-sm text-neutral-500">
        © {new Date().getFullYear()} ImobAI. Todos os direitos reservados.
      </footer>
    </main>
  );
}