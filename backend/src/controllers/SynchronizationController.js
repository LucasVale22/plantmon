const NodeMCU = require('../models/NodeMCU');

module.exports = {

    //Consulta de um NodeMCU especifico
    async index(req, res) {

        const { device } = req.params;

        try {
            
            const nodemcu = await NodeMCU.findOne({device: device});

            return res.json(nodemcu);

        } catch (err) {
            return res.status(400).send({ error: "Erro ao consultar NodeMCU." });
        }

    },

    //Listar NodeMCU's disponiveis
    async show(req, res) {

        try {
            
            const nodemcu = await NodeMCU.find(
                {
                    available_ports: { $eq: 10 }
                }
            );

            return res.json(nodemcu);

        } catch (err) {
            return res.status(400).send({ error: "Erro ao listar NodeMCU's." });
        }

    },

    //Sincronizando o NodeMCU escolhido
    async update(req, res) {
        
        const { device } = req.params;
        const { connected } = req.body;

        try {

            const nodemcu = await NodeMCU.findOneAndUpdate({device: device},
                { 
                    "connected": connected,
                },
                { "new": true },
            );
    
            return res.json(nodemcu);
            
        } catch (err) {
            return res.status(400).send({ error: "Erro ao atualizar NodeMCU" })
        }

    },

}