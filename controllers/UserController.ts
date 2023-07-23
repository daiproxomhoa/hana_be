import { verify } from "jsonwebtoken";
import { pg } from "../config/database";
import bcrypt from "bcrypt";

export const userController = {
  get: async (id) => {
    const query = {
      text:
        "SELECT account.username, user_info.address, user_info.birthday, user_info.gender,user_info.avatar, user_info.id, user_info.phone " +
        "FROM auth.account inner join auth.user_info ON auth.account.id=auth.user_info.id AND auth.account.id=$1 ",
      values: [id],
    };
    console.log("query", query);
    return await pg.query(query);
  },
  detail: async (params) => {
    const query = {
      text: "SELECT address, birthday, gender, id, phone FROM auth.user_info WHERE id=$1",
      values: [params.id],
    };
    return await pg.query(query);
  },
  update: async (params) => {
    const query = {
      text: "UPDATE auth.user_info SET address=$1, birthday=$2, gender=$3, phone=$4 ,avatar=$5 WHERE id=$6",
      values: [
        params.address,
        params.birthday,
        params.gender,
        params.phone,
        params.avatar,
        params.id,
      ],
    };
    return await pg.query(query);
  },

  updateAvatar: async (req, res) => {
    const params = req.body;
    const data = (await verify(req.token, "secretkey")) as any;
    const query = {
      text: "UPDATE auth.user_info SET avatar=$1 WHERE id=$2",
      values: [params.avatar, data.id],
    };

    pg.query(query, async (err, result) => {
      if (err) {
        res.json({
          error: err,
        });
      } else {
        res.status(200).json({ message: "ok" });
      }
    });
  },
  signup: async (req, res) => {
    const params = req.body;
    console.log(req);
    const query = {
      text: "INSERT INTO public.users (user_name,user_password) VALUES ($1,$2) RETURNING id;",
      values: [
        params.user_name,
        bcrypt.hashSync(
          params.password,
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
  },
  delete: async (params) => {
    const query = {
      text: "DELETE FROM public.users WHERE id=$1",
      values: [params.id],
    };
    return await pg.query(query);
  },
};
