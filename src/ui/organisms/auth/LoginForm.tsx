"use client";
import {
  ILoginRequest,
} from "@/app/core/application/dto/auth";
import { IErrorResponse, IFieldError } from "@/app/core/application/dto/common";
import inputAlert from "@/ui/atoms/Alert";
import { FormField } from "@/ui/molecules/common/FormField";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("El correo es inválido")
    .required("El correo el obligatorio"),
  password: yup
    .string()
    .min(8, "La contraseña debe tener  al menos 8  caracteres")
    .required("La contraseña es obligatoria"),
});

export const LoginForm = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ILoginRequest>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(loginSchema),
  });

  const router = useRouter()
  const handleLogin = async (data: ILoginRequest) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: data.email,
        password: data.password,
      });

      if (result?.error) {
        console.log("Ocurrio un error", JSON.parse(result.error));
        handleError(JSON.parse(result.error))
        return;
      }
      inputAlert("Welcome", "success");
      router.push("/dashboard/projects")
    } catch (error) {
      console.log(error);
    }
  };

  const handleError = (error: unknown):void => {
    const erroData = error as IErrorResponse;
    if (erroData && erroData.errors) {
      if (Array.isArray(erroData.errors) && "field" in erroData.errors[0]) {
        erroData.errors.forEach((fieldError) => {
          const { field, error } = fieldError as IFieldError;
          setError(field as keyof ILoginRequest, {
            message: error,
          });
        });
      } else {
        if ("message" in erroData.errors[0]) {
          setError("email", {
            message: erroData.errors[0].message,
          });
        }
      }
      inputAlert("Error with the credentials", "error");
    }
  };

  return (
    <form
      className="w-full max-w-sm mx-auto p-4 space-y-4 text-black"
      onSubmit={handleSubmit(handleLogin)}
    >
      <h2 className="text-2xl font-bold  text-center text-black">Iniciar Sesión</h2>

      <p className="text-sm text-center text-gray-500">Ingresa tus credenciales para acceder a tu cuenta</p>

      <FormField<ILoginRequest>
        control={control}
        type="email"
        label="Correo Electrónico"
        name="email"
        error={errors.email}
        placeholder="Ingresa tu correo"
      />

      <FormField<ILoginRequest>
        control={control}
        type="password"
        label="Contraseña"
        name="password"
        error={errors.password}
        placeholder="Ingresa tu contraseña"
      />
      <button
        type="submit"
        className="w-full py-2 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-600"
      >
        Iniciar Sesión
      </button>
      <p className="text-sm text-center text-blue-600"><Link href="/forgot">¿Olvidaste tu contraseña?</Link></p>
      <p className="text-sm text-center text-gray-800">¿No tienes una cuenta?<Link className="text-sm text-center text-blue-600" href="/register"> Regístrate aquí</Link></p>

    </form>
  );
};