import { Projeto } from "@/types/projeto";
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:8080"
});

export class LoginService{

    novoCadastro(usuario: Projeto.Usuario){
        return axiosInstance.post("/auth/novoUsuario", usuario);
    }

    login(login: String, senha: String){
        return axiosInstance.post("/auth/login",
            { username: login, password: senha});
    }

}
