import { Cliente } from "./Cliente";
import { Produto } from "./Produto";

export class Pedido {
  public Id?: number;
  public Valor?: number;
  public Data?: Date;
  public MetPag?: string;
  public ClienteId?: number;
  public Cliente?: Cliente;
  public ProdutosPedidos?: Produto[];
}
