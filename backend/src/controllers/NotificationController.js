const Notification = require('../models/Notification');

module.exports = {

    //Listando todas notificações
    async show(req, res) {

        try {
            
            const notification = await Notification.find().sort({ createdAt: -1 });

            return res.json(notification);

        } catch (err) {
            console.log(err);
            return res.status(400).send({ error: "Erro ao exibir as notificações" });
        }
    },

    //Cadastrando um ambiente novo
    async store(req, res) {
        
        const { origin, title, content } = req.body;

        try {

            let notification = await Notification.find({origin: origin});

            //Caso ja exista no BD, nao precisa criar de novo
            if(notification.length == 0) {
                notification = await Notification.create({
                    origin: origin,
                    title: title,
                    content: content,
                });
            }
            else {
                notification = await Notification.findOneAndUpdate(origin,
                    { 
                        "origin": origin,
                        "title": title,
                        "content": content,      
                    },
                    { "new": true },
                );
            }
    
            return res.json(notification);
            
        } catch (err) {
            console.log(err);
            return res.status(400).send({ error: "Erro ao criar uma notificação." })
        }

    },

}