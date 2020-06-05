import { Request, Response } from "express";

import { serializedArray } from "../utils/serialized";

import knex from "../database/connection";

class ItemsControler {
  async index(req: Request, res: Response) {
    const items = await knex("items").select("*");

    let serializedItems = serializedArray(items);

    return res.json(serializedItems);
  }
}

export default ItemsControler;
