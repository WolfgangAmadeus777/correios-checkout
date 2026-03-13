import { type NextRequest, NextResponse } from "next/server"

const CPF_API_KEY = "9d97e993b9bb5849c7750841e4866c75"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cpf = searchParams.get("cpf")

  if (!cpf) {
    return NextResponse.json({ error: "CPF is required" }, { status: 400 })
  }

  // Remove any non-numeric characters from CPF
  const cleanCpf = cpf.replace(/\D/g, "")

  if (cleanCpf.length !== 11) {
    return NextResponse.json({ error: "CPF deve conter 11 dígitos" }, { status: 400 })
  }

  try {
    const apiUrl = `https://api.cpf-brasil.org/cpf/${cleanCpf}`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-API-Key": CPF_API_KEY,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (response.ok && data.success) {
      // Transform response to match expected format
      const transformedData = {
        nome: data.data.NOME,
        cpf: data.data.CPF,
        nascimento: data.data.NASC,
        sexo: data.data.SEXO,
        nome_mae: data.data.NOME_MAE,
      }
      return NextResponse.json(transformedData)
    } else {
      // Handle API errors
      const errorMessage = data.message || data.error || "Erro ao consultar CPF"
      return NextResponse.json({ error: errorMessage, code: data.code }, { status: response.status })
    }
  } catch (error) {
    console.error("[v0] Server: Error calling CPF API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
