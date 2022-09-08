import pokemonController from '../../src/controllers/pokemon.controller';
import { getAll, getByName } from '../../src/services/pokemon.service';
import httpMocks from 'node-mocks-http';
import { Pokemon } from '.prisma/client';

const pokemons: Pokemon[] = require('../mock-data/pokemons.json');

jest.mock('../../src/services/pokemon.service')
const mockGetAll = getAll as jest.MockedFunction<typeof getAll>;
const mockGetByName = getByName as jest.MockedFunction<typeof getByName>;

let req: { query: {}; };
let res: { statusCode: any; _getJSONData: () => any; };
let next: any;


beforeEach(() => {
    req = httpMocks.createRequest({ query: {} });
    res = httpMocks.createResponse();
    next = null;
})

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
})

describe("pockemonController.getPokemons", () => {

    it("pockemonController should have getPokemons function", () => {
        expect(typeof pokemonController.getPokemons).toBe("function");
    })

    it("Should call pokemonService.getAll", async () => {
        await pokemonController.getPokemons(req, res, next);
        expect(getAll).toBeCalled();
    })

    it("Expect status code 404", async () => {
        mockGetAll.mockResolvedValue([]);
        await pokemonController.getPokemons(req, res, next);
        expect(Object.keys(req.query).length).toBe(0);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toStrictEqual({ body: { pokemons: [] } })
    })

    it("Expect status code 200", async () => {
        mockGetAll.mockResolvedValue(pokemons);
        await pokemonController.getPokemons(req, res, next);
        expect(Object.keys(req.query).length).toBe(0);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({ body: { pokemons } })
    })

    it("Expect status code 400, Wrong query - type", async () => {
        req = httpMocks.createRequest({ query: { type: '' } });
        await pokemonController.getPokemons(req, res, next);
        expect(Object.keys(req.query).length).toBe(1);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toStrictEqual({ "error": "Invalid query! Available search query: '?name={name}'. Available filtering by: 'hp', 'defense' or 'attack'" })
    })

    it("Expect status code 400, Wrong query - search name and filter hp", async () => {
        req = httpMocks.createRequest({ query: { name: 'name', 'hp[gte]': 100 } });
        await pokemonController.getPokemons(req, res, next);
        expect(Object.keys(req.query).length).toBe(2);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toStrictEqual({ "error": "Invalid query! Available search query: '?name={name}'. Available filtering by: 'hp', 'defense' or 'attack'" })
    })

    it("Should get by name", async () => {
        req = httpMocks.createRequest({ query: { name: 'Clefairy' } });

        const pokemon = {
            "id": 16,
            "name": "Clefairy",
            "type_1": "Fairy",
            "type_2": "",
            "total": 323,
            "hp": 70,
            "attack": 45,
            "defense": 48,
            "sp_atk": 60,
            "sp_def": 65,
            "speed": 35,
            "generation": 1,
            "legendary": false
        }

        mockGetByName.mockResolvedValue([pokemon]);
        await pokemonController.getPokemons(req, res, next);
        expect(Object.keys(req.query).length).toBe(1);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({ body: { pokemons: [pokemon] } })
    })
})