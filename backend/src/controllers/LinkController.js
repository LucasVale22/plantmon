const Sensor= require('../models/Sensor');
const NodeMCU= require('../models/NodeMCU');

module.exports = {

    //Listar sensores disponiveis para um NodeMCU especifico
    async show(req, res) {

        const { device, name } =  req.params;

        try {
            
            const sensor = await Sensor.find().and([
                { nodemcu: device }, 
                { name: name },
                { connected: false }
            ]);

            return res.json(sensor);

        } catch (err) {
            return res.status(400).send({ error: "Erro ao listar sensores de " + name });
        }

    },

    //Vinculando o sensor escolhido
    async update(req, res) {
        
        const { device, port } = req.params;

        try {

            //Atualizando a conexão do sensor
            const sensor = await Sensor.findOneAndUpdate(
                {
                    "$and":
                    [
                        { port: port },
                        { nodemcu: device }, 
                    ]
                },
                { 
                    "connected": true,
                },
                { "new": true },
            );

            //Atualizando o numero de portas disponiveis para este nodemcu
            await NodeMCU.findOneAndUpdate({ device: device },
                { 
                    "$inc":
                    {
                        available_ports: -1,
                    }
                    
                },
                { "new": true },
            );
    
            return res.json(sensor);
            
        } catch (err) {
            return res.status(400).send({ error: "Erro ao atualizar sensor" })
        }

    },

}