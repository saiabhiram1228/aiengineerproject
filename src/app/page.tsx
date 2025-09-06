
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function LandingPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Icons.logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            MailPilot AI
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="flex flex-col items-center justify-center text-center gap-6 py-24 px-4 md:px-6">
        <div className="flex items-center gap-3 mb-4">
          <Icons.logo className="h-16 w-16 text-primary" />
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            MailPilot AI
          </h1>
        </div>
          <p className="max-w-2xl text-lg text-muted-foreground">
            An AI-Powered Communication Assistant to intelligently manage your emails. Analyze, prioritize, and generate responses with ease.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
