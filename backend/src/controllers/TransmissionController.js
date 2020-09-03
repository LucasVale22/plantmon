const Sensor= require('../models/Sensor');

module.exports = {

    //Liberando sensor para transmissão de dados
    async update(req, res) {
        
        const { device, port } = req.params;
        const { data } = req.body;

        const date_time = new Date();

        try {

            //Atualizando a conexão do sensor
            const sensor = await Sensor.findOneAndUpdate(
                {
                    "$and":
                    [
                        { nodemcu: device },
                        { port: port }, 
                        { connected: true }
                    ]
                },
                { 
                    "$push": 
                    { 
                        "data": data,
                        "time": date_time, 
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