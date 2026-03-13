"use client"

import {
  Menu,
  FileText,
  Phone,
  ShoppingCart,
  HelpCircle,
  Users,
  Building,
  GraduationCap,
  Shield,
  Search,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  Clock,
  CheckCircle,
} from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface PixData {
  qrCodeBase64: string
  copiaECola: string
  txid: string
  expiration: string
  amountCents: number
}

export default function PixPage() {
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string>("PENDING")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const generatePix = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get customer data from localStorage
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
      }

      if (!customerData.cpf) {
        setError("CPF não encontrado. Por favor, volte e consulte seu CPF novamente.")
        setLoading(false)
        return
      }

      const response = await fetch("/api/pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerData.nome,
          customerDocument: customerData.cpf,
          customerPhone: customerData.telefone,
          customerEmail: customerData.email,
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
  }, [])

  useEffect(() => {
    if (mounted) {
      generatePix()
    }
  }, [mounted, generatePix])

  // Poll for payment status
  useEffect(() => {
    if (!pixData?.txid || paymentStatus === "APPROVED") return

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/pix?txid=${pixData.txid}`)
        const data = await response.json()
        if (data.success && data.status) {
          setPaymentStatus(data.status)
        }
      } catch (err) {
        // Silent fail for status check
      }
    }

    const interval = setInterval(checkStatus, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [pixData?.txid, paymentStatus])

  const copyToClipboard = async () => {
    if (!pixData?.copiaECola) return

    try {
      await navigator.clipboard.writeText(pixData.copiaECola)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      // Fallback for older browsers
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: "Verdana, sans-serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#f5f3f0" }}>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <button className="text-blue-600 text-sm">Acessibilidade</button>
          </div>
        </div>

        <div className="h-px bg-white w-full"></div>

        <div className="flex items-center justify-between px-4 py-3">
          <div className="md:hidden flex items-center justify-between w-full">
            <Menu className="w-6 h-6 text-chart-3" />
            <img src="/images/correios-logo.png" alt="Correios" className="h-7" />
            <div className="w-6"></div>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1">
            <Menu className="w-6 h-6 text-chart-3" />
            <img src="/images/correios-logo.png" alt="Correios" className="h-7" />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="bg-gray-300 mr-3 w-px h-[30px]"></div>
            <img src="/images/login-icon.png" alt="Entrar" className="h-8 w-[41px]" />
            <span className="text-[rgba(0,63,253,1)] font-light">Entrar</span>
          </div>
        </div>

        <div className="bg-yellow-400 w-full h-px"></div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-4 tracking-normal text-base">
          <span className="md:hidden">
            <a href="/" className="text-blue-600 hover:underline">
              {"<"}
            </a>
            <span className="text-black ml-1">Pagamento PIX</span>
          </span>
          <div className="hidden md:flex items-center gap-2 text-blue-600">
            <a href="/" className="hover:underline">
              Portal Correios
            </a>
            <span className="text-foreground">{">"}</span>
            <a href="/" className="hover:underline">
              Rastreamento
            </a>
            <span className="text-foreground">{">"}</span>
            <span>Pagamento PIX</span>
          </div>
        </nav>

        {/* Payment Content */}
        <div className="bg-white p-6 rounded-sm">
          <h1 className="text-2xl font-bold text-[rgba(0,64,105,1)] mb-6">Pagamento via PIX</h1>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600 text-lg">Gerando QR Code PIX...</p>
              <p className="text-gray-500 text-sm mt-2">Aguarde um momento</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 font-medium mb-4">{error}</p>
              <Button
                onClick={generatePix}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Payment Approved State */}
          {paymentStatus === "APPROVED" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">Pagamento Confirmado!</h2>
              <p className="text-green-600 mb-4">
                Sua encomenda será liberada em breve. Acompanhe o rastreamento para mais atualizações.
              </p>
              <a href="/" className="text-blue-600 hover:underline">
                Voltar para o início
              </a>
            </div>
          )}

          {/* PIX Data */}
          {pixData && !loading && !error && paymentStatus !== "APPROVED" && (
            <div className="space-y-6">
              {/* Amount */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm mb-1">Valor a pagar:</p>
                <p className="text-3xl font-bold text-[rgba(0,64,105,1)]">
                  {formatCurrency(pixData.amountCents)}
                </p>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center">
                <p className="text-gray-700 mb-4 text-center">
                  Escaneie o QR Code abaixo com o aplicativo do seu banco:
                </p>
                <div className="bg-white p-4 border-2 border-gray-200 rounded-lg shadow-sm">
                  <img
                    src={pixData.qrCodeBase64}
                    alt="QR Code PIX"
                    className="w-64 h-64 md:w-72 md:h-72"
                  />
                </div>
              </div>

              {/* Copy and Paste Code */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 font-medium mb-2 text-center">
                  Ou copie o código PIX Copia e Cola:
                </p>
                <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-600 break-all font-mono">
                    {pixData.copiaECola}
                  </p>
                </div>
                <Button
                  onClick={copyToClipboard}
                  className={`w-full ${
                    copied
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white font-bold py-3`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Código Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copiar Código PIX
                    </>
                  )}
                </Button>
              </div>

              {/* Status and Timer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-yellow-700">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Aguardando pagamento...</span>
                </div>
                <p className="text-center text-yellow-600 text-sm mt-2">
                  O QR Code expira em 1 hora. Após o pagamento, a confirmação pode levar alguns minutos.
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-3">Como pagar:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Abra o aplicativo do seu banco</li>
                  <li>Acesse a opção PIX</li>
                  <li>Escolha pagar com QR Code ou PIX Copia e Cola</li>
                  <li>Escaneie o código ou cole o texto copiado</li>
                  <li>Confirme o pagamento</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-yellow-400 text-black py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4 text-[rgba(0,64,105,1)] text-lg md:text-2xl">Fale Conosco</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[rgba(12,63,101,1)]" />
                  <span className="text-[rgba(0,65,104,1)] font-medium text-sm md:text-base">
                    Registro de Manifestações
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm md:text-base">
                    Central de Atendimento
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm md:text-base">
                    Soluções para o seu negócio
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm md:text-base">
                    Suporte ao cliente com contrato
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm md:text-base">Ouvidoria</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm md:text-base">Denúncia</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-lg md:text-2xl text-[rgba(0,64,105,1)]">Sobre os Correios</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm md:text-base">
                    Identidade corporativa
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm md:text-base">Educação e cultura</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm md:text-base">Código de ética</span>
                </li>
                <li className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm md:text-base">
                    Transparência e prestação de contas
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm md:text-base">
                    Política de Privacidade e Notas Legais
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-lg md:text-2xl text-[rgba(0,64,105,1)]">Outros Sites</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-[rgba(0,64,105,1)]">
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm md:text-base">
                    Loja online dos Correios
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8 pt-4 border-t border-yellow-500">
            <p className="text-sm">© Copyright 2025 Correios</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
