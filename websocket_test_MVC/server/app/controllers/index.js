module.exports.showSensorData = function(application, req, res){
    
    var sensorData = req.body;

    application.get('io').emit(
        'msgToClient',
        {
            sensorName : sensorData.sensorName, 
            measure : 'mandando dados...'
        }
    );
    
    res.render('index', {sensorData : sensorData});
}