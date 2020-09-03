const Environment = require('../models/Environment');
const Plant = require('../models/Plant');
const NodeMCU = require('../models/NodeMCU');
const Sensor = require('../models/Sensor');

function setTemperature(temperature) {

    let ideal_values = { 'min': 0, 'max': 0 };

    switch(temperature) {
        case 'Germinacao': 
            ideal_values = { 'min': 21, 'max': 25 };
            break;
        case 'Vegetativo': 
            ideal_values = { 'min': 20, 'max': 27 };
            break;
        case 'Floracao': 
            ideal_values = { 'min': 20, 'max': 29 };
            break;
        case 'Clonagem': 
            ideal_values = { 'min': 24, 'max': 28 };
            break;
    }

    return ideal_values;
}

function setAirHumidity(air_humidity) {

    let ideal_values = { 'min': 0, 'max': 0 };

    switch(air_humidity) {
        case 'Escassa': 
            ideal_values = { 'min': 0, 'max': 19 };
            break;
        case 'Baixa': 
            ideal_values = { 'min': 20, 'max': 29 };
            break;
        case 'Media': 
            ideal_values = { 'min': 30, 'max': 49 };
            break;
        case 'Favoravel': 
            ideal_values = { 'min': 50, 'max': 79 };
            break;
        case 'Alta': 
            ideal_values = { 'min': 80, 'max': 100 };
            break;
    }

    return ideal_values;
}

module.exports = {

    //Acessando um ambiente especifico
    async index(req, res) {

        const { environment_id } = req.params;

        try {

            const environment = await Environment.findById(environment_id);

            return res.json(environment);

        } catch (err) {
            return res.status(400).send({ error: "Erro exibir este ambiente." });
        
        }

    },

    //Exibindo os ambientes cadastrados
    async show(req, res) {

        try {
            
            const environment = await Environment.find().sort({ name: 1 });

            return res.json(environment);

        } catch (err) {
            console.log(err);
            return res.status(400).send({ error: "Erro ao exibir os ambientes" });
        }
    },

    //Cadastrando um ambiente novo
    async store(req, res) {
        
        //const { filename } = req.file;
        const { thumbnail, name, nodemcu, ports ,location, temperature, air_humidity } = req.body;

        const ideal_temperature = setTemperature(temperature);
        const ideal_air_humidity = setAirHumidity(air_humidity);

        try {

            const environment = await Environment.create({
                nodemcu: nodemcu,
                ports: ports,
                thumbnail: thumbnail,
                name: name,
                location: location,
                registered_plants: 0,
                ideal_conditions: {
                    temperature: {
                        min: ideal_temperature.min,
                        max: ideal_temperature.max,
                    },
                    air_humidity: {
                        min: ideal_air_humidity.min,
                        max: ideal_air_humidity.max,
                    },
                },
            });
    
            return res.json(environment);
            
        } catch (err) {
            console.log(err);
            return res.status(400).send({ error: "Erro ao criar um novo ambiente." })
        }

    },

    //Edicao de ambiente (atualizando suas propriedades)
    async update(req, res) {

        const { environment_id } = req.params;
        const { thumbnail, name, device, ports ,location, temperature, air_humidity } = req.body;

        const ideal_temperature = setTemperature(temperature);
        const ideal_air_humidity = setAirHumidity(air_humidity);

        try {

            const environment = await Environment.findByIdAndUpdate(environment_id,
                { 
                    "device": device,
                    "ports": ports,
                    "thumbnail": thumbnail,
                    "name": name,
                    "location": location,
                    "ideal_conditions.temperature.min": ideal_temperature.min,
                    "ideal_conditions.temperature.max": ideal_temperature.max,
                    "ideal_conditions.air_humidity.min": ideal_air_humidity.min,
                    "ideal_conditions.air_humidity.max": ideal_air_humidity.max,      
                },
                { "new": true },
            );
    
            return res.send(environment);
    
        } catch (err) {
            return res.status(400).send({ error : 'Erro ao atualizar os dados do ambiente.' });
        }

    },

    //Removendo um ambiente (e suas respectivas plantas)
    async destroy(req, res) {

        const { environment_id } = req.params;

        try {

            const environment = await Environment.findById(environment_id);

            console.log(environment.nodemcu);

            await NodeMCU.findOneAndUpdate({device: environment.nodemcu},
                { 
                    "connected": false,
                    "available_ports": 10
                },
                { "new": true },
                
            );

            await Sensor.updateMany({nodemcu: environment.nodemcu}, 
                {
                    connected: false,
                }
            );
            
            await Plant.findByIdAndRemove(environment_id);

            await Environment.findByIdAndRemove(environment_id);


            return res.json({ msg: "Ambiente removido com sucesso." });

        } catch (err) {
            return res.status(400).send({ error: "Erro remover ambiente." });
        
        }
    }

}