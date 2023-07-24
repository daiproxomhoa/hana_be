import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { pg } from "../config/database";

export const userController = {
  signup: async (req: Request, res: Response) => {
    const params = req.body;
    const query2 = {
      name: "fetch-user",
      text: `SELECT * FROM users WHERE user_name = $1`,
      values: [params.user_name],
    };
    pg.query(query2, async (err, result) => {
      console.log("result", err, result);
      if (err) {
        res.json({
          error: err,
        });
      } else {
        const userInfo = result.rows[0];
        if (userInfo) {
          res.json({
            error: { message: "Tài khoản đã tồn tại" },
          });
        } else {
          const query = {
            text: "INSERT INTO public.users (user_name,user_password) VALUES ($1,$2) RETURNING id;",
            values: [
              params.user_name,
              bcrypt.hashSync(
                params.user_password,
                bcrypt.genSaltSync(params.user_name.length)
              ),
            ],
          };
          pg.query(query, async (err, result) => {
            if (err) {
              res.json({
                error: err,
              });
            } else {
              res.json({
                data: result.rows[0],
              });
            }
          });
        }
      }
    });
  },

  login: async (req: Request, res: Response) => {
    const params = req.body;
    const query = {
      name: "get-user_name",
      text: `SELECT * FROM users WHERE user_name = $1`,
      values: [params.user_name],
    };
    pg.query(query, async (err, result) => {
      if (result.rowCount) {
        const userInfo = result.rows?.[0];
        const match = bcrypt.compareSync(
          params.user_password,
          userInfo.user_password
        );
        if (match) {
          res.json({
            data: userInfo,
            token: sign(userInfo, process.env.SECRET_KEY || "", {
              expiresIn: "2 days",
            }),
          });
        } else {
          res.json({
            error: [{ message: "Mật khẩu không đúng" }],
          });
        }
      } else {
        res.json({
          error: [{ message: "Tài khoản không tồn tại" }],
        });
      }
    });
  },
  delete: async (req: Request, res: Response) => {
    const query = {
      text: "DELETE FROM users WHERE id=$1",
      values: [req.params.userId],
    };
    pg.query(query, (error, result) => {
      if (error) {
        res.json({
          error: error,
        });
      }
      if (result.rowCount > 0) {
        res.json({
          message: "Xoá  thành công",
        });
      } else {
        res.json({
          error: [{ message: "Tài khoản không tồn tại" }],
        });
      }
    });
  },
};
