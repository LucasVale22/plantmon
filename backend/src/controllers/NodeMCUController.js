/*******************************************************************************************
*   Controller do Nodemcu: intermediar as requisições HTTP associadas ao processo de       * 
*                          identificação e conexão dos dispositivos controladores NodeMCU. *                                                                                       
*******************************************************************************************/

const NodeMCU = require('../models/NodeMCU');

module.exports = {

    //Consulta de um NodeMCU especifico
    async index(req, res) {

        const { device } = req.params;

        try {
            
            const nodemcu = await NodeMCU.findOne({device: device})
                                         .select('-_id -createdAt -__v');

            return res.json(nodemcu);

        } catch (err) {
            return res.status(400).send({ error: "Erro ao consultar NodeMCU." });
        }

    },

     //Listar NodeMCU's identidicados na rede (sincronizados ou não)
     async show(req, res) {

        try {
            
            const nodemcu = await NodeMCU.find();

            return res.json(nodemcu);

        } catch (err) {
            return res.status(400).send({ error: "Erro ao listar NodeMCU's." });
        }

    },

    //Registro de um novo NodeMCU
    async store(req, res) {
        
        const { device, name } = req.body;

        try {

            let nodemcu = await NodeMCU.find({device: device});

            //Caso ja exista no BD, nao precisa criar de novo
            if(nodemcu.length == 0) {
                nodemcu = await NodeMCU.create({
                    device,
                    name,
                    connected: false,
                    available_ports: 10,
                });
            }

            return res.json(nodemcu);
            
        } catch (err) {
            console.log(err);
            return res.status(400).send({ error: "Erro ao registrar NodeMCU." })
        }

    },

}