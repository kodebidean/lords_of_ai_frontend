import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-got-dark-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-got bg-gradient-tech text-transparent bg-clip-text mb-4 animate-float">
          Lords of AI
        </h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-got-tech mx-auto"></div>
      </div>
    </div>
  );
}
