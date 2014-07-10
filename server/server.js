exports.listen = function (server) {
    server.get('/rest/v1/executions/:id/summary', function (req, res) {
        res.sendfile('./server/mocks/execution.json');
    });

    server.post('/rest/v1/executions', function (req, res) {
        res.sendfile('./server/mocks/trigger.json');
    });

    server.get('/rest/v1/flows/:id/inputs', function (req, res) {
        res.sendfile('./server/mocks/inputs.json');
    });

    server.get('/rest/v1/flows/library', function (req, res) {
        res.sendfile('./server/mocks/flows.json');
    });

    server.get('/rest/v1/flows/:id', function (req, res) {
        res.sendfile('./server/mocks/flow.json');
    });
};