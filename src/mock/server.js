var express = require('express');
var app = express();
app.get('/', function (req, res) {  
    res.send('Hello world!');
});

app.get('/api1', function (req, res) {  
    let temp = Date.now();
    let data = {
        success : true,
        data : [
            {
                asix : temp, 
                sell : Math.random(),               
                buy :  Math.random()               
            }
            
        ]
                
    };
    //res.send('Hello world!'+req.query.future);
    res.json(data);
});
app.get('/api', function (req, res) {  
    let temp = Date.now();
    let data = {
        data : [
            {
                sell : {
                    x : temp,
                    y : Math.random()
                },
                buy : {
                    x : temp,
                    y : Math.random()
                }
            },
            {
                sell : {
                    x : temp+5000,
                    y : Math.random()
                },
                buy : {
                    x : temp+5000,
                    y : Math.random()
                }
            },
            
        ],
        success : true
        
        
        
    };
    //res.send('Hello world!'+req.query.future);
    res.json(data);
});
app.listen(5000); 
