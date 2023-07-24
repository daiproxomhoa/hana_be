import { Request, Response } from "express";
import { pg } from "../config/database";

export const productController = {
  create: async (req: Request, res: Response) => {
    const params = req.body;
    const query = {
      name: "fetch-product",
      text: `SELECT * FROM product WHERE code = $1`,
      values: [params.code],
    };
    pg.query(query, async (err, result) => {
      if (err) {
        res.json({
          error: err,
        });
      } else if (result.rowCount) {
        res.json({
          error: [{ message: "Mã sản phẩm đã tồn tại" }],
        });
      } else {
        const query = {
          name: "insert-product",
          text: `INSERT INTO public.product(code, name, description, prices, is_promotion, images) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          values: [
            params.code,
            params.name,
            params.description,
            params.prices,
            params.is_promotion,
            params.images,
          ],
        };
        pg.query(query, async (err, result) => {
          if (err) {
            res.json({
              error: err,
            });
          } else {
            res.json({ data: result.rows[0] });
          }
        });
      }
    });
  },
  update: async (req: Request, res: Response) => {
    const params = req.body;
    const query = {
      name: "update-product",
      text: `UPDATE public.product
      SET code=$2, name=$3, description=$4, prices=$5, is_promotion=$6, images=$7
      WHERE id=$1 RETURNING *`,
      values: [
        params.id,
        params.code,
        params.name,
        params.description,
        params.prices,
        params.is_promotion,
        params.images,
      ],
    };
    pg.query(query, async (err, result) => {
      if (err) {
        res.json({
          error: err,
        });
      } else {
        if (result.rowCount > 0) res.json({ data: result.rows[0] });
        else {
          res.json({
            error: [{ message: "Mã sản phẩm không tồn tại" }],
          });
        }
      }
    });
  },
  delete: async (req: Request, res: Response) => {
    const query = {
      text: "DELETE FROM product WHERE id=$1",
      values: [req.params.id],
    };
    pg.query(query, (error, result) => {
      if (error) {
        res.json({
          error: error,
        });
      }
      if (result.rowCount > 0) {
        res.json({
          message: "Xoá thành công",
        });
      } else {
        res.json({
          error: [{ message: "Sản phẩm không tồn tại" }],
        });
      }
    });
  },
  getList: async (req: Request, res: Response) => {
    const query = {
      text: `SELECT * FROM product WHERE (code LIKE $3 OR name LIKE $3) OFFSET $1 LIMIT $2`,
      values: [
        Number(
          Number(req.params.page_size || 10) * Number(req.query.page_no || 0)
        ).valueOf(),
        req.query.page_size || 10,
        "%" + req.query.q + "%",
      ],
    };
    pg.query(query, (error, result) => {
      if (error) {
        res.json({
          error: error,
        });
      }
      res.json({ data: result.rows, total: result.rowCount });
    });
  },
};
