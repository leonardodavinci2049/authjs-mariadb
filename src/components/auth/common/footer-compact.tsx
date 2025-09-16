export default function FooterCompact() {
  return (
    <footer className="text-muted-foreground border-t py-4 text-center text-sm">
      <div className="container mx-auto px-4">
        <p>
          © {new Date().getFullYear()} App Base. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
