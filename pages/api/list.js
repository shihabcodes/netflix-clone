import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "my-list.json");

async function readList() {
  try {
    const raw = await fs.readFile(dbPath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir(path.dirname(dbPath), { recursive: true });
      await fs.writeFile(dbPath, "[]", "utf8");
      return [];
    }
    throw err;
  }
}

async function writeList(list) {
  await fs.writeFile(dbPath, JSON.stringify(list, null, 2), "utf8");
}

export default async function handler(req, res) {
  const method = req.method?.toUpperCase();

  if (method === "GET") {
    const list = await readList();
    return res.status(200).json({ list });
  }

  if (method === "POST") {
    const item = req.body;
    if (!item || !item.id) {
      return res.status(400).json({ error: "Item must include an id." });
    }

    const list = await readList();
    const exists = list.some((x) => x.id === item.id);
    if (!exists) {
      list.push(item);
      await writeList(list);
    }

    return res.status(200).json({ list });
  }

  if (method === "DELETE") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Missing id query parameter." });
    }

    const list = await readList();
    const filtered = list.filter((x) => String(x.id) !== String(id));
    await writeList(filtered);

    return res.status(200).json({ list: filtered });
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
