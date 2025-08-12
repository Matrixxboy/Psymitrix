export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Find Peace
            </span>
            <br />
            <span className="text-foreground">of Mind</span>
          </h1>
          <p className="max-w-[600px] mx-auto text-base md:text-lg text-muted-foreground">
            Experience a new way of emotional support. Our AI companion is here
            to listen, understand, and guide you through life's journey.
          </p>
        </div>
      </section>
    </div>
  );
}
