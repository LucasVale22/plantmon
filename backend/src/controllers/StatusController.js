const Sensor = require('../models/Sensor');

module.exports = {

    //Resgatar sensor específico
    async index(req, res) {

        const { device, port } = req.params;

        try {
            
            const sensor = await Sensor.find().and([
                { nodemcu: device },
                { port: port }
            ]);

            return res.json(sensor);

        } catch (err) {
            return res.status(400).send({ error: "Erro ao consultar sesnor." });
        }

    },

    //Resgatar sensores correspondentes a um NodeMCU especifico
    async show(req, res) {

        const { device } = req.params;
        const { target, port1, port2 } = req.query;

        try {
            
            const sensor = await Sensor.find().and([
                { nodemcu: device }, 
                { target: target }, 
                { port: [port1, port2] },
                { connected: true }
            ]);

            return res.json(sensor);

        } catch (err) {
            return res.status(400).send({ error: "Erro ao listar sensores." });
        }

    },

}