import express from 'express';
import fs from 'fs';

const app = express();
const port = 3000;

let orderId = 0;

const credentials = {
    admin: {pass: '1234'},
    chef: '1234',
    runner: '1234',
}

app.use(express.json());

function jsonHasKeys(keys, json){
    let out = true;
    for (let key in keys){
        out &&= json.hasOwnProperty(key) !== undefined
    }
    return out;
}

function timeMargin(milliseconds){
    return Math.abs(new Date().getTime() - milliseconds);
}

function validateJson(json) {
    if (!jsonHasKeys(
        [
            "time",
            "order",
            "name"
        ],
        json)) {
        return "missing one or more keys from \"time\", \"order\", \"name\"";
    }
    console.log(timeMargin(json.time))
    if (timeMargin(json.time) > 1000) {
        return "time margin too big (wrong time zone?)"
    }
    if (json.order.length < 1) {
        return "no order given"
    }
    if (json.name.length < 1) {
        return "no name given"
    }
    return "success"
}

app.patch("/pass_set", (req, res) => {
    if (req.body.credential === credentials.admin.pass) {
        res.status(200).send({message: 'Set successfully'});
    } else {
        res.status(403).send({message: 'Invalid credential'});
    }
})

app.post('/', (req, res) => {
    console.log(req.body);

    fs.readFile('./data/orders.json', 'utf8', (err, data) => {
        if (err) {
            return res.sendStatus(500);
        }

        let json;

        try {
            json = JSON.parse(data);
        } catch (error) {
            return res.status(500);
        }

        let validation = validateJson(req.body);
        if (validation === "success") {
            json.push({
                id: orderId++,
                time: req.body.time,
                name: req.body.name,
                order: req.body.order,
            });
        } else {
            res.status(406).json({
                message: validation,
            });
            return;
        }

        fs.writeFile(
            './data/orders.json',
            JSON.stringify(json, null, 2),
            (err) => {
                if (err) {
                    return res.sendStatus(500);
                }

                res.status(201).json({
                    message: 'added order'
                });
            }
        );
    });
});

app.post('/login', (req, res) => {
    if (credentials[req.body.user] !== undefined) {
        if (credentials[req.body.user].pass === req.body.password){
            res.sendStatus(200);
            return;
        }
    }
    res.sendStatus(403)
})

app.get('/', (req, res) => {
    fs.readFile('./site/index.html', 'utf8', (err, data) => {
        if (err) {
            return res.sendStatus(500);
        }
        res.status(200).send(data);
    })

})

app.get('/:path', (req, res) => {
    fs.readFile("./data/" + req.params.path, (err, data) => {
        if (err){
            res.sendStatus(404);
            return;
        }
        res.send(data.toString());
    })

})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})