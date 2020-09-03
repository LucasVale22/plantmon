const Plant = require('../models/Plant');
const Environment = require('../models/Environment');
const mongoose = require('mongoose');

module.exports = {

    //Acessando uma planta especifica
    async index(req, res) {

        const { plant_id } = req.params;

        try {

            const plant = await Plant.findById(plant_id);

            return res.json(plant);

        } catch (err) {
            return res.status(400).send({ error: "Erro exibir esta planta." });
        
        }

    },

    //Exibindo todas as plantas de um determinado ambiente
    async show(req, res) {

        const { environment_id } = req.params;

        try {
            
            const plants = await Plant.find({ environment: environment_id }).sort({ nickname: 1 });

            return res.json(plants);

        } catch (err) {
            return res.status(400).send({ error: "Erro ao listar as plantas." });
        }
    },

    //Cadastrando uma planta nova
    async store(req, res) {
        
        const { environment_id } = req.params;  
        
        const { specie, ports, thumbnail, nickname, amount, location } = req.body;   

        const environment = await Environment.findById(environment_id);

        const updated_amount = environment.registered_plants + amount;

        if(updated_amount > 4) {
            return res.status(400).json({ error: "O numero de plantas nesse ambiente sera excedido!" });
        }

        try {
            
            let plant = {};

            for(let counter = 1; counter <= amount; counter++) {
                plant = await Plant.create({
                    environment: environment_id,
                    thumbnail: thumbnail,
                    specie: specie,
                    ports: ports,
                    nickname: nickname,
                    location: location,
                });
    
                await Environment.findByIdAndUpdate(environment_id, 
                    {
                        "$inc": 
                        {
                            registered_plants: 1,
                        },
                    },
                    { "new": true },
                );
            }

            return res.json(plant);

        } catch (err) {
            return res.status(400).send({ error: 'Erro ao cadastrar planta.' });
        }

    },

    //Atulizando o status de uma planta a partir dos sensores associados
    async update(req, res) {

        const { plant_id } = req.params;
        const { specie, ports, thumbnail, nickname} = req.body;

        try {

            const plant = await Plant.findByIdAndUpdate(plant_id,
                { 
                    "specie": specie,
                    "ports": ports,
                    "thumbnail": thumbnail,
                    "nickname": nickname,   
                },
                { "new": true },
            );
    
            return res.send({ plant });
    
        } catch (err) {
            return res.status(400).send({ error : 'Erro ao atualizar planta.' });
        }

    },

    //Deletando uma planta
    async destroy(req, res) {

        const { plant_id, environment_id } = req.params;

        try {
            
            //removendo a conexão do módulo/sensores
            await Plant.findByIdAndRemove(plant_id);

            await Environment.findByIdAndUpdate(environment_id, 
                {
                    "$inc": 
                    {
                        registered_plants: -1,
                    },
                },
                { "new": true },
            );

            return res.json({ msg: "Planta removida com sucesso!" });

        } catch (err) {
            return res.status(400).send({ error: "Erro ao remover planta." })
        }

    } 
}