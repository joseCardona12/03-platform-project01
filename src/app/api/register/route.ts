import { RegisterService } from "@/app/infrastructure/services/registerService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const registerService = new RegisterService();
    try {
        const formData = await req.formData();  
        const newUser = registerService.register(formData);

        return NextResponse.json(newUser, { status: 200 });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
    }
}