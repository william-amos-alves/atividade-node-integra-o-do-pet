import { Pet } from "../models/pet.js";
import { Cliente } from "../models/cliente.js";
import { Router } from "express";


export const petsRouter = Router();

// [GET] /pets -> listar todos os pets

petsRouter.get("/pets", async (req, res) => {
    const listaPet = await Pet.findAll() // Outra opição para aparece os donos do PET Pet.findAll({include: [Cliente]})
    res.send(listaPet);
  });
  // [GET] /pets/:id -> listar um pet específico
  
  petsRouter.get("/pets/:id", async (req, res) => {
    const pet = await Pet.findOne({
      // outros EXP: (const {id} = req.params) / (req.params.id;)
      where: { id: req.params.id },
      // EXP: attributes: {exclude: ["createAt", "updatedAt"] },
      include: [{ model: Cliente, attributes: ["id", ["nome", "nomeCliente"]] }],
      // EX: include: [{ model: Cliente, attributes: {exclude: ["senha"]} }],
    });
  
    if (pet) {
      res.json(pet);
    } else {
      res.status(404).json({ message: "Pet não encrontado!" });
    }
  });
  
  // [DELETE] /pets/:id -> deletar um pet específico
  
  petsRouter.delete("/pets/:id", async (req, res) => {
    const idPet = req.params.id;
    try {
      const pet = await Pet.findOne({ where: { id: idPet } }); // EXP: mais direto (findByPk(req.params.id) )
      if (pet) {
        await pet.destroy();
        res.json({ message: "Pet removido com sucesso." });
      } else {
        res.status(404).json({ message: "Pet não encontrado." });
      }
    } catch (err) {
      res.status(500).json({ message: "Um erro ocorreu ao excluir pets." });
    }
  });
  
  // /pets -> Inserir um novo pet
  petsRouter.post("/pets", async (req, res) =>{
    const { nome, tipo, porte, dataNasc, clienteId } = req.body;
  
    try{
      const cliente = await Cliente.findByPk(clienteId);
  
      if(cliente){
        await 
        Pet.create({nome, tipo, porte, dataNasc, clienteId});
        res.json({message: "Pet criando com sucesso."});
      }else{
        res
          .status(404)
          .json({message: "Falha ao inserir pet. Cliente não encontrado."});
      }
    }catch(err){
      res
        .status(500)
        .json({message: "Ocorreu um erro ao adicionar pet."});
    }
  });
  
  // /pets/:id -> Atualizar um pet
  
  petsRouter.put("/pets/:id", async (req, res) =>{
    const {nome, tipo, porte, dataNasc } = req.body;
  
    try{
      const pet = await Pet.findByPk(req.params.id);
  
      if(pet){
        await pet.update({nome, tipo, porte, dataNasc});
        res.json({message: "Pet atualizado com sucesso."});
      }else{
        res
          .status(404)
          .json({message: "Pet não encontrado"});
      }
    }catch(err){
      res
        .status(500)
        .json({message: "Um erro ocorreu ao atualizar pet."});
    }
  });