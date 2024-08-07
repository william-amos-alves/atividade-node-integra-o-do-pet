// Modelo para gerar a tabela de clientes no MySQL
// Mapeamento: cada propriedade que definimos vira uma coluna da tabela

import { connection } from "../config/database.js";
import { DataTypes } from "sequelize";
import { Endereco } from "./endereco.js";
import { Pet } from "./pet.js";

// OBS: O Sequelize define implicitamente a chave primária
export const Cliente = connection.define("cliente", {
  // Configurando a coluna 'nome'
  nome: {
    // nome VARCHAR(130)
    type: DataTypes.STRING(130), // Define a coluna 'nome' como VARCHAR
    allowNull: false, // Torma a coluna NOT NULL
  },
  email: {
    // email VARCHAR (255) UNIQUE NOT NULL
    type: DataTypes.STRING, // Por padrão 255
    allowNull: false,
    unique: true, // Define os dados da coluna com UNIQUE
  },
  telefone: {
    // telefone VARCHAR(255) UNIQUE NOT NULL
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

// Associação 1:1 (cliente - Endereço)
// Cliente tem um Endereço
// Endereço ganha uma chave estrangeira
Cliente.hasOne(Endereco, {onDelete: "CASCADE"}); // CASCADE => indica que se o cliente for deletado o endereço será deletado também
Endereco.belongsTo(Cliente); // Gerar uma chave estrangeira na tebela endereço

// Associação 1:N (cliente - Pet)
Cliente.hasMany(Pet, {onDelete: "CASCADE"});
Pet.belongsTo(Cliente); // Gerar uma chave estrangeira para indicar o responsável

// Cliente = model = gerenciar a tabela de cliente

// Cliente.findAll() -> todos os cliente na tebela
// Cliente.update(novosDados) -> atualizar um cliente especifico
// Clinete.destroy() -> apagar o cliente da tabela
// Cliente.findOne
