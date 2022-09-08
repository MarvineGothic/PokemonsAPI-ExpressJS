import { Pokemon } from '.prisma/client';
import express from 'express';
import pokemon from '../controllers/pokemon.controller';

var router = express.Router();

/**
 * This function comment is parsed by doctrine
 * @route GET /api/pokemon
 * @group pokemon - Operations about user
 * @param {string} name.query - search pokemon by name
 * @param {string} hp.query - filter by HP.
 * @param {string} defense.query - filter by Defense.
 * @param {string} attack.query - filter by Attack.
 * @returns {[Pokemon]} 200 - An array of pokemons
 * @returns {Error}  default - Unexpected error
 */
router.get('/pokemon', pokemon.getPokemons);

export default router;
