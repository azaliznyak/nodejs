import express, { Request, Response } from "express";

import { fsService } from "./fs.service";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await fsService.read();
    res.json(users);
  } catch (e) {
    res.status(500).json(e.message);
  }
});
app.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, age, status } = req.body;

    if (!name || name.length < 3) {
      return res.status(400).json("Name is required and/or more than 3");
    }

    const users = await fsService.read();

    const index = users.findIndex((user) => user.name === name);
    if (index !== -1) {
      //означає, що юзер знайшовся
      return res.status(409).json("User with this name already exists");
    }
    const newUser = {
      id: users[users.length - 1].id + 1,
      name,
      age,
      status,
    };
    users.push(newUser);
    await fsService.write(users);
    res.status(201).json(newUser);
  } catch (e) {
    res.status(500).json(e.message);
  }
});
app.get("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const users = await fsService.read();

    const user = users.find((user) => user.id === userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json(user);
  } catch (e) {
    res.status(500).json(e.message);
  }
});
app.put("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const { name, age, status } = req.body;

    const users = await fsService.read();

    const user = users.find((user) => user.id === userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (name) {
      user.name = name;
    }
    if (age) {
      user.age = age;
    }
    if (status) {
      user.status = status;
    }

    await fsService.write(users);
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json(e.message);
  }
});
app.delete("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    const users = await fsService.read();

    const index = users.findIndex((user) => user.id === userId);
    if (index === -1) {
      // якщо не знайшли
      return res.status(404).json({ message: "user not found" });
    }
    users.splice(index, 1); //якщо все ок
    await fsService.write(users);

    res.sendStatus(204);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
