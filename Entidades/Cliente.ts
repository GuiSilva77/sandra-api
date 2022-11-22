import { Pedido } from "./Pedido";

export class Cliente {
  public Id?: number;
  public Nome?: string;
  public Login?: string;
  public Senha?: string;
  public Pedidos?: Pedido[];
}
