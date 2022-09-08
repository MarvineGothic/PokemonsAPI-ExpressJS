import { Pokemon } from '@prisma/client';
import { Query } from '../types';
import prisma from '../client';
import { equal } from 'assert';

type PrismaParams = {
    skip?: number;
    take?: number;
    where?: any;
}

export const getAll = async (startIndex: number, endIndex: number): Promise<Pokemon[]> => {
    const params: PrismaParams = {}

    if (startIndex >= 0 && endIndex >= 0) {
        params['skip'] = startIndex;
        params['take'] = endIndex - startIndex
    }

    return await prisma.pokemon.findMany(params);
}

export const getByName = async (name: string): Promise<Pokemon[]> => {
    return await prisma.pokemon.findMany({
        where: {
            name: {
                contains: name
            }
        }
    });
}

export const filterBy = async (filter: Query, startIndex: number, endIndex: number): Promise<Pokemon[]> => {
    const params: PrismaParams = {
        where: filter
    }

    if (startIndex >= 0 && endIndex >= 0) {
        params['skip'] = startIndex;
        params['take'] = endIndex - startIndex
    }

    return await prisma.pokemon.findMany(params);
}