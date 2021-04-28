const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/twitterdb', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(db => console.log('Database is connected'))
    .catch(err => console.log(err));