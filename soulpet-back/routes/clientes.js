import { Cliente } from "../models/cliente.js";
import { Endereco } from "../models/endereco.js";
import { Router } from "express";

// Criar o módulo de rotas
export const clientesRouter = Router();

// Listagem de todos os clientes
clientesRouter.get("/clientes", async (req, res) => {
    // SELECT * FROM clinetes;
    const listaCliente = await Cliente.findAll(); // Outra opição para aparece os donos do PET Pet.findAll({include: [Cliente]})
    res.send(listaCliente);
  });
  
  // Listagem de um cliente específico
  // :id => parâmetro de rota
  clientesRouter.get("/clientes/:id", async (req, res) => {
    // SELECT * FROM clientes WHERE id = 1;
    const cliente = await Cliente.findOne({
      where: { id: req.params.id },
      include: [Endereco], // juntar os dados do cliente com seu respectivo endereço
      // Métodos: GET (leitura), POST (inserção), PUT (alteração), DELETE (remoção)
      // app.get("/hello", (req, res) => {
      // manipulador de ROTA REQ(requisicao) e RES (resposta)
      //   res.send("Hello World!"); // enviando a resposta para quem solicitou
      // });
    });
  
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ message: "Cliente não encrontado!" });
    }
  
    // TESTE => console.log(req.params.id);
    // res.send("Cliente:" + req.params.id);
  });
  
  clientesRouter.post("/clientes", async (req, res) => {
    // Extraimos os dados do body que serão usados na inserção
    const { nome, email, telefone, endereco } = req.body;
  
    try {
      // Tentativa de inserir o cliente
      await Cliente.create(
        { nome, email, telefone, endereco },
        { include: [Endereco] } // Indicamos que o endereço será salvo e associado ao cliente
      );
      res.json({ message: "Cliente criado com sucesso." });
    } catch (err) {
      res.status(500).json({ message: "Um erro ocorreu ao inserir cliente." }); // 500 -> Internal Erro
      // Tratamento caso ocorra algum erro
    }
  
    // TESTE => console.log(req.body); dados do corpo da requisição
    // res.send("Resposta");
  });
  
  clientesRouter.put("/clientes/:id", async (req, res) => {
    const idCliente = req.params.id;
    const { nome, email, telefone, endereco } = req.body;
  
    try {
      const cliente = await Cliente.findOne({ where: { id: idCliente } });
  
      if (cliente) {
        // Tualiazar a linha do endereço que for o id do cliente
        // for igual ao id do cliente sendo atualizado
        await Endereco.update(endereco, { where: { clienteId: idCliente } });
        // Seguir com a atualização
        await cliente.update({ nome, email, telefone });
        res.json({ message: "Cliente atualizado." });
      } else {
        res.status(404).json({ message: "O cliente não encontrado." });
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "Ocorreu um erro ao atualizar o cliente." });
    }
  
    //  Checar se o cliente existe
    // TESTE => console.log(req.params);
    // console.log(req.body);
    // res.send("Update");
  });
  
  clientesRouter.delete("/clientes/:id", async (req, res) => {
    const idCliente = req.params.id;
  
    try {
      const cliente = await Cliente.findOne({ where: { id: idCliente } });
  
      if (cliente) {
        await cliente.destroy();
        res.json({ message: "Cliente removido com sucesso." });
      } else {
        res.status(404).json({ message: "Cliente não encontrado." });
      }
    } catch (err) {
      res.status(500).json({ message: "Um erro ocorreu ao excluir cliente." });
    }
  });