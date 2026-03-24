import { type NextRequest, NextResponse } from "next/server"

const BOSSPAY_PUBLIC_KEY = "pk_live_f78559a96d482cf8eed577827074a068f0fe4b6adeb7add0"
const BOSSPAY_SECRET_KEY = "sk_live_dd88e95efd43f45b1a89080abe615df41af5f943271fab5d"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerDocument, customerPhone, customerEmail, amount } = body

    if (!customerName || !customerDocument || !customerPhone) {
      return NextResponse.json(
        { error: "Nome, CPF e telefone são obrigatórios" },
        { status: 400 }
      )
    }

    // Clean document (CPF)
    const cleanDocument = customerDocument.replace(/\D/g, "")
    const amountCents = Math.round((amount || 45.60) * 100)

    const response = await fetch("https://app.bosspay.cash/api/v1/pix/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Public-Key": BOSSPAY_PUBLIC_KEY,
        "X-Secret-Key": BOSSPAY_SECRET_KEY,
      },
      body: JSON.stringify({
        amount_cents: amountCents, // R$ 45,60
        customer_name: customerName,
        customer_document: cleanDocument,
        customer_phone: customerPhone.replace(/\D/g, ""),
        customer_email: customerEmail || undefined,
        description: "IOF - Imposto sobre Operações Financeiras",
        expiration: 3600, // 1 hour
      }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return NextResponse.json({
        success: true,
        txid: data.txid,
        qrCodeBase64: data.pix.qr_code_base64,
        copiaECola: data.pix.copia_e_cola,
        expiration: data.pix.expiration,
        amountCents: data.amount_cents,
      })
    } else {
      return NextResponse.json(
        { error: data.message || "Erro ao gerar PIX", code: data.code },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("[v0] Error creating PIX IOF:", error)
    return NextResponse.json(
      { error: "Erro interno ao gerar PIX" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const txid = searchParams.get("txid")

  if (!txid) {
    return NextResponse.json({ error: "txid é obrigatório" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://app.bosspay.cash/api/v1/pix/${txid}`, {
      method: "GET",
      headers: {
        "X-Public-Key": BOSSPAY_PUBLIC_KEY,
        "X-Secret-Key": BOSSPAY_SECRET_KEY,
      },
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        status: data.status,
        txid: data.txid,
      })
    } else {
      return NextResponse.json(
        { error: data.message || "Erro ao consultar status" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("[v0] Error checking PIX status:", error)
    return NextResponse.json(
      { error: "Erro interno ao consultar status" },
      { status: 500 }
    )
  }
}
