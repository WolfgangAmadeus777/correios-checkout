import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cpf = searchParams.get("cpf")

  if (!cpf) {
    return NextResponse.json({ error: "CPF is required" }, { status: 400 })
  }

  try {
    console.log("[v0] Server: Calling CPF API for:", cpf)

    const apiUrl = `https://apela-api.tech/?user=a39d1d540e8677beb6b8bd8669c02df3&cpf=${cpf}`
    console.log("[v0] Server: API URL:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    console.log("[v0] Server: API Response status:", response.status)

    if (response.ok) {
      const data = await response.json()
      console.log("[v0] Server: API Response data:", data)
      return NextResponse.json(data)
    } else {
      console.log("[v0] Server: API call failed with status:", response.status)
      return NextResponse.json({ error: "API call failed" }, { status: response.status })
    }
  } catch (error) {
    console.error("[v0] Server: Error calling CPF API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
