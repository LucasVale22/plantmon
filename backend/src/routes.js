const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const NodeMCUController = require('./controllers/NodeMCUController');
const SynchronizationController = require('./controllers/SynchronizationController');

const SensorController = require('./controllers/SensorController');
const LinkController = require('./controllers/LinkController');

const TransmissionController = require('./controllers/TransmissionController');

const StatusController = require('./controllers/StatusController');

const EnvironmentController = require('./controllers/EnvironmentController');

const SpecieController = require('./controllers/SpecieController');

const PlantController = require('./controllers/PlantController');

const NotificationController = require('./controllers/NotificationController');

const routes = express.Router();
const upload = multer(uploadConfig);

//Rotas do NodeMCU
routes.post('/nodemcu', NodeMCUController.store);
routes.get('/nodemcu/:device', NodeMCUController.index);
routes.get('/nodemcu', NodeMCUController.show);

//Rotas de Sincronizacao
routes.get('/synchronization/:device', SynchronizationController.index);
routes.get('/synchronization', SynchronizationController.show);
routes.put('/synchronization/:device', SynchronizationController.update);

//Rotas de Sensores
routes.post('/nodemcu/:device/sensor', SensorController.store);
routes.get('/nodemcu/:device/sensor/:port', SensorController.index);
routes.get('/sensors', SensorController.show);

//Rotas de vinculo
routes.get('/nodemcu/:device/:name/link', LinkController.show);
routes.put('/nodemcu/:device/link/:port', LinkController.update);

//Rotas de transmissao
routes.put('/nodemcu/:device/transmission/:port', TransmissionController.update);

//Rotas de status
routes.get('/nodemcu/:device/status/:port', StatusController.index);
routes.get('/nodemcu/:device/status', StatusController.show);

//Rotas dos ambientes
routes.post('/environments', upload.single('thumbnail'), EnvironmentController.store);
routes.get('/environments/:environment_id', EnvironmentController.index);
routes.get('/environments', EnvironmentController.show);
routes.put('/environments/:environment_id', EnvironmentController.update);
routes.delete('/environments/:environment_id', EnvironmentController.destroy);

//Rotas das espécies
routes.get('/species/:specie_id', SpecieController.index);
routes.get('/species', SpecieController.show); 

//Rotas das plantas
routes.get('/environments/:environment_id/plant/:plant_id', PlantController.index);
routes.get('/environments/:environment_id/plant', PlantController.show);
routes.post('/environments/:environment_id/plant', upload.single('thumbnail'),PlantController.store);
routes.put('/environments/:environment_id/plant/:plant_id', PlantController.update);
routes.delete('/environments/:environment_id/plant/:plant_id', PlantController.destroy);

//Rotas das notificações
routes.post('/notifications', NotificationController.store);
routes.get('/notifications', NotificationController.show);

module.exports = routes;