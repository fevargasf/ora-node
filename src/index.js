
const  express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload')

const app = express();

//imports
const personRoutes = require('./routes/routes.js');
//consulta base de datos

//settings
const PORT = process.env.PORT || 5000


//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(fileUpload())
//routes
app.use(personRoutes);


// start express server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


