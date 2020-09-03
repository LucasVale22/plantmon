const Specie = require('../models/Specie');

module.exports = {

    //Selecao de uma especie especifica
    async index(req, res) {

        const { specie_id } = req.params;

        try {

            const specie = await Specie.findById(specie_id);

            return res.json(specie);

        } catch (err) {
            return res.status(400).send({ error: "Erro ao consultar a especie." });
        
        }

    },

    //Busca de todas as especies cadastradas
    async show(req, res) {

        try {
            
            const species = await Specie.find().sort({ popular_name: 1 });

            return res.json(species);

        } catch (err) {
            return res.status(400).send({ error: "Erro ao listar as especies." });
        }
    },

}