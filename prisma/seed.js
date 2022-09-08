const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const csv = require('csvtojson')

const main = async () => {
    console.log('Start seeding data');
    csv()
        .fromFile('Data/pokemon.csv')
        .then((jsonArray) => {
            jsonArray.forEach(async (jsonObj) => {
                if (jsonObj.Legendary.toLowerCase() !== 'true' && jsonObj['Type 1'] !== 'Ghost') {

                    let hp = Number(jsonObj.HP);
                    let attack = Number(jsonObj.Attack);
                    let sp_atk = Number(jsonObj.Sp[' Atk']);
                    let defense = Number(jsonObj.Defense);

                    if (jsonObj['Type 1'] === 'Steel') {
                        hp *= 2
                    }

                    if (jsonObj['Type 1'] === 'Fire') {
                        attack *= 0.9
                    }

                    if (jsonObj['Type 1'] === 'Bug' && jsonObj['Type 2'] === 'Flying') {
                        sp_atk *= 1.1
                    }

                    if (jsonObj.Name.startsWith('G')) {
                        defense += (jsonObj.Name.length - 1) * 5
                    }

                    const pokemon = {
                        name: jsonObj.Name,
                        type_1: jsonObj['Type 1'],
                        type_2: jsonObj['Type 2'],
                        total: Number(jsonObj.Total),
                        hp: parseInt(hp),
                        attack: parseInt(attack),
                        defense: parseInt(defense),
                        sp_atk: parseInt(sp_atk),
                        sp_def: Number(jsonObj.Sp[' Def']),
                        speed: Number(jsonObj.Speed),
                        generation: Number(jsonObj.Generation),
                        legendary: jsonObj.Legendary.toLowerCase() === 'true',
                    }

                    await prisma.pokemon.create({
                        data: pokemon,
                    })
                }
            })
        })
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })