import { Router } from'express';

import {
 stringController
} from '../controllers/stringController.js';
import {
 stringValidation
} from '../middleware/string_validation.js';


const stringRouter = Router();
// POST /strings - Create/Analyze String
stringRouter.post('/', stringValidation.validateStringInput, stringController.analyzeString);

// GET /strings - Get All Strings with Filtering
stringRouter.get('/', stringValidation.validateQueryParams, stringController.getAllStrings);

// GET /strings/filter-by-natural-language - Natural Language Filtering
stringRouter.get('/filter-by-natural-language', stringController.filterByNaturalLanguage);

// GET /strings/{string_value} - Get Specific String
stringRouter.get('/:string_value', stringController.getString);



// DELETE /strings/{string_value} - Delete String
stringRouter.delete('/:string_value', stringController.deleteString);

export default stringRouter;