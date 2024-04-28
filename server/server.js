const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db")
const morgan = require("morgan")
const dotenv = require("dotenv")
dotenv.config();
const colors = require("colors")
const authRouter = require("./routes/authRoutes")
const {decryptRSA,encryptRSA} = require('./helpers/encryptionHelpers')

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// console.log("encrypt key using RSA-->",encryptRSA(process.env.KEY))
// console.log("encrypt IV using RSA--->",encryptRSA(process.env.CIPHER_IV))
// const KEY_ENCRYPT = encryptRSA(process.env.KEY)
// const IV_ENCRYPT = encryptRSA(process.env.CIPHER_IV)
// console.log("decrypt Key using RSA--->",decryptRSA(KEY_ENCRYPT))
// console.log("decrypt Iv using RSA---->",decryptRSA(IV_ENCRYPT))


app.get('/', (req, res) => res.send('Hello World!!'));

app.use("/api/v1/auth", authRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(
    colors.bold.bgGreen.blue(
      `Node Server Running In ${process.env.DEV_MODE} mode on port ${PORT}`
    )
  );
});
