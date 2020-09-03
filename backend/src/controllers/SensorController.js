const Sensor = require('../models/Sensor');

module.exports = {

    //Consulta de um sensor especifico
    async index(req, res) {

        const { device, port } = req.params;

        try {
            
            const sensor = await Sensor.findOne().and([
                { nodemcu: device }, 
                { port: port }
            ]).select('-_id -data -time -createdAt -__v');

            return res.send(sensor);

        } catch (err) {
            return res.status(400).send({ error: "Erro ao consultar sensor." });
        }

    },

    //Listar sensores todos os sensores detectados na rede
    async show(req, res) {

        try {
            
            const sensor = await Sensor.find();

            return res.json(sensor);

        } catch (err) {
            return res.status(400).send({ error: "Erro ao listar sensores"});
        }

    },

    //Registro de um novo sensor
    async store(req, res) {
        
        const { device } = req.params;
        const { port, name, target } = req.body;

        try {

            let sensor = await Sensor.find().and([
                { nodemcu: device },
                { port: port }
            ]);

            //Caso ja exista no BD, nao precisa criar de novo (pode acontecer ao desconnectar o nodemcu da energia)
            if(sensor.length == 0) {
                sensor = await Sensor.create({
                    nodemcu: device,
                    port,
                    name,
                    target,
                    connected: false,
                    data: [],
                    time:[],
                });
            }

            return res.json(sensor);
            
        } catch (err) {
            console.log(err);
            return res.status(400).send({ error: "Erro ao registrar o sensor " + name })
        }

    },

}