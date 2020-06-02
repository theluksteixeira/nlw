import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

    async index(req: Request, res: Response) {
        //cidade, uf, items (query filters);
        const { city, uf, items } = req.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_itens', 'point_itens.point_id', '=', 'points.id')
            .whereIn('point_itens.item_id', parsedItems)
            .where('points.city', String(city))
            .where('points.uf', String(uf))
            .distinct()
            .select('points.*')

        return res.json(points);
    }

    async show(req: Request, res: Response) {
        const { id } = req.params;
        const point = await knex('points').where('id', id).first();

        if (!point) {
            return res.status(400).json({ message: "Lugar de coleta não encontrada." });
        }

        const items = await knex('itens')
            .join('point_itens', 'itens.id', '=', 'point_itens.item_id')
            .where('point_itens.point_id', id)
            .select('itens.title');

        return res.json({ point, items });
    }

    async create(req: Request, res: Response) {
        const { name, email, whatsapp, latitude, longitude, city, uf, items } = req.body;

        const trx = await knex.transaction();

        const point = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];
        const pointItem = items.map((item: number) => {
            return {
                point_id,
                item_id: item
            }
        });

        await trx('point_itens').insert(
            pointItem
        );

        await trx.commit();

        return res.json({
            id: point_id,
            ...point
        });

    }
}

export default PointsController;
