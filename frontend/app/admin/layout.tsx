import "./admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adminShell">
      <div className="adminTopbar">
        <div className="adminTopbarInner">
          <div className="brand">
            <div className="brandDot" />
            <div>
              <div className="brandTitle">Admin</div>
              <div className="brandSub">Imóveis • Operação</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">{children}</div>
    </div>
  );
}