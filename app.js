const express = require('express');
const path = require('path');// identifica em qual diretório estamos

const checkListrouter = require('./src/routes/checklist');
const taskRouter = require('./src/routes/task');
const rootRouter = require('./src/routes/index');
const methodOverride = require('method-override');


require('./config/database');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));// requisições via formulário
app.use(methodOverride('_method', { methods: ['POST', 'GET', 'PUT'] }));


app.use(express.static(path.join(__dirname, 'public'))); // habilita o uso de arquivos estáticos


app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use('/', rootRouter);
app.use('/checklists', checkListrouter);
app.use('/checklists', taskRouter.checklistDepedent);
app.use('/tasks', taskRouter.simple);

app.listen(3000, () => {
    console.log('http://localhost:3000');
    console.log('Servidor iniciado na porta 3000');
})