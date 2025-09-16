
import FooterCompact from '@/components/auth/common/footer-compact';
import Logo from '@/components/ui/logo';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center py-40">
      <Link href={'/'}>
        <Logo />
      </Link>
      {children}
      
      {/* Footer */}
      <FooterCompact />
    </section>
  );
}
