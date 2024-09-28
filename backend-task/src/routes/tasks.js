import { Router } from "express";
import { deleteTask, getTaskCount, getTasks, saveTask, updateTask, getTask } from "../controllers/tasks.js";
import { getInvo, getInvoId, getProd, getProdByInvo } from "../controllers/documents.js";
import  {processInvoice}  from "../controllers/processInvoice.js";
import {saveImage} from '../controllers/saveImage.js'
//import { publicImag } from "../controllers/publicImag.js";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: Tasks
 *  description: Tasks endpoint
 */

/**
 * @swagger
 * /tasks:
 *  get:
 *      summary: Get list the tasks 
 *      tags: [Tasks]
 */

router.get('/tasks', getTasks)

/**
 * @swagger
 * /tasks/count:
 *  get:
 *      summary: count the task 
 *      tags: [Tasks]
 */

router.get('/tasks/count', getTaskCount)

/**
 * @swagger
 * /tasks:
 *  get:
 *      summary: get a task by id
 *      tags: [Tasks]
 */

router.get('/tasks/:id', getTask)

/**
 * @swagger
 * /tasks:
 *  post:
 *      summary: save a new task 
 *      tags: [Tasks]
 */

router.post('/tasks', saveTask)

/**
 * @swagger
 * /tasks:
 *  delete:
 *      summary: delete a task by id
 *      tags: [Tasks]
 */

router.delete('/tasks/:id', deleteTask)

/**
 * @swagger
 * /tasks:
 *  put:
 *      summary: update a task by id
 *      tags: [Tasks]
 */
router.put('/tasks/:id', updateTask)


// crud documents

router.post('/image', saveImage)
router.post('/docs', processInvoice)
router.get('/docs', getInvo)
router.get('/docs/prod', getProd)
router.get('/docs/:id', getInvoId)
router.get('/prod/:N_Factura', getProdByInvo)
//router.get('/public', publicImag)
export default router
