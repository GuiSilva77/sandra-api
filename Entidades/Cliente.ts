import { Pedido } from "./Pedido";

export class Cliente {
  public Id?: number;
  public Nome?: string;
  public Login?: string;
  public Senha?: string;
  public CPF?: string | null;
  public Ativado?: boolean | null;
  public Pedidos?: Pedido[];
}
