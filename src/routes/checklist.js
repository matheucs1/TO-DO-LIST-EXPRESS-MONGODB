const express = require('express');

const router = express.Router();

const Checklist = require('../models/checklist');


//Para encontrar alguem no banco
router.get('/', async (req, res) => {
    try {
        let checklists = await Checklist.find({});
        res.status(200).render('checklists/index', {checklists: checklists});
    } catch (error) {
        res.status(500).render('pages/error', {error: 'Erro ao exibir as Listas de tarefas'});
    }
})

router.get('/new', async(req, res)=>{
    try {
        let checklist = new Checklist();
        res.status(200).render('checklists/new', {checklist: checklist});
    } catch (error) {
        res.status(500).render('pages/error', {error: 'Erro ao carregar o formulario!'});
    }
})

router.get('/:id/edit', async(req, res)=>{
    try {
        let checklist = await Checklist.findById(req.params.id);
        res.status(200).render('checklists/edit', {checklist: checklist});
    } catch (error) {
        res.status(500).render('pages/error', {error: 'Erro ao exibir a edição de lista de tares'});

    }
})


//Criar no banco de dados
router.post('/', async (req, res) => {
    let { name } = req.body.checklist
    let checklist = new Checklist({name})
   
    try {
        await checklist.save();
        res.redirect('/checklists')
    } catch (error) {
        res.status(422).render('checklists/new', {checklists: {...Checklist, error}});
    }
})

/*router.post('/', (req, res) => {
    console.log(req.body);
    res.status(200).json(req.body);
})*/


// Encontrar um unico por ID
router.get('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id).populate('tasks');
        res.status(200).render('checklists/show', {checklist: checklist});
    } catch (error) {
        res.status(500).render('pages/error', {error: 'Erro ao exibir as Listas de tarefas'})
    }
})

//Atuializar dados
router.put('/:id', async (req, res) => {
    let {name} = req.body.checklist
    let checklist = await Checklist.findById(req.params.id);

    try {
        // let checklist = await Checklist.findByIdAndUpdate(req.params.id, {name}, {new: true}); // {name} == o que será alterado, {new:true} == novo conteúdo
        await checklist.updateOne({ name });
        res.redirect('/checklists');
    } catch (error) {
        let errors = error.erros;
        res.status(422).render('checklists/edit', {checklist: {...checklist, errors}});
    }
})

// Remover um dado do banco
router.delete('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findByIdAndRemove(req.params.id);
        res.status(200).json(checklist);
    } catch (error) {
        res.status(422).json(error);

    }
    
})

module.exports = router;