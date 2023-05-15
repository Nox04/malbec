import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import * as exec from "child_process";
import * as fs from "fs";

type Data = {
  message: string;
};

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ dest: "uploads/", storage });

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
  fn: any
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    try {
      const result = await runMiddleware(req, res, upload.single("audio"));

      exec.exec(
        "whisper ./uploads/audio.wav --language English --output_dir ./uploads/ --output_format txt",
        (error, stdout) => {
          if (error) {
            return res
              .status(500)
              .json({ message: "Error processing the file" });
          }
          const text = fs.readFileSync("./uploads/audio.txt", "utf8");
          return res.status(200).json({
            message: text || "",
          });
        }
      );
    } catch (err) {
      console.error("Error processing the file: ", err);
      return res.status(500).json({ message: "Error processing the file." });
    }
  } else {
    return res.status(404).json({ message: "Error" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
