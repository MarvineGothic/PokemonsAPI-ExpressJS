import { Pokemon } from '@prisma/client';
import { Query, Filter } from '../types';
import { filterBy, getByName, getAll } from '../services/pokemon.service';

const getPokemons = async (req: any, res: any, next: any) => {
    try {
        let pokemons: Pokemon[] = [];
        const query: Query = req.query;

        const page: number = query.page ? parseInt(query.page) : 0;
        const limit: number = query.limit ? Math.min(query.limit, 10) : 10;
        const startIndex: number = (page - 1) * limit;
        const endIndex: number = page * limit;

        delete query.page;

        const queryLength: number = Object.keys(query).length;

        if (queryLength) {
            const filterJson: Query = composeFilter(query);

            if (Object.keys(filterJson).length && !query.name) {
                pokemons = await filterBy(filterJson, startIndex, endIndex)
            } else if (query.name && queryLength === 1) {
                pokemons = await getByName(query.name);
            } else {
                throw Error("Invalid query! Available search query: '?name={name}'. "
                    + "Available filtering by: 'hp', 'defense' or 'attack'");
            }
        } else {
            pokemons = await getAll(startIndex, endIndex);
        }
        
        if (pokemons && pokemons.length) {
            res.json({ body: { pokemons } });
        } else {
            res.status(404);
            res.json({ body: { pokemons: [] } })
        }
    } catch (error: any) {
        res.status(400);
        res.json({ error: error.message })
    }
};

const composeFilter = (query: Query) => {
const filterJson: Query = {};
    for (const key in query) {
        switch (key) {
            case 'hp':
            case 'defense':
            case 'attack':
                const filter: Filter = {};
                for (const filterKey in query[key]) {
                    filter[filterKey as keyof Filter] = parseInt(query[key][filterKey])
                }
                filterJson[key] = filter;
                break;
        }
    }
    return filterJson;
}

export = {
    getPokemons
};