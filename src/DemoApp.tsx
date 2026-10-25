import { Button } from "@/components/ui/Button";
import { DemoDispatch } from "@/components/DemoDispatch";
import { DemoMatrix } from "@/components/DemoMatrix";
import { DemoOneSave } from "@/components/DemoOneSave";
import { Logo } from "@/components/ui/Logo";
import { MotionProvider } from "@/lib/motion";

export default function DemoApp() {
  return (
    <MotionProvider>
      <div className="min-h-screen bg-paper text-ink">
        <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 px-5 py-3 backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <a href="/" aria-label="Fleet OPS home" className="rounded-full">
              <Logo />
            </a>
            <Button href="/" variant="ghost" icon="arrow-left" className="px-4 py-2.5 text-sm">
              Back to site
            </Button>
          </div>
        </header>

        <main>
          <section className="bg-paper px-5 pb-8 pt-20 sm:px-8 sm:pt-28">
            <div className="mx-auto max-w-6xl">
              <p className="eyebrow text-brand">Interactive demo</p>
              <h1 className="display mt-4 max-w-4xl text-[clamp(3rem,8vw,7rem)]">See the work before you book.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
                Use example data to inspect papers, decide dispatch, and save one trip across three books.
              </p>
            </div>
          </section>
          <DemoMatrix />
          <DemoDispatch />
          <DemoOneSave />
        </main>

        <footer className="border-t border-ink/10 bg-ink px-5 py-10 text-center text-paper sm:px-8">
          <p className="text-sm text-paper/70">Example data only. Fleet OPS does not track vehicles.</p>
          <a href="/" className="mt-3 inline-block font-semibold text-lime underline underline-offset-4">
            Return to Fleet OPS
          </a>
        </footer>
      </div>
    </MotionProvider>
  );
}
